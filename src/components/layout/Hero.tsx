"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mountain, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMagnetic } from "@/lib/use-magnetic";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";

/**
 * ACTO 1 — "La Altitud".
 * Hero inmersivo que evoca la niebla de la Selva Central a 1.700 msnm mediante
 * paralaje profundo: el cielo, las capas de montañas y la niebla se mueven a
 * distinta velocidad al hacer scroll, generando sensación de profundidad.
 * El parallax se anula con prefers-reduced-motion (queda un Hero estático limpio).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Capas a distinta velocidad → profundidad. Las más lejanas se mueven menos.
  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", "62%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="noise-grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-espresso-800 via-espresso-900 to-espresso-900 text-cream"
    >
      {/* Capa lejana: halo solar / cielo de altura */}
      <motion.div
        aria-hidden
        style={reducedMotion ? undefined : { y: yFar }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute left-1/2 top-[12%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute -left-32 bottom-1/3 h-96 w-96 rounded-full bg-organic/20 blur-3xl" />
      </motion.div>

      {/* Montañas lejanas (movimiento lento) */}
      <motion.div
        aria-hidden
        style={reducedMotion ? undefined : { y: yMid }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
      >
        <MountainLayer
          className="h-[55vh] w-full text-espresso-900/60"
          variant="far"
        />
      </motion.div>

      {/* Montañas cercanas (movimiento rápido) + niebla */}
      <motion.div
        aria-hidden
        style={reducedMotion ? undefined : { y: yNear }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
      >
        <MountainLayer
          className="h-[42vh] w-full text-espresso-900"
          variant="near"
        />
      </motion.div>

      {/* Niebla flotante */}
      <FogBands reducedMotion={reducedMotion} />

      {/* Contenido */}
      <motion.div
        style={reducedMotion ? undefined : { y: yContent, opacity }}
        className="container-app relative z-20 flex w-full min-w-0 max-w-full flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-cream/5 px-4 py-1.5 text-sm font-medium tracking-wide text-gold-light backdrop-blur"
        >
          <Mountain className="h-4 w-4" />
          100% Orgánico • {BRAND.origin}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl text-balance font-serif text-4xl leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          El café que crece donde
          <span className="text-gold"> nace la nube</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 w-full max-w-xl text-balance text-lg text-cream/80"
        >
          Microlotes de especialidad cultivados a 1.700 msnm en Pichanaqui.
          Trazabilidad total, puntaje {BRAND.scaRange}, y un ritual en cada taza.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticCTA target="#catalogo" primary strength={0.7}>
            Explorar el catálogo
          </MagneticCTA>
          <MagneticCTA target="#b2b" strength={0.65}>
            Soluciones para empresas
          </MagneticCTA>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-10 flex items-center gap-2 text-sm text-cream/60"
        >
          <Sparkles className="h-4 w-4 text-gold-light" />
          Tostado bajo pedido · Orgánico · Comercio directo con el productor
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/30 p-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

/** Botón CTA magnético con glow orgánico (variante primaria). */
function MagneticCTA({
  target,
  primary = false,
  strength = 0.65,
  children,
}: {
  target: string;
  primary?: boolean;
  strength?: number;
  children: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  const { scrollTo } = useSmoothScroll();

  return (
    <a
      ref={ref}
      href={target}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(target, -64);
      }}
      data-cursor={primary ? "Ver granos" : "Cotizar"}
      className={
        primary
          ? "glow-organic rounded-full bg-gold px-8 py-4 font-semibold text-espresso-900 transition hover:bg-gold-light"
          : "rounded-full border border-cream/30 px-8 py-4 font-medium text-cream backdrop-blur transition hover:bg-cream/10"
      }
    >
      {children}
    </a>
  );
}

/** Bandas de niebla con deriva lenta horizontal. */
function FogBands({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 h-32 w-[140%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cream/5 to-transparent blur-2xl"
          style={{ top: `${42 + i * 16}%` }}
          animate={
            reducedMotion
              ? undefined
              : { x: ["-20%", "0%", "-20%"] }
          }
          transition={{
            duration: 18 + i * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Silueta de montañas en SVG (capa de parallax). */
function MountainLayer({
  className,
  variant,
}: {
  className?: string;
  variant: "far" | "near";
}) {
  const path =
    variant === "far"
      ? "M0,160 L180,70 L340,150 L520,40 L700,140 L900,60 L1100,150 L1280,90 L1440,160 L1440,320 L0,320 Z"
      : "M0,240 L160,140 L320,220 L480,120 L640,210 L820,110 L1000,220 L1180,130 L1440,230 L1440,320 L0,320 Z";
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={className}
      fill="currentColor"
    >
      <path d={path} />
    </svg>
  );
}
