"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Heart, User, Mountain } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import { MobileMenu } from "./MobileMenu";
import { useClubStore } from "@/store/club-store";

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
  const [scrolled, setScrolled] = useState(false);
  const { isSubscribed } = useClubStore();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Detecta scroll para cambiar apariencia del header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En home: transparente hasta que scrollea. En páginas internas: siempre opaco.
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        isTransparent
          ? "border-b border-white/10 bg-transparent"
          : "border-b border-sand/70 bg-cream/95 shadow-sm backdrop-blur-md"
      }`}
    >
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
          <span
            className={`hidden font-serif text-lg font-semibold sm:block transition-colors duration-300 ${
              isTransparent ? "text-cream" : "text-espresso-800"
            }`}
          >
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

            const resolvedHref =
              isHome && item.homeAnchor ? item.homeAnchor : item.href;
            const isAnchor = resolvedHref.startsWith("#");
            const Comp = isAnchor ? "a" : Link;

            if (isClub) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-espresso-900 text-cream"
                      : isTransparent
                      ? "bg-white/20 text-cream hover:bg-white/30 backdrop-blur-sm"
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
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-md ${
                  isActive
                    ? isTransparent
                      ? "text-cream font-semibold"
                      : "text-espresso-900 font-semibold"
                    : isTransparent
                    ? "text-cream/80 hover:text-cream"
                    : "text-espresso-500 hover:text-espresso-900"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                      isTransparent ? "bg-gold" : "bg-gold"
                    }`}
                  />
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
            className={`rounded-full p-2.5 transition-colors duration-200 ${
              pathname === "/wishlist"
                ? "text-gold"
                : isTransparent
                ? "text-cream/80 hover:text-cream hover:bg-white/10"
                : "text-espresso-700 hover:text-gold hover:bg-sand"
            }`}
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/perfil"
            aria-label="Mi perfil"
            className={`rounded-full p-2.5 transition-colors duration-200 ${
              pathname === "/perfil"
                ? "text-gold"
                : isTransparent
                ? "text-cream/80 hover:text-cream hover:bg-white/10"
                : "text-espresso-700 hover:text-gold hover:bg-sand"
            }`}
          >
            <User className="h-5 w-5" />
          </Link>
          <CartButton isTransparent={isTransparent} />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className={`rounded-full p-2.5 transition-colors duration-200 md:hidden ${
              isTransparent
                ? "text-cream/80 hover:text-cream hover:bg-white/10"
                : "text-espresso-700 hover:bg-sand"
            }`}
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
