"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Mountain } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";
import { ScrollToTop } from "./ScrollToTop";

const SITE_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Catálogo" },
  { href: "/fincas", label: "Fincas de Origen" },
  { href: "/club", label: "Club de Suscripción" },
  { href: "/revista", label: "Revista" },
  { href: "/#b2b", label: "Café para Oficinas" },
];

const LEGAL_LINKS = [
  "Términos y Condiciones",
  "Políticas de Privacidad",
  "Libro de Reclamaciones",
];

export function Footer() {
  const columns = [
    {
      title: "Marca",
      isLogo: true,
    },
    {
      title: "Mapa del Sitio",
      links: SITE_LINKS,
    },
    {
      title: "Legales",
      links: LEGAL_LINKS.map((l) => ({ label: l, href: "#" })),
    },
    {
      title: "Contacto",
      isContact: true,
    },
  ];

  return (
    <footer className="relative bg-espresso-900 text-cream/70">
      <ScrollToTop />

      <div className="container-app py-14">
        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          viewport={{ once: true }}
        >
          {/* Marca */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Image
              src="/brand/logo.png"
              alt="Flor de Altura Café"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <p className="mt-4 text-sm leading-relaxed">
              Café de especialidad 100% Arábica orgánico cultivado entre 1.700 y 1.950 msnm
              en Pichanaqui y Perené, Selva Central del Perú. Microlotes trazables,
              SCA 84–87, comercio justo FLO-CERT certificado.
            </p>
            <motion.div
              className="mt-4 flex gap-3"
              initial="hidden"
              whileInView="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              <motion.div variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}>
                <SocialLink href={BRAND.socials.instagram} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialLink>
              </motion.div>
              <motion.div variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}>
                <SocialLink href={BRAND.socials.facebook} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialLink>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Mapa del sitio */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-cream">
              Mapa del Sitio
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legales */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-cream">
              Legales
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {LEGAL_LINKS.map((l) => (
                <li key={l}>
                  <span className="cursor-pointer transition hover:text-gold">
                    {l}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-cream">
              Contacto
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {BRAND.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {BRAND.phoneDisplay}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {BRAND.email}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-gold" />
                Lun - Sáb: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* CTA newsletter / club */}
        <div className="mt-10 rounded-2xl border border-espresso-700 px-6 py-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:justify-between">
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <Mountain className="h-4 w-4 text-gold" />
              <span className="font-mono text-xs uppercase tracking-widest text-gold">
                Club Flor de Altura
              </span>
            </div>
            <p className="font-serif text-lg text-cream">
              Un microlote diferente cada mes, desde 1.700 msnm.
            </p>
          </div>
          <Link
            href="/club"
            className="flex-shrink-0 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-espresso-900 hover:bg-gold-light transition"
          >
            Unirme al Club
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-espresso-700 pt-6 text-sm sm:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. Todos los derechos
            reservados. RUC {BRAND.ruc}
          </p>
          {/* Firma del desarrollador — no modificar */}
          <p className="text-cream/50">
            Designed &amp; Developed by{" "}
            <Link
              href={BRAND.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold transition hover:text-gold-light"
            >
              {BRAND.developer}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso-700 text-cream transition hover:bg-gold hover:text-espresso-900"
    >
      {children}
    </Link>
  );
}
