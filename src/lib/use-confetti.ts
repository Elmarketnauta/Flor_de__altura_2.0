"use client";

import { useCallback, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vrotation: number;
  life: number;
  color: string;
}

const COLORS = [
  "#d4a574", // gold
  "#6b4f47", // espresso
  "#a8845c", // tan
  "#8b6f47", // bronze
  "#c9a677", // light gold
];

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const rafRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const triggerConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generar piezas de confeti
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 40; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 5 + 3,
        rotation: Math.random() * Math.PI * 2,
        vrotation: (Math.random() - 0.5) * 0.2,
        life: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    piecesRef.current = pieces;
    isRunningRef.current = true;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const newPieces = piecesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2, // gravedad
          rotation: p.rotation + p.vrotation,
          life: p.life - 0.01,
        }))
        .filter((p) => p.life > 0 && p.y < canvas.height);

      piecesRef.current = newPieces;

      newPieces.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
      });

      if (newPieces.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isRunningRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    piecesRef.current = [];
  }, []);

  return {
    canvasRef,
    triggerConfetti,
    cleanup,
  };
}
