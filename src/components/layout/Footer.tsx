import Image from "next/image";
import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";

const SITE_LINKS = [
  { href: "#top", label: "Inicio" },
  { href: "#origen", label: "Origen y Finca" },
  { href: "#catalogo", label: "Catálogo de Granos" },
  { href: "#b2b", label: "Planes de Oficina" },
  { href: "#revista", label: "Revista Digital" },
];

const LEGAL_LINKS = [
  "Términos y Condiciones",
  "Políticas de Privacidad",
  "Libro de Reclamaciones",
];

export function Footer() {
  return (
    <footer className="bg-espresso-900 text-cream/70">
      <div className="container-app py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <Image
              src="/brand/logo.png"
              alt="Flor de Altura Café"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <p className="mt-4 text-sm leading-relaxed">
              Un café orgánico de especialidad y origen único cultivado en
              Pichanaqui, Selva Central del Perú. Calidad, trazabilidad y
              comercio justo real en cada grano.
            </p>
            <div className="mt-4 flex gap-3">
              <SocialLink href={BRAND.socials.instagram} label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={BRAND.socials.facebook} label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          {/* Mapa del sitio */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-cream">
              Mapa del Sitio
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition hover:text-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legales */}
          <div>
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
          </div>

          {/* Contacto */}
          <div>
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
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-espresso-700 pt-6 text-sm sm:flex-row">
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
