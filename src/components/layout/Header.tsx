"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Heart, User, Mountain } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import { MobileMenu } from "./MobileMenu";
import { useClubStore } from "@/store/club-store";

const NAV = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "/fincas", label: "Fincas" },
  { href: "/club", label: "Club" },
  { href: "#b2b", label: "Oficinas" },
  { href: "#revista", label: "Revista" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSubscribed } = useClubStore();

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/85 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
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

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {NAV.map((item) => {
            const isClub = item.href === "/club";
            const isExternal = item.href.startsWith("/") && !item.href.startsWith("#");
            const Comp = isExternal ? Link : "a";
            return (
              <Comp
                key={item.href}
                href={item.href}
                className={
                  isClub
                    ? "flex items-center gap-1.5 rounded-full bg-espresso-800 px-3 py-1.5 text-xs font-semibold text-cream transition hover:bg-espresso-900"
                    : "text-sm font-medium text-espresso-600 transition hover:text-gold-dark"
                }
              >
                {isClub && <Mountain className="h-3 w-3 text-gold" />}
                {item.label}
                {isClub && isSubscribed && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-gold" aria-label="Suscripción activa" />
                )}
              </Comp>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/wishlist"
            aria-label="Mis favoritos"
            className="rounded-full p-2.5 text-espresso-700 transition hover:bg-sand hover:text-gold"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/perfil"
            aria-label="Mi perfil"
            className="rounded-full p-2.5 text-espresso-700 transition hover:bg-sand hover:text-gold"
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
