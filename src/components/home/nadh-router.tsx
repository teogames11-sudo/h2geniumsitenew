"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { useOrbit } from "@/hooks/useOrbit";
import type { OrbitPosition } from "@/hooks/useOrbit";

const orbitItems = [
  {
    title: "NADH",
    desc: "Кратко о подходе HYDROGENIUM NADH+ и роли водорода.",
    href: "#nadh",
  },
  {
    title: "Кабинеты",
    desc: "Форматы ингаляции, капсул, бальнео и IV-решений.",
    href: "/application",
  },
  {
    title: "Сертификаты",
    desc: "Разрешительные документы и РУ на оборудование HYDROGENIUM.",
    href: "/documents",
  },
  {
    title: "Контакты",
    desc: "Заявка и консультация по внедрению решений.",
    href: "#contacts",
  },
];

type Bubble = {
  id: string;
  baseX: number;
  baseY: number;
  radius: number;
  floatSpeed: number;
  drift: number;
  influence: number;
  influenceStrength: number;
  polarity: number;
  opacity: number;
  blur: number;
};
type NadhRouterProps = { wide?: boolean };

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const NadhRouter = ({ wide = false }: NadhRouterProps) => {
  const reduceMotion = useReducedMotion();
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const bubbleLayerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const bubbleElementsRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const sizeRef = useRef({ width: 0, height: 0 });
  const bubbleOffsetRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const rafRef = useRef<number | null>(null);
  const touchPauseRef = useRef<number | null>(null);
  const phases = useMemo(() => [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2], []);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const wireRefs = useRef<Array<SVGPathElement | null>>([]);
  const positionsRef = useRef<OrbitPosition[]>(Array.from({ length: orbitItems.length }, () => ({ x: 0, y: 0 })));

  const bubbles = useMemo<Bubble[]>(() => {
    const count = isMobile ? 20 : 28;
    const rnd = mulberry32(isMobile ? 20250106 : 20250105);
    return Array.from({ length: count }).map((_, idx) => ({
      id: `bubble-${idx}`,
      baseX: rnd() * 96 + 2,
      baseY: rnd() * 84 + 6,
      radius: rnd() * 8 + 10,
      floatSpeed: rnd() * 0.6 + 0.45,
      drift: rnd() * 18 + 12,
      influence: rnd() * 90 + 140,
      influenceStrength: rnd() * 18 + 12,
      polarity: rnd() > 0.5 ? 1 : -1,
      opacity: rnd() * 0.2 + 0.28,
      blur: rnd() * 1.5 + 0.8,
    }));
  }, [isMobile]);

  const { center, size, paused, setPaused } = useOrbit({
    count: orbitItems.length,
    containerRef: orbitRef,
    duration: 36,
    rxFactor: 0.42,
    ryFactor: 0.28,
    minRx: 260,
    maxRx: 360,
    minRy: 170,
    maxRy: 240,
    phases,
    disableAnimation: reduceMotion || isMobile,
    onUpdate: (positions, meta) => {
      positionsRef.current = positions;
      positions.forEach((pos, idx) => {
        const el = linkRefs.current[idx];
        if (el) {
          el.style.left = `${pos.x}px`;
          el.style.top = `${pos.y}px`;
          el.style.transform = "translate(-50%, -50%)";
        }
        const wire = wireRefs.current[idx];
        if (wire) {
          wire.setAttribute("d", `M ${meta.center.cx} ${meta.center.cy} L ${pos.x} ${pos.y}`);
        }
      });
    },
  });

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    bubbleOffsetRef.current.clear();
  }, [bubbles]);

  useEffect(
    () => () => {
      if (touchPauseRef.current) clearTimeout(touchPauseRef.current);
    },
    [],
  );

  useEffect(() => {
    const layer = bubbleLayerRef.current;
    if (!layer) return;

    const interval = 1000 / (reduceMotion ? 10 : 15);
    let last = performance.now();

    const runFrame = (ts: number) => {
      if (ts - last >= interval) {
        last = ts;
        const time = ts / 1000;
        const fallbackWidth = layer.clientWidth || 640;
        const fallbackHeight = layer.clientHeight || 520;
        const { width, height } =
          sizeRef.current.width > 0 ? sizeRef.current : { width: fallbackWidth, height: fallbackHeight };
        const cursor =
          !isMobile && !reduceMotion
            ? { x: mouseRef.current.x * width, y: mouseRef.current.y * height }
            : { x: width / 2, y: height / 2 };

        bubbles.forEach((bubble, idx) => {
          const el = bubbleElementsRef.current.get(bubble.id);
          if (!el) return;
          const baseX = (bubble.baseX / 100) * width;
          const baseY = (bubble.baseY / 100) * height;
          const floatX = Math.sin(time * bubble.floatSpeed + idx * 0.6) * bubble.drift;
          const floatY = Math.cos(time * bubble.floatSpeed * 0.9 + idx * 0.4) * bubble.drift * 0.6;
          const dx = cursor.x - baseX;
          const dy = cursor.y - baseY;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const influence = Math.max(0, 1 - dist / bubble.influence);
          const targetOffset = {
            x: (dx / dist) * influence * bubble.influenceStrength * bubble.polarity,
            y: (dy / dist) * influence * bubble.influenceStrength * bubble.polarity,
          };
          const prev = bubbleOffsetRef.current.get(bubble.id) ?? { x: 0, y: 0 };
          const lerp = reduceMotion || isMobile ? 0.1 : 0.18;
          const next = {
            x: prev.x + (targetOffset.x - prev.x) * lerp,
            y: prev.y + (targetOffset.y - prev.y) * lerp,
          };
          bubbleOffsetRef.current.set(bubble.id, next);
          el.style.transform = `translate(${baseX + floatX + next.x}px, ${baseY + floatY + next.y}px) translate(-50%, -50%)`;
        });
      }
      rafRef.current = requestAnimationFrame(runFrame);
    };

    runFrame(performance.now());

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bubbles, isMobile, reduceMotion]);

  const handlePause = (value: boolean) => {
    if (reduceMotion || isMobile) return;
    if (!value && touchPauseRef.current) {
      clearTimeout(touchPauseRef.current);
      touchPauseRef.current = null;
    }
    setPaused(value);
  };

  const pauseForTouch = () => {
    if (reduceMotion || isMobile) return;
    handlePause(true);
    if (touchPauseRef.current) clearTimeout(touchPauseRef.current);
    touchPauseRef.current = window.setTimeout(() => handlePause(false), 2200);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!orbitRef.current) return;
    const rect = orbitRef.current.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const ny = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    mouseRef.current = { x: nx, y: ny };
  };

  const resetMouse = () => {
    mouseRef.current = { x: 0.5, y: 0.5 };
  };

  const sectionClasses = clsx(
    "relative mt-12 space-y-8 overflow-visible rounded-[28px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 shadow-[var(--shadow-2),0_28px_84px_-32px_rgba(18,110,235,0.42)] backdrop-blur-2xl",
    wide ? "mx-[-18px] sm:mx-[-32px] lg:mx-[-56px] px-6 sm:px-10 lg:px-14 py-8 sm:py-10" : "p-6 sm:p-10",
  );

  return (
    <section id="nadh" className={sectionClasses}>
      <div className="pointer-events-none absolute inset-[-28px] -z-10 rounded-[42px] bg-[radial-gradient(circle_at_40%_28%,rgba(47,183,255,0.2),transparent_55%),radial-gradient(circle_at_72%_72%,rgba(65,224,196,0.16),transparent_55%)] blur-[76px] opacity-80 animate-[softGlow_5.4s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-b from-[rgba(90,160,220,0.18)] via-transparent to-[rgba(10,20,40,0.2)]" />

      <Reveal className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <GlassBadge tone="mint">NADH</GlassBadge>
        </div>

        <GlassCard className="relative overflow-hidden border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 p-4 sm:p-6">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_24%_24%,rgba(47,183,255,0.14),transparent_36%),radial-gradient(circle_at_82%_60%,rgba(65,224,196,0.12),transparent_32%)] blur-[38px]" />

          <div ref={bubbleLayerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {(() => {
              const width = size.width || 640;
              const height = size.height || 520;

              return bubbles.map((bubble) => {
                const baseX = (bubble.baseX / 100) * width;
                const baseY = (bubble.baseY / 100) * height;
                return (
                  <span
                    key={bubble.id}
                    data-bubble-id={bubble.id}
                    ref={(node) => {
                      const map = bubbleElementsRef.current;
                      if (!node) {
                        map.delete(bubble.id);
                      } else {
                        map.set(bubble.id, node);
                      }
                    }}
                    className="pointer-events-none absolute rounded-full bg-[color:var(--accent-cyan)]/70"
                    style={{
                      width: bubble.radius * 2,
                      height: bubble.radius * 2,
                      left: baseX,
                      top: baseY,
                      opacity: bubble.opacity,
                      filter: `blur(${bubble.blur}px) drop-shadow(0 0 12px rgba(120,210,255,0.28))`,
                      transform: "translate(-50%, -50%)",
                    }}
                    aria-hidden
                  />
                );
              });
            })()}
          </div>

            <div
              ref={orbitRef}
              className="relative z-10 min-h-[520px] overflow-visible rounded-[22px] border border-[color:var(--glass-stroke)] bg-gradient-to-br from-[rgba(10,20,40,0.85)] via-[rgba(10,20,40,0.55)] to-[color:var(--accent-blue)]/12"
              onMouseMove={handleMouseMove}
              onMouseLeave={resetMouse}
            >
            <div className="pointer-events-none absolute inset-0">
              {/* bubble layer is above */}
            </div>

            {!isMobile && size.width > 0 && size.height > 0 && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox={`0 0 ${size.width} ${size.height}`}
                aria-hidden
              >
                <defs>
                  <linearGradient id="nadhWire" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2FB7FF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#41E0C4" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
                {orbitItems.map((_, idx) => {
                  const pos = positionsRef.current[idx] ?? { x: center.cx, y: center.cy };
                  const d = `M ${center.cx} ${center.cy} L ${pos.x} ${pos.y}`;
                  return (
                    <path
                      key={`wire-${idx}`}
                      ref={(node) => {
                        wireRefs.current[idx] = node;
                      }}
                      d={d}
                      stroke="url(#nadhWire)"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      fill="none"
                      style={{
                        animation: "energyDash 7s linear infinite",
                        animationPlayState: paused ? "paused" : "running",
                        filter: "drop-shadow(0 0 10px rgba(47,183,255,0.24))",
                        willChange: "transform, opacity",
                      }}
                      opacity={0.9}
                    />
                  );
                })}
              </svg>
            )}

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 shadow-[0_18px_44px_-18px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
              {!reduceMotion && (
                <>
                  <span className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(18,110,235,0.22),transparent_65%)] blur-[52px]" />
                  <span className="absolute inset-[-32%] rounded-full border border-[color:var(--glass-stroke)]" />
                </>
              )}
              <div className="absolute inset-6 rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.38)]" />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">молекула</div>
                  <div className="text-3xl font-semibold text-[color:var(--text)] drop-shadow-[0_10px_26px_rgba(18,110,235,0.35)]">
                    NADH
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[color:var(--muted)]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[color:var(--accent-blue)]/60 shadow-[0_0_0_8px_rgba(18,110,235,0.12)]" />
                    <span>коэнзим клеточного дыхания</span>
                  </div>
                </div>
              </div>
            </div>

            {!isMobile &&
              orbitItems.map((item, idx) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={(node) => {
                      linkRefs.current[idx] = node;
                    }}
                    className="absolute pointer-events-auto"
                    style={{
                      left: center.cx,
                      top: center.cy,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseEnter={() => handlePause(true)}
                    onMouseLeave={() => handlePause(false)}
                    onFocus={() => handlePause(true)}
                    onBlur={() => handlePause(false)}
                    onTouchStart={pauseForTouch}
                    aria-label={item.title}
                  >
                    <GlassCard className="w-[240px] max-w-[260px] rounded-full border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 px-5 py-3 text-left shadow-[0_22px_52px_-22px_rgba(18,110,235,0.45)] transition hover:-translate-y-[1px]">
                      <div className="text-sm font-semibold text-[color:var(--text)]">{item.title}</div>
                      <p className="text-[11px] leading-snug text-[color:var(--muted)]">{item.desc}</p>
                    </GlassCard>
                  </Link>
                );
              })}
          </div>
        </GlassCard>

        {isMobile && (
          <div className="grid gap-3">
            {orbitItems.map((item) => (
              <Link key={item.href} href={item.href} aria-label={item.title}>
                <GlassCard className="rounded-2xl border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 p-4 shadow-[var(--shadow-1)]">
                  <div className="text-base font-semibold text-[color:var(--text)]">{item.title}</div>
                  <p className="text-sm leading-snug text-[color:var(--muted)]">{item.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}

        <GlassCard className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 p-5 shadow-[var(--shadow-1)]">
          <div id="formats" className="sr-only" aria-hidden="true" />
          <h3 className="text-xl font-semibold text-[color:var(--text)]">NADH: что это и почему это важно</h3>
          <p className="text-[color:var(--muted)]">
            NADH (никотинамид-аденин-динуклеотид, восстановленная форма) — ключевой кофермент энергетического обмена. Он
            переносит электроны в митохондриях и участвует в процессах, которые приводят к синтезу АТФ — универсального
            “топлива” клетки. Баланс NAD+/NADH связан с тем, как организм управляет окислительно-восстановительными
            реакциями, устойчивостью к нагрузке и скоростью восстановления.
          </p>
          <p className="text-[color:var(--muted)]">
            В наших протоколах мы опираемся на понимание роли NAD+/NADH как на основу для корректной логики восстановления:
            сочетание водородных форматов, мониторинга состояния и регламентов проведения процедур. Такой подход помогает
            выстраивать последовательность шагов, фиксировать динамику “до/после” и поддерживать воспроизводимость
            результатов в клинических и оздоровительных сценариях.
          </p>
          <p className="text-xs text-[color:var(--muted)]">
            Информация представлена в ознакомительных целях и не заменяет консультацию врача. Форматы и протоколы
            подбираются специалистом индивидуально.
          </p>
        </GlassCard>
      </Reveal>
    </section>
  );
};

