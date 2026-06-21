import type { Product } from "@/types";
import productsData from "./products.json";

export const PRODUCTS = productsData as Product[];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByOrigin(origin: string): Product[] {
  return PRODUCTS.filter((p) => p.origin === origin);
}

export function getProductsByVariety(variety: string): Product[] {
  return PRODUCTS.filter((p) => p.variety === variety);
}
