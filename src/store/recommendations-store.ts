"use client";

import { create } from "zustand";
import type { Product } from "@/types";

type RecommendationStrategy = "browsing" | "trending" | "similar_taste";

interface RecommendationsState {
  products: Product[];
  strategy: RecommendationStrategy;
  lastUpdated: number;
  isLoading: boolean;

  // Mutaciones
  setRecommendations: (products: Product[], strategy: RecommendationStrategy) => void;
  setIsLoading: (loading: boolean) => void;
  fetchRecommendations: (
    strategy: RecommendationStrategy,
    browsedIds?: string[]
  ) => Promise<void>;

  // Selectores
  getRecommendedProducts: (limit?: number) => Product[];
  isEmpty: () => boolean;
}

export const useRecommendationsStore = create<RecommendationsState>(
  (set, get) => ({
    products: [],
    strategy: "trending",
    lastUpdated: 0,
    isLoading: false,

    setRecommendations: (products, strategy) =>
      set({
        products,
        strategy,
        lastUpdated: Date.now(),
      }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    fetchRecommendations: async (strategy, browsedIds = []) => {
      set({ isLoading: true });
      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            strategy,
            browsedIds,
          }),
        });

        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        set({
          products: data.products || [],
          strategy,
          lastUpdated: Date.now(),
          isLoading: false,
        });
      } catch (error) {
        console.error("[RecommendationsFetch Error]", error);
        set({ isLoading: false });
      }
    },

    getRecommendedProducts: (limit = 4) => {
      return get().products.slice(0, limit);
    },

    isEmpty: () => get().products.length === 0,
  })
);
