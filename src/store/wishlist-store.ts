"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";

interface WishlistItem {
  productId: string;
  addedAt: number;
  source: "browse" | "recommendation" | "search";
}

interface WishlistState {
  items: WishlistItem[];

  // Mutaciones
  addToWishlist: (productId: string, source?: string) => void;
  removeFromWishlist: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearWishlist: () => void;

  // Selectores
  wishlistCount: () => number;
  getWishlistProductIds: () => string[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (productId, source = "browse") =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === productId);
          if (exists) return state;

          return {
            items: [
              ...state.items,
              {
                productId,
                addedAt: Date.now(),
                source: source as any,
              },
            ],
          };
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      isFavorite: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),

      wishlistCount: () => get().items.length,

      getWishlistProductIds: () => get().items.map((i) => i.productId),
    }),
    {
      name: "fa-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
