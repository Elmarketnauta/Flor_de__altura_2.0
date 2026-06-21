"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [session, router]);

  const handleCreateOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            format: item.format,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          total,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const { orderId: newOrderId } = await response.json();
      setOrderId(newOrderId);
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

          {/* Payment Form */}
          <div className="bg-white rounded-xl border border-sand/20 p-6">
            <h2 className="text-2xl font-playfair font-bold text-espresso mb-6">
              Pago
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-espresso mb-2">
                Dirección de Entrega
              </label>
              <input
                type="text"
                placeholder="Calle y número"
                className="w-full px-4 py-2 border border-sand/30 rounded-lg mb-2"
              />
              <input
                type="text"
                placeholder="Ciudad"
                className="w-full px-4 py-2 border border-sand/30 rounded-lg"
              />
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 disabled:bg-sand text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Creando Orden..." : "Proceder al Pago"}
            </button>

            <p className="text-xs text-sand text-center mt-4">
              Serás redirigido a Stripe para completar el pago de forma segura
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
