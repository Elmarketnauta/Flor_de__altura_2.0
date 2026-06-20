"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve `true` solo después del montaje en cliente.
 * Evita mismatches de hidratación al leer estado persistido (localStorage).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
