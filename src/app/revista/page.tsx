"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import articlesData from "@/data/articles.json";
import { trackEvent } from "@/lib/analytics";
import type { Article, ArticleFilter } from "@/types";

const articles = articlesData as Article[];

const CATEGORY_LABELS: Record<string, string> = {
  origen: "Origen",
  metodos: "Métodos",
  sostenibilidad: "Sostenibilidad",
};

export default function RevistaPage() {
  const [selectedFilter, setSelectedFilter] = useState<ArticleFilter>("all");

  useEffect(() => {
    trackEvent("page_view", { page: "/revista" });
  }, []);

  const filteredArticles = useMemo(() => {
    if (selectedFilter === "all") return articles;
    return articles.filter((a) => a.category === selectedFilter);
  }, [selectedFilter]);

  const handleFilterClick = (filter: ArticleFilter) => {
    setSelectedFilter(filter);
    trackEvent("magazine_filter", { filter_value: filter });
  };

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="border-b border-sand bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Link
              href="/#revista"
              className="flex items-center gap-2 text-sm font-medium text-espresso-600 hover:text-espresso-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </motion.div>
          <h1 className="font-serif text-4xl font-semibold text-espresso-900">
            Flor de Altura Revista
          </h1>
          <p className="mt-2 text-espresso-500">
            Historias, técnicas y sostenibilidad del café de especialidad
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-wrap gap-3"
        >
          <button
            onClick={() => handleFilterClick("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedFilter === "all"
                ? "bg-espresso-700 text-cream"
                : "border border-sand bg-white text-espresso-600 hover:border-espresso-700"
            }`}
          >
            Todas
          </button>
          {(["origen", "metodos", "sostenibilidad"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedFilter === cat
                  ? "bg-espresso-700 text-cream"
                  : "border border-sand bg-white text-espresso-600 hover:border-espresso-700"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <motion.div layout className="grid gap-8">
          {/* Featured Article (first) */}
          {filteredArticles.length > 0 && (
            <motion.article
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 overflow-hidden rounded-2xl bg-white shadow-card lg:grid-cols-2"
            >
              <div className="relative aspect-video lg:aspect-auto">
                <Image
                  src={filteredArticles[0].image}
                  alt={filteredArticles[0].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-dark">
                    {CATEGORY_LABELS[filteredArticles[0].category]}
                  </span>
                  <h2 className="mt-4 font-serif text-2xl font-semibold text-espresso-900 sm:text-3xl">
                    {filteredArticles[0].title}
                  </h2>
                  <p className="mt-3 text-espresso-500">
                    {filteredArticles[0].excerpt}
                  </p>
                  <div className="mt-4 flex gap-4 text-xs text-espresso-500">
                    <span>{filteredArticles[0].date}</span>
                    <span>•</span>
                    <span>{filteredArticles[0].readTime}</span>
                  </div>
                </div>
                <Link
                  href={`/revista/${filteredArticles[0].id}`}
                  className="mt-6 flex items-center gap-2 w-fit rounded-full bg-gold px-6 py-3 font-semibold text-espresso-900 transition hover:bg-gold-dark"
                >
                  Leer artículo
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          )}

          {/* Other Articles Grid */}
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.slice(1).map((article, idx) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 1) * 0.05 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-lg transition"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-gold/20 px-2.5 py-1 text-xs font-semibold text-gold-dark">
                    {CATEGORY_LABELS[article.category]}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-espresso-900 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-espresso-500 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex gap-3 text-xs text-espresso-500 border-t border-sand pt-4">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <Link
                    href={`/revista/${article.id}`}
                    className="mt-4 flex items-center gap-2 w-fit text-sm font-semibold text-gold hover:text-gold-dark transition"
                  >
                    Leer más
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-sand bg-white p-12 text-center"
            >
              <p className="text-lg text-espresso-500">
                No hay artículos en esta categoría.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
