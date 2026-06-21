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
  /** Origen geográfico (ej. "Pichanaqui, Perú"). */
  origin: string;
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

// ============================================================
// AUTHENTICATION & USERS
// ============================================================

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  country: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: UserRole;
  };
  expires: string;
}

// ============================================================
// ORDERS & PAYMENTS
// ============================================================

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "refunded" | "failed";
export type PaymentMethod = "stripe" | "paypal";

export interface OrderItem {
  productId: string;
  format: ProductFormat;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  clientSecret: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
}

// ============================================================
// RECOMMENDATIONS (ML)
// ============================================================

export interface ProductVector {
  id: string;
  flavorBrightness: number;  // 0-1
  bodyWeight: number;         // 0-1
  acidityLevel: number;       // 0-1
  scaScoreNorm: number;       // 0-1
  priceTier: number;          // 0-1
}

export interface UserPreference {
  userId: string;
  vector: number[];           // 5-dimensional preference vector
  confidence: number;         // 0-1
}

// ============================================================
// ADMIN & LOYALTY
// ============================================================

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export interface LoyaltyAccount {
  id: string;
  userId: string;
  points: number;
  tier: LoyaltyTier;
  lifetimePoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  orderId?: string;
  type: "earn" | "redeem" | "expire" | "bonus";
  points: number;
  description: string;
  createdAt: string;
}

export interface ProductInventory {
  productId: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  conversionRate: number;
  recentOrders: Order[];
}
