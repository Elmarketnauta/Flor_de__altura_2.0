"use client";

import { motion } from "framer-motion";
import { Mountain, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-espresso-800 to-espresso-900 text-cream"
    >
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-organic/20 blur-3xl" />

      <div className="container-app relative grid gap-10 py-24 lg:grid-cols-2 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-5 flex items-center gap-2 text-gold-light">
            <Mountain className="h-4 w-4" />
            <span className="text-sm font-medium tracking-wide">
              {BRAND.origin}
            </span>
          </div>

          <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            El café que crece donde
            <span className="text-gold"> nace la nube</span>
          </h1>

          <p className="mt-5 max-w-md text-lg text-cream/80">
            Microlotes de especialidad cultivados a 1.700 msnm en Pichanaqui.
            Trazabilidad total, puntaje {BRAND.scaRange}, y un ritual en cada
            taza.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogo"
              className="rounded-full bg-gold px-7 py-3.5 font-semibold text-espresso-900 shadow-card transition hover:bg-gold-light"
            >
              Explorar el catálogo
            </a>
            <a
              href="#b2b"
              className="rounded-full border border-cream/30 px-7 py-3.5 font-medium text-cream transition hover:bg-cream/10"
            >
              Soluciones para empresas
            </a>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-cream/60">
            <Sparkles className="h-4 w-4 text-gold-light" />
            Tostado bajo pedido · Orgánico · Comercio directo con el productor
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative hidden items-center justify-center lg:flex"
        >
          <div className="grid w-full max-w-sm gap-4">
            <StatCard value="1.700" unit="msnm" label="Altitud de cultivo" />
            <div className="grid grid-cols-2 gap-4">
              <StatCard value="84–87" unit="pts" label="Puntaje SCA" />
              <StatCard value="100%" unit="" label="Trazable al lote" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 backdrop-blur">
      <div className="font-serif text-3xl font-semibold text-gold">
        {value}
        {unit && <span className="ml-1 text-base text-cream/60">{unit}</span>}
      </div>
      <p className="mt-1 text-sm text-cream/70">{label}</p>
    </div>
  );
}
