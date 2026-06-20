/** Tipado de la capa de datos para Google Tag Manager. */
export {};

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
