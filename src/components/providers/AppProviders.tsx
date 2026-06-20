"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/**
 * Carga diferida de la capa cinemática (Lenis + GSAP) en cliente.
 * `ssr: false` evita penalizar el LCP del Hero con JS de animación en el
 * primer render; el contenido se pinta de inmediato y el smooth-scroll se
 * hidrata después.
 */
const SmoothScrollProvider = dynamic(
  () =>
    import("./SmoothScrollProvider").then((m) => m.SmoothScrollProvider),
  { ssr: false },
);

const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      {children}
      <CustomCursor />
    </SmoothScrollProvider>
  );
}
