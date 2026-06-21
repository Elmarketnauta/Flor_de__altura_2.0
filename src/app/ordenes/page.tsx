"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/auth/auth";
import Link from "next/link";
import { Order } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente de Pago",
  paid: "Pagado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  refunded: "Reembolsado",
  failed: "Falló",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-green-100 text-green-800",
  refunded: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/history");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("No pudimos cargar tus órdenes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-sand">Cargando órdenes...</p>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-playfair font-bold text-espresso mb-2">
            Mis Órdenes
          </h1>
          <p className="text-sand">Historial de tus compras</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sand mb-4">No tienes órdenes aún</p>
            <Link href="/productos" className="text-gold font-semibold hover:underline">
              Explorar catálogo →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-sand/20 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-espresso">
                      Orden #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-sand">
                      {new Date(order.createdAt).toLocaleDateString("es-PE")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      STATUS_COLORS[order.status]
                    }`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="mb-4 p-3 bg-cream rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-sand">Subtotal</span>
                    <span className="text-espresso font-semibold">
                      S/ {order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-sand">Impuestos</span>
                      <span className="text-espresso font-semibold">
                        S/ {order.tax.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-sand/20 pt-2">
                    <span className="font-bold text-espresso">Total</span>
                    <span className="font-bold text-gold text-lg">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-sm">
                  <p className="text-sand font-semibold mb-2">
                    {order.items.length} producto(s)
                  </p>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="text-sand">
                        {item.format} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/ordenes/${order.id}`}
                  className="mt-4 inline-block text-gold font-semibold hover:underline"
                >
                  Ver detalles →
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
