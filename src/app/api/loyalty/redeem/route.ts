import { supabaseAdmin } from "@/lib/supabase/server";
import { calculateTier } from "@/lib/loyalty/calculate";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { points } = body;

    if (!points || points <= 0 || points % 100 !== 0) {
      return NextResponse.json(
        { error: "Points must be a multiple of 100 and greater than 0" },
        { status: 400 }
      );
    }

    const userId = userData.user.id;

    // Fetch current loyalty account
    const { data: account, error: accountError } = await supabaseAdmin
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Loyalty account not found" }, { status: 404 });
    }

    // Check if user has enough points
    if (account.points < points) {
      return NextResponse.json(
        { error: `Insufficient points. You have ${account.points} points.` },
        { status: 400 }
      );
    }

    // Deduct points
    const newPoints = account.points - points;
    const newLifetimePoints = account.lifetime_points - points;
    const newTier = calculateTier(newLifetimePoints);

    // Update loyalty account
    const { error: updateError } = await supabaseAdmin
      .from("loyalty_accounts")
      .update({
        points: newPoints,
        lifetime_points: newLifetimePoints,
        tier: newTier,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      throw new Error(`Failed to update loyalty account: ${updateError.message}`);
    }

    // Record transaction
    const discount = (points / 100) * 5;
    await supabaseAdmin.from("points_transactions").insert([
      {
        user_id: userId,
        type: "redeem",
        points: -points,
        description: `Redeemed ${points} points for S/ ${discount.toFixed(2)} discount`,
      },
    ]);

    // Log action
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: userId,
        event_type: "loyalty_redeem",
        details: {
          pointsRedeemed: points,
          discount,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      message: `Redeemed ${points} points for S/ ${discount.toFixed(2)} discount`,
      discount,
      newPoints,
    });
  } catch (error) {
    console.error("[LoyaltyRedeemError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
