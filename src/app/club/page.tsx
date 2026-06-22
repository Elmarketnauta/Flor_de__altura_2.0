"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mountain,
  Check,
  ArrowRight,
  Star,
  Zap,
  Gift,
  Repeat,
  ChevronDown,
  Lock,
} from "lucide-react";
import { CLUB_TIERS, useClubStore, getClubTierConfig } from "@/store/club-store";
import { useLoyaltyStore } from "@/store/loyalty-store";
import { cn, formatPEN } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { ClubTier, ClubFrequency, ProductFormat } from "@/types";
import { FINCAS } from "@/data/fincas";

const FREQUENCY_OPTIONS: { value: ClubFrequency; label: string; discount: number }[] = [
  { value: "mensual", label: "Mensual", discount: 0 },
  { value: "bimestral", label: "Bimestral", discount: 5 },
];

const FORMAT_OPTIONS: { value: ProductFormat; label: string }[] = [
  { value: "grano", label: "En grano" },
  { value: "molido", label: "Molido" },
];

const LOYALTY_INTEGRATION = [
  {
    tier: "Explorador",
    loyaltyBonus: "100 pts bienvenida",
    multiplier: "1.25×",
    extra: "Acceso anticipado a lanzamientos",
  },
  {
    tier: "Cumbre",
    loyaltyBonus: "250 pts bienvenida",
    multiplier: "1.5×",
    extra: "10% descuento en catálogo",
  },
  {
    tier: "Cumbre Plus",
    loyaltyBonus: "500 pts bienvenida",
    multiplier: "2.0×",
    extra: "20% descuento + cupping virtual",
  },
];

const FAQS = [
  {
    q: "¿Cuándo llega mi primer envío?",
    a: "El primer envío se despacha dentro de los 3 días hábiles tras la suscripción. Los envíos siguientes salen el 1ro de cada mes (mensual) o cada dos meses (bimestral).",
  },
  {
    q: "¿Puedo pausar o cancelar cuando quiera?",
    a: "Sí, sin penalidad. Desde tu perfil puedes pausar, reactivar o cancelar en cualquier momento antes de que se procese el próximo envío.",
  },
  {
    q: "¿Cómo se integra con mi programa de puntos?",
    a: "Los puntos del Club se acumulan automáticamente. El multiplicador del Club (1.25× a 2×) se aplica sobre las compras regulares también, tomando siempre el mayor beneficio entre tu tier de loyalty y tu tier de Club.",
  },
  {
    q: "¿Los cafés del Club son los mismos del catálogo?",
    a: "No siempre. Los suscriptores acceden a microlotes de temporada y ediciones de finca que no están disponibles en el catálogo general. Es una de las ventajas exclusivas del Club.",
  },
  {
    q: "¿Puedo elegir el café que recibo?",
    a: "Los niveles Explorador y Cumbre reciben la selección curatorial del mes. Cumbre Plus recibe dos orígenes distintos y puede indicar preferencias de perfil (floral, dulce, intenso).",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sand">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left hover:text-espresso-900 transition"
        aria-expanded={open}
      >
        <span className="font-medium text-espresso-800">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-espresso-400 flex-shrink-0 ml-4 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-espresso-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClubPage() {
  const [selectedTier, setSelectedTier] = useState<ClubTier>("cumbre");
  const [frequency, setFrequency] = useState<ClubFrequency>("mensual");
  const [format, setFormat] = useState<ProductFormat>("grano");
  const [step, setStep] = useState<"plan" | "confirm">("plan");

  const { isSubscribed, tier: activeTier, subscribe, status } = useClubStore();
  const { points, tier: loyaltyTier } = useLoyaltyStore();

  const freqConfig = FREQUENCY_OPTIONS.find((f) => f.value === frequency)!;
  const tierConfig = getClubTierConfig(selectedTier);
  const finalPrice =
    tierConfig.priceMonthly * (1 - freqConfig.discount / 100);

  const handleSubscribe = () => {
    subscribe(selectedTier, frequency, format);
    trackEvent("club_subscribe", {
      tier: selectedTier,
      frequency,
      format,
      price: finalPrice,
    });
    setStep("plan");
  };

  return (
    <main className="min-h-screen bg-cream pt-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-espresso-800 px-4 py-24 sm:px-6 lg:px-8">
        <div className="noise-grain absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-organic/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2">
              <Mountain className="h-4 w-4 text-gold" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gold">
                Club Flor de Altura · Suscripción mensual
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl font-semibold text-cream sm:text-6xl lg:text-7xl"
          >
            Un café de altura,
            <br />
            <span className="text-gold">cada mes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-espresso-200 max-w-2xl mx-auto"
          >
            Descubre un microlote diferente cada ciclo. Cafés cultivados entre
            1.700 y 1.950 msnm, con nota de cata, historia del productor y
            puntos de fidelidad que se acumulan automáticamente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm"
          >
            {["Sin permanencia", "Pausa cuando quieras", "Puntos x2 en Cumbre Plus"].map((perk) => (
              <div key={perk} className="flex items-center gap-1.5 text-espresso-200">
                <Check className="h-4 w-4 text-gold" />
                {perk}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Estado suscripción activa ── */}
      {isSubscribed && activeTier && status === "active" && (
        <div className="bg-organic text-cream">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Mountain className="h-5 w-5 text-gold" />
              <span className="font-medium">
                Suscripción activa: <strong>{getClubTierConfig(activeTier).name}</strong>
              </span>
            </div>
            <Link
              href="/perfil"
              className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium hover:bg-white/30 transition"
            >
              Gestionar suscripción
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-24">

        {/* ── Cómo funciona ── */}
        <section>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              El proceso
            </p>
            <h2 className="mt-2 font-serif text-3xl text-espresso-900">
              Así funciona el Club
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Star,
                title: "Elige tu plan",
                desc: "Selecciona entre Explorador, Cumbre o Cumbre Plus según tu consumo y curiosidad.",
              },
              {
                icon: Mountain,
                title: "Curamos tu café",
                desc: "Cada mes elegimos un microlote de altura de nuestras fincas aliadas, con ficha de cata incluida.",
              },
              {
                icon: Gift,
                title: "Llega a tu puerta",
                desc: "Envío el 1ro de cada mes. Embalaje hermético que preserva los aromas hasta 60 días.",
              },
              {
                icon: Zap,
                title: "Acumulas puntos",
                desc: "Cada envío genera puntos con el multiplicador del Club. Canjéalos por productos o descuentos.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-espresso-800">
                  <step.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-espresso-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-espresso-500 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Configurador de suscripción ── */}
        <section>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Planes
            </p>
            <h2 className="mt-2 font-serif text-3xl text-espresso-900">
              Elige tu nivel de altura
            </h2>
          </div>

          {/* Frecuencia */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-sand bg-white p-1">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition",
                    frequency === opt.value
                      ? "bg-espresso-800 text-cream"
                      : "text-espresso-500 hover:text-espresso-800"
                  )}
                >
                  {opt.label}
                  {opt.discount > 0 && (
                    <span className="ml-2 rounded-full bg-gold/20 px-1.5 py-0.5 text-xs text-gold-dark font-semibold">
                      -{opt.discount}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas de plan */}
          <div className="grid gap-6 sm:grid-cols-3">
            {CLUB_TIERS.map((tier, i) => {
              const price = tier.priceMonthly * (1 - freqConfig.discount / 100);
              const isSelected = selectedTier === tier.id;
              const isPopular = tier.id === "cumbre";

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedTier(tier.id)}
                  className={cn(
                    "relative cursor-pointer rounded-3xl border-2 bg-white p-7 transition-all duration-200",
                    isSelected
                      ? "border-espresso-800 shadow-xl"
                      : "border-sand hover:border-espresso-400 hover:shadow-md"
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-espresso-900">
                        Más popular
                      </span>
                    </div>
                  )}

                  <div className="text-3xl mb-3">{tier.badge}</div>

                  <div className="flex items-center gap-2 mb-1">
                    <Mountain className="h-3.5 w-3.5 text-gold" />
                    <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                      {tier.id === "explorador"
                        ? "1.700 msnm"
                        : tier.id === "cumbre"
                        ? "1.850 msnm"
                        : "1.950 msnm"}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-espresso-900">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-espresso-500">{tier.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-semibold text-espresso-900">
                      {formatPEN(price)}
                    </span>
                    <span className="text-sm text-espresso-400">/ {frequency}</span>
                  </div>

                  <p className="mt-1 text-xs text-espresso-400">
                    {tier.weightGrams * tier.bags}g · {tier.bags} bolsa{tier.bags > 1 ? "s" : ""}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-espresso-700">
                        <Check className="h-4 w-4 flex-shrink-0 text-organic mt-0.5" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-xl bg-cream px-3 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-mono text-espresso-500">Multiplicador puntos</span>
                    <span className="font-mono text-sm font-bold text-espresso-900">
                      {tier.pointsMultiplier}×
                    </span>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-espresso-800"
                    >
                      <Check className="h-3.5 w-3.5 text-cream" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Formato + CTA */}
          <div className="mt-10 mx-auto max-w-md rounded-3xl border border-sand bg-white p-8 text-center">
            <h3 className="font-serif text-xl text-espresso-900 mb-4">
              Formato de molido
            </h3>
            <div className="inline-flex rounded-full border border-sand p-1 mb-6">
              {FORMAT_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-medium transition",
                    format === f.value
                      ? "bg-espresso-700 text-cream"
                      : "text-espresso-500 hover:text-espresso-700"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mb-2 text-sm text-espresso-500">
              Plan seleccionado:{" "}
              <strong className="text-espresso-900">{tierConfig.name}</strong>
              {" · "}
              <strong className="text-espresso-900">{formatPEN(finalPrice)}/{frequency}</strong>
            </div>

            {points > 0 && (
              <p className="mb-4 text-xs text-organic font-medium">
                Tienes {points} puntos · Con {tierConfig.name} los multiplicarás {tierConfig.pointsMultiplier}×
              </p>
            )}

            <button
              onClick={handleSubscribe}
              className="w-full rounded-full bg-gold py-3.5 font-bold text-espresso-900 hover:bg-gold-dark hover:text-cream transition active:scale-95"
            >
              {isSubscribed ? "Cambiar de plan" : "Suscribirme ahora"}
            </button>
            <p className="mt-3 text-xs text-espresso-400">
              Sin permanencia · Cancela cuando quieras
            </p>
          </div>
        </section>

        {/* ── Integración con Loyalty ── */}
        <section>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Fidelidad
            </p>
            <h2 className="mt-2 font-serif text-3xl text-espresso-900">
              El Club amplifica tus puntos
            </h2>
            <p className="mt-3 text-espresso-500 max-w-xl mx-auto">
              El programa de puntos y el Club son la misma estrategia de fidelidad.
              Cada envío suma, cada compra multiplica.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-sand">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand bg-espresso-800 text-cream">
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">
                    Plan del Club
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">
                    Puntos bienvenida
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide">
                    Multiplicador
                  </th>
                  <th className="px-6 py-4 text-left font-mono text-xs uppercase tracking-wide hidden sm:table-cell">
                    Beneficio extra
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand bg-white">
                {LOYALTY_INTEGRATION.map((row, i) => (
                  <tr key={row.tier} className={cn("transition hover:bg-cream", i % 2 === 0 ? "" : "bg-cream/40")}>
                    <td className="px-6 py-4 font-semibold text-espresso-900">
                      {row.tier}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-organic font-medium">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {row.loyaltyBonus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-espresso-900">
                        {row.multiplier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-espresso-500 hidden sm:table-cell">
                      {row.extra}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-espresso-400">
            Los puntos acumulados pueden canjearse por S/ 5 de descuento cada 100 puntos.
            Los multiplicadores del Club se aplican sobre compras del catálogo también.
          </p>
        </section>

        {/* ── Fincas del Club ── */}
        <section>
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">
              Origen
            </p>
            <h2 className="mt-2 font-serif text-3xl text-espresso-900">
              De estas fincas viene tu café
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {FINCAS.map((finca, i) => (
              <motion.div
                key={finca.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/fincas/${finca.slug}`}
                  className="group flex gap-4 rounded-2xl border border-sand bg-white p-5 hover:border-gold hover:shadow-md transition"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-espresso-800 to-organic">
                    <Image
                      src={finca.image}
                      alt={finca.name}
                      fill
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Mountain className="h-5 w-5 text-gold" />
                      <span className="font-mono text-[9px] font-bold text-cream text-center leading-tight mt-1">
                        {finca.altitude.min.toLocaleString()}+
                        <br />msnm
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-espresso-900 group-hover:text-espresso-700 transition">
                      {finca.name}
                    </h3>
                    <p className="text-xs font-mono text-espresso-400 uppercase tracking-wide">
                      {finca.region}
                    </p>
                    <p className="mt-2 text-sm text-espresso-500 line-clamp-2">
                      {finca.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-espresso-900">
              Preguntas frecuentes
            </h2>
          </div>
          <div>
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="relative overflow-hidden rounded-3xl bg-espresso-800 px-8 py-16 text-center">
          <div className="noise-grain absolute inset-0" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2">
                <Mountain className="h-4 w-4 text-gold" />
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gold">
                  1.700 – 1.950 msnm
                </span>
              </div>
            </div>
            <h2 className="font-serif text-4xl font-semibold text-cream">
              Empieza tu viaje de altura
            </h2>
            <p className="mt-4 text-espresso-200 max-w-xl mx-auto">
              Primer envío en menos de 3 días. Sin permanencia.
              Con puntos desde el primer sorbo.
            </p>
            <button
              onClick={() =>
                document
                  .querySelector("[data-club-plans]")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-bold text-espresso-900 hover:bg-gold-dark hover:text-cream transition text-lg"
            >
              Ver planes
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
