"use client";

export const dynamic = "force-dynamic";

import AdminLayout from "@/components/admin/AdminLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import { motion } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  refunded: "Reembolsado",
  failed: "Fallido",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-300",
  paid: "bg-green-100 text-green-800 border border-green-300",
  processing: "bg-blue-100 text-blue-800 border border-blue-300",
  shipped: "bg-indigo-100 text-indigo-800 border border-indigo-300",
  delivered: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  refunded: "bg-orange-100 text-orange-800 border border-orange-300",
  failed: "bg-red-100 text-red-800 border border-red-300",
};

export default function AdminOrdenesPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.email) return;

      try {
        const response = await fetch("/api/orders/history");

        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  const handleStatusUpdate = async (orderId: string, status: string, tracking?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          trackingNumber: tracking,
        }),
      });

      if (!response.ok) throw new Error("Failed to update order");

      // Update local state
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: status as any } : o
        )
      );

      setSelectedOrder(null);
      setNewStatus("");
      setTrackingNumber("");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar la orden");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Órdenes">
        <div className="p-6 flex items-center justify-center h-full">
          <p className="text-sand">Cargando órdenes...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Órdenes">
      <div className="p-6">
        <div className="rounded-2xl border border-sand bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream border-b border-sand">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">ID Orden</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Usuario</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Total</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Estado</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Fecha</th>
                  <th className="px-6 py-4 text-center font-semibold text-espresso">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {orders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-cream transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 truncate">{order.userId.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-semibold">
                      S/ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sand text-xs">
                      {new Date(order.createdAt).toLocaleDateString("es-PE")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-gold hover:text-gold-dark font-semibold text-xs"
                      >
                        Editar
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="font-playfair text-lg font-semibold text-espresso mb-4">
                Actualizar Orden #{selectedOrder.id.slice(0, 8).toUpperCase()}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-espresso mb-2">
                    Nuevo Estado
                  </label>
                  <select
                    value={newStatus || selectedOrder.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-sand rounded-lg focus:outline-none focus:border-gold"
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {(newStatus === "shipped" || selectedOrder.status === "shipped") && (
                  <div>
                    <label className="block text-sm font-semibold text-espresso mb-2">
                      Código de Rastreo (opcional)
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="ej: 12345678"
                      className="w-full px-4 py-2 border border-sand rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2 border border-sand rounded-lg hover:bg-cream transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedOrder.id, newStatus || selectedOrder.status, trackingNumber)
                  }
                  className="flex-1 px-4 py-2 bg-gold text-espresso rounded-lg hover:bg-gold-dark transition-colors font-semibold"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
