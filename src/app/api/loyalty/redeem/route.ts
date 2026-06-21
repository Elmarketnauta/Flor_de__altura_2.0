import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthedUser } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Redeem loyalty points for a discount.
 *
 * SECURITY: the read-check-write is delegated to the atomic Postgres function
 * `redeem_loyalty_points` (see supabase/migrations/001_loyalty_redeem_atomic.sql),
 * which locks the account row (SELECT ... FOR UPDATE). This prevents the
 * double-spend race that existed when the balance was read and written in
 * separate application-level steps.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const points = Number(body.points);

    if (!Number.isInteger(points) || points <= 0 || points % 100 !== 0) {
      return NextResponse.json(
        { error: "Points must be a positive multiple of 100" },
        { status: 400 }
      );
    }

    const userId = user.id;

    // Atomic redemption: locks the row, validates the balance, deducts points,
    // recomputes the tier, and records the transaction — all in one DB call.
    const { data, error } = await supabaseAdmin.rpc("redeem_loyalty_points", {
      p_user_id: userId,
      p_points: points,
    });

    if (error) {
      // Map known business errors raised by the function to clean HTTP codes.
      const msg = error.message || "";
      if (msg.includes("INSUFFICIENT_POINTS")) {
        return NextResponse.json(
          { error: "Insufficient points" },
          { status: 400 }
        );
      }
      if (msg.includes("ACCOUNT_NOT_FOUND")) {
        return NextResponse.json(
          { error: "Loyalty account not found" },
          { status: 404 }
        );
      }
      if (msg.includes("INVALID_POINTS")) {
        return NextResponse.json(
          { error: "Points must be a positive multiple of 100" },
          { status: 400 }
        );
      }
      console.error("[LoyaltyRedeemError]", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const result = Array.isArray(data) ? data[0] : data;

    // Audit log (best-effort; non-blocking for the response).
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: userId,
        event_type: "loyalty_redeem",
        details: {
          pointsRedeemed: points,
          discount: result?.discount,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      message: `Redeemed ${points} points for S/ ${Number(result?.discount).toFixed(2)} discount`,
      discount: Number(result?.discount),
      newPoints: result?.new_points,
      newTier: result?.new_tier,
    });
  } catch (error) {
    console.error("[LoyaltyRedeemError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
