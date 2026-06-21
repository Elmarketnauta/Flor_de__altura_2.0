import { supabaseAdmin } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/send";
import { generateOrderShippedHTML } from "@/lib/email/templates";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface UpdateStatusRequest {
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: UpdateStatusRequest = await request.json();
    const { status, trackingNumber, trackingUrl } = body;
    const orderId = params.id;

    // Valid statuses
    const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "refunded", "failed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Fetch order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    // Send shipping email if status is "shipped"
    if (status === "shipped") {
      const { data: user } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
      if (user?.user?.email) {
        const html = generateOrderShippedHTML(orderId, trackingUrl, trackingNumber);
        await sendEmail({
          to: user.user.email,
          subject: "📦 Tu pedido está en camino",
          html,
        });
      }
    }

    // Log admin action
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: admin.id,
        event_type: "order_status_updated",
        details: {
          orderId,
          newStatus: status,
          trackingNumber,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      message: `Order updated to ${status}`,
    });
  } catch (error) {
    console.error("[AdminOrderUpdateError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
