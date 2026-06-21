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

    // Admin check
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all inventory
    const { data: inventory, error } = await supabaseAdmin
      .from("product_inventory")
      .select("*")
      .order("product_id");

    if (error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      inventory: inventory || [],
    });
  } catch (error) {
    console.error("[InventoryGetError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    // Admin check
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, stock, reserved, lowStockThreshold } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Upsert inventory
    const { data, error } = await supabaseAdmin
      .from("product_inventory")
      .upsert(
        {
          product_id: productId,
          stock: stock ?? 0,
          reserved: reserved ?? 0,
          low_stock_threshold: lowStockThreshold ?? 10,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_id" }
      )
      .select();

    if (error) {
      throw new Error(`Failed to update inventory: ${error.message}`);
    }

    // Log action
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: userData.user.id,
        event_type: "inventory_updated",
        details: {
          productId,
          stock,
          reserved,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      inventory: data?.[0],
    });
  } catch (error) {
    console.error("[InventoryUpdateError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
