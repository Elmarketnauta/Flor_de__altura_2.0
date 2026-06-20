"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product, ProductFormat } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { cn, formatPEN } from "@/lib/utils";

const FORMATS: { value: ProductFormat; label: string }[] = [
  { value: "grano", label: "En grano" },
  { value: "molido", label: "Molido" },
];

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [format, setFormat] = useState<ProductFormat>("grano");

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sand to-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-6 transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-espresso-900">
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-espresso-800/90 px-2.5 py-1 text-xs font-semibold text-cream">
          SCA {product.scaScore}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-xs uppercase tracking-wide text-gold-dark">
          {product.variety}
        </span>
        <h3 className="mt-1 font-serif text-lg leading-snug text-espresso-800">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-espresso-500">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.notes.map((note) => (
            <span
              key={note}
              className="rounded-full bg-cream px-2 py-0.5 text-xs text-espresso-600"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Selector de formato */}
        <div className="mt-4 inline-flex w-fit rounded-full border border-sand p-0.5">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              aria-pressed={format === f.value}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition",
                format === f.value
                  ? "bg-espresso-700 text-cream"
                  : "text-espresso-500 hover:text-espresso-700",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between pt-2">
          <div>
            <span className="font-serif text-2xl font-semibold text-espresso-800 tabular-nums">
              {formatPEN(product.price)}
            </span>
            <span className="ml-1 text-xs text-espresso-400">
              / {product.weightGrams} g
            </span>
          </div>

          <button
            onClick={() => addItem(product, format)}
            aria-label={`Añadir ${product.name} al carrito`}
            data-layer="add_to_cart"
            data-product-id={product.id}
            data-product-name={product.name}
            data-product-price={product.price}
            data-product-format={format}
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-espresso-900 shadow-sm transition hover:bg-gold-dark hover:text-cream active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}
