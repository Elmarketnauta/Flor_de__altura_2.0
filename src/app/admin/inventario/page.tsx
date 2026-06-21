"use client";

import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminInventarioPage() {
  return (
    <AdminLayout title="Inventario">
      <div className="p-6">
        <div className="rounded-2xl border border-sand bg-white p-8 text-center">
          <p className="text-sand mb-4">Gestión de inventario disponible pronto</p>
          <p className="text-sm text-sand">
            Aquí podrás ver y actualizar el stock de productos.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
