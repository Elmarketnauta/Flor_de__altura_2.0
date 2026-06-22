"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Mail, Mountain, Phone, User, X } from "lucide-react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { useClubStore } from "@/store/club-store";
import type { NavItem } from "./Header";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
}

export function MobileMenu({ open, onClose, nav }: MobileMenuProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { isSubscribed } = useClubStore();

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
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.nav
            aria-label="Navegación móvil"
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-cream shadow-drawer"
            variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/brand/logo.png"
                  alt="Flor de Altura Café"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <span className="font-serif text-sm font-semibold text-espresso-800">
                  Flor de Altura
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="rounded-full p-2 text-espresso-500 transition hover:bg-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links principales */}
            <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
              {nav.map((item) => {
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
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 rounded-xl px-4 py-3.5 font-semibold text-sm transition ${
                          isActive
                            ? "bg-espresso-900 text-cream"
                            : "bg-espresso-800 text-cream hover:bg-espresso-900"
                        }`}
                      >
                        <Mountain className="h-4 w-4 text-gold flex-shrink-0" />
                        {item.label}
                        {isSubscribed && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-gold" />
                        )}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Comp
                      href={resolvedHref}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-sand font-semibold text-espresso-900"
                          : "text-espresso-700 hover:bg-sand/60 hover:text-espresso-900"
                      }`}
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                      )}
                      {item.label}
                    </Comp>
                  </li>
                );
              })}
            </ul>

            {/* Accesos rápidos — wishlist y perfil */}
            <div className="border-t border-sand px-3 py-3">
              <p className="px-4 pb-2 font-mono text-[10px] uppercase tracking-widest text-espresso-400">
                Mi cuenta
              </p>
              <div className="flex gap-2">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                    pathname === "/wishlist"
                      ? "bg-sand text-espresso-900"
                      : "text-espresso-600 hover:bg-sand"
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  Favoritos
                </Link>
                <Link
                  href="/perfil"
                  onClick={onClose}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition ${
                    pathname === "/perfil"
                      ? "bg-sand text-espresso-900"
                      : "text-espresso-600 hover:bg-sand"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Mi perfil
                </Link>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-2 border-t border-sand px-5 py-4 text-sm text-espresso-500">
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
