import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    text: "El Geysha es sencillamente espectacular. Tiene notas florales que nunca había sentido en un café comercial. La entrega a Miraflores llegó al día siguiente del tostado.",
    initials: "AC",
    name: "Alejandro Cárdenas",
    role: "Suscripción Mensual B2C",
  },
  {
    text: "Implementamos el plan Flor de Altura en la oficina y el cambio ha sido rotundo. Los chicos valoran mucho que sea orgánico y el soporte de mantenimiento es excelente.",
    initials: "VS",
    name: "Valeria Salazar",
    role: "HR Manager - Tech Solutions",
  },
  {
    text: "Compré el curso de barismo en Hotmart y el cupón RITUAL20 me sirvió para abastecerme del grano Catuai. Preparar mi V60 por la mañana es mi momento favorito.",
    initials: "GP",
    name: "Gustavo Ponce",
    role: "Comprador Frecuente",
  },
];

export function Testimonials() {
  return (
    <section className="bg-sand/40 py-20">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-sm uppercase tracking-wide text-gold-dark">
            Opiniones Reales
          </span>
          <h2 className="mt-2 font-serif text-3xl text-espresso-800 sm:text-4xl">
            Recomendado por amantes del buen café
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.initials}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-card"
            >
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-espresso-600">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-espresso-700 font-semibold text-cream">
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold text-espresso-800">{t.name}</p>
                  <p className="text-sm text-espresso-400">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
