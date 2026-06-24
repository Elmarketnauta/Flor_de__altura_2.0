"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { formatPEN } from "@/lib/utils";
import {
  calculateTierProgress,
  convertPointsToDiscount,
  getTierColor,
  getTierLabel,
} from "@/lib/loyalty/calculate";
import { cn } from "@/lib/utils";
import type { LoyaltyTier, PointsTransaction } from "@/types";

interface LoyaltyAccount {
  points: number;
  tier: LoyaltyTier;
  lifetime_points: number;
}

interface UserProfile {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  dni?: string;
  address?: string;
}

const TIER_LABELS: Record<LoyaltyTier, string> = {
  bronze: "Bronce",
  silver: "Plata",
  gold: "Oro",
  platinum: "Platino",
};

const TIER_NEXT: Record<LoyaltyTier, string> = {
  bronze: "Plata",
  silver: "Oro",
  gold: "Platino",
  platinum: "¡Nivel máximo!",
};

const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 500,
  silver: 2000,
  gold: 5000,
  platinum: 5000,
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const wishlistCount = useWishlistStore((s) => s.wishlistCount);
  const cartItems = useCartStore((s) => s.items);

  const [loyalty, setLoyalty] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingLoyalty, setLoadingLoyalty] = useState(true);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/perfil");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchLoyalty();
  }, [status]);

  const fetchLoyalty = async () => {
    try {
      const res = await fetch("/api/loyalty/balance");
      if (!res.ok) return;
      const data = await res.json();
      setLoyalty(data.account);
      setTransactions(data.recentTransactions ?? []);
    } catch {
    } finally {
      setLoadingLoyalty(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sand border-t-gold" />
      </div>
    );
  }

  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "Cliente";
  const firstName = displayName.split(" ")[0];

  const tierProgress = loyalty ? calculateTierProgress(loyalty.lifetime_points) : null;
  const discount = loyalty ? convertPointsToDiscount(loyalty.points) : 0;

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="border-b border-sand bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-espresso-800 to-espresso-600 text-cream">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                  Mi cuenta
                </p>
                <h1 className="font-serif text-2xl text-espresso-900">
                  Hola, {firstName}
                </h1>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full border border-sand px-4 py-2 text-sm font-medium text-espresso-500 transition hover:border-terracotta/40 hover:text-terracotta"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Dashboard de puntos ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          {loadingLoyalty ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-sand bg-white">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-sand border-t-gold" />
            </div>
          ) : loyalty ? (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-espresso-900 via-espresso-800 to-[#2a1a10] text-cream shadow-lg">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-gold/70">
                      Club Flor de Altura
                    </p>
                    <p className="mt-1 font-serif text-4xl font-semibold text-gold">
                      {loyalty.points.toLocaleString("es-PE")}
                    </p>
                    <p className="mt-0.5 text-sm text-cream/60">puntos disponibles</p>
                    {loyalty.points >= 100 && (
                      <p className="mt-2 text-sm font-medium text-gold-light">
                        = {formatPEN(discount)} en descuentos
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                      loyalty.tier === "platinum" ? "bg-purple-200 text-purple-900" :
                      loyalty.tier === "gold" ? "bg-yellow-200 text-yellow-900" :
                      loyalty.tier === "silver" ? "bg-gray-200 text-gray-800" :
                      "bg-amber-100 text-amber-900",
                    )}>
                      {TIER_LABELS[loyalty.tier]}
                    </span>
                    <p className="mt-2 text-xs text-cream/50">
                      {loyalty.lifetime_points.toLocaleString("es-PE")} pts acumulados
                    </p>
                  </div>
                </div>

                {/* Barra de progreso al siguiente tier */}
                {loyalty.tier !== "platinum" && tierProgress && (
                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs text-cream/60">
                      <span>{TIER_LABELS[loyalty.tier]}</span>
                      <span>{TIER_NEXT[loyalty.tier]} en {tierProgress.nextThreshold.toLocaleString("es-PE")} pts</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-700"
                        style={{ width: `${tierProgress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {loyalty.tier === "platinum" && (
                  <div className="mt-6 flex items-center gap-2 text-sm text-gold-light">
                    <Star className="h-4 w-4" />
                    Nivel Platino — máximo multiplicador (2×)
                  </div>
                )}
              </div>

              {/* Últimas transacciones */}
              {transactions.length > 0 && (
                <div className="border-t border-white/10 px-6 py-4 sm:px-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cream/50">
                    Últimos movimientos
                  </p>
                  <div className="space-y-2">
                    {transactions.slice(0, 4).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">{tx.description}</span>
                        <span className={cn(
                          "font-semibold",
                          tx.type === "earn" || tx.type === "bonus" ? "text-gold-light" : "text-terracotta",
                        )}>
                          {tx.type === "earn" || tx.type === "bonus" ? "+" : "-"}{tx.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-sand bg-white p-6 text-center">
              <Award className="mx-auto mb-3 h-10 w-10 text-sand" />
              <p className="text-espresso-500">No se pudo cargar tu cuenta de puntos.</p>
            </div>
          )}
        </motion.div>

        {/* ── Accesos rápidos ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Heart,
              label: "Favoritos",
              value: wishlistCount(),
              suffix: "productos",
              href: "/wishlist",
              color: "text-terracotta",
            },
            {
              icon: ShoppingBag,
              label: "Carrito",
              value: cartItems.length,
              suffix: "productos",
              onClick: () => useCartStore.getState().openCart(),
              color: "text-gold-dark",
            },
            {
              icon: Package,
              label: "Pedidos",
              value: 0,
              suffix: "realizados",
              href: "/ordenes",
              color: "text-organic",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-espresso-500">{item.label}</p>
                  <p className="mt-1 font-serif text-3xl font-semibold text-espresso-900">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-xs text-espresso-400">{item.suffix}</p>
                </div>
                <Icon className={cn("h-8 w-8", item.color)} />
              </div>
            );

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="rounded-2xl border border-sand bg-white shadow-sm transition hover:shadow-md"
              >
                {item.href ? (
                  <Link href={item.href} className="block">{content}</Link>
                ) : (
                  <button onClick={item.onClick} className="block w-full text-left">{content}</button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Datos personales ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-sand bg-white p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-lg text-espresso-900">Datos personales</h2>
            <User className="h-5 w-5 text-sand" />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DataRow label="Correo electrónico" value={user?.email ?? "—"} />
            <DataRow label="Nombre completo" value={user?.name ?? "—"} />
            <DataRow label="DNI" value="Disponible en tu cuenta" />
            <DataRow label="Dirección de entrega" value="Disponible en tu cuenta" />
          </dl>
          <p className="mt-4 text-xs text-espresso-400">
            Para actualizar tus datos contáctanos a{" "}
            <a href="mailto:hola@flordealtura.com" className="text-gold-dark hover:underline">
              hola@flordealtura.com
            </a>
          </p>
        </motion.div>

        {/* ── Cómo ganar más puntos ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gold/30 bg-gold/5 p-6 sm:p-8"
        >
          <h2 className="mb-4 font-serif text-lg text-espresso-900">
            Cómo ganar más puntos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { text: "S/ 1 gastado = 1 punto base", badge: "Bronce" },
              { text: "S/ 1 gastado = 1.25 puntos", badge: "Plata (500 pts)" },
              { text: "S/ 1 gastado = 1.5 puntos", badge: "Oro (2.000 pts)" },
              { text: "S/ 1 gastado = 2 puntos", badge: "Platino (5.000 pts)" },
            ].map((item) => (
              <div key={item.badge} className="flex items-center gap-3 text-sm">
                <Star className="h-4 w-4 flex-shrink-0 text-gold" />
                <span className="text-espresso-600">
                  {item.text}{" "}
                  <span className="font-semibold text-espresso-800">— Nivel {item.badge}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gold/20 pt-4 text-sm text-espresso-500">
            <strong className="text-espresso-700">Canjear:</strong> 100 puntos = S/ 5 de descuento en tu próximo pedido.
          </div>
          <Link
            href="/productos"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-espresso-800 px-6 py-3 text-sm font-semibold text-cream transition hover:bg-espresso-900"
          >
            Comprar y acumular puntos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </main>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-espresso-400">{label}</dt>
      <dd className="mt-1 text-sm text-espresso-700">{value}</dd>
    </div>
  );
}
