"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";

interface ArticleCardProps {
  article: Article;
  onOpen: (article: Article) => void;
}

export function ArticleCard({ article, onOpen }: ArticleCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      <button
        onClick={() => onOpen(article)}
        aria-label={`Leer artículo: ${article.title}`}
        data-layer="open_article"
        data-article-id={article.id}
        data-article-category={article.category}
        className="flex h-full flex-col text-left"
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
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-dark">
            Leer artículo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </button>
    </article>
  );
}
