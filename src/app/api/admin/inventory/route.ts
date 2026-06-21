import { supabaseAdmin } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all inventory
    const { data: inventory, error } = await supabaseAdmin
      .from("product_inventory")
      .select("*")
      .order("product_id");

    if (error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      inventory: inventory || [],
    });
  } catch (error) {
    console.error("[InventoryGetError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, stock, reserved, lowStockThreshold } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Upsert inventory
    const { data, error } = await supabaseAdmin
      .from("product_inventory")
      .upsert(
        {
          product_id: productId,
          stock: stock ?? 0,
          reserved: reserved ?? 0,
          low_stock_threshold: lowStockThreshold ?? 10,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "product_id" }
      )
      .select();

    if (error) {
      throw new Error(`Failed to update inventory: ${error.message}`);
    }

    // Log action
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: admin.id,
        event_type: "inventory_updated",
        details: {
          productId,
          stock,
          reserved,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      inventory: data?.[0],
    });
  } catch (error) {
    console.error("[InventoryUpdateError]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
