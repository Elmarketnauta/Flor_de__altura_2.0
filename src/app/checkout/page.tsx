"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPEN } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [session, router]);

  /**
   * Builds the WhatsApp order message including the order id so the team can
   * reference it when coordinating payment and delivery.
   */
  const buildWhatsAppUrl = (orderRef: string) => {
    const lines = cartItems.map((i) => {
      const lineTotal = formatPEN(i.price * i.quantity);
      const formatLabel = i.format === "grano" ? "En grano" : "Molido";
      return `• ${i.quantity}× ${i.name} (${formatLabel}) — ${lineTotal}`;
    });

    const message = [
      "¡Hola Flor de Altura! ☕ Quiero confirmar mi pedido:",
      "",
      `*Pedido #${orderRef.slice(0, 8).toUpperCase()}*`,
      "",
      ...lines,
      "",
      `Subtotal: ${formatPEN(subtotal)}`,
      `Impuesto (18%): ${formatPEN(tax)}`,
      `*Total: ${formatPEN(total)}*`,
      "",
      "¿Me ayudan a coordinar el pago y la entrega? 🌱",
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setError("");

    try {
      // Create the order (server recomputes all amounts from the catalog).
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            format: item.format,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const { orderId: newOrderId } = await response.json();

      // Hand off to WhatsApp to coordinate payment & delivery, then clear cart.
      const url = buildWhatsAppUrl(newOrderId);
      clearCart();
      window.open(url, "_blank", "noopener,noreferrer");
      router.push("/ordenes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-espresso font-bold mb-4">Tu carrito está vacío</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-sand/20 p-6">
            <h2 className="text-2xl font-playfair font-bold text-espresso mb-6">
              Resumen de Orden
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-espresso">{item.name}</p>
                    <p className="text-sand text-xs">
                      {item.format} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-gold">
                    S/ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-sand/20 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-sand">Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sand">Impuesto (18%)</span>
                <span>S/ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-sand/20">
                <span>Total</span>
                <span className="text-gold">S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Confirmación por WhatsApp */}
          <div className="bg-white rounded-xl border border-sand/20 p-6">
            <h2 className="text-2xl font-playfair font-bold text-espresso mb-6">
              Confirmar Pedido
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-sand mb-6">
              Coordina el pago y la entrega directamente con nosotros por
              WhatsApp. Al confirmar, abriremos un chat con el resumen de tu
              pedido listo para enviar.
            </p>

            <button
              onClick={handleCreateOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-sand text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? (
                "Generando pedido..."
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24.0 12.045 0 5.463 0 .104 5.359.101 11.94c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.881 11.881 0 005.683 1.448h.005c6.582 0 11.94-5.359 11.943-11.941a11.821 11.821 0 00-3.498-8.404"/>
                  </svg>
                  Confirmar por WhatsApp
                </>
              )}
            </button>

            <p className="text-xs text-sand text-center mt-4">
              Te atenderemos al +51 910 251 455 para coordinar pago y envío.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
