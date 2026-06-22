"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mountain,
  ChevronDown,
  Plus,
  Minus,
  Heart,
  Leaf,
  FlaskConical,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPEN, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Product, ProductFormat } from "@/types";

const FORMATS: { value: ProductFormat; label: string }[] = [
  { value: "grano", label: "En grano" },
  { value: "molido", label: "Molido" },
];

function SensorBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-xs font-medium text-espresso-600">{label}</span>
      <div className="flex-1 rounded-full bg-sand h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 5) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full bg-gold"
        />
      </div>
      <span className="w-6 text-right text-xs font-mono text-espresso-400">{value}/5</span>
    </div>
  );
}

export function ProductDetailClient({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const isFavorite = useWishlistStore((s) => s.isFavorite);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  const [format, setFormat] = useState<ProductFormat>("grano");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(isFavorite(product.id));
  const [nerdyOpen, setNerdyOpen] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product, format);
    trackEvent("add_to_cart", {
      productId: product.id,
      productName: product.name,
      format,
      quantity,
      price: product.price,
    });
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product.id, "product_detail");
      setIsWishlisted(true);
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-sand bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center gap-2 text-sm text-espresso-500">
          <Link href="/" className="hover:text-gold transition">Inicio</Link>
          <span>/</span>
          <Link href="/#catalogo" className="hover:text-gold transition">Catálogo</Link>
          <span>/</span>
          <span className="text-espresso-800 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {/* Altitud — siempre visible */}
            <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-espresso-800/90 px-3 py-1.5 backdrop-blur-sm">
              <Mountain className="h-3.5 w-3.5 text-gold" />
              <span className="font-mono text-xs font-semibold text-cream tracking-wide">
                {product.altitude.toLocaleString()} msnm
              </span>
            </div>

            {product.badge && (
              <div className="absolute right-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-xs font-bold text-espresso-900">
                {product.badge}
              </div>
            )}

            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-sand to-cream flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="object-contain p-16 w-full h-full"
                priority
              />
            </div>

            <div className="mt-4 flex items-center gap-2 px-2">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="text-sm font-semibold text-espresso-700">
                SCA {product.scaScore}
              </span>
              <span className="text-sm text-espresso-400">· Café de especialidad certificado</span>
            </div>
          </motion.div>

          {/* Información */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Origen + Finca */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-gold-dark">
                {product.origin}
              </span>
              {product.fincaSlug && (
                <>
                  <span className="text-espresso-300">·</span>
                  <Link
                    href={`/fincas/${product.fincaSlug}`}
                    className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-organic hover:text-organic-light transition"
                  >
                    <MapPin className="h-3 w-3" />
                    {product.fincaName}
                  </Link>
                </>
              )}
            </div>

            {/* Nombre */}
            <div>
              <h1 className="font-serif text-4xl font-semibold text-espresso-900 leading-tight">
                {product.name}
              </h1>
              <p className="mt-2 text-lg text-espresso-500">{product.tagline}</p>
            </div>

            {/* Altitud destacada — core de marca */}
            <div className="flex items-center gap-3 rounded-2xl border border-sand bg-white px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-800">
                <Mountain className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-espresso-900 leading-none">
                  {product.altitude.toLocaleString()} msnm
                </p>
                <p className="mt-0.5 text-xs text-espresso-400">
                  Altitud de cultivo · Selva Central del Perú
                </p>
              </div>
            </div>

            {/* Notas de cata */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-espresso-400">
                Notas de cata
              </p>
              <div className="flex flex-wrap gap-2">
                {product.notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full bg-sand px-3 py-1 text-sm font-medium text-espresso-700"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Perfil sensorial */}
            {product.tastingProfile && (
              <div className="space-y-2.5 rounded-2xl bg-white border border-sand p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-espresso-400">
                  Perfil sensorial
                </p>
                <SensorBar label="Acidez" value={product.tastingProfile.acidity} />
                <SensorBar label="Cuerpo" value={product.tastingProfile.body} />
                <SensorBar label="Dulzor" value={product.tastingProfile.sweetness} />
                <SensorBar label="Complejidad" value={product.tastingProfile.complexity} />
              </div>
            )}

            {/* Descripción */}
            <p className="text-espresso-600 leading-relaxed">{product.description}</p>

            {/* Nerdy info desplegable */}
            <div className="rounded-2xl border border-sand overflow-hidden">
              <button
                onClick={() => setNerdyOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-sand/40 transition"
                aria-expanded={nerdyOpen}
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-gold" />
                  <span className="text-sm font-semibold text-espresso-800">
                    Información técnica del café
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-espresso-400 transition-transform duration-300",
                    nerdyOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {nerdyOpen && (
                  <motion.div
                    key="nerdy"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-sand px-5 py-5 space-y-4 bg-white">
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Altitud</dt>
                          <dd className="mt-0.5 font-semibold text-espresso-800">{product.altitude.toLocaleString()} msnm</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Proceso</dt>
                          <dd className="mt-0.5 font-semibold text-espresso-800">{product.process}</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Variedad</dt>
                          <dd className="mt-0.5 font-semibold text-espresso-800">{product.variety}</dd>
                        </div>
                        {product.botanicalVariety && (
                          <div>
                            <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Variedad botánica</dt>
                            <dd className="mt-0.5 font-semibold text-espresso-800 text-xs leading-snug">{product.botanicalVariety}</dd>
                          </div>
                        )}
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Origen</dt>
                          <dd className="mt-0.5 font-semibold text-espresso-800">{product.origin}</dd>
                        </div>
                        {product.fincaName && (
                          <div>
                            <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Finca</dt>
                            <dd className="mt-0.5">
                              {product.fincaSlug ? (
                                <Link href={`/fincas/${product.fincaSlug}`} className="font-semibold text-organic hover:underline">
                                  {product.fincaName}
                                </Link>
                              ) : (
                                <span className="font-semibold text-espresso-800">{product.fincaName}</span>
                              )}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Puntaje SCA</dt>
                          <dd className="mt-0.5 font-semibold text-espresso-800">{product.scaScore} / 100</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Peso</dt>
                          <dd className="mt-0.5 font-semibold text-espresso-800">{product.weightGrams} g</dd>
                        </div>
                      </dl>

                      {product.cupProfile && (
                        <div className="pt-2 border-t border-sand">
                          <p className="font-mono text-xs uppercase tracking-wide text-espresso-400 mb-2">Perfil de taza</p>
                          <p className="text-sm text-espresso-600 leading-relaxed">{product.cupProfile}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Leaf className="h-4 w-4 text-organic" />
                        <span className="text-xs text-organic font-medium">
                          100% Arábica Orgánico · Selva Central del Perú
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Compra */}
            <div className="rounded-2xl border border-sand bg-white p-5 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold text-espresso-900">
                  {formatPEN(product.price * quantity)}
                </span>
                <span className="text-sm text-espresso-400">
                  ({formatPEN(product.price)} / {product.weightGrams}g)
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-espresso-400">Formato</p>
                <div className="inline-flex rounded-full border border-sand p-0.5">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      aria-pressed={format === f.value}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition",
                        format === f.value
                          ? "bg-espresso-700 text-cream"
                          : "text-espresso-500 hover:text-espresso-700"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-espresso-400">Cantidad</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-espresso-700 hover:bg-sand transition"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-mono text-lg font-semibold text-espresso-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-espresso-700 hover:bg-sand transition"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-gold py-3 text-sm font-bold text-espresso-900 shadow-sm transition hover:bg-gold-dark hover:text-cream active:scale-95"
                >
                  Añadir al carrito
                </button>
                <button
                  onClick={handleToggleWishlist}
                  aria-label={isWishlisted ? "Quitar de favoritos" : "Guardar en favoritos"}
                  className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition",
                    isWishlisted
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-sand bg-white text-espresso-500 hover:border-gold hover:text-gold"
                  )}
                >
                  <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <Link
                href="/club"
                className="flex items-center justify-between rounded-xl bg-espresso-800 px-4 py-3 text-cream hover:bg-espresso-900 transition group"
              >
                <div>
                  <p className="text-xs font-mono uppercase tracking-wide text-gold">Club Flor de Altura</p>
                  <p className="text-sm font-medium">Suscríbete y ahorra hasta 20%</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-dark">Misma finca</p>
                <h2 className="font-serif text-2xl text-espresso-900">
                  Otros cafés de {product.fincaName}
                </h2>
              </div>
              {product.fincaSlug && (
                <Link
                  href={`/fincas/${product.fincaSlug}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-organic hover:text-organic-light transition"
                >
                  Ver finca
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/productos/${p.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-sand bg-white hover:border-gold transition"
                  >
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-sand to-cream">
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-espresso-800/85 px-2 py-1">
                        <Mountain className="h-3 w-3 text-gold" />
                        <span className="font-mono text-[10px] font-semibold text-cream">
                          {p.altitude.toLocaleString()} msnm
                        </span>
                      </div>
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-6 transition group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-xs text-gold-dark">{p.variety}</p>
                      <h3 className="mt-1 font-serif text-lg text-espresso-800">{p.name}</h3>
                      <p className="mt-1 text-sm text-espresso-500">{p.tagline}</p>
                      <p className="mt-3 font-semibold text-espresso-900">{formatPEN(p.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Finca CTA */}
        {product.fincaSlug && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 overflow-hidden rounded-3xl bg-espresso-800 px-8 py-10 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1.5">
                <Mountain className="h-3.5 w-3.5 text-gold" />
                <span className="font-mono text-xs text-gold font-semibold tracking-wide">
                  {product.altitude.toLocaleString()} msnm
                </span>
              </div>
            </div>
            <h2 className="font-serif text-3xl text-cream">Conoce {product.fincaName}</h2>
            <p className="mt-3 text-espresso-200 max-w-xl mx-auto">
              Cada taza tiene historia. Descubre la finca, el productor y el territorio donde nace este café excepcional.
            </p>
            <Link
              href={`/fincas/${product.fincaSlug}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-espresso-900 hover:bg-gold-dark transition"
            >
              Visitar la finca
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
