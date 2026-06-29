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

  // Sutil realce de la imagen al entrar en vista. Los párrafos usan un reveal
  // por opacidad sin desplazamiento vertical para que nunca se solapen entre sí
  // ni con el título.
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 1, 1]);

  return (
    <section
      ref={containerRef}
      id="origen"
      className="noise-grain relative scroll-mt-20 bg-cream py-0 lg:py-0"
    >
      <div className="container-app grid items-start gap-10 py-16 lg:min-h-screen lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
        {/* Imagen: estática en móvil, sticky en desktop */}
        <motion.div
          className="relative lg:sticky lg:top-1/4"
          style={
            reducedMotion
              ? undefined
              : {
                  opacity: imageOpacity,
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
            className="absolute -bottom-6 -right-2 hidden h-40 w-40 overflow-hidden rounded-2xl border-4 border-cream bg-sand shadow-card lg:block"
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
        <div className="space-y-0">
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
            Café peruano de altura: donde la altitud transforma el grano
          </motion.h2>

          {/* Párrafo 1: Altitud */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-8 space-y-2"
          >
            <p className="text-lg text-espresso-600">
              Flor de Altura nace en el corazón de Pichanaqui, Junín, Selva Central del Perú,
              como una alianza directa con pequeños productores de altura. Entre 1.700 y 1.950 msnm,
              el frío nocturno ralentiza la maduración del grano, concentrando azúcares naturales
              y construyendo la complejidad aromática que define al auténtico café de especialidad peruano.
            </p>
          </motion.div>

          {/* Párrafo 2: Orgánico */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12 space-y-2"
          >
            <p className="text-lg text-espresso-600">
              Nuestros cafetos Arábica — variedades Catuai Rojo y Geisha — crecen bajo la
              sombra de árboles nativos de guabo y pacae, absorbiendo los nutrientes únicos
              de los suelos volcánicos andino-amazónicos. Sin pesticidas ni abonos sintéticos:
              certificación orgánica SENASA que garantiza un grano puro, limpio y 100% trazable.
            </p>
          </motion.div>

          {/* Párrafo 3: Comercio Justo + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12 space-y-6"
          >
            <p className="text-lg text-espresso-600">
              Trabajamos en comercio directo con los productores de la Finca San Ignacio
              y la Finca Bella Vista, pagando primas por encima del mercado para garantizar
              la sostenibilidad de las familias caficultoras de Junín y Chanchamayo.
              Cada taza de Flor de Altura es un viaje trazable desde la mano del productor
              hasta tu mesa — sin intermediarios, sin anonimato.
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
              title="1.700 – 1.950 msnm"
              description="La altitud ralentiza la maduración y concentra azúcares naturales, creando el perfil complejo del café de especialidad."
            />
            <FeatureCard
              icon={Sprout}
              title="Comercio Justo Certificado"
              description="FLO-CERT Fairtrade y pago directo a los productores de Pichanaqui y Perené, sin intermediarios."
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
