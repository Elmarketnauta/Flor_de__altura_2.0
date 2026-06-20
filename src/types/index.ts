/** Tipos de dominio compartidos en toda la app. */

export type ProductFormat = "grano" | "molido";

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Notas de cata / descripción corta para la tarjeta. */
  tagline: string;
  description: string;
  /** Puntaje SCA (84–87). */
  scaScore: number;
  /** Altitud de cultivo en msnm. */
  altitude: number;
  /** Proceso de beneficio (lavado, honey, natural...). */
  process: string;
  /** Variedad / tipo botánico mostrado como etiqueta. */
  variety: string;
  /** Notas de cata en chips. */
  notes: string[];
  /** Precio en soles (PEN) por presentación de 250 g. */
  price: number;
  weightGrams: number;
  image: string;
  badge?: string;
  available: boolean;
}

/** Línea de producto dentro del carrito (producto + cantidad + formato). */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  format: ProductFormat;
  quantity: number;
}

/** Slug de categoría (coincide con los filtros de la revista). */
export type ArticleCategory = "origen" | "metodos" | "sostenibilidad";

export interface Article {
  id: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  image: string;
  /** Fecha en formato visible (ej. "18 de Junio, 2026"). */
  date: string;
  /** Tiempo de lectura legible (ej. "5 min"). */
  readTime: string;
  /** Cuerpo del artículo en párrafos. */
  content: string[];
}

/** Opción de filtro de la revista, incluido "Todos". */
export type ArticleFilter = "all" | ArticleCategory;
