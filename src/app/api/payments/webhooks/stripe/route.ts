import { supabaseAdmin } from "@/lib/supabase/server";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[StripeWebhookError]", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({
              status: "paid",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          // Log success
          console.log(`[PaymentSuccess] Order ${orderId}`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({
              status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          console.log(`[PaymentFailed] Order ${orderId}`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent;

        if (paymentIntentId) {
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntentId)
            .single();

          if (order) {
            await supabaseAdmin
              .from("orders")
              .update({
                status: "refunded",
                updated_at: new Date().toISOString(),
              })
              .eq("id", order.id);

            console.log(`[Refunded] Order ${order.id}`);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WebhookProcessError]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
