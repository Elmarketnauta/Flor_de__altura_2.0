"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Heart, User, Mountain } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import { MobileMenu } from "./MobileMenu";
import { useClubStore } from "@/store/club-store";

/**
 * Cada item define cómo resolver el href según el contexto de la ruta.
 * - `href`: destino real (ruta absoluta o anchor en home)
 * - `homeAnchor`: anchor usado sólo cuando ya estamos en "/"
 * - `matchPath`: prefijo de ruta para marcar el item como activo
 */
export interface NavItem {
  label: string;
  href: string;
  homeAnchor?: string;
  matchPath?: string;
}

export const NAV: NavItem[] = [
  { label: "Catálogo",  href: "/productos",  homeAnchor: "#catalogo",  matchPath: "/productos" },
  { label: "Fincas",   href: "/fincas",                               matchPath: "/fincas"    },
  { label: "Club",     href: "/club",                                  matchPath: "/club"      },
  { label: "Oficinas", href: "/#b2b",        homeAnchor: "#b2b"                               },
  { label: "Revista",  href: "/revista",     homeAnchor: "#revista",   matchPath: "/revista"   },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSubscribed } = useClubStore();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/90 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="Flor de Altura Café — inicio"
        >
          <Image
            src="/brand/logo.png"
            alt="Flor de Altura Café"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="hidden font-serif text-lg font-semibold text-espresso-800 sm:block">
            Flor de Altura
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((item) => {
            const isClub = item.href === "/club";
            const isActive =
              item.matchPath &&
              (pathname === item.matchPath ||
                pathname.startsWith(item.matchPath + "/"));

            // En la home usamos el anchor directo; en otras rutas la ruta real
            const resolvedHref =
              isHome && item.homeAnchor ? item.homeAnchor : item.href;
            const isAnchor = resolvedHref.startsWith("#");
            const Comp = isAnchor ? "a" : Link;

            if (isClub) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-espresso-900 text-cream"
                      : "bg-espresso-800 text-cream hover:bg-espresso-900"
                  }`}
                >
                  <Mountain className="h-3 w-3 text-gold" />
                  {item.label}
                  {isSubscribed && (
                    <span
                      className="ml-0.5 h-1.5 w-1.5 rounded-full bg-gold"
                      aria-label="Suscripción activa"
                    />
                  )}
                </Link>
              );
            }

            return (
              <Comp
                key={item.href}
                href={resolvedHref}
                className={`relative px-3 py-1.5 text-sm font-medium transition rounded-md ${
                  isActive
                    ? "text-espresso-900 font-semibold"
                    : "text-espresso-500 hover:text-espresso-900"
                }`}
              >
                {item.label}
                {/* Indicador de ruta activa */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gold" />
                )}
              </Comp>
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-0.5">
          <Link
            href="/wishlist"
            aria-label="Mis favoritos"
            className={`rounded-full p-2.5 transition hover:bg-sand ${
              pathname === "/wishlist"
                ? "text-gold"
                : "text-espresso-700 hover:text-gold"
            }`}
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/perfil"
            aria-label="Mi perfil"
            className={`rounded-full p-2.5 transition hover:bg-sand ${
              pathname === "/perfil"
                ? "text-gold"
                : "text-espresso-700 hover:text-gold"
            }`}
          >
            <User className="h-5 w-5" />
          </Link>
          <CartButton />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="rounded-full p-2.5 text-espresso-700 transition hover:bg-sand md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={NAV}
      />
    </header>
  );
}
