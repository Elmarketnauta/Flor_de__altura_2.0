"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { Article } from "@/types";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

/**
 * Lector inmersivo de artículos (diálogo modal enriquecido).
 * Bloquea el scroll del fondo (body lock), cierra con Escape / click en overlay
 * y es accesible (role="dialog", aria-modal).
 */
export function ArticleModal({ article, onClose }: ArticleModalProps) {
  const isOpen = article !== null;

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("scroll-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {article && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Contenido */}
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-modal-title"
            className="relative z-10 my-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-cream shadow-drawer"
            variants={{
              hidden: { opacity: 0, scale: 0.96, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar artículo"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-espresso-700 shadow-sm transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Banner */}
            <div className="relative h-52 w-full bg-gradient-to-br from-espresso-700 to-organic sm:h-64">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain p-8"
              />
            </div>

            {/* Cuerpo */}
            <div className="max-h-[55vh] overflow-y-auto px-6 py-6 sm:px-8">
              <span className="inline-block rounded-full bg-gold/15 px-3 py-1 font-mono text-xs uppercase tracking-wide text-gold-dark">
                {ARTICLE_CATEGORY_LABELS[article.category]}
              </span>
              <h2
                id="article-modal-title"
                className="mt-3 font-serif text-2xl leading-tight text-espresso-800 sm:text-3xl"
              >
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-espresso-400">
                {article.date} · Tiempo de lectura: {article.readTime}
              </p>

              <div className="mt-5 space-y-4 leading-relaxed text-espresso-600">
                {article.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
