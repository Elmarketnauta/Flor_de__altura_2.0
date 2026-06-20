import type { Metadata } from "next";
import { Poppins, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Flor de Altura Café | Café Orgánico de Especialidad y Origen Único",
  description:
    "Marca premium de café de especialidad, 100% Arábica Orgánico de origen único, cultivado en la Selva Central del Perú (Pichanaqui). Granos selectos frescos y planes corporativos.",
  keywords: [
    "cafe de especialidad peru",
    "comprar cafe organico lima",
    "cafe pichanaqui",
    "cafe geysha peru",
    "cafe para oficinas lima",
    "flor de altura cafe",
  ],
  openGraph: {
    title: "Flor de Altura Café | Café de Especialidad",
    description:
      "Café orgánico cultivado a 1.700 msnm en Pichanaqui. Tostado en pequeños lotes para preservar su pureza floral y afrutada.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${playfair.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
