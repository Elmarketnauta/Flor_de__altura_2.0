import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LoyaltyTier } from "@/types";

interface LoyaltyState {
  points: number;
  tier: LoyaltyTier;
  lifetimePoints: number;
  isLoading: boolean;

  // Actions
  setPoints: (points: number) => void;
  setTier: (tier: LoyaltyTier) => void;
  setLifetimePoints: (points: number) => void;
  setLoading: (loading: boolean) => void;
  redeemPoints: (amount: number) => void;
  addPoints: (amount: number) => void;
  reset: () => void;
}

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set) => ({
      points: 0,
      tier: "bronze",
      lifetimePoints: 0,
      isLoading: false,

      setPoints: (points) => set({ points }),
      setTier: (tier) => set({ tier }),
      setLifetimePoints: (lifetimePoints) => set({ lifetimePoints }),
      setLoading: (isLoading) => set({ isLoading }),

      redeemPoints: (amount) =>
        set((state) => ({
          points: Math.max(0, state.points - amount),
        })),

      addPoints: (amount) =>
        set((state) => ({
          points: state.points + amount,
          lifetimePoints: state.lifetimePoints + amount,
        })),

      reset: () =>
        set({
          points: 0,
          tier: "bronze",
          lifetimePoints: 0,
          isLoading: false,
        }),
    }),
    {
      name: "fa-loyalty",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        points: state.points,
        tier: state.tier,
        lifetimePoints: state.lifetimePoints,
        // Don't persist isLoading
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
