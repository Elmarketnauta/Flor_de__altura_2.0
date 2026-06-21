import { LoyaltyTier } from "@/types";

/**
 * Loyalty tier thresholds based on lifetime points.
 * Tiers: Bronze (0-499), Silver (500-1999), Gold (2000-4999), Platinum (5000+)
 */
export function calculateTier(lifetimePoints: number): LoyaltyTier {
  if (lifetimePoints >= 5000) return "platinum";
  if (lifetimePoints >= 2000) return "gold";
  if (lifetimePoints >= 500) return "silver";
  return "bronze";
}

/**
 * Points multiplier by tier.
 * Bronze 1x, Silver 1.25x, Gold 1.5x, Platinum 2x
 */
export function getPointsMultiplier(tier: LoyaltyTier): number {
  const multipliers: Record<LoyaltyTier, number> = {
    bronze: 1.0,
    silver: 1.25,
    gold: 1.5,
    platinum: 2.0,
  };
  return multipliers[tier];
}

/**
 * Calculate points earned from an order.
 * Base: 1 punto per S/ 1 spent
 * Then apply tier multiplier
 */
export function calculatePointsEarned(orderAmount: number, tier: LoyaltyTier): number {
  const basePoints = Math.floor(orderAmount);
  const multiplier = getPointsMultiplier(tier);
  return Math.floor(basePoints * multiplier);
}

/**
 * Convert points to discount in PEN.
 * 100 puntos = S/ 5 off
 */
export function convertPointsToDiscount(points: number): number {
  return (points / 100) * 5;
}

/**
 * Discount check: user can only redeem if they have at least 100 points.
 */
export function canRedeemPoints(points: number): boolean {
  return points >= 100;
}

/**
 * Helper to display tier with friendly label
 */
export function getTierLabel(tier: LoyaltyTier): string {
  const labels: Record<LoyaltyTier, string> = {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum",
  };
  return labels[tier];
}

/**
 * Get color for tier badge
 */
export function getTierColor(tier: LoyaltyTier): string {
  const colors: Record<LoyaltyTier, string> = {
    bronze: "bg-amber-100 text-amber-800",
    silver: "bg-gray-100 text-gray-800",
    gold: "bg-yellow-100 text-yellow-800",
    platinum: "bg-purple-100 text-purple-800",
  };
  return colors[tier];
}

/**
 * Calculate progress to next tier in points and percentage
 */
export function calculateTierProgress(
  lifetimePoints: number
): { currentPoints: number; nextThreshold: number; progressPercent: number } {
  const tiers = [
    { points: 0, nextThreshold: 500 },
    { points: 500, nextThreshold: 2000 },
    { points: 2000, nextThreshold: 5000 },
    { points: 5000, nextThreshold: Infinity },
  ];

  const currentTierIndex = tiers.findIndex((t) => lifetimePoints >= t.points);
  const currentTier = tiers[Math.max(0, currentTierIndex)];
  const nextTier = tiers[Math.min(tiers.length - 1, currentTierIndex + 1)];

  const pointsInCurrentTier = lifetimePoints - currentTier.points;
  const pointsNeededForNext = nextTier.nextThreshold - currentTier.points;
  const progressPercent =
    pointsNeededForNext === Infinity ? 100 : Math.round((pointsInCurrentTier / pointsNeededForNext) * 100);

  return {
    currentPoints: pointsInCurrentTier,
    nextThreshold: pointsNeededForNext === Infinity ? 0 : pointsNeededForNext - pointsInCurrentTier,
    progressPercent: Math.min(100, progressPercent),
  };
}
