"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Users, Package, Gift, Zap } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin");
      return;
    }

    if (status !== "authenticated") return;

    // SECURITY: do not grant admin UI to any authenticated user. Verify the
    // role against the server. /api/admin/stats returns 403 for non-admins, so
    // a successful response is proof of the admin role. A 401/403 redirects the
    // user away from the panel.
    let cancelled = false;

    async function verifyAdmin() {
      try {
        const token = (session as any)?.user?.accessToken;
        const res = await fetch("/api/admin/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (cancelled) return;

        if (res.ok) {
          setIsAdmin(true);
          setIsLoading(false);
        } else {
          // Not an admin (403) or unauthenticated (401) → leave the panel.
          router.replace("/");
        }
      } catch {
        if (!cancelled) router.replace("/");
      }
    }

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [status, session, router]);

  if (isLoading || !session || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-sand">Cargando...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/ordenes", label: "Órdenes", icon: Package },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    { href: "/admin/inventario", label: "Inventario", icon: Zap },
    { href: "/admin/loyalty", label: "Lealtad", icon: Gift },
  ];

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-espresso text-cream border-r border-sand overflow-y-auto hidden md:flex flex-col">
        <div className="p-6 border-b border-espresso-800">
          <h2 className="font-playfair text-xl font-semibold">Admin Panel</h2>
          <p className="text-xs text-sand mt-2">Flor de Altura</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-espresso-800 transition-colors text-sm"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-espresso-800 p-4 text-xs text-sand">
          <p className="mb-2">Logged in as</p>
          <p className="font-semibold truncate">{session.user?.email}</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-sand px-6 py-4 flex items-center justify-between">
          <h1 className="font-playfair text-2xl font-semibold text-espresso">{title}</h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-sand hover:text-espresso transition-colors"
            >
              ← Back to Shop
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-cream">{children}</main>
      </div>
    </div>
  );
}
