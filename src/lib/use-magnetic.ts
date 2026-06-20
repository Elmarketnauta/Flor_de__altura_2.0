"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/**
 * Botón magnético: el elemento se desplaza sutilmente hacia el cursor mientras
 * el puntero está dentro de su área, y vuelve a su sitio al salir. Devuelve un
 * ref para adjuntar al elemento.
 *
 * Desactivado en touch y reduced-motion. `strength` controla cuánto se atrae
 * (px máximos de desplazamiento aproximado).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.65) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const onLeave = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, strength]);

  return ref;
}
