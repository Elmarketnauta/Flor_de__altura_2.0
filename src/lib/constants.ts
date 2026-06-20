/** Constantes de configuración de negocio. */

/** Número de WhatsApp oficial en formato internacional sin "+" (Perú: 51). */
export const WHATSAPP_NUMBER = "51910251455";

/** Cupón destacado en la sección de educación. */
export const RITUAL_COUPON = "RITUAL20";

/** Enlace del curso en Hotmart. */
export const HOTMART_COURSE_URL = "https://www.hotmart.com/";

/** Etiquetas visibles de las categorías de la revista. */
export const ARTICLE_CATEGORY_LABELS = {
  origen: "Origen",
  metodos: "Métodos",
  sostenibilidad: "Sostenibilidad",
} as const;

/** Filtros de la revista en orden de aparición. */
export const ARTICLE_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "origen", label: "Origen" },
  { value: "metodos", label: "Métodos" },
  { value: "sostenibilidad", label: "Sostenibilidad" },
] as const;

/** Identidad de marca y contacto. */
export const BRAND = {
  name: "Flor de Altura Café",
  origin: "Pichanaqui, Junín · 1.700 msnm",
  scaRange: "SCA 84–87 pts",
  developer: "Marketnauta",
  developerUrl: "https://www.marketnauta.com/",
  phoneDisplay: "+51 910 251 455",
  email: "hola@flordealtura.com",
  address: "Pichanaqui, Chanchamayo, Junín - Perú",
  ruc: "20614458411",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
} as const;
