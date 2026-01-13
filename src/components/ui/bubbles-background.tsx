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

  const bubbles = useMemo<Bubble[]>(() => {
    const baseCount = isMobile ? 14 : 24;
    const extraRight = isMobile ? 3 : 5;
    const rnd = mulberry32(isMobile ? 20250130 : 20250129);

    const makeBubble = (idx: number, forcedRight = false, boosted = false): Bubble => {
      const strong = boosted || rnd() > 0.62;
      const size = (isMobile ? 110 : 170) + rnd() * (isMobile ? 170 : 240);
      const x = forcedRight ? 65 + rnd() * 35 : rnd() * 100;
      return {
        id: `bg-bubble-${idx}`,
        x,
        y: rnd() * 100,
        size,
        blur: (isMobile ? 8 : 10) + rnd() * (isMobile ? 7 : 10),
        opacity: strong ? 0.82 + rnd() * 0.14 : 0.58 + rnd() * 0.18,
        duration: (isMobile ? 11 : 12) + rnd() * (isMobile ? 8 : 10),
        delay: rnd() * 8,
        driftX: 62 + rnd() * (isMobile ? 56 : 104),
        driftY: 118 + rnd() * (isMobile ? 120 : 168),
        parallax: (isMobile ? 16 : 24) + rnd() * (isMobile ? 18 : 32),
        glow: strong ? 52 + rnd() * 28 : 28 + rnd() * 18,
        mix: rnd() > 0.1 ? "screen" : "soft-light",
        influence: (isMobile ? 230 : 340) + rnd() * (isMobile ? 120 : 220),
      };
    };

    const list: Bubble[] = [];
    for (let i = 0; i < baseCount; i++) {
      list.push(makeBubble(i));
    }
    for (let i = 0; i < extraRight; i++) {
      list.push(makeBubble(baseCount + i, true, true));
    }
    return list;
  }, [isMobile]);

  useEffect(() => {
    bubbleRefs.current.clear();
    offsetsRef.current.clear();
  }, [bubbles]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const interval = 1000 / (prefersReduced ? 10 : 24);
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
  }, [bubbles, prefersReduced]);

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
            filter: `blur(${bubble.blur}px)`,
            mixBlendMode: bubble.mix,
            background:
              "radial-gradient(circle at 28% 26%, rgba(140,210,255,0.75), rgba(50,130,220,0.14) 36%, transparent 60%)," +
              "radial-gradient(circle at 70% 72%, rgba(120,210,255,0.72), rgba(40,120,220,0.28) 38%, rgba(18,90,190,0.12) 64%, transparent 82%)," +
              "radial-gradient(circle at 46% 42%, rgba(80,160,255,0.55), rgba(30,90,190,0.2) 56%, transparent 78%)",
            boxShadow: `0 0 0 10px rgba(170, 225, 255, 0.2), 0 0 ${46 + bubble.glow}px ${18 + bubble.glow * 0.34}px rgba(30, 110, 235, 0.34)`,
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
