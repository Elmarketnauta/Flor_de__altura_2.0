"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Cursor sensorial: grano de café PNG que sigue al puntero con inercia.
 * Rota continuamente y se expande al pasar sobre elementos `data-cursor`,
 * mostrando una etiqueta contextual.
 *
 * Se desactiva en dispositivos táctiles y con prefers-reduced-motion.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Solo en punteros finos (mouse/trackpad).
  useEffect(() => {
    if (reducedMotion) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let rotationAngle = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      rotationAngle += 2.2;

      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]",
      );
      if (el) {
        setActive(true);
        setLabel(el.dataset.cursor ?? "");
      } else {
        setActive(false);
        setLabel("");
      }
    };

    const render = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${rotationAngle}deg)`;
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const baseSize = active ? 120 : 40;
  const scale = active ? 1 : 1;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center transition-[width,height] duration-300 ease-out"
      style={{
        width: baseSize,
        height: baseSize,
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src="/cursor/coffee-bean.svg"
          alt=""
          fill
          className="select-none"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {label && (
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-organic/90 px-3 py-1 text-center text-[9px] font-semibold uppercase tracking-wider text-cream backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
