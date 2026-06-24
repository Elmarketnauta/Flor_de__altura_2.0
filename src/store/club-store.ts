"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ClubTier, ClubFrequency, ClubStatus, ProductFormat, ClubTierConfig } from "@/types";

export const CLUB_TIERS: ClubTierConfig[] = [
  {
    id: "explorador",
    name: "Explorador",
    tagline: "Descubre el café de especialidad",
    priceMonthly: 55,
    weightGrams: 250,
    bags: 1,
    pointsBonus: 100,
    pointsMultiplier: 1.25,
    perks: [
      "1 bolsa de 250g/mes",
      "Nota de cata exclusiva",
      "100 puntos de bienvenida",
      "Acceso anticipado a microlotes",
    ],
    badge: "🌱",
  },
  {
    id: "cumbre",
    name: "Cumbre",
    tagline: "Para el paladar que busca más complejidad",
    priceMonthly: 95,
    weightGrams: 500,
    bags: 1,
    pointsBonus: 250,
    pointsMultiplier: 1.5,
    perks: [
      "1 bolsa de 500g/mes",
      "Nota de cata + guía de preparación",
      "250 puntos de bienvenida",
      "Acceso prioritario a ediciones limitadas",
      "Descuento 10% en compras adicionales",
    ],
    badge: "⛰️",
  },
  {
    id: "cumbre-plus",
    name: "Aventurero",
    tagline: "La cima del café de especialidad peruano",
    priceMonthly: 165,
    weightGrams: 500,
    bags: 2,
    pointsBonus: 500,
    pointsMultiplier: 2.0,
    perks: [
      "2 bolsas de 500g/mes (orígenes distintos)",
      "Nota de cata + video del productor",
      "500 puntos de bienvenida",
      "Acceso exclusivo a lotes de microfinca",
      "Descuento 20% en compras adicionales",
      "Invitación a cupping virtual trimestral",
    ],
    badge: "🏔️",
  },
];

interface ClubState {
  isSubscribed: boolean;
  tier: ClubTier | null;
  frequency: ClubFrequency;
  format: ProductFormat;
  status: ClubStatus | null;
  nextShipmentDate: string | null;
  totalShipments: number;
  pointsEarned: number;

  subscribe: (tier: ClubTier, frequency: ClubFrequency, format: ProductFormat) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  changeTier: (tier: ClubTier) => void;
  changeFormat: (format: ProductFormat) => void;
  addClubPoints: (points: number) => void;
  reset: () => void;
}

function nextMonthDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(1);
  return d.toISOString().split("T")[0];
}

export const useClubStore = create<ClubState>()(
  persist(
    (set) => ({
      isSubscribed: false,
      tier: null,
      frequency: "mensual",
      format: "grano",
      status: null,
      nextShipmentDate: null,
      totalShipments: 0,
      pointsEarned: 0,

      subscribe: (tier, frequency, format) =>
        set({
          isSubscribed: true,
          tier,
          frequency,
          format,
          status: "active",
          nextShipmentDate: nextMonthDate(),
        }),

      pause: () => set({ status: "paused" }),

      resume: () =>
        set({ status: "active", nextShipmentDate: nextMonthDate() }),

      cancel: () =>
        set({
          isSubscribed: false,
          tier: null,
          status: "cancelled",
          nextShipmentDate: null,
        }),

      changeTier: (tier) => set({ tier }),

      changeFormat: (format) => set({ format }),

      addClubPoints: (points) =>
        set((state) => ({ pointsEarned: state.pointsEarned + points })),

      reset: () =>
        set({
          isSubscribed: false,
          tier: null,
          frequency: "mensual",
          format: "grano",
          status: null,
          nextShipmentDate: null,
          totalShipments: 0,
          pointsEarned: 0,
        }),
    }),
    {
      name: "fa-club",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getClubTierConfig(tier: ClubTier): ClubTierConfig {
  return CLUB_TIERS.find((t) => t.id === tier)!;
}
