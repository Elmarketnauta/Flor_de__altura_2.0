"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import articlesData from "@/data/articles.json";
import { trackEvent } from "@/lib/analytics";
import type { Article, ArticleCategory, ArticleFilter } from "@/types";
import { EditorialCover, coverAccent } from "@/components/revista/EditorialCover";

const articles = articlesData as Article[];

const CATEGORY_LABELS: Record<string, string> = {
  origen: "Origen",
  metodos: "Métodos",
  sostenibilidad: "Sostenibilidad",
};

/** Palabra-glifo de fondo para la portada de cada artículo (look editorial). */
const COVER_WORDS: Record<string, string> = {
  "geysha-origen": "Geisha",
  "temperatura-agua": "90°",
  "cultivo-bajo-sombra": "Sombra",
};

const coverWord = (a: Article) =>
  COVER_WORDS[a.id] ?? a.title.split(" ")[0];

/** Fecha de edición legible para el masthead. */
const ISSUE_DATE = new Date().toLocaleDateString("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

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

  const [cover, ...rest] = filteredArticles;
  const secondary = rest.slice(0, 2);
  const remainder = rest.slice(2);

  return (
    <main className="min-h-screen bg-cream">
      {/* ══════════ MASTHEAD ══════════ */}
      <header className="border-b-2 border-espresso-900 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top bar: edición + fecha */}
          <div className="flex items-center justify-between border-b border-sand py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-espresso-500">
            <span>Flor de Altura · Selva Central, Perú</span>
            <span className="hidden sm:inline">Edición Digital · {ISSUE_DATE}</span>
            <Link href="/" className="hover:text-espresso-900 transition">
              flordealtura.com
            </Link>
          </div>

          {/* Cabecera tipográfica */}
          <div className="py-8 text-center sm:py-12">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[11px] uppercase tracking-[0.45em] text-gold-dark"
            >
              La Revista del Café de Especialidad
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-3 font-serif text-5xl font-black uppercase leading-[0.9] tracking-tight text-espresso-900 sm:text-7xl lg:text-8xl"
            >
              Altura
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-espresso-500"
            >
              Un documento vivo sobre el origen, la técnica y la cultura del café
              de especialidad peruano — desde el grano hasta la taza.
            </motion.p>
          </div>
        </div>
      </header>

      {/* ══════════ FILTROS / SECCIONES ══════════ */}
      <nav className="sticky top-0 z-20 border-b border-sand bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-3 sm:gap-2 sm:px-6 lg:px-8">
          <FilterChip
            active={selectedFilter === "all"}
            onClick={() => handleFilterClick("all")}
          >
            Todas
          </FilterChip>
          {(["origen", "metodos", "sostenibilidad"] as const).map((cat) => (
            <FilterChip
              key={cat}
              active={selectedFilter === cat}
              onClick={() => handleFilterClick(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </FilterChip>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-sand bg-white p-16 text-center">
            <p className="font-serif text-2xl text-espresso-400">
              No hay historias en esta sección todavía.
            </p>
          </div>
        ) : (
          <>
            {/* ══════════ COVER STORY ══════════ */}
            {cover && <CoverStory article={cover} />}

            {/* ══════════ SECUNDARIAS (2 col) ══════════ */}
            {secondary.length > 0 && (
              <section className="mt-16 grid gap-10 border-t-2 border-espresso-900 pt-10 sm:grid-cols-2 sm:gap-12">
                {secondary.map((article, i) => (
                  <SecondaryStory key={article.id} article={article} index={i} />
                ))}
              </section>
            )}

            {/* ══════════ MÁS HISTORIAS (lista editorial) ══════════ */}
            {remainder.length > 0 && (
              <section className="mt-16">
                <h2 className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-espresso-500">
                  Más en esta edición
                </h2>
                <div className="divide-y divide-sand border-y border-sand">
                  {remainder.map((article, i) => (
                    <ListStory key={article.id} article={article} index={i} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* ══════════ CIERRE / SUSCRIPCIÓN ══════════ */}
      <section className="border-t-2 border-espresso-900 bg-espresso-900 text-cream">
        <div className="noise-grain relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
            El conocimiento se expande
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight sm:text-4xl">
            Cada taza es una historia. Aprende a leerla.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-espresso-200/80">
            Únete al Club Flor de Altura y recibe café de especialidad con la
            guía editorial para entenderlo, prepararlo y disfrutarlo.
          </p>
          <Link
            href="/club"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-semibold text-espresso-900 transition hover:bg-gold-light"
          >
            Conoce el Club
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition ${
        active
          ? "bg-espresso-900 text-cream"
          : "text-espresso-500 hover:bg-sand/60 hover:text-espresso-900"
      }`}
    >
      {children}
    </button>
  );
}

/** Portada principal — ocupa todo el ancho, look de tapa de revista. */
function CoverStory({ article }: { article: Article }) {
  const accent = coverAccent(article.category as ArticleCategory);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative grid overflow-hidden rounded-3xl lg:grid-cols-12"
    >
      {/* Imagen / cover */}
      <Link
        href={`/revista/${article.id}`}
        onClick={() => trackEvent("open_article", { articleId: article.id })}
        className="relative block lg:col-span-7"
      >
        <EditorialCover
          category={article.category as ArticleCategory}
          word={coverWord(article)}
          variant="wide"
          className="h-full min-h-[320px] transition duration-700 group-hover:scale-[1.02]"
        />
        {/* Overlay textual sobre la portada */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
          <span
            className="mb-3 w-fit rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-espresso-900"
            style={{ background: accent }}
          >
            {CATEGORY_LABELS[article.category]} · Historia de portada
          </span>
          <h2 className="max-w-2xl font-serif text-3xl font-bold leading-[1.05] text-cream drop-shadow-lg sm:text-4xl lg:text-5xl">
            {article.title}
          </h2>
        </div>
      </Link>

      {/* Cuerpo editorial */}
      <div className="flex flex-col justify-center gap-5 bg-espresso-900 p-8 text-cream lg:col-span-5 lg:p-12">
        {article.subtitle && (
          <p className="font-serif text-xl italic leading-relaxed text-cream/90">
            {article.subtitle}
          </p>
        )}
        <p className="leading-relaxed text-espresso-200/80">{article.excerpt}</p>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-espresso-400">
          {article.author && <span>{article.author.name}</span>}
          <span aria-hidden>·</span>
          <span>{article.date}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
        </div>
        <Link
          href={`/revista/${article.id}`}
          onClick={() => trackEvent("open_article", { articleId: article.id })}
          className="mt-2 inline-flex w-fit items-center gap-2 border-b-2 border-gold pb-1 font-semibold text-gold transition hover:gap-3"
        >
          Leer la historia
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

/** Historia secundaria — formato vertical, dos por fila. */
function SecondaryStory({ article, index }: { article: Article; index: number }) {
  const accent = coverAccent(article.category as ArticleCategory);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group"
    >
      <Link
        href={`/revista/${article.id}`}
        onClick={() => trackEvent("open_article", { articleId: article.id })}
        className="block overflow-hidden rounded-2xl"
      >
        <EditorialCover
          category={article.category as ArticleCategory}
          word={coverWord(article)}
          variant="wide"
          className="transition duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-5">
        <span
          className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]"
          style={{ color: accent === "#4a9edd" ? "#2c6a99" : accent }}
        >
          {CATEGORY_LABELS[article.category]}
        </span>
        <Link
          href={`/revista/${article.id}`}
          onClick={() => trackEvent("open_article", { articleId: article.id })}
        >
          <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-espresso-900 transition group-hover:text-gold-dark sm:text-3xl">
            {article.title}
          </h3>
        </Link>
        <p className="mt-3 leading-relaxed text-espresso-500">{article.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-espresso-400">
          <span>{article.date}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </motion.article>
  );
}

/** Entrada de lista — formato horizontal denso, tipo índice de revista. */
function ListStory({ article, index }: { article: Article; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/revista/${article.id}`}
        onClick={() => trackEvent("open_article", { articleId: article.id })}
        className="group flex items-center gap-6 py-6"
      >
        {/* Número de índice */}
        <span className="hidden font-serif text-4xl font-black text-sand transition group-hover:text-gold sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Mini cover */}
        <div className="w-28 flex-shrink-0 sm:w-40">
          <EditorialCover
            category={article.category as ArticleCategory}
            word={coverWord(article)}
            variant="square"
            className="rounded-lg"
          />
        </div>

        {/* Texto */}
        <div className="min-w-0 flex-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold-dark">
            {CATEGORY_LABELS[article.category]}
          </span>
          <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-espresso-900 transition group-hover:text-gold-dark sm:text-2xl">
            {article.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-espresso-500">
            {article.excerpt}
          </p>
          <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-espresso-400">
            <span>{article.date}</span>
            <span aria-hidden>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        <ArrowUpRight className="hidden h-5 w-5 flex-shrink-0 text-espresso-300 transition group-hover:text-gold-dark sm:block" />
      </Link>
    </motion.article>
  );
}
