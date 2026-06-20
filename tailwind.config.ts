import type { Config } from "tailwindcss";

/**
 * Flor de Altura Café — sistema de diseño.
 * Paleta oficial de marca (Pichanaqui, Selva Central · 1.700 msnm):
 *  - Tonos tierra (café tostado / suave)
 *  - Acentos dorados (ocre / oro Catuai)
 *  - Verdes orgánicos (verde selva) + terracota andino
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tonos tierra (café)
        espresso: {
          DEFAULT: "#3c2218", // --color-primary (café tostado oscuro)
          50: "#faf6f0",
          100: "#ebd9c8",
          200: "#d8bda5",
          300: "#bf9778",
          400: "#8a5a3c",
          500: "#5c3a21", // --color-secondary (café suave)
          600: "#492c1a",
          700: "#3c2218", // primary
          800: "#2c221e", // --color-text (café carbón)
          900: "#1d1512",
        },
        // Acentos dorados (ocre / oro Catuai)
        gold: {
          DEFAULT: "#c08b5c",
          light: "#ebd9c8",
          dark: "#a8744a",
        },
        // Verde selva
        organic: {
          DEFAULT: "#2a4135",
          light: "#4a6b5a",
          dark: "#1c2e25",
        },
        // Acento terracota andino
        terracotta: {
          DEFAULT: "#c84b31",
          dark: "#a83a24",
        },
        // Neutros cálidos
        cream: "#faf6f0",
        sand: "#ebd9c8",
        clay: "#5c3a21",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      boxShadow: {
        drawer: "-8px 0 40px -12px rgba(60, 34, 24, 0.35)",
        card: "0 10px 30px -15px rgba(60, 34, 24, 0.30)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
