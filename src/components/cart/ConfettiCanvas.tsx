"use client";

import { useEffect } from "react";
import { useConfetti } from "@/lib/use-confetti";

interface ConfettiCanvasProps {
  trigger?: boolean;
}

export function ConfettiCanvas({ trigger = false }: ConfettiCanvasProps) {
  const { canvasRef, triggerConfetti, cleanup } = useConfetti();

  useEffect(() => {
    if (trigger) {
      triggerConfetti();
    }

    return cleanup;
  }, [trigger, triggerConfetti, cleanup]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  );
}
