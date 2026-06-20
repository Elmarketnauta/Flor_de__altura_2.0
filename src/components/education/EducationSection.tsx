import Image from "next/image";
import { GraduationCap, PlayCircle } from "lucide-react";
import { HOTMART_COURSE_URL } from "@/lib/constants";
import { CouponBox } from "./CouponBox";

const METHODS = ["V60", "Prensa Francesa", "AeroPress"];

export function EducationSection() {
  return (
    <section id="educacion" className="scroll-mt-20 bg-espresso-800 py-20 text-cream lg:py-24">
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        {/* Mockup del curso */}
        <div className="relative order-last lg:order-first">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-organic to-espresso-900 shadow-card">
            <Image
              src="/brand/logo.png"
              alt="Mockup del curso virtual de barismo"
              fill
              sizes="(max-width: 1024px) 100vw, 448px"
              className="object-contain p-12"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle
                className="h-16 w-16 text-cream/90 drop-shadow-lg"
                strokeWidth={1.2}
              />
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-terracotta px-3 py-1 text-xs font-semibold">
              Videocurso · Hotmart
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div>
          <span className="font-mono text-sm uppercase tracking-wide text-gold-light">
            Curso Online en Hotmart
          </span>
          <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
            El Ritual del Café: Barismo y Métodos en Casa
          </h2>
          <p className="mt-4 text-cream/80">
            Democratizamos el conocimiento del café de especialidad. En este
            videocurso paso a paso, aprenderás a elegir granos, regular la
            molienda según el agua y dominar extracciones perfectas.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <span
                key={m}
                className="rounded-full bg-cream/10 px-3 py-1 text-sm text-cream/90"
              >
                {m}
              </span>
            ))}
          </div>

          {/* CTA prominente */}
          <a
            href={HOTMART_COURSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-layer="view_course_hotmart"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-gold px-8 py-4 text-lg font-semibold text-espresso-900 shadow-card transition hover:bg-gold-light active:scale-[0.99]"
          >
            <GraduationCap className="h-6 w-6" />
            Ver Curso en Hotmart
          </a>

          {/* Cupón con copiar al portapapeles */}
          <div className="mt-8">
            <CouponBox />
          </div>
        </div>
      </div>
    </section>
  );
}
