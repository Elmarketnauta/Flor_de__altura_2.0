import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(\S+)$/);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    const { allowed } = await checkRateLimit(`profile:${clientIp}`, 30, 3600);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const authHeader = request.headers.get("authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(
      token
    );

    if (authError || !userData.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userProfile, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    // Get order and wishlist counts
    const [{ count: orderCount }, { count: wishlistCount }] = await Promise.all(
      [
        supabaseAdmin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userData.user.id),
        supabaseAdmin
          .from("wishlists")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userData.user.id),
      ]
    );

    return NextResponse.json({
      user: userProfile,
      stats: {
        orderCount: orderCount || 0,
        wishlistCount: wishlistCount || 0,
      },
    });
  } catch (err) {
    console.error("[ProfileError]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    const { allowed } = await checkRateLimit(`profile:${clientIp}`, 20, 3600);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const authHeader = request.headers.get("authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(
      token
    );

    if (authError || !userData.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, country } = body;

    const { data: updatedUser, error } = await supabaseAdmin
      .from("users")
      .update({
        full_name: fullName,
        phone,
        country,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("[ProfileUpdateError]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
