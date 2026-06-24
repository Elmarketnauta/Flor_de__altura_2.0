"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { Analytics } from "./Analytics";

const SmoothScrollProvider = dynamic(
  () =>
    import("./SmoothScrollProvider").then((m) => m.SmoothScrollProvider),
  { ssr: false },
);

const ScrollToTop = dynamic(
  () => import("@/components/layout/ScrollToTop").then((m) => m.ScrollToTop),
  { ssr: false, loading: () => null },
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SmoothScrollProvider>
        <Analytics />
        {children}
        <ScrollToTop />
      </SmoothScrollProvider>
    </SessionProvider>
  );
}
