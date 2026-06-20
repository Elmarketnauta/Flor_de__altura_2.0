"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";

const NAV = [
  { href: "#origen", label: "Origen" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#b2b", label: "Oficinas" },
  { href: "#revista", label: "Revista" },
  { href: "#educacion", label: "Cursos" },
];

export function Header() {
  const [open, setOpen] = useState(false);

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
          <CartButton />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="rounded-full p-2.5 text-espresso-700 transition hover:bg-sand md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-sand bg-cream md:hidden"
            aria-label="Móvil"
          >
            <ul className="container-app flex flex-col gap-1 py-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-medium text-espresso-700 transition hover:bg-sand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
