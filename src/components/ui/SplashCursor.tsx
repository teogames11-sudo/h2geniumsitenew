"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./SplashCursor.module.css";

type SplashCursorProps = {
  active?: boolean;
  onComplete?: () => void;
  DURATION?: number;
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixColor = (a: [number, number, number], b: [number, number, number], t: number, alpha: number) => {
  const r = Math.round(lerp(a[0], b[0], t));
  const g = Math.round(lerp(a[1], b[1], t));
  const bCh = Math.round(lerp(a[2], b[2], t));
  return `rgba(${r}, ${g}, ${bCh}, ${alpha})`;
};

export const SplashCursor = ({
  active = true,
  onComplete,
  DURATION = 1900,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  COLOR_UPDATE_SPEED = 10,
  TRANSPARENT = true,
}: SplashCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(active);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const duration = Math.max(1200, DURATION);
    const start = performance.now();
    const splashStrength = Math.min(1.2, Math.max(0.6, SPLAT_FORCE / 6000));
    const baseR = Math.min(canvas.clientWidth, canvas.clientHeight) * SPLAT_RADIUS;
    const maxR = Math.hypot(canvas.clientWidth, canvas.clientHeight) * 0.6;
    const baseColor = [
      Math.round(BACK_COLOR.r * 255),
      Math.round(BACK_COLOR.g * 255),
      Math.round(BACK_COLOR.b * 255),
    ] as [number, number, number];
    const altColor: [number, number, number] = [110, 70, 255];
    const blueColor: [number, number, number] = [90, 160, 255];

    const draw = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const out = easeOutCubic(progress);
      const rebound = progress > 0.7 ? Math.sin(((progress - 0.7) / 0.3) * Math.PI) : 0;
      const rawRadius = baseR + (maxR - baseR) * (out - rebound * 0.028);
      const safeRadius = Number.isFinite(rawRadius) ? Math.max(0.001, rawRadius) : 0.001;
      const energy = Math.pow(1 - progress, 0.72);
      const smooth = Math.sin(progress * Math.PI);
      const alpha = Math.max(0, smooth * 0.5 * splashStrength * (0.75 + energy * 0.25));
      const timeSec = (now - start) / 1000;
      const colorA = mixColor(baseColor, blueColor, 0.55, alpha);
      const colorB = mixColor(baseColor, altColor, 0.65, alpha * 0.85);

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      if (!TRANSPARENT) {
        ctx.fillStyle = "rgba(4, 8, 16, 0.75)";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }

      const cx = canvas.clientWidth / 2;
      const cy = canvas.clientHeight / 2;
      ctx.globalCompositeOperation = "screen";

      const coreGradient = ctx.createRadialGradient(cx, cy, safeRadius * 0.1, cx, cy, safeRadius * 1.2);
      coreGradient.addColorStop(0, mixColor(baseColor, blueColor, 0.35, alpha * 0.7));
      coreGradient.addColorStop(0.35, colorA);
      coreGradient.addColorStop(0.65, colorB);
      coreGradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const ringCount = 3;
      for (let i = 0; i < ringCount; i += 1) {
        const wobble = 0.04 * Math.sin(timeSec * 1.2 + i * 1.4);
        const ringRadius = safeRadius * (0.65 + i * 0.15 + wobble);
        const ringWidth = Math.max(18, ringRadius * 0.12);
        const ringAlpha = alpha * (0.72 - i * 0.12);
        const ringGradient = ctx.createRadialGradient(
          cx,
          cy,
          Math.max(0, ringRadius - ringWidth),
          cx,
          cy,
          ringRadius + ringWidth,
        );
        ringGradient.addColorStop(0, "rgba(0,0,0,0)");
        ringGradient.addColorStop(0.4, mixColor(blueColor, altColor, 0.4 + i * 0.1, ringAlpha));
        ringGradient.addColorStop(0.65, mixColor(altColor, blueColor, 0.4, ringAlpha * 0.6));
        ringGradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ringGradient;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }

      const wispCount = 4;
      for (let i = 0; i < wispCount; i += 1) {
        const angle = timeSec * 0.7 + i * (Math.PI * 2 / wispCount);
        const offset = safeRadius * (0.12 + 0.05 * Math.sin(timeSec * 2 + i));
        const ox = Math.cos(angle) * offset;
        const oy = Math.sin(angle) * offset;
        const wispRadius = safeRadius * (0.55 + 0.08 * Math.cos(timeSec * 1.4 + i));
        const wispAlpha = alpha * 0.26;
        const wispGradient = ctx.createRadialGradient(
          cx + ox,
          cy + oy,
          wispRadius * 0.2,
          cx + ox,
          cy + oy,
          wispRadius,
        );
        wispGradient.addColorStop(0, mixColor(blueColor, altColor, 0.5, wispAlpha));
        wispGradient.addColorStop(0.6, mixColor(altColor, blueColor, 0.35, wispAlpha * 0.6));
        wispGradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = wispGradient;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }

      const impact = Math.exp(-Math.pow((progress - 0.68) / 0.12, 2));
      if (impact > 0.06) {
        const impactRadius = maxR * 0.98;
        const impactWidth = Math.max(22, maxR * 0.05);
        const impactGradient = ctx.createRadialGradient(
          cx,
          cy,
          Math.max(0, impactRadius - impactWidth),
          cx,
          cy,
          Math.max(0.001, impactRadius + impactWidth),
        );
        impactGradient.addColorStop(0, "rgba(0,0,0,0)");
        impactGradient.addColorStop(0.45, mixColor(blueColor, altColor, 0.6, impact * 0.28));
        impactGradient.addColorStop(0.7, mixColor(altColor, blueColor, 0.6, impact * 0.14));
        impactGradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = impactGradient;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }

      ctx.globalCompositeOperation = "source-over";

      if (progress < 1) {
        raf = requestAnimationFrame(draw);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setVisible(false);
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, reduceMotion, SPLAT_FORCE, SPLAT_RADIUS, BACK_COLOR, TRANSPARENT, COLOR_UPDATE_SPEED, DURATION, onComplete]);

  return (
    <div className={styles.splashRoot} data-active={visible ? "true" : "false"} aria-hidden>
      <div className={styles.splashShade} />
      <canvas ref={canvasRef} className={styles.splashCanvas} />
    </div>
  );
};
