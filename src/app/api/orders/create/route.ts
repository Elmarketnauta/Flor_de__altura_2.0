import { supabaseAdmin } from "@/lib/supabase/server";
import { getAuthedUser } from "@/lib/auth/session";
import { getProductById } from "@/data/products";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const TAX_RATE = 0.18; // IGV Perú
const MIN_ORDER_TOTAL = 100;
const VALID_FORMATS = ["grano", "molido"];
const MAX_QTY_PER_ITEM = 100;

interface IncomingItem {
  productId: string;
  format?: string;
  quantity: number;
}

/**
 * Round to 2 decimals to avoid floating point drift in currency math.
 */
function money(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const incomingItems: IncomingItem[] = body.items;

    if (!Array.isArray(incomingItems) || incomingItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // SECURITY: never trust client-supplied prices/subtotal/tax/total.
    // Rebuild every line from the server-side product catalog and recompute
    // all monetary values here. The client's numbers are ignored entirely.
    const serverItems = [];
    let subtotal = 0;

    for (const item of incomingItems) {
      const quantity = Number(item.quantity);

      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          { error: "Invalid item in cart" },
          { status: 400 }
        );
      }

      if (quantity > MAX_QTY_PER_ITEM) {
        return NextResponse.json(
          { error: `Quantity too high for ${item.productId}` },
          { status: 400 }
        );
      }

      const format = item.format ?? "grano";
      if (!VALID_FORMATS.includes(format)) {
        return NextResponse.json(
          { error: "Invalid product format" },
          { status: 400 }
        );
      }

      const product = getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Unknown product: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.available === false) {
        return NextResponse.json(
          { error: `Product not available: ${product.name}` },
          { status: 409 }
        );
      }

      // Authoritative price from the catalog.
      const unitPrice = product.price;
      const lineTotal = money(unitPrice * quantity);
      subtotal = money(subtotal + lineTotal);

      serverItems.push({
        productId: product.id,
        format,
        quantity,
        price: unitPrice,
      });
    }

    const tax = money(subtotal * TAX_RATE);
    const total = money(subtotal + tax);

    if (total < MIN_ORDER_TOTAL) {
      return NextResponse.json(
        { error: `Invalid order: minimum S/ ${MIN_ORDER_TOTAL} required` },
        { status: 400 }
      );
    }

    // Create order with the server-computed amounts.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: user.id,
          status: "pending",
          subtotal,
          tax,
          total,
          items: serverItems,
          payment_method: null,
        },
      ])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items with the authoritative prices.
    const orderItems = serverItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      format: item.format,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // Delete order if items fail
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      status: "pending",
      subtotal,
      tax,
      total: order.total,
    });
  } catch (err) {
    console.error("[OrderCreateError]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
