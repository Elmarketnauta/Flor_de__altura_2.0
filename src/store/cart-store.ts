"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, ProductFormat } from "@/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPEN } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastModified: number;
  syncStatus: "idle" | "syncing" | "error";

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

  // Validaciones
  isValidQuantity: (quantity: number, productId: string) => boolean;
  meetsMinimumOrder: () => boolean;
  canCheckout: () => boolean;

  // Sincronización
  syncWithRemote: () => Promise<void>;
  setSyncStatus: (status: "idle" | "syncing" | "error") => void;

  // Selectores derivados
  totalItems: () => number;
  totalPrice: () => number;
  buildWhatsAppUrl: () => string;
}

/** Genera un id de línea único por combinación producto+formato. */
function lineIdFor(productId: string, format: ProductFormat): string {
  return `${productId}__${format}`;
}

const MINIMUM_ORDER_VALUE = 100; // PEN
const MAX_QUANTITY_PER_PRODUCT = 20;
const CART_EXPIRY_HOURS = 24;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastModified: Date.now(),
      syncStatus: "idle",

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
              lastModified: Date.now(),
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

          return { isOpen: true, lastModified: Date.now(), items: [...state.items, newItem] };
        }),

      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== lineId),
          lastModified: Date.now(),
        })),

      incrementItem: (lineId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === lineId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
          lastModified: Date.now(),
        })),

      decrementItem: (lineId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === lineId ? { ...i, quantity: i.quantity - 1 } : i,
            )
            .filter((i) => i.quantity > 0),
          lastModified: Date.now(),
        })),

      clearCart: () => set({ items: [], lastModified: Date.now() }),

      isValidQuantity: (quantity: number, _productId: string) => {
        return quantity > 0 && quantity <= MAX_QUANTITY_PER_PRODUCT;
      },

      meetsMinimumOrder: () => {
        return get().totalPrice() >= MINIMUM_ORDER_VALUE;
      },

      canCheckout: () => {
        return get().items.length > 0 && get().meetsMinimumOrder();
      },

      syncWithRemote: async () => {
        const state = get();
        if (state.items.length === 0) return;

        set({ syncStatus: "syncing" });
        try {
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: state.items,
              lastModified: state.lastModified,
            }),
          });

          if (!response.ok) throw new Error("Sync failed");
          set({ syncStatus: "idle" });
        } catch (error) {
          console.error("[CartSync] Error:", error);
          set({ syncStatus: "error" });
        }
      },

      setSyncStatus: (status) => set({ syncStatus: status }),

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
      partialize: (state) => ({
        items: state.items,
        lastModified: state.lastModified,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const now = Date.now();
        const lastMod = state.lastModified || now;
        const hoursOld = (now - lastMod) / (1000 * 60 * 60);

        if (hoursOld > CART_EXPIRY_HOURS) {
          state.items = [];
          state.lastModified = now;
        }
      },
    },
  ),
);
