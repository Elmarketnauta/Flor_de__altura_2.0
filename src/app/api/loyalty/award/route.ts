import { supabaseAdmin } from "@/lib/supabase/server";
import { calculatePointsEarned, calculateTier } from "@/lib/loyalty/calculate";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

/**
 * Internal endpoint called by the Stripe webhook to award loyalty points
 * after a confirmed payment.
 *
 * SECURITY:
 * - Authenticated with a shared internal secret (INTERNAL_API_SECRET) sent in
 *   the `x-internal-secret` header. This endpoint is NOT user-facing and must
 *   never be callable by clients — otherwise anyone could fabricate points.
 * - The order amount is read from the database (the source of truth), NOT from
 *   the request body, so a caller cannot inflate the points awarded.
 * - Idempotent: if points were already awarded for this order, it is a no-op.
 */

function isAuthorizedInternalCall(request: NextRequest): boolean {
  const expected = process.env.INTERNAL_API_SECRET;
  // Fail closed: if the secret isn't configured, reject every call.
  if (!expected) {
    console.error("[LoyaltyAward] INTERNAL_API_SECRET is not configured");
    return false;
  }

  const provided = request.headers.get("x-internal-secret") ?? "";
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);

  // Length check first — timingSafeEqual throws on length mismatch.
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorizedInternalCall(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Source of truth: read the order from the DB. Never trust a client-supplied
    // amount or userId.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, total, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only award points for orders that are actually paid.
    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Order is not in a paid state" },
        { status: 409 }
      );
    }

    const userId = order.user_id;
    const orderAmount = order.total;

    // Idempotency guard: if we've already recorded an "earn" transaction for
    // this order, do not award again (webhooks can be delivered more than once).
    const { data: existingTxn } = await supabaseAdmin
      .from("points_transactions")
      .select("id")
      .eq("order_id", orderId)
      .eq("type", "earn")
      .maybeSingle();

    if (existingTxn) {
      return NextResponse.json({
        success: true,
        alreadyAwarded: true,
      });
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
