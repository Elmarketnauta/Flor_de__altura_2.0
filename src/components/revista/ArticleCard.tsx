"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";
import { useTilt } from "@/lib/use-tilt";
import { trackEvent } from "@/lib/analytics";

interface ArticleCardProps {
  article: Article;
  onOpen: (article: Article) => void;
}

export function ArticleCard({ article, onOpen }: ArticleCardProps) {
  const { ref, glareRef } = useTilt({
    scale: 1.02,
    rotationX: 10,
    rotationY: 10,
    glareMaxOpacity: 0.15,
  });

  const handleOpen = () => {
    trackEvent("open_article", {
      articleId: article.id,
      category: article.category,
    });
    onOpen(article);
  };

  return (
    <motion.article
      ref={ref}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card"
      style={{ transformStyle: "preserve-3d" } as any}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <button
        onClick={handleOpen}
        aria-label={`Leer artículo: ${article.title}`}
        data-layer="open_article"
        data-article-id={article.id}
        data-article-category={article.category}
        className="flex h-full flex-col text-left"
        style={{ transformStyle: "preserve-3d" } as any}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-sand to-cream">
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-8 transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-espresso-800/90 px-3 py-1 font-mono text-xs uppercase tracking-wide text-cream">
            {ARTICLE_CATEGORY_LABELS[article.category]}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="text-xs text-espresso-400">
            {article.date} · Lectura {article.readTime}
          </span>
          <h3 className="mt-2 font-serif text-lg leading-snug text-espresso-800 transition group-hover:text-gold-dark">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-espresso-500">
            {article.excerpt}
          </p>
        </div>
      </button>

      {/* Leer artículo → ruta propia */}
      <div className="px-5 pb-5">
        <Link
          href={`/revista/${article.id}`}
          onClick={() => trackEvent("open_article", { articleId: article.id })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-dark hover:text-espresso-900 transition"
        >
          Leer artículo
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Glare overlay para tilt 3D */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ transformStyle: "preserve-3d" } as any}
      />
    </motion.article>
  );
}
