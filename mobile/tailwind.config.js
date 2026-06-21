/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#3D2817",
        "espresso-500": "#5D4E2D",
        "espresso-800": "#2A1810",
        "espresso-900": "#1A0F08",
        gold: "#D4AF37",
        "gold-dark": "#C9A227",
        cream: "#F5F1ED",
        sand: "#CBBBAA",
        organic: "#00A86B",
        "organic-dark": "#008855",
        clay: "#D2B48C",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
