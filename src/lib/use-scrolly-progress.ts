"use client";

import { useRef, useEffect } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

/**
 * Hook para scrollytelling: retorna el progreso de scroll de un contenedor target
 * como un MotionValue [0, 1] que puede ser usado con useTransform para animar
 * elementos basados en el scroll relativo dentro de ese contenedor.
 *
 * Ejemplo:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const progress = useScrollyProgress(ref);
 *   const opacity = useTransform(progress, [0, 1], [0, 1]);
 */
export function useScrollyProgress(
  containerRef: React.RefObject<HTMLElement>,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return scrollYProgress;
}
