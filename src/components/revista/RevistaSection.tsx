"use client";

import { useMemo, useState } from "react";
import type { Article, ArticleFilter } from "@/types";
import { ARTICLE_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import articlesData from "@/data/articles.json";
import { ArticleCard } from "./ArticleCard";
import { ArticleModal } from "./ArticleModal";

const articles = articlesData as Article[];

export function RevistaSection() {
  const [filter, setFilter] = useState<ArticleFilter>("all");
  const [selected, setSelected] = useState<Article | null>(null);

  const visible = useMemo(
    () =>
      filter === "all"
        ? articles
        : articles.filter((a) => a.category === filter),
    [filter],
  );

  const handleFilter = (value: ArticleFilter) => {
    setFilter(value);
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "filter_magazine", filter_value: value });
    }
  };

  return (
    <section id="revista" className="scroll-mt-20 bg-cream py-20">
      <div className="container-app">
        {/* Encabezado + filtros */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="font-mono text-sm uppercase tracking-wide text-gold-dark">
              Publicaciones
            </span>
            <h2 className="mt-2 font-serif text-3xl text-espresso-800 sm:text-4xl">
              Flor de Altura Revista
            </h2>
            <p className="mt-3 text-espresso-500">
              Explora artículos escritos por nuestros baristas y productores.
              Aprende sobre el cultivo orgánico, técnicas de extracción y cultura
              del café.
            </p>
          </div>

          <ul
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filtrar artículos por categoría"
          >
            {ARTICLE_FILTERS.map((f) => (
              <li key={f.value}>
                <button
                  role="tab"
                  aria-selected={filter === f.value}
                  onClick={() => handleFilter(f.value)}
                  data-layer="magazine_filter"
                  data-filter={f.value}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                    filter === f.value
                      ? "border-espresso-700 bg-espresso-700 text-cream"
                      : "border-sand bg-white text-espresso-600 hover:border-gold hover:text-gold-dark",
                  )}
                >
                  {f.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Grilla de artículos */}
        {visible.length === 0 ? (
          <p className="mt-12 text-center text-espresso-400">
            No se encontraron artículos en esta categoría.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lector inmersivo */}
      <ArticleModal article={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
