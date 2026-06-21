import { supabaseAdmin } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !userData.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin role check
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Total revenue (all paid orders)
    const { data: paidOrders } = await supabaseAdmin
      .from("orders")
      .select("total")
      .eq("status", "paid");

    const totalRevenue = paidOrders?.reduce((sum, order) => sum + order.total, 0) || 0;

    // Total orders by status
    const { data: allOrders } = await supabaseAdmin.from("orders").select("status");
    const totalOrders = allOrders?.length || 0;

    // Active users (orders last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentOrdersData } = await supabaseAdmin
      .from("orders")
      .select("user_id, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString());

    const uniqueUsers = new Set(recentOrdersData?.map((o) => o.user_id) || []);
    const activeUsers = uniqueUsers.size;

    // Conversion rate (paid / total)
    const paidCount = allOrders?.filter((o) => o.status === "paid").length || 0;
    const conversionRate = totalOrders > 0 ? (paidCount / totalOrders) * 100 : 0;

    // Recent 10 orders
    const { data: recentOrders } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeUsers,
        conversionRate: Math.round(conversionRate),
      },
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error("[AdminStatsError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
