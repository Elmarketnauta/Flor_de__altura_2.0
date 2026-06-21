/**
 * Lightweight collaborative filtering using cosine similarity
 * No external ML dependencies, runs inline
 */

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }

  aMagnitude = Math.sqrt(aMagnitude);
  bMagnitude = Math.sqrt(bMagnitude);

  if (aMagnitude === 0 || bMagnitude === 0) return 0;

  return dotProduct / (aMagnitude * bMagnitude);
}

/**
 * Calculate user preference vector based on browsing history
 * Weighted average of products viewed, wishlisted, purchased
 */
export function calculateUserVector(
  productVectors: number[][],
  weights: number[]
): number[] {
  if (productVectors.length === 0) {
    return [0.5, 0.5, 0.5, 0.5, 0.5]; // Default neutral vector
  }

  const dimension = productVectors[0].length;
  const result = Array(dimension).fill(0);

  let totalWeight = 0;
  for (let i = 0; i < productVectors.length; i++) {
    const weight = weights[i] || 1;
    totalWeight += weight;

    for (let j = 0; j < dimension; j++) {
      result[j] += productVectors[i][j] * weight;
    }
  }

  // Normalize by total weight
  return result.map((v) => v / totalWeight);
}

/**
 * Find top N most similar products
 */
export function findTopSimilar(
  userVector: number[],
  candidateVectors: Array<{ id: string; vector: number[] }>,
  topN: number = 5
): Array<{ id: string; score: number }> {
  const similarities = candidateVectors.map((candidate) => ({
    id: candidate.id,
    score: cosineSimilarity(userVector, candidate.vector),
  }));

  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
