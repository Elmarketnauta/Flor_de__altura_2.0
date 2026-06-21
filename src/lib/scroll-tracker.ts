"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "./analytics";

export function useScrollDepth() {
  const maxDepthRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ?
        (window.scrollY / scrollHeight) * 100 : 0;

      if (scrollPercentage > maxDepthRef.current) {
        maxDepthRef.current = scrollPercentage;

        // Track milestones: 25%, 50%, 75%, 100%
        if (scrollPercentage >= 25 && maxDepthRef.current < 50) {
          trackEvent("scroll_depth", { milestone: "25%" });
        } else if (scrollPercentage >= 50 && maxDepthRef.current < 75) {
          trackEvent("scroll_depth", { milestone: "50%" });
        } else if (scrollPercentage >= 75 && maxDepthRef.current < 100) {
          trackEvent("scroll_depth", { milestone: "75%" });
        } else if (scrollPercentage === 100) {
          trackEvent("scroll_depth", { milestone: "100%" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return maxDepthRef;
}

export function useElementInView(
  elementId: string,
  callback?: (isInView: boolean) => void
) {
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("element_in_view", { elementId });
          callback?.(true);
        } else {
          callback?.(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId, callback]);
}
