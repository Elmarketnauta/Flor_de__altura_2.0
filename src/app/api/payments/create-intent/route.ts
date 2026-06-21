import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthedUser } from "@/lib/auth/session";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Lazy init so `next build` never needs STRIPE_SECRET_KEY at import time.
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow paying orders that are still pending — prevents re-charging a
    // paid/refunded order.
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Order is not payable" },
        { status: 409 }
      );
    }

    // SECURITY: charge the amount stored on the order (server-computed), never
    // an amount supplied by the client.
    const amount = order.total;

    // Create Stripe payment intent (idempotent with order ID)
    const paymentIntent = await getStripe().paymentIntents.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: "pen",
        metadata: {
          orderId,
          userId: user.id,
        },
        description: `Flor de Altura Coffee Order #${orderId}`,
      },
      {
        idempotencyKey: orderId, // Prevents duplicate charges
      }
    );

    // Update order with payment intent ID
    await supabaseAdmin
      .from("orders")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        payment_method: "stripe",
      })
      .eq("id", orderId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      amount,
    });
  } catch (error) {
    console.error("[PaymentError]", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
