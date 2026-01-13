"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type EffectItem = {
  title: string;
  description: string;
};

type CardMeta = EffectItem & {
  width: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
};

type Vec2 = { x: number; y: number };

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const EffectsFloatingCloud = ({ items }: { items: EffectItem[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const positionsRef = useRef<Vec2[]>([]);
  const velocitiesRef = useRef<Vec2[]>([]);
  const radiiRef = useRef<number[]>([]);
  const cardsRef = useRef<CardMeta[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const aliveRef = useRef(false);
  const lastTimeRef = useRef(0);
  const reduceRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const cards = useMemo<CardMeta[]>(() => {
    const rnd = mulberry32(20250206 + items.length);
    return items.map((item) => ({
      ...item,
      width: 260 + rnd() * 110,
      phaseX: rnd() * Math.PI * 2,
      phaseY: rnd() * Math.PI * 2,
      ampX: 10 + rnd() * 16,
      ampY: 10 + rnd() * 16,
    }));
  }, [items]);

  const ensureArrays = (count = cardsRef.current.length) => {
    if (positionsRef.current.length !== count) {
      positionsRef.current = Array.from({ length: count }, () => ({ x: 0, y: 0 }));
    }
    if (velocitiesRef.current.length !== count) {
      velocitiesRef.current = Array.from({ length: count }, () => ({ x: 0, y: 0 }));
    }
    if (radiiRef.current.length !== count) {
      radiiRef.current = Array.from({ length: count }, () => 120);
    }
  };

  const applyTransforms = () => {
    positionsRef.current.forEach((pos, idx) => {
      const el = cardRefs.current[idx];
      if (el && pos) {
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
    });
  };

  useEffect(() => {
    cardsRef.current = cards;
    ensureArrays(cards.length);
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const padX = Math.min(200, Math.max(20, rect.width * 0.03));
    const padY = Math.min(220, Math.max(60, rect.height * 0.08));
    const cols = Math.max(3, Math.ceil(Math.sqrt(cards.length + 2)));
    const rows = Math.max(3, Math.ceil(cards.length / cols));
    const cellW = (rect.width - padX * 2) / cols;
    const cellH = (rect.height - padY * 2) / rows;
    const rnd = mulberry32(20250207 + cards.length);

    positionsRef.current = cards.map((_, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const jitterX = (rnd() - 0.5) * cellW * 0.35;
      const jitterY = (rnd() - 0.5) * cellH * 0.35;
      return {
        x: padX + col * cellW + cellW * 0.5 + jitterX,
        y: padY + row * cellH + cellH * 0.5 + jitterY,
      };
    });
    const velSeed = mulberry32(20250211 + cards.length);
    velocitiesRef.current = cards.map(() => {
      const ang = velSeed() * Math.PI * 2;
      const mag = 0.06 + velSeed() * 0.12;
      return { x: Math.cos(ang) * mag, y: Math.sin(ang) * mag };
    });

    cards.forEach((_, idx) => {
      const el = cardRefs.current[idx];
      const pos = positionsRef.current[idx];
      if (el) {
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
    });

    const measure = () => {
      radiiRef.current = cards.map((_, idx) => {
        const el = cardRefs.current[idx];
        if (!el) return 120;
        const box = el.getBoundingClientRect();
        const radius = 0.5 * Math.hypot(box.width, box.height);
        return radius || 120;
      });
      };

    measure();
    const resize = new ResizeObserver(measure);
    cardRefs.current.forEach((el) => el && resize.observe(el));
    applyTransforms();
    return () => resize.disconnect();
  }, [cards]);

  useEffect(() => {
    reduceRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    ensureArrays();
    aliveRef.current = true;
    lastTimeRef.current = performance.now();

    const tick = (ts: number) => {
      if (!aliveRef.current) return;
      const dt = Math.max(0.016, (ts - lastTimeRef.current) / 1000);
      lastTimeRef.current = ts;
      const container = containerRef.current;
      if (!container) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const padX = Math.min(180, Math.max(10, width * 0.025));
      const padY = Math.min(200, Math.max(50, height * 0.08));
      const maxSpeed = width < 768 ? 0.36 : 0.42;
      const minSpeedFloor = 0.06;
      const damping = 0.992;
      const wanderK = 0.045;
      const bounce = 0.7;
      const meta = cardsRef.current;

      if (!reduceRef.current) {
        meta.forEach((card, idx) => {
          const pos = positionsRef.current[idx];
          const vel = velocitiesRef.current[idx];
          const wanderX = Math.sin(ts * 0.00045 + card.phaseX) * card.ampX * wanderK;
          const wanderY = Math.cos(ts * 0.00035 + card.phaseY) * card.ampY * wanderK;
          vel.x += wanderX * dt * 60;
          vel.y += wanderY * dt * 60;

          if (pos.x < padX) {
            pos.x = padX;
            vel.x = Math.abs(vel.x) * bounce;
          } else if (pos.x > width - padX) {
            pos.x = width - padX;
            vel.x = -Math.abs(vel.x) * bounce;
          }
          if (pos.y < padY) {
            pos.y = padY;
            vel.y = Math.abs(vel.y) * bounce;
          } else if (pos.y > height - padY) {
            pos.y = height - padY;
            vel.y = -Math.abs(vel.y) * bounce;
          }

          vel.x *= damping;
          vel.y *= damping;

          const speed = Math.hypot(vel.x, vel.y);
          if (speed < minSpeedFloor) {
            const ang = card.phaseX + ts * 0.001 + idx * 0.37;
            vel.x += Math.cos(ang) * 0.06;
            vel.y += Math.sin(ang) * 0.06;
          }
          if (speed > maxSpeed) {
            const s = maxSpeed / speed;
            vel.x *= s;
            vel.y *= s;
          }

          pos.x = clamp(pos.x + vel.x, padX, width - padX);
          pos.y = clamp(pos.y + vel.y, padY, height - padY);
        });

        // позволяем карточкам пересекаться — коллизии отключены
      }

      positionsRef.current.forEach((pos, idx) => {
        const vel = velocitiesRef.current[idx];
        if (pos.x < padX) {
          pos.x = padX;
          vel.x = Math.abs(vel.x) * bounce;
        } else if (pos.x > width - padX) {
          pos.x = width - padX;
          vel.x = -Math.abs(vel.x) * bounce;
        }
        if (pos.y < padY) {
          pos.y = padY;
          vel.y = Math.abs(vel.y) * bounce;
        } else if (pos.y > height - padY) {
          pos.y = height - padY;
          vel.y = -Math.abs(vel.y) * bounce;
        }
      });

      cardsRef.current.forEach((_, idx) => {
        const el = cardRefs.current[idx];
        const pos = positionsRef.current[idx];
        if (el && pos) {
          el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate3d(-50%, -50%, 0)`;
        }
      });

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      aliveRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto mt-4 w-full max-w-[1600px] min-h-[920px] overflow-hidden rounded-[32px] sm:min-h-[780px] md:min-h-[680px]"
      aria-hidden={false}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,183,255,0.08),transparent_40%),radial-gradient(circle_at_80%_72%,rgba(65,224,196,0.08),transparent_42%)]" />
      {cards.map((card, idx) => (
        <div
          key={card.title}
          ref={(node) => {
            cardRefs.current[idx] = node;
          }}
          className="pointer-events-none absolute select-none rounded-[20px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/35 p-4 text-left shadow-[0_0_28px_rgba(59,130,246,0.18)] backdrop-blur-lg will-change-transform"
          style={{
            width: card.width,
          }}
        >
          <div className="text-lg font-semibold text-[color:var(--text)]">{card.title}</div>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{card.description}</p>
        </div>
      ))}
    </div>
  );
};
