"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { B2BForm } from "./B2BForm";

/**
 * ACTO 4 — "El Impacto".
 * Dark Mode Industrial elegante: gradient espresso-900 → orgánico oscuro.
 * Textura de ruido visible para "peso" corporativo.
 * Benefits con check animados, entrada en cascada.
 */

const BENEFITS = [
  {
    title: "Abastecimiento Semanal de Café de Especialidad",
    description:
      "Entregamos lotes de café orgánico peruano recién tostado directamente desde nuestra tostaduría hasta tu oficina en Lima.",
  },
  {
    title: "Talleres Sensoriales de Cata",
    description:
      "Programa experiencias de cata guiadas por baristas certificados SCA para tu equipo — team building con propósito y cultura del café de especialidad.",
  },
  {
    title: "Newsletter de Café de Especialidad",
    description:
      "Contenido editorial mensual: guías de extracción, novedades de cosecha, puntajes SCA y cultura del café desde la Selva Central del Perú.",
  },
];

export function B2BSection() {
  return (
    <section
      id="b2b"
      className="noise-grain relative scroll-mt-20 bg-gradient-to-br from-espresso-900 via-espresso-800 to-[#1a2e25] py-20 text-cream lg:py-24"
    >
      {/* Accent glow en las esquinas */}
      <div className="pointer-events-none absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-1/4 h-80 w-80 rounded-full bg-organic/5 blur-3xl" />

      <div className="container-app relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* Copy + beneficios */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono text-sm uppercase tracking-wide text-gold-light"
          >
            Flor de Altura Oficina
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 font-serif text-4xl leading-tight sm:text-5xl"
          >
            Café orgánico de especialidad para tu empresa en Lima
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 max-w-md text-lg text-cream/80"
          >
            Transforma el ambiente laboral de tu empresa reemplazando el café
            industrial por granos orgánicos de especialidad de origen peruano,
            cultivados a 1.700 msnm en Pichanaqui y tostados bajo pedido semanal.
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.4 },
              },
            }}
            viewport={{ once: true }}
            className="mt-10 space-y-5"
          >
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b.title}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="flex gap-4"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: 0.4 + i * 0.15,
                  }}
                  viewport={{ once: true }}
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light text-espresso-900"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </motion.span>
                <div>
                  <h4 className="font-semibold text-cream">{b.title}</h4>
                  <p className="mt-1 text-sm text-cream/70">{b.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Formulario de captación */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <B2BForm />
        </motion.div>
      </div>
    </section>
  );
}
