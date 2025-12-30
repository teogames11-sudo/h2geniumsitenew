"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  blur: number;
};

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const BubblesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cursorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor(randomBetween(48, 70));
      bubblesRef.current = Array.from({ length: count }).map(() => ({
        x: randomBetween(0, canvas.width),
        y: randomBetween(0, canvas.height),
        r: randomBetween(32, 180),
        vx: randomBetween(-0.22, 0.22),
        vy: randomBetween(-0.16, 0.16),
        alpha: randomBetween(0.18, 0.3),
        blur: randomBetween(18, 52),
      }));
    };

    const draw = () => {
      const bubbles = bubblesRef.current;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubbles.forEach((bubble) => {
        const offsetX = (cursorRef.current.x - canvas.width / 2) * 0.0024 * (bubble.r / 110);
        const offsetY = (cursorRef.current.y - canvas.height / 2) * 0.0024 * (bubble.r / 110);
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          bubble.x + offsetX,
          bubble.y + offsetY,
          bubble.r * 0.2,
          bubble.x + offsetX,
          bubble.y + offsetY,
          bubble.r,
        );
        gradient.addColorStop(0, `rgba(255,255,255,${bubble.alpha + 0.16})`);
        gradient.addColorStop(0.5, `rgba(120,195,255,${bubble.alpha + 0.08})`);
        gradient.addColorStop(1, `rgba(120,195,255,0.1)`);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = bubble.blur;
        ctx.shadowColor = "rgba(90,175,255,0.85)";
        ctx.arc(bubble.x + offsetX, bubble.y + offsetY, bubble.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const tick = () => {
      const bubbles = bubblesRef.current;
      bubbles.forEach((bubble) => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        if (bubble.x - bubble.r > canvas.width) bubble.x = -bubble.r;
        if (bubble.x + bubble.r < 0) bubble.x = canvas.width + bubble.r;
        if (bubble.y - bubble.r > canvas.height) bubble.y = -bubble.r;
        if (bubble.y + bubble.r < 0) bubble.y = canvas.height + bubble.r;
      });
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };

    init();
    draw();
    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(tick);
    }

    const handleVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!prefersReduced && !rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      init();
      draw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      cursorRef.current = { x: event.clientX, y: event.clientY };
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-90" aria-hidden />;
};
