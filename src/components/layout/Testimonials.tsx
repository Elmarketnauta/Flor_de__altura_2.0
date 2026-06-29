"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "El Geisha de Altura es sencillamente espectacular. Tiene notas florales y de bergamota que nunca había sentido en un café peruano. La entrega a Miraflores llegó al día siguiente del tostado.",
    initials: "AC",
    name: "Alejandro Cárdenas",
    role: "Suscriptor Club Flor de Altura",
  },
  {
    text: "Implementamos el plan corporativo de Flor de Altura en la oficina y el cambio ha sido rotundo. El equipo valora enormemente que sea café orgánico peruano certificado y el servicio es impecable.",
    initials: "VS",
    name: "Valeria Salazar",
    role: "HR Manager · Tech Solutions Lima",
  },
  {
    text: "Tomé el curso de barismo y con el cupón RITUAL20 me abastecí del Catuai orgánico de Pichanaqui. Preparar mi V60 cada mañana con este café de especialidad peruano es mi ritual favorito.",
    initials: "GP",
    name: "Gustavo Ponce",
    role: "Comprador Frecuente · Lima",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-sand/40 to-cream py-20 lg:py-24">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="font-mono text-sm uppercase tracking-wide text-gold-dark">
            Opiniones Reales
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-espresso-800 sm:text-4xl lg:text-5xl">
            Lo que dicen los amantes del café de especialidad peruano
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.initials}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(60,34,24,0.1)" }}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-card transition"
            >
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: 0.3 + i * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </motion.div>
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-lg text-espresso-600">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: 0.4,
                  }}
                  viewport={{ once: true }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-espresso-700 to-espresso-800 font-semibold text-cream"
                >
                  {t.initials}
                </motion.span>
                <div>
                  <p className="font-semibold text-espresso-800">{t.name}</p>
                  <p className="text-sm text-espresso-400">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
