"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { PRODUCTS } from "@/data/products";
import { formatPEN } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/types";

export default function WishlistPage() {
  const getWishlistProductIds = useWishlistStore((s) => s.getWishlistProductIds);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [mounted, setMounted] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    trackEvent("page_view", { page: "/wishlist" });
  }, []);

  if (!mounted) return null;

  const wishlistIds = getWishlistProductIds();
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  const filteredProducts = selectedOrigin
    ? wishlistedProducts.filter((p) => p.origin === selectedOrigin)
    : wishlistedProducts;

  const origins = Array.from(new Set(wishlistedProducts.map((p) => p.origin)));
  const isEmpty = wishlistedProducts.length === 0;

  const handleAddToCart = (product: Product) => {
    addItem(product, "grano", 1);
    trackEvent("add_to_cart", {
      productId: product.id,
      source: "wishlist",
      productName: product.name,
    });
    openCart();
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    trackEvent("remove_from_wishlist", { productId, source: "wishlist_page" });
  };

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="border-b border-sand bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-espresso-600 hover:text-espresso-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-semibold text-espresso-900">
                Mis Favoritos
              </h1>
              <p className="mt-1 text-sm text-espresso-500">
                {isEmpty ? "Sin favoritos aún" : `${wishlistedProducts.length} producto${wishlistedProducts.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Heart className="h-8 w-8 fill-gold text-gold" />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-sand bg-white p-12 text-center"
          >
            <Heart className="mx-auto h-16 w-16 text-sand" />
            <h2 className="mt-4 font-serif text-2xl text-espresso-800">
              Sin favoritos
            </h2>
            <p className="mt-2 text-espresso-500">
              Agrega tus cafés favoritos para verlos aquí.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-gold px-6 py-2.5 font-semibold text-espresso-900 transition hover:bg-gold-dark"
            >
              Explorar Catálogo
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Filtros */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={() => setSelectedOrigin(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedOrigin === null
                    ? "bg-espresso-700 text-cream"
                    : "border border-sand bg-white text-espresso-600 hover:border-espresso-700"
                }`}
              >
                Todos
              </button>
              {origins.map((origin) => (
                <button
                  key={origin}
                  onClick={() => setSelectedOrigin(origin)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedOrigin === origin
                      ? "bg-espresso-700 text-cream"
                      : "border border-sand bg-white text-espresso-600 hover:border-espresso-700"
                  }`}
                >
                  {origin}
                </button>
              ))}
            </motion.div>

            {/* Grid */}
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProducts.map((product, idx) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group rounded-2xl border border-sand bg-white p-5 shadow-card hover:shadow-lg transition"
                >
                  {/* Imagen */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-sand to-cream mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute right-2 top-2 flex items-center justify-center rounded-full bg-white p-2 shadow-sm hover:bg-red-50 transition"
                      aria-label="Quitar de favoritos"
                    >
                      <Heart
                        className="h-5 w-5 fill-gold text-gold"
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <span className="text-xs uppercase tracking-wide text-gold-dark font-mono">
                    {product.variety}
                  </span>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-espresso-800">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-espresso-500 line-clamp-2">
                    {product.tagline}
                  </p>

                  {/* Notas */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {product.notes.slice(0, 2).map((note) => (
                      <span
                        key={note}
                        className="rounded-full bg-cream px-2 py-0.5 text-xs text-espresso-600"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Precio + CTA */}
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-sand">
                    <span className="font-serif text-lg font-semibold text-espresso-800 tabular-nums">
                      {formatPEN(product.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 rounded-full bg-gold px-3 py-2 text-sm font-semibold text-espresso-900 shadow-sm hover:bg-gold-dark transition active:scale-95"
                      aria-label={`Añadir ${product.name} al carrito`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Agregar
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
