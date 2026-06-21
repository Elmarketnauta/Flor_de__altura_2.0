"use client";

import { useEffect } from "react";
import { useAnalytics, trackPageView } from "@/lib/analytics";
import { useScrollDepth } from "@/lib/scroll-tracker";

export function Analytics() {
  useAnalytics();
  useScrollDepth();

  useEffect(() => {
    // Track page view on mount
    trackPageView(
      typeof window !== "undefined" ? window.location.pathname : "/"
    );
  }, []);

  return null;
}
