"use client";

export const dynamic = "force-dynamic";

import AdminLayout from "@/components/admin/AdminLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ProductInventory } from "@/types";
import { PRODUCTS } from "@/data/products";
import { motion } from "framer-motion";

interface InventoryItem extends ProductInventory {
  productName?: string;
}

export default function AdminInventarioPage() {
  const { data: session } = useSession();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ stock: number; reserved: number }>({ stock: 0, reserved: 0 });

  useEffect(() => {
    async function fetchInventory() {
      if (!session?.user?.email) return;

      try {
        const response = await fetch("/api/admin/inventory", {
          headers: {
            Authorization: `Bearer ${(session as any).user?.accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch inventory");
        const data = await response.json();

        // Merge with product names
        const enriched = (data.inventory || []).map((item: ProductInventory) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          return {
            ...item,
            productName: product?.name || "Unknown",
          };
        });

        setInventory(enriched);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInventory();
  }, [session]);

  const handleSaveStock = async (productId: string) => {
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any).user?.accessToken}`,
        },
        body: JSON.stringify({
          productId,
          stock: editValues.stock,
          reserved: editValues.reserved,
        }),
      });

      if (!response.ok) throw new Error("Failed to update inventory");

      const data = await response.json();
      setInventory(
        inventory.map((item) =>
          item.productId === productId ? { ...data.inventory, productName: item.productName } : item
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Error al actualizar inventario");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Inventario">
        <div className="p-6 flex items-center justify-center h-full">
          <p className="text-sand">Cargando inventario...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Inventario">
      <div className="p-6">
        <div className="rounded-2xl border border-sand bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream border-b border-sand">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Producto</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Stock</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Reservado</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Disponible</th>
                  <th className="px-6 py-4 text-left font-semibold text-espresso">Límite Bajo</th>
                  <th className="px-6 py-4 text-center font-semibold text-espresso">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {inventory.map((item, idx) => (
                  <motion.tr
                    key={item.productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-cream transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-espresso">{item.productName}</td>
                    <td className="px-6 py-4">
                      {editingId === item.productId ? (
                        <input
                          type="number"
                          value={editValues.stock}
                          onChange={(e) =>
                            setEditValues({ ...editValues, stock: parseInt(e.target.value) || 0 })
                          }
                          className="w-20 px-2 py-1 border border-sand rounded focus:outline-none focus:border-gold"
                        />
                      ) : (
                        item.stock
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === item.productId ? (
                        <input
                          type="number"
                          value={editValues.reserved}
                          onChange={(e) =>
                            setEditValues({ ...editValues, reserved: parseInt(e.target.value) || 0 })
                          }
                          className="w-20 px-2 py-1 border border-sand rounded focus:outline-none focus:border-gold"
                        />
                      ) : (
                        item.reserved
                      )}
                    </td>
                    <td className="px-6 py-4">{item.stock - item.reserved}</td>
                    <td className="px-6 py-4 text-xs text-sand">{item.lowStockThreshold}</td>
                    <td className="px-6 py-4 text-center">
                      {editingId === item.productId ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSaveStock(item.productId)}
                            className="text-green-600 hover:text-green-800 font-semibold text-xs"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-sand hover:text-espresso font-semibold text-xs"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(item.productId);
                            setEditValues({ stock: item.stock, reserved: item.reserved });
                          }}
                          className="text-gold hover:text-gold-dark font-semibold text-xs"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
