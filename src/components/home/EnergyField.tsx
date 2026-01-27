"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

type EnergyFieldProps = {
  targetRef: RefObject<HTMLElement | null>;
  className?: string;
};

type FieldNode = {
  x: number;
  y: number;
  radius: number;
  drift: number;
  speed: number;
  phase: number;
  influence: number;
  strength: number;
};

type Pulse = {
  x: number;
  y: number;
  start: number;
};

const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));

export const EnergyField = ({ targetRef, className }: EnergyFieldProps) => {
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    const cursor = { x: 0.5, y: 0.35 };
    const pulses: Pulse[] = [];
    let lastTime = performance.now();

    const nodes: FieldNode[] = Array.from({ length: 72 }).map((_, idx) => {
      const seed = (idx + 1) * 97.37;
      const nx = (Math.sin(seed) + 1) / 2;
      const ny = (Math.cos(seed * 1.3) + 1) / 2;
      return {
        x: clamp(0.06, nx, 0.94),
        y: clamp(0.12, ny, 0.92),
        radius: 1.4 + (idx % 5) * 0.6,
        drift: 6 + (idx % 7) * 3,
        speed: 0.4 + (idx % 6) * 0.08,
        phase: idx * 0.42,
        influence: 220 + (idx % 6) * 60,
        strength: 10 + (idx % 6) * 4,
      };
    });

    const resize = () => {
      width = target.clientWidth;
      height = target.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const toCanvasPoint = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return { x: canvas.width * 0.5, y: canvas.height * 0.35 };
      }
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      return { x, y };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const point = toCanvasPoint(event);
      cursor.x = point.x;
      cursor.y = point.y;
    };

    const handlePointerLeave = () => {
      cursor.x = canvas.width * 0.5;
      cursor.y = canvas.height * 0.35;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const point = toCanvasPoint(event);
      pulses.push({ x: point.x, y: point.y, start: performance.now() });
      if (pulses.length > 4) pulses.shift();
    };

    const draw = (ts: number) => {
      const dt = Math.min(0.033, (ts - lastTime) / 1000);
      lastTime = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.4;
      const mist = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, canvas.width * 0.45);
      mist.addColorStop(0, "rgba(110, 220, 255, 0.12)");
      mist.addColorStop(0.5, "rgba(70, 190, 255, 0.06)");
      mist.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, idx) => {
        const time = ts / 1000;
        const driftX = Math.sin(time * node.speed + node.phase) * node.drift;
        const driftY = Math.cos(time * node.speed * 0.9 + node.phase) * node.drift * 0.6;
        const baseX = node.x * canvas.width + driftX;
        const baseY = node.y * canvas.height + driftY;
        const dx = cursor.x - baseX;
        const dy = cursor.y - baseY;
        const dist = Math.max(12, Math.hypot(dx, dy));
        const influence = Math.max(0, 1 - dist / node.influence);
        const ox = (dx / dist) * influence * node.strength;
        const oy = (dy / dist) * influence * node.strength;
        const x = baseX + ox;
        const y = baseY + oy;

        const alpha = 0.18 + influence * 0.32 + (idx % 4) * 0.02;
        ctx.fillStyle = `rgba(120, 220, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, node.radius + influence * 1.4, 0, Math.PI * 2);
        ctx.fill();
      });

      const pulseDecay = 1600;
      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        const pulse = pulses[i];
        const age = ts - pulse.start;
        if (age > pulseDecay) {
          pulses.splice(i, 1);
          continue;
        }
        const t = age / pulseDecay;
        const radius = (40 + t * 220) * dpr;
        const alpha = 0.35 * (1 - t);
        ctx.strokeStyle = `rgba(130, 235, 255, ${alpha})`;
        ctx.lineWidth = 1.6 * dpr;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      const attract = 0.35;
      cursor.x += (centerX - cursor.x) * attract * dt;
      cursor.y += (centerY - cursor.y) * attract * dt;

      raf = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(target);
    window.addEventListener("resize", resize);
    target.addEventListener("pointermove", handlePointerMove, { passive: true });
    target.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    target.addEventListener("pointerdown", handlePointerDown, { passive: true });
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerleave", handlePointerLeave);
      target.removeEventListener("pointerdown", handlePointerDown);
      if (raf) cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulses.splice(0, pulses.length);
    };
  }, [reduceMotion, targetRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};
