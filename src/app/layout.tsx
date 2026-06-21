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
