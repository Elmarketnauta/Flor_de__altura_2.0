"use client";

import { useEffect, useState } from "react";

/**
 * Detecta la preferencia del sistema `prefers-reduced-motion`.
 * Sirve para desactivar smooth-scroll, parallax y micro-interacciones
 * costosas en usuarios que pidieron menos movimiento (accesibilidad + CWV).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
