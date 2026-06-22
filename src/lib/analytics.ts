"use client";

import { useEffect } from "react";

// Tipos de eventos tipados para Mixpanel
export interface AnalyticsEvent {
  type: string;
  properties?: Record<string, string | number | boolean | null>;
}

export type EventType =
  | "page_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "update_quantity"
  | "begin_checkout"
  | "purchase_complete"
  | "open_article"
  | "magazine_filter"
  | "add_to_wishlist"
  | "remove_from_wishlist"
  | "scroll_depth"
  | "element_in_view"
  | "carousel_scroll"
  | "filter_change"
  | "filter_clear"
  | "club_subscribe"
  | "club_pause"
  | "club_cancel"
  | "product_detail_view"
  | "finca_view";

// Inicializar Mixpanel (solo en cliente, solo si token existe)
export function initMixpanel() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    console.warn(
      "[Analytics] Mixpanel token missing. Set NEXT_PUBLIC_MIXPANEL_TOKEN in .env.local"
    );
    return;
  }

  // Inyectar script de Mixpanel
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
  document.head.appendChild(script);

  script.onload = () => {
    if ("mixpanel" in window) {
      (window as any).mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
        debug: process.env.NODE_ENV === "development",
        batch_requests: true,
      });
    }
  };
}

// Rastrear evento personalizado
export function trackEvent(
  eventType: EventType,
  properties?: Record<string, any>
) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Event: ${eventType}`, properties);
    return;
  }

  // Mixpanel
  if ("mixpanel" in window) {
    (window as any).mixpanel.track(eventType, {
      timestamp: new Date().toISOString(),
      ...properties,
    });
  }

  // Google Analytics (si está disponible)
  if ("gtag" in window) {
    (window as any).gtag("event", eventType, {
      ...properties,
    });
  }
}

// Rastrear vista de página
export function trackPageView(page: string, properties?: Record<string, any>) {
  trackEvent("page_view", {
    page,
    url: typeof window !== "undefined" ? window.location.pathname : "",
    ...properties,
  });

  // Google Analytics page view
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
  }
}

// Rastrear conversión (compra)
export function trackConversion(
  value: number,
  currency = "PEN",
  properties?: Record<string, any>
) {
  trackEvent("purchase_complete", {
    value,
    currency,
    ...properties,
  });

  // Google Analytics ecommerce
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("event", "purchase", {
      value,
      currency,
      ...properties,
    });
  }
}

// Hook para inicializar analytics al montar
export function useAnalytics() {
  useEffect(() => {
    initMixpanel();
  }, []);
}

// Declare global types para evitar TS errors
declare global {
  interface Window {
    mixpanel?: any;
    gtag?: (...args: any[]) => void;
  }
}
