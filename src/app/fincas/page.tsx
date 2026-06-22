"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mountain, MapPin, ArrowRight, Leaf } from "lucide-react";
import { FINCAS } from "@/data/fincas";

export default function FincasPage() {
  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso-800 px-4 py-24 sm:px-6 lg:px-8">
        {/* Ruido orgánico */}
        <div className="noise-grain absolute inset-0" aria-hidden />
        {/* Halo de luz */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2">
              <Mountain className="h-4 w-4 text-gold" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gold">
                1.700 – 1.950 msnm
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl font-semibold text-cream sm:text-6xl"
          >
            Fincas de Origen Peruano
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-espresso-200 max-w-2xl mx-auto"
          >
            Cada taza de Flor de Altura nace en un territorio específico de la Selva Central
            del Perú, cultivada por un productor con nombre y apellido. La altitud entre
            1.700 y 1.950 msnm no es marketing: es la razón científica por la que este
            café de especialidad existe.
          </motion.p>
        </div>
      </section>

      {/* Grid de fincas */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {FINCAS.map((finca, i) => (
            <motion.div
              key={finca.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                href={`/fincas/${finca.slug}`}
                className="group block overflow-hidden rounded-3xl bg-white shadow-card hover:shadow-xl transition-shadow duration-300"
              >
                {/* Imagen hero */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-espresso-800 to-organic">
                  <Image
                    src={finca.heroImage}
                    alt={finca.name}
                    fill
                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Altitud — siempre visible */}
                  <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-espresso-900/80 px-3 py-1.5 backdrop-blur-sm">
                    <Mountain className="h-3.5 w-3.5 text-gold" />
                    <span className="font-mono text-xs font-bold text-cream tracking-wide">
                      {finca.altitude.min.toLocaleString()} – {finca.altitude.max.toLocaleString()} msnm
                    </span>
                  </div>
                  {/* Año fundación */}
                  <div className="absolute bottom-5 right-5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                    <span className="font-mono text-xs text-cream">
                      Est. {finca.established}
                    </span>
                  </div>
                  {/* Overlay gradiente */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-espresso-900/70 to-transparent" />
                </div>

                <div className="p-7">
                  {/* Región */}
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-organic">
                    <MapPin className="h-3 w-3" />
                    {finca.region}
                  </div>

                  <h2 className="mt-2 font-serif text-2xl font-semibold text-espresso-900 group-hover:text-espresso-700 transition">
                    {finca.name}
                  </h2>
                  <p className="mt-1 text-espresso-500">{finca.tagline}</p>

                  <p className="mt-4 text-sm text-espresso-600 leading-relaxed line-clamp-3">
                    {finca.description}
                  </p>

                  {/* Productor */}
                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-cream p-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-sand flex-shrink-0">
                      <Image
                        src={finca.producer.image}
                        alt={finca.producer.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-espresso-900">
                        {finca.producer.name}
                      </p>
                      <p className="text-xs text-espresso-500">{finca.producer.role}</p>
                    </div>
                  </div>

                  {/* Variedades + certificaciones */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {finca.varieties.map((v) => (
                      <span
                        key={v}
                        className="flex items-center gap-1 rounded-full bg-organic/10 px-2.5 py-1 text-xs font-medium text-organic"
                      >
                        <Leaf className="h-3 w-3" />
                        {v}
                      </span>
                    ))}
                    {finca.certifications.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-sand px-2.5 py-1 text-xs text-espresso-600"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-espresso-700 group-hover:text-gold transition">
                    Conocer la finca
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Manifiesto de trazabilidad */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 rounded-3xl border border-sand bg-white px-8 py-12 text-center"
        >
          <div className="flex justify-center mb-5">
            <Mountain className="h-10 w-10 text-gold" />
          </div>
          <h2 className="font-serif text-3xl text-espresso-900">
            Trazabilidad completa: de la planta a tu taza
          </h2>
          <p className="mt-4 text-espresso-500 max-w-xl mx-auto">
            En Flor de Altura no compramos café anónimo. Cada bolsa identifica la finca de origen,
            el nombre del productor, la altitud exacta de cultivo y el proceso de beneficio.
            Eso es trazabilidad real — el estándar del verdadero café de especialidad peruano.
          </p>
          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso-800 px-6 py-3 text-sm font-semibold text-cream hover:bg-espresso-900 transition"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
