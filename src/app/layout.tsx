import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const GTM_ID = "GTM-WVWL28V4";

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
  title: {
    default: "Flor de Altura | Café de Especialidad de Origen Peruano",
    template: "%s | Flor de Altura Café",
  },
  description:
    "Café de especialidad 100% Arábica orgánico cultivado a 1.700 – 1.950 msnm en Pichanaqui y Perené, Selva Central del Perú. Microlotes trazables con puntaje SCA 84–87. Envío a Lima y todo el país.",
  keywords: [
    "café de especialidad peruano",
    "café orgánico Pichanaqui",
    "comprar café de especialidad Lima",
    "café Geisha Perú",
    "café Catuai orgánico",
    "microlote café Perú",
    "café Selva Central Perú",
    "café de altura Junín",
    "café trazable origen único",
    "Flor de Altura café",
    "café SCA 84 87 puntos",
    "café para oficinas Lima",
  ],
  authors: [{ name: "Flor de Altura Café", url: "https://flordealtura.com" }],
  creator: "Flor de Altura Café",
  openGraph: {
    title: "Flor de Altura | Café de Especialidad de Origen Peruano",
    description:
      "Microlotes de café orgánico cultivados entre 1.700 y 1.950 msnm en la Selva Central del Perú. Trazabilidad total del grano al productor. Puntaje SCA 84–87.",
    type: "website",
    locale: "es_PE",
    siteName: "Flor de Altura Café",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flor de Altura | Café de Especialidad Peruano",
    description:
      "Microlotes orgánicos cultivados a 1.700 msnm en Pichanaqui, Junín. Trazabilidad total, SCA 84–87.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      {/* Google Tag Manager */}
      <Script id="gtm-base" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      {/* End Google Tag Manager */}
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
