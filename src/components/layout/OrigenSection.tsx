import Image from "next/image";
import { Mountain, Sprout } from "lucide-react";

const FEATURES = [
  {
    icon: Mountain,
    title: "1.700 msnm",
    description:
      "Altitud que propicia una maduración lenta de la cereza y mayor concentración de azúcares naturales.",
  },
  {
    icon: Sprout,
    title: "Comercio Justo",
    description:
      "Pagamos primas especiales por encima del mercado para asegurar la sostenibilidad de las familias caficultoras.",
  },
];

export function OrigenSection() {
  return (
    <section id="origen" className="scroll-mt-20 bg-cream py-20 lg:py-24">
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        {/* Imágenes */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-organic to-espresso-800 shadow-card">
            <Image
              src="/brand/logo.png"
              alt="Finca Flor de Altura en Junín"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-12"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden h-40 w-40 overflow-hidden rounded-2xl border-4 border-cream bg-sand shadow-card sm:block">
            <Image
              src="/brand/logo.png"
              alt="Manos agricultoras de café"
              fill
              sizes="160px"
              className="object-contain p-4"
            />
          </div>
        </div>

        {/* Contenido */}
        <div>
          <span className="font-mono text-sm uppercase tracking-wide text-gold-dark">
            Nuestra Historia
          </span>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-espresso-800 sm:text-4xl">
            Cosechando identidad en alturas excepcionales
          </h2>
          <p className="mt-4 text-espresso-600">
            Flor de Altura nace en el corazón de Pichanaqui, Junín, como una
            alianza directa con pequeños agricultores locales. Creemos que la
            calidad de la taza no es fruto del azar, sino del respeto a los
            tiempos de la tierra.
          </p>
          <p className="mt-3 text-espresso-600">
            Nuestros cafetos crecen protegidos por árboles de sombra nativos,
            absorbiendo lentamente los nutrientes de suelos fértiles de montaña.
            Al prescindir de pesticidas y abonos químicos, garantizamos un grano
            puro, limpio y saludable.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-5 shadow-card">
                <f.icon className="h-7 w-7 text-organic" strokeWidth={1.6} />
                <h4 className="mt-3 font-serif text-xl text-espresso-800">
                  {f.title}
                </h4>
                <p className="mt-1 text-sm text-espresso-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
