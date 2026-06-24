/** Tipos de dominio compartidos en toda la app. */

export type ProductFormat = "grano" | "molido";

export interface ProductTastingProfile {
  acidity: number;
  body: number;
  sweetness: number;
  complexity: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  scaScore: number;
  /** Altitud de cultivo en msnm — elemento de marca permanente. */
  altitude: number;
  process: string;
  variety: string;
  botanicalVariety?: string;
  origin: string;
  fincaSlug?: string;
  fincaName?: string;
  notes: string[];
  tastingProfile?: ProductTastingProfile;
  cupProfile?: string;
  price: number;
  weightGrams: number;
  image: string;
  badge?: string;
  available: boolean;
}

// ============================================================
// FINCAS (Farms)
// ============================================================

export interface FincaProducer {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface FincaAltitudeRange {
  min: number;
  max: number;
}

export interface Finca {
  slug: string;
  name: string;
  tagline: string;
  region: string;
  country: string;
  altitude: FincaAltitudeRange;
  coordinates: { lat: number; lng: number };
  description: string;
  story: string[];
  producer: FincaProducer;
  image: string;
  heroImage: string;
  certifications: string[];
  varieties: string[];
  processes: string[];
  productSlugs: string[];
  established: number;
}

// ============================================================
// CLUB FLOR DE ALTURA (Suscripción mensual)
// ============================================================

export type ClubTier = "explorador" | "cumbre" | "cumbre-plus";
export type ClubFrequency = "mensual" | "bimestral";
export type ClubStatus = "active" | "paused" | "cancelled";

export interface ClubTierConfig {
  id: ClubTier;
  name: string;
  tagline: string;
  priceMonthly: number;
  weightGrams: number;
  bags: number;
  pointsBonus: number;
  pointsMultiplier: number;
  perks: string[];
  badge: string;
}

export interface ClubSubscription {
  id: string;
  userId: string;
  tier: ClubTier;
  frequency: ClubFrequency;
  status: ClubStatus;
  format: ProductFormat;
  startDate: string;
  nextShipmentDate: string;
  currentCycleProduct?: string;
  totalShipments: number;
  pointsEarned: number;
  createdAt: string;
  updatedAt: string;
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

export interface ArticleSection {
  type: "paragraph" | "heading" | "pullquote" | "callout" | "tasting-card" | "data-table" | "timeline";
  text?: string;
  items?: string[];
  rows?: { label: string; value: string }[];
  events?: { year: string; fact: string }[];
  label?: string;
}

export interface Article {
  id: string;
  category: ArticleCategory;
  title: string;
  subtitle?: string;
  excerpt: string;
  image: string;
  heroImage?: string;
  /** Fecha en formato visible (ej. "18 de Junio, 2026"). */
  date: string;
  /** Tiempo de lectura legible (ej. "5 min"). */
  readTime: string;
  author?: { name: string; role: string };
  /** Cuerpo del artículo en párrafos (legado). */
  content: string[];
  /** Cuerpo editorial enriquecido. */
  sections?: ArticleSection[];
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
