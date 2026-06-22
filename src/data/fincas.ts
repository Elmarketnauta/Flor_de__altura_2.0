import type { Finca } from "@/types";
import fincasData from "./fincas.json";

export const FINCAS = fincasData as Finca[];

export function getFincaBySlug(slug: string): Finca | undefined {
  return FINCAS.find((f) => f.slug === slug);
}
