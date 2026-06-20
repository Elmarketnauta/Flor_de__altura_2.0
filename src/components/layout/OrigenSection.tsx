"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mountain, Sprout, ArrowRight } from "lucide-react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMagnetic } from "@/lib/use-magnetic";

/**
 * ACTO 2 — "La Tierra y la Cosecha".
 * Scrollytelling anclado (pin GSAP simulado): imagen de la finca fija en el lado
 * izquierdo mientras párrafos aparecen/desaparecen en el derecho guiados por scroll.
 * Textura de ruido orgánico y color verde de marca para reforzar lo natural.
 */
export function OrigenSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Progreso de scroll para revelar párrafos en cascada.
  const p1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [0, 1, 1]);
  const p1YOut = useTransform(scrollYProgress, [0.35, 0.5], [0, -100]);
  const p2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6], [0, 1, 1]);
  const p2YOut = useTransform(scrollYProgress, [0.6, 0.75], [0, -100]);
  const p3Opacity = useTransform(scrollYProgress, [0.5, 0.65, 0.85], [0, 1, 1]);

  return (
    <section
      ref={containerRef}
      id="origen"
      className="noise-grain relative scroll-mt-20 bg-cream py-0 lg:py-0"
    >
      <div className="container-app grid min-h-screen items-center gap-12 lg:grid-cols-2 lg:py-20">
        {/* Imagen: fija en desktop, scrollea en móvil */}
        <motion.div
          className="sticky top-1/2 -translate-y-1/2 lg:relative lg:top-auto lg:translate-y-0"
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: useTransform(
                    scrollYProgress,
                    [0, 0.3, 1],
                    [0.5, 1, 1],
                  ),
                }
          }
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-organic via-organic/80 to-espresso-800 shadow-card">
            <Image
              src="/brand/logo.png"
              alt="Finca Flor de Altura en Pichanaqui"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-12"
              priority
            />
          </div>
          {/* Badge flotante de altitud */}
          <motion.div
            animate={reducedMotion ? undefined : { y: [0, 12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-2 hidden h-40 w-40 overflow-hidden rounded-2xl border-4 border-cream bg-sand shadow-card sm:block"
          >
            <Image
              src="/brand/logo.png"
              alt="Manos agricultoras"
              fill
              sizes="160px"
              className="object-contain p-4"
            />
          </motion.div>
        </motion.div>

        {/* Contenido: reveal por scroll */}
        <div className="space-y-0 py-20 lg:py-0">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm uppercase tracking-wide text-organic"
          >
            Nuestra Historia
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-serif text-4xl leading-tight text-espresso-800 sm:text-5xl"
          >
            Cosechando identidad en alturas excepcionales
          </motion.h2>

          {/* Párrafo 1: Altitud */}
          <motion.div
            style={reducedMotion ? undefined : { opacity: p1Opacity, y: p1YOut }}
            className="mt-8 space-y-2"
          >
            <p className="text-lg text-espresso-600">
              Flor de Altura nace en el corazón de Pichanaqui, Junín, como una
              alianza directa con pequeños agricultores locales. A 1.700 msnm,
              creemos que la calidad de la taza no es fruto del azar, sino del
              respeto a los tiempos de la tierra.
            </p>
          </motion.div>

          {/* Párrafo 2: Orgánico */}
          <motion.div
            style={reducedMotion ? undefined : { opacity: p2Opacity, y: p2YOut }}
            className="mt-12 space-y-2"
          >
            <p className="text-lg text-espresso-600">
              Nuestros cafetos crecen protegidos por árboles de sombra nativos,
              absorbiendo lentamente los nutrientes de suelos fértiles de
              montaña. Al prescindir de pesticidas y abonos químicos,
              garantizamos un grano puro, limpio, 100% orgánico y saludable.
            </p>
          </motion.div>

          {/* Párrafo 3: Comercio Justo + CTA */}
          <motion.div
            style={reducedMotion ? undefined : { opacity: p3Opacity }}
            className="mt-12 space-y-6"
          >
            <p className="text-lg text-espresso-600">
              Pagamos primas especiales por encima del mercado para asegurar la
              sostenibilidad de las familias caficultoras. Cada taza de Flor de
              Altura es un viaje directo desde la mano del agricultor a tu mesa,
              sin intermediarios.
            </p>

            <CulturaLink />
          </motion.div>

          {/* Features: Altitud + Comercio Justo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid gap-6 sm:grid-cols-2"
          >
            <FeatureCard
              icon={Mountain}
              title="1.700 msnm"
              description="Altitud que propicia maduración lenta y mayor concentración de azúcares naturales."
            />
            <FeatureCard
              icon={Sprout}
              title="Comercio Justo"
              description="Pagamos primas especiales para asegurar la sostenibilidad de nuestros agricultores."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Card de feature con ícono animado. */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Mountain;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-organic/20 bg-gradient-to-br from-organic/5 to-transparent p-5 transition"
    >
      <Icon className="h-7 w-7 text-organic" strokeWidth={1.5} />
      <h4 className="mt-3 font-serif text-xl text-espresso-800">{title}</h4>
      <p className="mt-1 text-sm text-espresso-500">{description}</p>
    </motion.div>
  );
}

/** CTA "Leer Historia Completa" con magnetismo + cursor custom. */
function CulturaLink() {
  const ref = useMagnetic<HTMLAnchorElement>(0.55);
  return (
    <a
      ref={ref}
      href="#origen"
      data-cursor="Descubrir Origen"
      className="inline-flex items-center gap-2 font-semibold text-organic transition hover:gap-3"
    >
      Nuestra Cultura de Café
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
