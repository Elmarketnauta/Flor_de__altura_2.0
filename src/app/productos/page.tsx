"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { formatPEN } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { ProductCard } from "@/components/catalog/ProductCard";

type SortOption = "price-asc" | "price-desc" | "score" | "name";
type FilterValue = string | null;

export default function ProductsPage() {
  const openCart = useCartStore((s) => s.openCart);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<FilterValue>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<FilterValue>(null);
  const [sortBy, setSortBy] = useState<SortOption>("score");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(60);

  useEffect(() => {
    trackEvent("page_view", { page: "/productos" });
  }, []);

  // Extract unique filter options
  const varieties = Array.from(new Set(PRODUCTS.map((p) => p.variety)));
  const origins = Array.from(new Set(PRODUCTS.map((p) => p.origin)));
  const maxProductPrice = Math.max(...PRODUCTS.map((p) => p.price));

  // Apply filters and search
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVariety = !selectedVariety || p.variety === selectedVariety;
      const matchesOrigin = !selectedOrigin || p.origin === selectedOrigin;
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

      return matchesSearch && matchesVariety && matchesOrigin && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "score":
        result.sort((a, b) => b.scaScore - a.scaScore);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [searchQuery, selectedVariety, selectedOrigin, minPrice, maxPrice, sortBy]);

  const handleFilterChange = (filterType: string, value: FilterValue) => {
    trackEvent("filter_change", { filterType, value: value || "clear" });
    if (filterType === "variety") setSelectedVariety(value);
    if (filterType === "origin") setSelectedOrigin(value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVariety(null);
    setSelectedOrigin(null);
    setMinPrice(0);
    setMaxPrice(maxProductPrice);
    setSortBy("score");
    trackEvent("filter_clear", {});
  };

  const hasActiveFilters =
    searchQuery || selectedVariety || selectedOrigin || sortBy !== "score";

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="border-b border-sand bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Link
              href="/#catalogo"
              className="flex items-center gap-2 text-sm font-medium text-espresso-600 hover:text-espresso-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </motion.div>
          <h1 className="font-serif text-3xl font-semibold text-espresso-900">
            Catálogo Completo
          </h1>
          <p className="mt-2 text-espresso-500">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}{" "}
            encontrado{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-espresso-800 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-espresso-400" />
                <input
                  type="text"
                  placeholder="Nombre, variedad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-sand bg-white pl-9 pr-3 py-2 text-sm transition focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-espresso-800 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm transition focus:border-gold focus:outline-none"
              >
                <option value="score">Puntaje SCA (Mayor primero)</option>
                <option value="price-asc">Precio (Menor primero)</option>
                <option value="price-desc">Precio (Mayor primero)</option>
                <option value="name">Nombre (A-Z)</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-espresso-800 mb-2">
                Rango de Precio
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={maxProductPrice}
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-1/2 rounded border border-sand bg-white px-2 py-1 text-xs"
                    placeholder="Min"
                  />
                  <span className="text-xs text-espresso-500">a</span>
                  <input
                    type="number"
                    min="0"
                    max={maxProductPrice}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-1/2 rounded border border-sand bg-white px-2 py-1 text-xs"
                    placeholder="Max"
                  />
                </div>
                <span className="text-xs text-espresso-500">
                  {formatPEN(minPrice)} — {formatPEN(maxPrice)}
                </span>
              </div>
            </div>

            {/* Variety Filter */}
            <div>
              <label className="block text-sm font-semibold text-espresso-800 mb-2">
                Variedad
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange("variety", null)}
                  className={`block text-sm transition ${
                    !selectedVariety
                      ? "font-semibold text-espresso-900"
                      : "text-espresso-500 hover:text-espresso-700"
                  }`}
                >
                  Todas
                </button>
                {varieties.map((v) => (
                  <button
                    key={v}
                    onClick={() => handleFilterChange("variety", v)}
                    className={`block text-sm transition ${
                      selectedVariety === v
                        ? "font-semibold text-espresso-900"
                        : "text-espresso-500 hover:text-espresso-700"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin Filter */}
            <div>
              <label className="block text-sm font-semibold text-espresso-800 mb-2">
                Origen
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange("origin", null)}
                  className={`block text-sm transition ${
                    !selectedOrigin
                      ? "font-semibold text-espresso-900"
                      : "text-espresso-500 hover:text-espresso-700"
                  }`}
                >
                  Todos
                </button>
                {origins.map((o) => (
                  <button
                    key={o}
                    onClick={() => handleFilterChange("origin", o)}
                    className={`block text-sm transition ${
                      selectedOrigin === o
                        ? "font-semibold text-espresso-900"
                        : "text-espresso-500 hover:text-espresso-700"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-sand bg-white px-4 py-2 text-sm font-semibold text-espresso-600 transition hover:bg-sand"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
          </motion.aside>

          {/* Products Grid */}
          <motion.div
            layout
            className="lg:col-span-3"
          >
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-sand bg-white p-12 text-center"
              >
                <p className="text-lg text-espresso-500">
                  No encontramos productos que coincidan con tus filtros.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 font-semibold text-espresso-900 transition hover:bg-gold-dark"
                >
                  Limpiar filtros
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
