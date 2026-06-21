import { supabaseAdmin } from "@/lib/supabase/server";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
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
      .eq("user_id", userData.user.id)
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
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: "pen",
        metadata: {
          orderId,
          userId: userData.user.id,
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
