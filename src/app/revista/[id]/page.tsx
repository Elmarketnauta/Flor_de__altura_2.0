import { notFound } from "next/navigation";
import type { Metadata } from "next";
import articlesData from "@/data/articles.json";
import type { Article } from "@/types";
import { ArticlePage } from "./ArticlePage";

const articles = articlesData as Article[];

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return {};
  return {
    title: `${article.title} | Flor de Altura Revista`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default function Page({ params }: Props) {
  const article = articles.find((a) => a.id === params.id);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
