import { PRODUCTS } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function CatalogSection() {
  return (
    <section id="catalogo" className="scroll-mt-20 bg-cream py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Café de especialidad peruano
          </p>
          <h2 className="mt-2 font-serif text-3xl text-espresso-800 sm:text-4xl">
            Microlotes orgánicos trazables hasta la planta
          </h2>
          <p className="mt-3 text-espresso-500">
            Catuai y Geisha cultivados a 1.700 – 1.950 msnm en Pichanaqui y Perené,
            Selva Central del Perú. Selección rigurosa por puntaje SCA 84–87.
            Tostado bajo pedido, envío a todo el país.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
