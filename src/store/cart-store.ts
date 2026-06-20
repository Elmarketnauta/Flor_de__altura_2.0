"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, ProductFormat } from "@/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPEN } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // UI
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Mutaciones
  addItem: (product: Product, format?: ProductFormat, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  incrementItem: (lineId: string) => void;
  decrementItem: (lineId: string) => void;
  clearCart: () => void;

  // Selectores derivados
  totalItems: () => number;
  totalPrice: () => number;
  buildWhatsAppUrl: () => string;
}

/** Genera un id de línea único por combinación producto+formato. */
function lineIdFor(productId: string, format: ProductFormat): string {
  return `${productId}__${format}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, format = "grano", quantity = 1) =>
        set((state) => {
          const lineId = lineIdFor(product.id, format);
          const existing = state.items.find((i) => i.id === lineId);

          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.id === lineId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }

          const newItem: CartItem = {
            id: lineId,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            format,
            quantity,
          };

          return { isOpen: true, items: [...state.items, newItem] };
        }),

      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== lineId),
        })),

      incrementItem: (lineId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === lineId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      decrementItem: (lineId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === lineId ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      /**
       * Construye el enlace de WhatsApp API con el resumen del pedido.
       * Mapea cada línea del carrito y calcula el total.
       */
      buildWhatsAppUrl: () => {
        const { items, totalPrice } = get();

        const lines = items.map((i) => {
          const subtotal = formatPEN(i.price * i.quantity);
          const formatLabel = i.format === "grano" ? "En grano" : "Molido";
          return `• ${i.quantity}× ${i.name} (${formatLabel}) — ${subtotal}`;
        });

        const message = [
          "¡Hola Flor de Altura! ☕ Quiero confirmar mi pedido:",
          "",
          ...lines,
          "",
          `*Total: ${formatPEN(totalPrice())}*`,
          "",
          "¿Me ayudan a coordinar el pago y la entrega? 🌱",
        ].join("\n");

        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      },
    }),
    {
      name: "fa-cart",
      storage: createJSONStorage(() => localStorage),
      // Solo persistimos los items, no el estado de apertura del drawer.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
