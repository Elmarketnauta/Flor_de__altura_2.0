"use client";

export const dynamic = "force-dynamic";

import AdminLayout from "@/components/admin/AdminLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order, AdminStats } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!session?.user?.email) return;

      try {
        // Auth travels via the NextAuth session cookie automatically.
        const response = await fetch("/api/admin/stats");

        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [session]);

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="p-6 flex items-center justify-center h-full">
          <p className="text-sand">Cargando estadísticas...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Revenue */}
          <motion.div
            variants={cardVariants}
            className="rounded-2xl border border-sand bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-sand font-semibold">Ingresos Totales</p>
            <p className="text-3xl font-playfair font-semibold text-espresso mt-2">
              S/ {stats?.totalRevenue.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-sand mt-2">Todas las órdenes pagadas</p>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            variants={cardVariants}
            className="rounded-2xl border border-sand bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-sand font-semibold">Total Órdenes</p>
            <p className="text-3xl font-playfair font-semibold text-espresso mt-2">
              {stats?.totalOrders}
            </p>
            <p className="text-xs text-sand mt-2">Desde el inicio</p>
          </motion.div>

          {/* Active Users */}
          <motion.div
            variants={cardVariants}
            className="rounded-2xl border border-sand bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-sand font-semibold">Usuarios Activos</p>
            <p className="text-3xl font-playfair font-semibold text-espresso mt-2">
              {stats?.activeUsers}
            </p>
            <p className="text-xs text-sand mt-2">Últimos 30 días</p>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            variants={cardVariants}
            className="rounded-2xl border border-sand bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-sand font-semibold">Tasa Conversión</p>
            <p className="text-3xl font-playfair font-semibold text-gold mt-2">
              {stats?.conversionRate}%
            </p>
            <p className="text-xs text-sand mt-2">Órdenes pagadas / total</p>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-sand bg-white p-6"
        >
          <h2 className="font-playfair text-lg font-semibold text-espresso mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/ordenes"
              className="p-4 rounded-lg border border-sand hover:border-gold hover:bg-cream transition-all"
            >
              <p className="font-semibold text-espresso">Gestionar Órdenes</p>
              <p className="text-xs text-sand mt-1">Ver y actualizar estado</p>
            </Link>

            <Link
              href="/admin/usuarios"
              className="p-4 rounded-lg border border-sand hover:border-gold hover:bg-cream transition-all"
            >
              <p className="font-semibold text-espresso">Usuarios</p>
              <p className="text-xs text-sand mt-1">Listar y roles</p>
            </Link>

            <Link
              href="/admin/inventario"
              className="p-4 rounded-lg border border-sand hover:border-gold hover:bg-cream transition-all"
            >
              <p className="font-semibold text-espresso">Inventario</p>
              <p className="text-xs text-sand mt-1">Stock de productos</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
