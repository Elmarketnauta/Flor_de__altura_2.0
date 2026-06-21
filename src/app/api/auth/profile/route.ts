import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
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
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
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
