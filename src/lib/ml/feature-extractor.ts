import { Product, ProductVector } from "@/types";

/**
 * Extract feature vector from product
 * Maps product characteristics to a 5-dimensional vector
 */
export function extractProductVector(product: Product): ProductVector {
  // Flavor brightness: based on altitude + SCA score
  // Higher altitude + higher score = brighter
  const flavorBrightness = (product.altitude / 3000) * 0.5 + (product.scaScore - 80) / 7 * 0.5;

  // Body weight: based on process type
  // Natural > Honey > Washed
  const bodyWeightMap: Record<string, number> = {
    natural: 1.0,
    honey: 0.65,
    washed: 0.35,
  };
  const bodyWeight = bodyWeightMap[product.process.toLowerCase()] || 0.5;

  // Acidity level: based on altitude + variety hints
  // Higher altitude = more acidity
  const acidityLevel = (product.altitude / 3000) * 0.8 + 0.2;

  // SCA score normalization (80-87 range)
  const scaScoreNorm = (product.scaScore - 80) / 7;

  // Price tier normalization (assuming 25-100 PEN range for 250g)
  const priceTier = Math.min(product.price / 100, 1.0);

  return {
    id: product.id,
    flavorBrightness: Math.min(Math.max(flavorBrightness, 0), 1),
    bodyWeight: Math.min(Math.max(bodyWeight, 0), 1),
    acidityLevel: Math.min(Math.max(acidityLevel, 0), 1),
    scaScoreNorm: Math.min(Math.max(scaScoreNorm, 0), 1),
    priceTier: Math.min(Math.max(priceTier, 0), 1),
  };
}

/**
 * Convert product vector to normalized 5-dimensional array
 */
export function vectorToArray(vector: ProductVector): number[] {
  return [
    vector.flavorBrightness,
    vector.bodyWeight,
    vector.acidityLevel,
    vector.scaScoreNorm,
    vector.priceTier,
  ];
}
