import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revista de Café de Especialidad Peruano",
  description:
    "Artículos sobre café de especialidad peruano: origen del Geisha en Chanchamayo, temperatura ideal para extracciones perfectas, cultivo bajo sombra orgánico en Pichanaqui. Conocimiento de baristas y productores de la Selva Central del Perú.",
  openGraph: {
    title: "Revista Flor de Altura | Café de Especialidad Peruano",
    description:
      "Historias de origen, técnicas de preparación y sostenibilidad del café orgánico peruano. Escritos por baristas y productores de Pichanaqui y Perené.",
  },
};

export default function RevistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
