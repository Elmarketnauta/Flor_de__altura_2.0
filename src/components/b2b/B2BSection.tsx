import { Check } from "lucide-react";
import { B2BForm } from "./B2BForm";

const BENEFITS = [
  {
    title: "Máquinas Italianas en Comodato",
    description:
      "Instalamos equipos automáticos de alta tecnología sin costo de alquiler.",
  },
  {
    title: "Abastecimiento Semanal",
    description:
      "Entregamos lotes de café recién tostado directo de la tostaduría.",
  },
  {
    title: "Talleres Sensoriales",
    description:
      "Incluye una tarde de team building anual con cata de café guiada para tu equipo.",
  },
];

export function B2BSection() {
  return (
    <section
      id="b2b"
      className="scroll-mt-20 bg-organic py-20 text-cream lg:py-24"
    >
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        {/* Copy + beneficios */}
        <div>
          <span className="font-mono text-sm uppercase tracking-wide text-gold-light">
            Flor de Altura Oficina
          </span>
          <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
            El beneficio corporativo más valorado de Lima
          </h2>
          <p className="mt-4 max-w-md text-cream/80">
            Transforma el ambiente laboral de tu empresa reemplazando el café
            industrial quemado por granos orgánicos de especialidad cultivados
            en Pichanaqui.
          </p>

          <ul className="mt-8 space-y-5">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-espresso-900">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <div>
                  <h4 className="font-semibold text-cream">{b.title}</h4>
                  <p className="text-sm text-cream/70">{b.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario de captación */}
        <div className="w-full">
          <B2BForm />
        </div>
      </div>
    </section>
  );
}
