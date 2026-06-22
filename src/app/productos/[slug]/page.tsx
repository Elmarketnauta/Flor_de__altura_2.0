import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { ProductDetailClient } from "./ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — Café de Especialidad ${product.origin}`,
    description: `${product.tagline}. ${product.description.slice(0, 120)} Puntaje SCA ${product.scaScore}. Compra café de especialidad peruano orgánico online.`,
    openGraph: {
      title: `${product.name} | Flor de Altura — Café de Especialidad Peruano`,
      description: `${product.tagline}. Cultivado a ${product.altitude} msnm en ${product.origin}. SCA ${product.scaScore}.`,
    },
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.fincaSlug === product.fincaSlug
  ).slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}
