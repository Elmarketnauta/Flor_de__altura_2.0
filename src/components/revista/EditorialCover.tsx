"use client";

import type { ArticleCategory } from "@/types";

/**
 * Placeholder fotográfico editorial premium.
 *
 * En ausencia de fotografía real, genera una "portada" de revista a partir de
 * gradientes ricos por categoría + textura de grano (noise) + acentos
 * tipográficos. Diseñado para sustituirse trivialmente por una <Image> real:
 * basta envolver este componente en un condicional `article.coverPhoto ? ... : <EditorialCover/>`.
 *
 * El estilo busca la sensación de portada Rolling Stone / Time: color saturado,
 * profundidad por capas y un gran caracter tipográfico de fondo.
 */

interface CoverPalette {
  from: string;
  via: string;
  to: string;
  accent: string;
  glyph: string;
  kicker: string;
}

const PALETTES: Record<ArticleCategory, CoverPalette> = {
  origen: {
    from: "#1d1512",
    via: "#3c2218",
    to: "#5c3a21",
    accent: "#c08b5c",
    glyph: "❡",
    kicker: "ORIGEN",
  },
  metodos: {
    from: "#14110f",
    via: "#2a2018",
    to: "#3c2218",
    accent: "#4a9edd",
    glyph: "≈",
    kicker: "MÉTODOS",
  },
  sostenibilidad: {
    from: "#101a14",
    via: "#1c2e25",
    to: "#2a4135",
    accent: "#7bbf6a",
    glyph: "✿",
    kicker: "SOSTENIBILIDAD",
  },
};

interface EditorialCoverProps {
  category: ArticleCategory;
  /** Texto grande de fondo (normalmente una palabra clave del artículo). */
  word?: string;
  /** Proporción: "cover" (alto, portada) o "wide" (panorámico). */
  variant?: "cover" | "wide" | "square";
  className?: string;
}

const ASPECT: Record<NonNullable<EditorialCoverProps["variant"]>, string> = {
  cover: "aspect-[3/4]",
  wide: "aspect-[16/10]",
  square: "aspect-square",
};

export function EditorialCover({
  category,
  word,
  variant = "wide",
  className = "",
}: EditorialCoverProps) {
  const p = PALETTES[category];

  return (
    <div
      className={`noise-grain relative overflow-hidden ${ASPECT[variant]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${p.from} 0%, ${p.via} 55%, ${p.to} 100%)`,
      }}
      aria-hidden
    >
      {/* Halo de luz superior */}
      <div
        className="pointer-events-none absolute -top-1/3 left-1/4 h-2/3 w-2/3 rounded-full blur-3xl"
        style={{ background: p.accent, opacity: 0.18 }}
      />
      {/* Sombra inferior para legibilidad de overlays */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Gran caracter tipográfico de fondo */}
      {word && (
        <span
          className="pointer-events-none absolute -right-4 bottom-[-0.15em] select-none font-serif font-black leading-none tracking-tighter"
          style={{
            fontSize: "clamp(5rem, 22vw, 16rem)",
            color: p.accent,
            opacity: 0.12,
          }}
        >
          {word}
        </span>
      )}

      {/* Glyph de categoría */}
      <span
        className="pointer-events-none absolute left-6 top-6 select-none font-serif text-5xl"
        style={{ color: p.accent, opacity: 0.55 }}
      >
        {p.glyph}
      </span>

      {/* Líneas decorativas tipo registro de impresión */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-6 top-20 h-px w-16"
          style={{ background: p.accent, opacity: 0.5 }}
        />
        <div
          className="absolute left-6 top-[5.4rem] h-px w-8"
          style={{ background: p.accent, opacity: 0.3 }}
        />
      </div>
    </div>
  );
}

/** Acceso a la paleta para componentes que necesiten el acento por categoría. */
export function coverAccent(category: ArticleCategory): string {
  return PALETTES[category].accent;
}
