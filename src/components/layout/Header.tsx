"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Heart, User } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";
import { MobileMenu } from "./MobileMenu";

const NAV = [
  { href: "#origen", label: "Origen" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#b2b", label: "Oficinas" },
  { href: "#revista", label: "Revista" },
  { href: "#educacion", label: "Cursos" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/85 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        <Link
          href="#top"
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

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-espresso-600 transition hover:text-gold-dark"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/productos"
            aria-label="Catálogo"
            className="hidden sm:flex rounded-full p-2.5 text-espresso-700 transition hover:bg-sand hover:text-gold text-sm font-medium"
          >
            Catálogo
          </Link>
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
