"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { trackEvent } from "@/lib/analytics";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.wishlistCount);
  const cartItems = useCartStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
    trackEvent("page_view", { page: "/perfil" });
  }, []);

  if (!mounted) return null;

  const stats = [
    {
      icon: Heart,
      label: "Favoritos",
      value: wishlistCount(),
      href: "/wishlist",
    },
    {
      icon: ShoppingBag,
      label: "Carrito",
      value: cartItems.length,
      href: "#",
      action: () => useCartStore.getState().openCart(),
    },
    {
      icon: Clock,
      label: "Pedidos",
      value: 0,
      href: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="border-b border-sand bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-espresso-600 hover:text-espresso-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-semibold text-espresso-900">
                Mi Perfil
              </h1>
              <p className="mt-1 text-sm text-espresso-500">
                Bienvenido a tu espacio personal
              </p>
            </div>
            <User className="h-8 w-8 text-gold" />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 sm:grid-cols-3"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl border border-sand bg-white p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-espresso-500">{stat.label}</p>
                      <p className="mt-2 font-serif text-3xl font-semibold text-espresso-900">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  {stat.href && stat.href !== "#" && (
                    <Link
                      href={stat.href}
                      className="mt-4 inline-block text-sm font-medium text-gold hover:text-gold-dark transition"
                    >
                      Ver todos →
                    </Link>
                  )}
                  {stat.action && (
                    <button
                      onClick={() => stat.action?.()}
                      className="mt-4 inline-block text-sm font-medium text-gold hover:text-gold-dark transition"
                    >
                      Ver carrito →
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Account Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-sand bg-white p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-espresso-900">
              Información de Cuenta
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-espresso-500">Estado</p>
                <p className="mt-1 font-medium text-espresso-900">
                  Cliente anónimo (sin registro)
                </p>
              </div>
              <div>
                <p className="text-sm text-espresso-500">Datos Guardados</p>
                <p className="mt-1 text-sm text-espresso-700">
                  • Carrito: Guardado en localStorage
                </p>
                <p className="mt-1 text-sm text-espresso-700">
                  • Favoritos: Guardado en localStorage
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Limpiar datos locales
                </button>
              </div>
            </div>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-sand bg-white p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-espresso-900">
              Preferencias
            </h2>
            <div className="mt-6 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-sand"
                />
                <span className="text-sm text-espresso-700">
                  Mostrar notificaciones de nuevos productos
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-sand"
                />
                <span className="text-sm text-espresso-700">
                  Permitir analytics para mejorar tu experiencia
                </span>
              </label>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-sand bg-white p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-espresso-900">
              ¿Necesitas ayuda?
            </h2>
            <div className="mt-6 space-y-3">
              <Link
                href="/#"
                className="block text-sm font-medium text-gold hover:text-gold-dark transition"
              >
                Contactar soporte →
              </Link>
              <Link
                href="/#"
                className="block text-sm font-medium text-gold hover:text-gold-dark transition"
              >
                Preguntas frecuentes →
              </Link>
              <Link
                href="/#"
                className="block text-sm font-medium text-gold hover:text-gold-dark transition"
              >
                Política de privacidad →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
