import { supabaseAdmin } from "@/lib/supabase/server";
import { calculatePointsEarned, calculateTier } from "@/lib/loyalty/calculate";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Internal endpoint called by Stripe webhook to award loyalty points after payment.
 * Uses a service token for authentication (not Bearer token from user).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, orderAmount, orderId } = body;

    if (!userId || !orderAmount) {
      return NextResponse.json(
        { error: "Missing userId or orderAmount" },
        { status: 400 }
      );
    }

    // Fetch or create loyalty account
    let { data: account, error: accountError } = await supabaseAdmin
      .from("loyalty_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (accountError && accountError.code === "PGRST116") {
      const { data: newAccount } = await supabaseAdmin
        .from("loyalty_accounts")
        .insert([
          {
            user_id: userId,
            points: 0,
            tier: "bronze",
            lifetime_points: 0,
          },
        ])
        .select()
        .single();

      account = newAccount;
    } else if (accountError) {
      throw new Error(`Failed to fetch loyalty account: ${accountError.message}`);
    }

    // Calculate points earned based on current tier
    const pointsEarned = calculatePointsEarned(orderAmount, account.tier);
    const newPoints = account.points + pointsEarned;
    const newLifetimePoints = account.lifetime_points + pointsEarned;
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
    await supabaseAdmin.from("points_transactions").insert([
      {
        user_id: userId,
        order_id: orderId,
        type: "earn",
        points: pointsEarned,
        description: `Earned from order #${orderId?.slice(0, 8).toUpperCase() || "unknown"}`,
      },
    ]);

    // Check if user achieved new tier
    const tierUpgraded = newTier !== account.tier;

    return NextResponse.json({
      success: true,
      pointsEarned,
      newTier,
      tierUpgraded,
      totalPoints: newPoints,
    });
  } catch (error) {
    console.error("[LoyaltyAwardError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
