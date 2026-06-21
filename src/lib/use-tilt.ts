"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

interface TiltOptions {
  scale?: number;
  rotationX?: number;
  rotationY?: number;
  glareEnable?: boolean;
  glareMaxOpacity?: number;
}

/**
 * Tilt 3D: el elemento se inclina hacia el cursor usando CSS transform 3D.
 * Simula profundidad sin necesidad de WebGL pesado.
 *
 * `glareEnable` añade un brillo reflectante que sigue al cursor.
 * Se desactiva en reduced-motion y touch.
 */
export function useTilt<T extends HTMLElement>(
  options: TiltOptions = {},
) {
  const {
    scale = 1.05,
    rotationX = 15,
    rotationY = 15,
    glareEnable = true,
    glareMaxOpacity = 0.3,
  } = options;

  const ref = useRef<T>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafId = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

      const distX = (x / (rect.width / 2)) * rotationY;
      const distY = -(y / (rect.height / 2)) * rotationX;

      targetRotX = distY;
      targetRotY = distX;

      // Glare (brillo reflectante)
      if (glareRef.current) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareMaxOpacity}), transparent)`;
      }
    };

    const onLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      if (glareRef.current) {
        glareRef.current.style.background = "transparent";
      }
    };

    const animate = () => {
      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;

      el.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      el.style.transition = "none";

      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [reducedMotion, scale, rotationX, rotationY, glareMaxOpacity]);

  return { ref, glareRef };
}
