import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Café de Especialidad Peruano",
  description:
    "Compra café de especialidad orgánico peruano. Microlotes Catuai Rojo y Geisha cultivados entre 1.700 y 1.950 msnm en Pichanaqui y Perené, Selva Central. Puntaje SCA 84–87. Envío a Lima y todo el Perú.",
  openGraph: {
    title: "Catálogo | Café de Especialidad Peruano — Flor de Altura",
    description:
      "Microlotes orgánicos Catuai y Geisha de la Selva Central del Perú. Tostado bajo pedido, trazabilidad completa, SCA 84–87.",
  },
};

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
