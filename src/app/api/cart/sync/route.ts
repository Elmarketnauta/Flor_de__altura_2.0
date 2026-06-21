import { NextRequest, NextResponse } from "next/server";
import type { CartItem } from "@/types";

const MINIMUM_ORDER_VALUE = 100;
const MAX_QUANTITY_PER_PRODUCT = 20;

interface SyncRequest {
  items: CartItem[];
  lastModified?: number;
  customerId?: string;
  source?: "web" | "mobile";
}

interface SyncResponse {
  success: boolean;
  error?: string;
  data?: {
    itemsCount: number;
    uniqueProducts: number;
    subtotal: number;
    total: number;
    meetsMinimum: boolean;
    discountApplied?: number;
    syncedAt: string;
    sessionId: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SyncResponse>> {
  try {
    const body = (await request.json()) as SyncRequest;
    const { items = [], customerId, source = "web" } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Validar integridad de cada item
    const validItems = items.filter(
      (item) =>
        item.id &&
        item.productId &&
        item.quantity > 0 &&
        item.quantity <= MAX_QUANTITY_PER_PRODUCT &&
        item.price > 0
    );

    // Deduplicar items (en caso de race conditions)
    const deduped = Array.from(
      new Map(validItems.map((item) => [item.id, item])).values()
    );

    // Calcular totales
    const subtotal = deduped.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // TODO: Apply discount rules based on customerId, loyalty program, etc.
    const discountAmount = 0;
    const total = Math.max(subtotal - discountAmount, 0);
    const meetsMinimum = total >= MINIMUM_ORDER_VALUE;

    // Generate session ID for tracking and persistence
    const sessionId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Log cart sync (en producción, guardar en DB)
    console.log("[CartSync Event]", {
      sessionId,
      customerId: customerId || "anonymous",
      source,
      itemsCount: deduped.length,
      subtotal,
      discountAmount,
      total,
      meetsMinimum,
      timestamp: new Date().toISOString(),
    });

    // TODO: Persist cart session to database
    // await db.cartSession.create({
    //   sessionId,
    //   customerId,
    //   items: deduped,
    //   total,
    //   source,
    // });

    return NextResponse.json(
      {
        success: true,
        data: {
          itemsCount: deduped.length,
          uniqueProducts: new Set(deduped.map((i) => i.productId)).size,
          subtotal,
          total,
          meetsMinimum,
          discountApplied: discountAmount > 0 ? discountAmount : undefined,
          syncedAt: new Date().toISOString(),
          sessionId,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Cart-Session": sessionId,
        },
      }
    );
  } catch (error) {
    console.error("[CartSync Error]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
