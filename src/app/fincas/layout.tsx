import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fincas de Origen Peruano | Café de Especialidad",
  description:
    "Conoce las fincas productoras de Flor de Altura: Finca San Ignacio en Pichanaqui (1.700–1.850 msnm) y Finca Bella Vista en Perené (1.850–1.950 msnm). Café de especialidad peruano con trazabilidad total del productor al consumidor.",
  openGraph: {
    title: "Nuestras Fincas | Café de Especialidad Peruano — Flor de Altura",
    description:
      "Finca San Ignacio (Pichanaqui, Junín) y Finca Bella Vista (Perené, Chanchamayo). Café orgánico trazable desde la planta, altitud 1.700–1.950 msnm.",
  },
};

export default function FincasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
