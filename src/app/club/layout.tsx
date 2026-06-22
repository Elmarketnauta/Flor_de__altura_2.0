import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club de Suscripción Mensual de Café de Especialidad",
  description:
    "Suscríbete al Club Flor de Altura y recibe cada mes un microlote diferente de café de especialidad peruano cultivado entre 1.700 y 1.950 msnm. Planes Explorador, Cumbre y Cumbre Plus. Sin permanencia, cancela cuando quieras.",
  openGraph: {
    title: "Club Flor de Altura | Suscripción de Café de Especialidad Peruano",
    description:
      "Un microlote de café orgánico peruano diferente cada mes. Geisha, Catuai y ediciones exclusivas de finca. Desde S/ 55/mes sin permanencia.",
  },
};

export default function ClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
