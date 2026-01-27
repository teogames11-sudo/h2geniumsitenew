"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Bubble = {
  id: string;
  x: number; // percent of viewport width
  y: number; // percent of viewport height
  size: number; // px
  blur: number; // px
  opacity: number;
  duration: number; // s
  delay: number; // s
  driftX: number; // px
  driftY: number; // px
  parallax: number; // px
  glow: number;
  mix: "screen" | "soft-light";
  influence: number;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const BubblesBackground = () => {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const offsetsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string; addEventListener?: (t: string, cb: () => void) => void };
      deviceMemory?: number;
    };
    const connection = nav.connection;
    const update = () => {
      const effectiveType = connection?.effectiveType ?? "";
      const saveData = connection?.saveData === true;
      const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
      setLowPower(saveData || lowMemory || effectiveType.includes("2g"));
    };
    update();
    connection?.addEventListener?.("change", update);
    return () => connection?.removeEventListener?.("change", update);
  }, []);

  const motionEnabled = !prefersReduced && !lowPower;

  const bubbles = useMemo<Bubble[]>(() => {
    const baseCount = isMobile ? 12 : 20;
    const density = lowPower ? 0.6 : prefersReduced ? 0.8 : 1;
    const count = Math.max(6, Math.round(baseCount * density));
    const extraRight = isMobile ? 2 : 4;
    const extraCount = Math.max(1, Math.round(extraRight * (lowPower ? 0.6 : 1)));
    const rnd = mulberry32(isMobile ? 20250130 : 20250129);
    const motionScale = motionEnabled ? 1 : 0.55;
    const parallaxScale = motionEnabled ? 1 : 0;

    const makeBubble = (idx: number, forcedRight = false, boosted = false): Bubble => {
      const strong = boosted || rnd() > 0.62;
      const size = (isMobile ? 130 : 200) + rnd() * (isMobile ? 190 : 280);
      const x = forcedRight ? 65 + rnd() * 35 : rnd() * 100;
      const durationBase = (isMobile ? 11 : 12) + rnd() * (isMobile ? 8 : 10);
      return {
        id: `bg-bubble-${idx}`,
        x,
        y: rnd() * 100,
        size: size * (lowPower ? 0.9 : 1),
        blur: ((isMobile ? 14 : 18) + rnd() * (isMobile ? 10 : 16)) * (lowPower ? 0.9 : 1),
        opacity: strong ? 0.52 + rnd() * 0.18 : 0.32 + rnd() * 0.16,
        duration: durationBase * (motionEnabled ? 1 : 1.25),
        delay: rnd() * 8,
        driftX: (52 + rnd() * (isMobile ? 52 : 96)) * motionScale,
        driftY: (108 + rnd() * (isMobile ? 110 : 160)) * motionScale,
        parallax: ((isMobile ? 16 : 24) + rnd() * (isMobile ? 18 : 32)) * parallaxScale,
        glow: (strong ? 70 + rnd() * 28 : 38 + rnd() * 22) * (lowPower ? 0.8 : 1),
        mix: rnd() > 0.1 ? "screen" : "soft-light",
        influence: (isMobile ? 230 : 340) + rnd() * (isMobile ? 120 : 220),
      };
    };

    const list: Bubble[] = [];
    for (let i = 0; i < count; i++) {
      list.push(makeBubble(i));
    }
    for (let i = 0; i < extraCount; i++) {
      list.push(makeBubble(count + i, true, true));
    }
    return list;
  }, [isMobile, lowPower, motionEnabled, prefersReduced]);

  useEffect(() => {
    bubbleRefs.current.clear();
    offsetsRef.current.clear();
  }, [bubbles]);

  useEffect(() => {
    if (!motionEnabled) return;
    let lastMove = 0;
    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastMove < 33) return;
      lastMove = now;
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);
      mouseRef.current = {
        x: event.clientX / vw,
        y: event.clientY / vh,
      };
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [motionEnabled]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !motionEnabled) return;

    const interval = 1000 / (lowPower ? 12 : 24);
    let last = performance.now();

    const tick = (ts: number) => {
      if (ts - last >= interval) {
        last = ts;
        const vw = Math.max(1, window.innerWidth);
        const vh = Math.max(1, window.innerHeight);
        const cursor = mouseRef.current;

        bubbles.forEach((bubble, idx) => {
          const el = bubbleRefs.current.get(bubble.id);
          if (!el) return;
          const baseX = (bubble.x / 100) * vw;
          const baseY = (bubble.y / 100) * vh;
          const dx = cursor.x * vw - baseX;
          const dy = cursor.y * vh - baseY;
          const dist = Math.max(12, Math.hypot(dx, dy));
          const influence = Math.max(0, 1 - dist / bubble.influence);
          const targetOffset = {
            x: (dx / dist) * influence * bubble.parallax * 0.8,
            y: (dy / dist) * influence * bubble.parallax * 0.8,
          };
          const prev = offsetsRef.current.get(bubble.id) ?? { x: 0, y: 0 };
          const lerp = prefersReduced ? 0.06 : 0.14;
          const next = {
            x: prev.x + (targetOffset.x - prev.x) * lerp,
            y: prev.y + (targetOffset.y - prev.y) * lerp,
          };
          offsetsRef.current.set(bubble.id, next);
          el.style.setProperty("--parallax-x", `${next.x.toFixed(2)}px`);
          el.style.setProperty("--parallax-y", `${next.y.toFixed(2)}px`);
        });
      }
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bubbles, lowPower, motionEnabled]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={
        process.env.NODE_ENV === "development"
          ? { outline: "1px dashed rgba(0,0,0,0.08)", fontSize: 10, color: "#126eeb", padding: 4 }
          : undefined
      }
    >
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          ref={(node) => {
            if (!node) {
              bubbleRefs.current.delete(bubble.id);
              return;
            }
            bubbleRefs.current.set(bubble.id, node);
          }}
          className="pointer-events-none absolute rounded-full bg-bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: 0,
            top: 0,
            opacity: bubble.opacity,
            filter: `blur(${bubble.blur}px) saturate(1.05)`,
            mixBlendMode: bubble.mix,
            background:
              "radial-gradient(circle at 28% 26%, rgba(210,245,255,0.85), rgba(120,200,255,0.4) 32%, rgba(40,110,200,0.16) 58%, transparent 72%)," +
              "radial-gradient(circle at 70% 74%, rgba(120,210,255,0.68), rgba(40,120,220,0.26) 38%, rgba(16,70,160,0.16) 62%, transparent 82%)," +
              "radial-gradient(circle at 52% 52%, rgba(40,110,200,0.5), rgba(20,60,130,0.22) 55%, transparent 78%)",
            boxShadow:
              `inset 0 0 ${18 + bubble.glow * 0.2}px rgba(190, 240, 255, 0.45),` +
              ` inset 0 -${20 + bubble.glow * 0.18}px ${34 + bubble.glow * 0.28}px rgba(8, 26, 60, 0.45),` +
              ` 0 18px 40px -24px rgba(6, 14, 30, 0.55),` +
              ` 0 0 ${48 + bubble.glow}px ${18 + bubble.glow * 0.3}px rgba(30, 110, 235, 0.28)`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `-${bubble.delay}s`,
            willChange: "transform, opacity, filter",
            "--base-x": `${bubble.x}vw`,
            "--base-y": `${bubble.y}vh`,
            "--drift-x": `${bubble.driftX}px`,
            "--drift-y": `${bubble.driftY}px`,
            "--parallax-x": "0px",
            "--parallax-y": "0px",
          }}
        />
      ))}
    </div>
  );
};
