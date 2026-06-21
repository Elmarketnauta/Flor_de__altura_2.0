import { supabaseAdmin } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { generateOrderShippedHTML } from "@/lib/email/templates";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Admin endpoint to manually send emails.
 * Requires admin role.
 * POST body: { orderId, type: "shipped", trackingNumber?, trackingUrl? }
 */
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

    // Admin check
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, type, trackingNumber, trackingUrl } = body;

    if (!orderId || !type) {
      return NextResponse.json({ error: "Missing orderId or type" }, { status: 400 });
    }

    // Fetch order and user
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { data: user } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (!user?.user?.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    let html: string;
    let subject: string;

    switch (type) {
      case "shipped":
        subject = "📦 Tu pedido está en camino";
        html = generateOrderShippedHTML(orderId, trackingUrl, trackingNumber);
        break;
      default:
        return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    const result = await sendEmail({
      to: user.user.email,
      subject,
      html,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 });
    }

    // Log email sent
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: userData.user.id,
        event_type: "email_sent",
        details: {
          to: user.user.email,
          type,
          orderId,
        },
      },
    ]);

    return NextResponse.json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("[EmailSendError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
