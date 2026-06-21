"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Article, ArticleFilter } from "@/types";
import { ARTICLE_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import articlesData from "@/data/articles.json";
import { ArticleCard } from "./ArticleCard";
import { ArticleModal } from "./ArticleModal";
import { trackEvent } from "@/lib/analytics";

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
    trackEvent("magazine_filter", { filter_value: value });
  };

  return (
    <section id="revista" className="scroll-mt-20 bg-cream py-20">
      <div className="container-app">
        {/* Encabezado + filtros */}
        <motion.div
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="font-mono text-sm uppercase tracking-wide text-gold-dark"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Publicaciones
            </motion.span>
            <motion.h2
              className="mt-2 font-serif text-3xl text-espresso-800 sm:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Flor de Altura Revista
            </motion.h2>
            <motion.p
              className="mt-3 text-espresso-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Explora artículos escritos por nuestros baristas y productores.
              Aprende sobre el cultivo orgánico, técnicas de extracción y cultura
              del café.
            </motion.p>
          </motion.div>

          <motion.ul
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Filtrar artículos por categoría"
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.2 },
              },
            }}
            viewport={{ once: true }}
          >
            {ARTICLE_FILTERS.map((f) => (
              <motion.li
                key={f.value}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <motion.button
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {f.label}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Grilla de artículos */}
        {visible.length === 0 ? (
          <motion.p
            className="mt-12 text-center text-espresso-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            No se encontraron artículos en esta categoría.
          </motion.p>
        ) : (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.2 },
              },
            }}
            key={filter}
          >
            {visible.map((article) => (
              <motion.div
                key={article.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <ArticleCard
                  article={article}
                  onOpen={setSelected}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lector inmersivo */}
      <ArticleModal article={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
