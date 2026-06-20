"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useReducedMotion } from "@/lib/use-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollContextValue {
  /** Instancia de Lenis (null si reduced-motion o aún no montada). */
  lenis: Lenis | null;
  /** Desplaza suavemente a un target (selector, elemento o número). */
  scrollTo: (target: string | HTMLElement | number, offset?: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Base cinemática del sitio: monta Lenis (smooth scroll de Studio Freight) y lo
 * sincroniza con el ticker de GSAP/ScrollTrigger para que todas las animaciones
 * por scroll compartan un único loop (sin jank ni doble RAF).
 *
 * Respeta `prefers-reduced-motion`: si el usuario pidió menos movimiento, no se
 * monta Lenis y el scroll queda nativo. ScrollTrigger sigue funcionando con el
 * scroll del navegador, así que los reveals degradan con elegancia.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      // Sin smooth-scroll: ScrollTrigger usa el scroll nativo.
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = instance;
    setLenis(instance);

    // Un único loop: GSAP maneja el RAF y Lenis avanza dentro de él.
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reducedMotion]);

  const scrollTo = (
    target: string | HTMLElement | number,
    offset = 0,
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.2 });
      return;
    }
    // Fallback nativo (reduced-motion o Lenis no montado).
    if (typeof target === "string") {
      document
        .querySelector(target)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target + offset, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
