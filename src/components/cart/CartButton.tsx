"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

/** Botón de la barra superior que abre el carrito y muestra el contador. */
export function CartButton({ isTransparent = false }: { isTransparent?: boolean }) {
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.totalItems());
  const hydrated = useHydrated();

  return (
    <button
      onClick={openCart}
      aria-label={`Abrir carrito, ${hydrated ? count : 0} artículos`}
      data-layer="open_cart"
      className={`relative rounded-full p-2.5 transition-colors duration-200 ${
        isTransparent
          ? "text-cream/80 hover:text-cream hover:bg-white/10"
          : "text-espresso-700 hover:text-gold hover:bg-sand"
      }`}
    >
      <ShoppingBag className="h-5 w-5" />
      {hydrated && count > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-espresso-900 tabular-nums"
        >
          {count}
        </span>
      )}
    </button>
  );
}
