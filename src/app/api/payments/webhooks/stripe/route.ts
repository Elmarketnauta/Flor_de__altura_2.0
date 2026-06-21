import { supabaseAdmin } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { generateOrderConfirmedHTML, generatePaymentFailedHTML, generateOrderRefundedHTML } from "@/lib/email/templates";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Lazy init so `next build` never needs Stripe secrets at import time.
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
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
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
          // Update order status
          const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

          if (!orderError && order) {
            await supabaseAdmin
              .from("orders")
              .update({
                status: "paid",
                updated_at: new Date().toISOString(),
              })
              .eq("id", orderId);

            // Fetch user email for confirmation email
            const { data: user } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
            if (user?.user?.email) {
              const html = generateOrderConfirmedHTML(order, user.user.email);
              await sendEmail({
                to: user.user.email,
                subject: "Tu pedido fue confirmado ✓",
                html,
              });
            }

            // Award loyalty points (FASE 13).
            // Authenticated with the internal secret; the award endpoint reads
            // the amount from the DB itself, so we only pass the orderId.
            try {
              await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/loyalty/award`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
                },
                body: JSON.stringify({ orderId }),
              });
            } catch (err) {
              console.error("[LoyaltyAwardFailed]", err);
            }
          }

          console.log(`[PaymentSuccess] Order ${orderId}`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

          await supabaseAdmin
            .from("orders")
            .update({
              status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          // Send payment failed email
          if (order) {
            const { data: user } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
            if (user?.user?.email) {
              const retryUrl = `${process.env.NEXTAUTH_URL}/checkout?orderId=${orderId}`;
              const html = generatePaymentFailedHTML(orderId, retryUrl);
              await sendEmail({
                to: user.user.email,
                subject: "Reintenta tu pago",
                html,
              });
            }
          }

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
            .select("*")
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

            // Send refund email
            const { data: user } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
            if (user?.user?.email) {
              const html = generateOrderRefundedHTML(order.id, order.total);
              await sendEmail({
                to: user.user.email,
                subject: "Tu reembolso ha sido procesado",
                html,
              });
            }

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
