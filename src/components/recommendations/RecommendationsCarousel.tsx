"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useRecommendationsStore } from "@/store/recommendations-store";
import { PRODUCTS } from "@/data/products";
import { formatPEN } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/types";

interface RecommendationsCarouselProps {
  strategy?: "browsing" | "trending" | "similar_taste";
  limit?: number;
  title?: string;
}

export function RecommendationsCarousel({
  strategy = "trending",
  limit = 4,
  title = "Productos Recomendados",
}: RecommendationsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const getRecommendedProducts = useRecommendationsStore(
    (s) => s.getRecommendedProducts
  );
  const fetchRecommendations = useRecommendationsStore(
    (s) => s.fetchRecommendations
  );
  const isFavorite = useWishlistStore((s) => s.isFavorite);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Fetch recommendations on mount
  useEffect(() => {
    const init = async () => {
      try {
        const browsedIds = PRODUCTS.slice(0, 3).map((p) => p.id);
        await fetchRecommendations(strategy, browsedIds);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [strategy, fetchRecommendations]);

  // Check scroll position
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const amount = 320; // Card width + gap
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
    trackEvent("carousel_scroll", { direction, strategy });
  };

  const recommendations = getRecommendedProducts(limit);

  if (isLoading || recommendations.length === 0) {
    return null;
  }

  const handleAddToCart = (product: Product) => {
    addItem(product, "grano", 1);
    trackEvent("add_to_cart", {
      productId: product.id,
      source: "recommendations_carousel",
    });
    openCart();
  };

  const handleToggleWishlist = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromWishlist(productId);
      trackEvent("remove_from_wishlist", { productId, source: "carousel" });
    } else {
      addToWishlist(productId, "recommendation");
      trackEvent("add_to_wishlist", { productId, source: "carousel" });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-semibold text-espresso-900 md:text-3xl"
        >
          {title}
        </motion.h2>

        {/* Carousel */}
        <div className="relative mt-8">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {recommendations.map((product, idx) => {
              const isFav = isFavorite(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-72"
                >
                  <div className="group relative rounded-2xl bg-white overflow-hidden shadow-card hover:shadow-lg transition h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sand to-cream">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-white p-2 shadow-sm hover:bg-gold/10 transition"
                        aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                      >
                        <svg
                          className="h-5 w-5 transition"
                          viewBox="0 0 24 24"
                          fill={isFav ? "currentColor" : "none"}
                          stroke="currentColor"
                          color={isFav ? "#d4a574" : "#6b4f47"}
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <span className="text-xs uppercase tracking-wide text-gold-dark font-mono">
                        {product.variety}
                      </span>
                      <h3 className="mt-2 font-serif text-sm font-semibold text-espresso-800 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-espresso-500 line-clamp-2">
                        {product.tagline}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.notes.slice(0, 2).map((note) => (
                          <span
                            key={note}
                            className="rounded-full bg-cream px-2 py-0.5 text-xs text-espresso-600"
                          >
                            {note}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-sand">
                        <span className="font-serif text-sm font-semibold text-espresso-800 tabular-nums">
                          {formatPEN(product.price)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-espresso-900 shadow-sm hover:bg-gold-dark transition active:scale-95"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-espresso-50 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-espresso-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-espresso-50 transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-espresso-600" />
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
