import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mountain,
  MapPin,
  Leaf,
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
} from "lucide-react";
import { FINCAS } from "@/data/fincas";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";

export function generateStaticParams() {
  return FINCAS.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const finca = FINCAS.find((f) => f.slug === params.slug);
  if (!finca) return {};
  return {
    title: `${finca.name} — Finca de Café de Especialidad en ${finca.region}`,
    description: `${finca.tagline}. ${finca.description.slice(0, 130)} Altitud ${finca.altitude.min.toLocaleString()}–${finca.altitude.max.toLocaleString()} msnm. Productor: ${finca.producer.name}.`,
    openGraph: {
      title: `${finca.name} | Flor de Altura — Café de Especialidad Peruano`,
      description: `${finca.tagline}. Café orgánico en ${finca.region}, ${finca.country}. ${finca.altitude.min.toLocaleString()}–${finca.altitude.max.toLocaleString()} msnm.`,
    },
  };
}

export default function FincaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const finca = FINCAS.find((f) => f.slug === params.slug);
  if (!finca) notFound();

  const fincaProducts = PRODUCTS.filter((p) =>
    finca.productSlugs.includes(p.slug)
  );

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero con imagen de finca */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <Image
          src={finca.heroImage}
          alt={finca.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso-900/40 via-espresso-900/20 to-espresso-900/80" />

        <div className="absolute left-4 top-20 sm:left-8">
          <Link
            href="/fincas"
            className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-cream backdrop-blur-sm hover:bg-white/30 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las fincas
          </Link>
        </div>

        {/* Altitud siempre visible */}
        <div className="absolute right-4 top-20 sm:right-8">
          <div className="flex items-center gap-2 rounded-full bg-espresso-900/70 px-4 py-2 backdrop-blur-sm">
            <Mountain className="h-4 w-4 text-gold" />
            <span className="font-mono text-sm font-bold text-cream">
              {finca.altitude.min.toLocaleString()} – {finca.altitude.max.toLocaleString()} msnm
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 sm:px-8 lg:px-16">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-gold" />
            <span className="font-mono text-sm uppercase tracking-widest text-gold">
              {finca.region} · {finca.country}
            </span>
          </div>
          <h1 className="font-serif text-5xl font-semibold text-cream sm:text-6xl">
            {finca.name}
          </h1>
          <p className="mt-3 text-xl text-espresso-100 max-w-2xl">
            {finca.tagline}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-3">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-12">

            <section>
              <h2 className="font-serif text-2xl text-espresso-900 mb-4">La finca</h2>
              <p className="text-espresso-600 leading-relaxed text-lg">{finca.description}</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-espresso-900 mb-6">La historia</h2>
              <div className="space-y-5 border-l-2 border-gold pl-6">
                {finca.story.map((paragraph, i) => (
                  <p key={i} className="text-espresso-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-espresso-900 mb-6">El productor</h2>
              <div className="flex gap-6 items-start rounded-2xl border border-sand bg-white p-6">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-sand to-cream">
                  <Image
                    src={finca.producer.image}
                    alt={finca.producer.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-espresso-900">
                    {finca.producer.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-gold-dark mt-0.5">
                    {finca.producer.role}
                  </p>
                  <p className="mt-3 text-sm text-espresso-600 leading-relaxed">
                    {finca.producer.bio}
                  </p>
                </div>
              </div>
            </section>

            {fincaProducts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-espresso-900">
                    Cafés de {finca.name}
                  </h2>
                  <span className="font-mono text-xs text-espresso-400">
                    {fincaProducts.length} producto{fincaProducts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {fincaProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            <div className="rounded-2xl border border-sand bg-white p-6 space-y-5">
              <h3 className="font-mono text-xs uppercase tracking-widest text-espresso-400">
                Datos de la finca
              </h3>

              <dl className="space-y-4">
                {/* Altitud prominente */}
                <div className="rounded-xl bg-espresso-800 px-4 py-3 flex items-center gap-3">
                  <Mountain className="h-5 w-5 text-gold flex-shrink-0" />
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-espresso-300">Altitud</dt>
                    <dd className="font-mono text-lg font-bold text-cream leading-tight">
                      {finca.altitude.min.toLocaleString()}–{finca.altitude.max.toLocaleString()} msnm
                    </dd>
                  </div>
                </div>

                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Región</dt>
                  <dd className="mt-1 font-medium text-espresso-800">{finca.region}</dd>
                </div>

                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400">Fundada</dt>
                  <dd className="mt-1 flex items-center gap-2 font-medium text-espresso-800">
                    <Calendar className="h-4 w-4 text-espresso-400" />
                    {finca.established}
                  </dd>
                </div>

                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400 mb-2">Variedades</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {finca.varieties.map((v) => (
                      <span key={v} className="flex items-center gap-1 rounded-full bg-organic/10 px-2.5 py-1 text-xs font-medium text-organic">
                        <Leaf className="h-3 w-3" />
                        {v}
                      </span>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-espresso-400 mb-2">Procesos</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {finca.processes.map((p) => (
                      <span key={p} className="rounded-full bg-sand px-2.5 py-1 text-xs text-espresso-700">
                        {p}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-sand bg-white p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-espresso-400 mb-4">
                Certificaciones
              </h3>
              <ul className="space-y-3">
                {finca.certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2 text-sm text-espresso-700">
                    <Award className="h-4 w-4 flex-shrink-0 text-gold" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-espresso-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="h-4 w-4 text-gold" />
                <span className="font-mono text-xs uppercase tracking-widest text-gold">Club Flor de Altura</span>
              </div>
              <h3 className="font-serif text-lg text-cream">
                Recibe un café de altura diferente cada mes
              </h3>
              <p className="mt-2 text-sm text-espresso-200">
                Los suscriptores del Club acceden a microlotes de fincas como {finca.name} antes que nadie.
              </p>
              <Link
                href="/club"
                className="mt-4 flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-espresso-900 hover:bg-gold-dark transition"
              >
                Unirme al Club
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
