import { NextRequest, NextResponse } from "next/server";
import type { CartItem } from "@/types";

interface SyncRequest {
  items: CartItem[];
  lastModified: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequest = await request.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Invalid items array" },
        { status: 400 }
      );
    }

    // Validar integridad de cada item
    const validItems = body.items.filter(
      (item) =>
        item.id &&
        item.productId &&
        item.quantity > 0 &&
        item.quantity <= 20
    );

    // Deduplicar items (en caso de race conditions)
    const deduped = Array.from(
      new Map(validItems.map((item) => [item.id, item])).values()
    );

    // Calcular total
    const total = deduped.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Log (en un caso real, guardaría en DB para user auth)
    console.log(
      `[CartSync] Synced ${deduped.length} items, total: ${total} PEN`
    );

    return NextResponse.json(
      {
        success: true,
        itemsCount: deduped.length,
        total,
        syncedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CartSync Error]", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
