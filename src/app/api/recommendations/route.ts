import { NextRequest, NextResponse } from "next/server";

interface RecommendationRequest {
  strategy: "browsing" | "trending" | "similar_taste";
  browsedIds?: string[];
}

// Mock productos (en un caso real, vendría de la base de datos)
const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    name: "Pichanaqui Orgánico",
    slug: "pichanaqui-organico",
    price: 150,
    image: "/img/cafe-1.jpg",
    scaScore: 85,
    origin: "Pichanaqui",
    description: "Café de especialidad 100% orgánico",
    formats: ["grano", "molido"],
  },
  {
    id: "prod-2",
    name: "Chanchamayo Premium",
    slug: "chanchamayo-premium",
    price: 180,
    image: "/img/cafe-2.jpg",
    scaScore: 86,
    origin: "Chanchamayo",
    description: "Selección premium de la región",
    formats: ["grano", "molido"],
  },
  {
    id: "prod-3",
    name: "Mixtura Andina",
    slug: "mixtura-andina",
    price: 165,
    image: "/img/cafe-3.jpg",
    scaScore: 84,
    origin: "Junín",
    description: "Blend equilibrado de la sierra",
    formats: ["grano", "molido"],
  },
  {
    id: "prod-4",
    name: "Altura Plus",
    slug: "altura-plus",
    price: 195,
    image: "/img/cafe-4.jpg",
    scaScore: 87,
    origin: "Pichanaqui",
    description: "Nuestra selección más exclusiva",
    formats: ["grano", "molido"],
  },
];

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { strategy, browsedIds = [] } = body;

    if (!strategy) {
      return NextResponse.json(
        { error: "Missing strategy" },
        { status: 400 }
      );
    }

    let recommendations = [...MOCK_PRODUCTS];

    // Filtrar productos ya vistos
    if (browsedIds.length > 0) {
      recommendations = recommendations.filter(
        (p) => !browsedIds.includes(p.id)
      );
    }

    // Aplicar lógica según estrategia
    switch (strategy) {
      case "trending":
        // Ordenar por SCA score (descendente)
        recommendations.sort((a, b) => b.scaScore - a.scaScore);
        break;

      case "similar_taste":
        // Agrupar por origin (similares)
        recommendations.sort((a, b) =>
          a.origin.localeCompare(b.origin)
        );
        break;

      case "browsing":
        // Aleatorio
        recommendations.sort(() => Math.random() - 0.5);
        break;
    }

    return NextResponse.json(
      {
        success: true,
        strategy,
        products: recommendations.slice(0, 4),
        count: recommendations.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RecommendationsAPI Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
