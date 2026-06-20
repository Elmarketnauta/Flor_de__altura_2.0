import type { Product } from "@/types";
import productsData from "@/data/products.json";
import { ProductCard } from "./ProductCard";

const products = productsData as Product[];

export function CatalogSection() {
  return (
    <section id="catalogo" className="scroll-mt-20 bg-cream py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Nuestro catálogo
          </p>
          <h2 className="mt-2 font-serif text-3xl text-espresso-800 sm:text-4xl">
            Café de especialidad, trazable hasta la planta
          </h2>
          <p className="mt-3 text-espresso-500">
            Microlotes cultivados en Pichanaqui a 1.700 msnm. Selección por
            puntaje SCA 84–87. Elige tu formato y añádelo al carrito.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
