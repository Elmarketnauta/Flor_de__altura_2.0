"use client";

import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminUsuariosPage() {
  return (
    <AdminLayout title="Usuarios">
      <div className="p-6">
        <div className="rounded-2xl border border-sand bg-white p-8 text-center">
          <p className="text-sand mb-4">Gestión de usuarios disponible pronto</p>
          <p className="text-sm text-sand">
            Aquí podrás ver la lista de usuarios, cambiar roles y ver estadísticas de actividad.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
