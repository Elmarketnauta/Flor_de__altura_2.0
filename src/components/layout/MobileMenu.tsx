"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, X } from "lucide-react";
import { useEffect } from "react";
import { BRAND } from "@/lib/constants";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
}

/**
 * Menú de navegación móvil como panel lateral (slide-out).
 * Bloquea el scroll del fondo, cierra con Escape / overlay / al navegar.
 */
export function MobileMenu({ open, onClose, nav }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("scroll-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.nav
            aria-label="Navegación móvil"
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-cream shadow-drawer"
            variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <Image
                src="/brand/logo.png"
                alt="Flor de Altura Café"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="rounded-full p-2 text-espresso-500 transition hover:bg-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="flex flex-1 flex-col gap-1 px-3 py-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-3 font-medium text-espresso-700 transition hover:bg-sand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-sand px-5 py-5 text-sm text-espresso-500">
              <Link
                href={`tel:${BRAND.phoneDisplay.replace(/\s/g, "")}`}
                className="flex items-center gap-2 transition hover:text-gold-dark"
              >
                <Phone className="h-4 w-4 text-gold-dark" />
                {BRAND.phoneDisplay}
              </Link>
              <Link
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2 transition hover:text-gold-dark"
              >
                <Mail className="h-4 w-4 text-gold-dark" />
                {BRAND.email}
              </Link>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
