"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

type CursorTrailProps = {
  targetRef: RefObject<HTMLElement | null>;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  size: number;
};

export const CursorTrail = ({ targetRef, className }: CursorTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const target = targetRef.current;
    const canvas = canvasRef.current;
    if (!target || !canvas || reduceMotion) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const connection = nav.connection;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const lowPower = Boolean(connection?.saveData) || lowMemory || connection?.effectiveType?.includes("2g");
    if (lowPower) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let lastSpawn = 0;
    let lastX = 0;
    let lastY = 0;
    let zoomScale = 1;
    const particles: Particle[] = [];
    const maxParticles = 120;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = target.clientWidth;
      height = target.clientHeight;
      const rootZoom = Number.parseFloat(window.getComputedStyle(document.documentElement).zoom || "1");
      zoomScale = Number.isFinite(rootZoom) && rootZoom > 0 ? rootZoom : 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, count: number) => {
      const now = performance.now();
      if (now - lastSpawn < 22) return;
      lastSpawn = now;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.25 + Math.random() * 0.9;
        const ttl = 1.1 + Math.random() * 0.9;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.15,
          life: ttl,
          ttl,
          size: 1.4 + Math.random() * 2.2,
        });
      }
      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }
    };

    const draw = (ts: number) => {
      const dt = Math.min(0.033, (ts - last) / 1000);
      last = ts;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = "rgba(120, 220, 255, 0.55)";
      ctx.shadowBlur = 10;

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        const alpha = Math.max(0, p.life / p.ttl);
        ctx.fillStyle = `rgba(140, 230, 255, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      if (particles.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
        ctx.clearRect(0, 0, width, height);
      }
    };

    const ensureLoop = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / zoomScale;
      const y = (event.clientY - rect.top) / zoomScale;
      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.hypot(dx, dy);
      lastX = x;
      lastY = y;
      const count = Math.min(3, 1 + Math.round(distance / 18));
      spawn(x, y, count);
      ensureLoop();
    };

    const handlePointerLeave = () => {
      lastSpawn = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(target);
    window.addEventListener("resize", resize);
    target.addEventListener("pointermove", handlePointerMove, { passive: true });
    target.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    resize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerleave", handlePointerLeave);
      if (raf) cancelAnimationFrame(raf);
      particles.splice(0, particles.length);
      ctx.clearRect(0, 0, width, height);
    };
  }, [reduceMotion, targetRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};
