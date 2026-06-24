import { PRODUCTS } from "@/data/products";
import { extractProductVector, vectorToArray } from "@/lib/ml/feature-extractor";
import { calculateUserVector, findTopSimilar } from "@/lib/ml/collab-filtering";
import { supabaseAdmin } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

interface RecommendationRequest {
  strategy: "browsing" | "trending" | "similar_taste" | "collaborative";
  browsedIds?: string[];
  limit?: number;
}

export const dynamic = "force-dynamic";

function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(\S+)$/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp();
    const { allowed } = await checkRateLimit(`recommendations:${clientIp}`, 100, 3600);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    }

    const body: RecommendationRequest = await request.json();
    const { strategy = "trending", browsedIds = [], limit = 5 } = body;

    let userId: string | null = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = extractBearerToken(authHeader);
      if (token) {
        const { data: userData } = await supabaseAdmin.auth.getUser(token);
        userId = userData?.user?.id || null;
      }
    }

    // Extract vectors for all products
    const productVectors = PRODUCTS.map((p) => ({
      id: p.id,
      vector: vectorToArray(extractProductVector(p)),
    }));

    // Filter already browsed
    const candidates = productVectors.filter((p) => !browsedIds.includes(p.id));

    let recommendations = PRODUCTS.filter((p) => !browsedIds.includes(p.id));

    switch (strategy) {
      case "trending": {
        // Highest SCA score
        recommendations = recommendations
          .sort((a, b) => b.scaScore - a.scaScore)
          .slice(0, limit);
        break;
      }

      case "similar_taste": {
        // Filter by origin from browsed products
        const browsedOrigins = PRODUCTS
          .filter((p) => browsedIds.includes(p.id))
          .map((p) => p.origin);

        if (browsedOrigins.length > 0) {
          recommendations = recommendations
            .filter((p) => browsedOrigins.includes(p.origin))
            .slice(0, limit);
        } else {
          recommendations = recommendations.slice(0, limit);
        }
        break;
      }

      case "collaborative": {
        if (userId) {
          // Fetch user's browsing history from Supabase
          const { data: behavior } = await supabaseAdmin
            .from("user_behavior")
            .select("product_id, event_type")
            .eq("user_id", userId)
            .limit(10)
            .order("created_at", { ascending: false });

          if (behavior && behavior.length > 0) {
            // Build user preference vector from browsing history
            const behaviorVectors = behavior
              .map((b) => {
                const product = PRODUCTS.find((p) => p.id === b.product_id);
                return product ? vectorToArray(extractProductVector(product)) : null;
              })
              .filter(Boolean) as number[][];

            // Weight more recent interactions higher
            const weights = behavior.map((_, i) => 1 / (i + 1));

            const userVector = calculateUserVector(behaviorVectors, weights);

            // Find most similar products
            const topSimilar = findTopSimilar(userVector, candidates, limit);
            const topIds = topSimilar.map((r) => r.id);

            recommendations = PRODUCTS.filter((p) =>
              topIds.includes(p.id)
            ).sort((a, b) => {
              const aScore = topSimilar.find((r) => r.id === a.id)?.score || 0;
              const bScore = topSimilar.find((r) => r.id === b.id)?.score || 0;
              return bScore - aScore;
            });
          } else {
            // Fallback to trending if no history
            recommendations = recommendations
              .sort((a, b) => b.scaScore - a.scaScore)
              .slice(0, limit);
          }
        } else {
          // Fallback for anonymous users
          recommendations = recommendations
            .sort((a, b) => b.scaScore - a.scaScore)
            .slice(0, limit);
        }
        break;
      }

      case "browsing":
      default: {
        // Random shuffle
        recommendations = recommendations
          .sort(() => Math.random() - 0.5)
          .slice(0, limit);
      }
    }

    // Log recommendation event if authenticated
    if (userId) {
      await supabaseAdmin.from("audit_logs").insert([
        {
          user_id: userId,
          event_type: "recommendation_served",
          details: {
            strategy,
            count: recommendations.length,
            browsedCount: browsedIds.length,
          },
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      strategy,
      products: recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error("[RecommendationsAPI Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
