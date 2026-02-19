"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import Galaxy from "@/components/ui/Galaxy";
import { NadhEnergyModel } from "@/components/home/NadhEnergyModel";
import styles from "./nadh-router.module.css";

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

type FactNode = {
  id: string;
  title: string;
  summary: string;
  angle: number;
  ring: number;
  duration: number;
  delay: number;
  reverse: boolean;
};

type NadhRouterProps = { wide?: boolean; disableReveal?: boolean };

const NADH_FACTS: FactNode[] = [
  {
    id: "transport",
    title: "Перенос электронов",
    summary: "NADH участвует в переносе электронов в дыхательной цепи митохондрий.",
    angle: -80,
    ring: 0.98,
    duration: 43,
    delay: -5,
    reverse: false,
  },
  {
    id: "atp",
    title: "Синтез АТФ",
    summary: "Через дыхательную цепь поддерживается выработка АТФ - базовой клеточной энергии.",
    angle: -18,
    ring: 1.05,
    duration: 39,
    delay: -11,
    reverse: true,
  },
  {
    id: "redox",
    title: "Баланс NAD+/NADH",
    summary: "Соотношение NAD+ и NADH связано с окислительно-восстановительными процессами клетки.",
    angle: 36,
    ring: 1.02,
    duration: 46,
    delay: -15,
    reverse: false,
  },
  {
    id: "mitochondria",
    title: "Митохондриальный статус",
    summary: "NADH рассматривают как важный компонент оценки клеточного энергостатуса.",
    angle: 94,
    ring: 0.93,
    duration: 41,
    delay: -7,
    reverse: true,
  },
  {
    id: "recovery",
    title: "Восстановление",
    summary: "Энергетические механизмы с участием NADH связывают с переносимостью нагрузки и восстановлением.",
    angle: 154,
    ring: 1.08,
    duration: 44,
    delay: -19,
    reverse: false,
  },
  {
    id: "monitoring",
    title: "Динамика до/после",
    summary: "В протоколах важно отслеживать изменения в динамике и переносимость процедур.",
    angle: 214,
    ring: 1.04,
    duration: 40,
    delay: -9,
    reverse: true,
  },
  {
    id: "protocol",
    title: "Протокольный подход",
    summary: "NADH рассматривается в связке с форматами водородной терапии и индивидуальной маршрутизацией.",
    angle: 274,
    ring: 0.95,
    duration: 42,
    delay: -13,
    reverse: false,
  },
];

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const NadhRouter = ({ wide = false, disableReveal = false }: NadhRouterProps) => {
  const reduceMotion = useReducedMotion();
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const bubbleLayerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [orbitSize, setOrbitSize] = useState({ width: 0, height: 0 });
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const bubbleElementsRef = useRef<Map<string, HTMLSpanElement>>(new Map());
  const sizeRef = useRef({ width: 0, height: 0 });
  const bubbleOffsetRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const rafRef = useRef<number | null>(null);
  const [activeFactId, setActiveFactId] = useState<string | null>(NADH_FACTS[0]?.id ?? null);

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

  const facts = useMemo(() => {
    if (isMobile) return NADH_FACTS.slice(0, 6);
    return NADH_FACTS;
  }, [isMobile]);

  const activeFact = useMemo(
    () => facts.find((item) => item.id === activeFactId) ?? facts[0] ?? null,
    [activeFactId, facts],
  );

  const factBaseRadius = useMemo(() => {
    const width = orbitSize.width || 640;
    const height = orbitSize.height || 520;
    const minSide = Math.min(width, height);
    const maxSide = Math.max(width, height);
    const ratio = isMobile ? 0.3 : 0.35;
    const fallback = isMobile ? 138 : 186;
    return Math.max(fallback, Math.min(maxSide * 0.34, minSide * (1 + ratio)));
  }, [isMobile, orbitSize.height, orbitSize.width]);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    if (!facts.length) {
      setActiveFactId(null);
      return;
    }
    setActiveFactId((prev) => (prev && facts.some((item) => item.id === prev) ? prev : facts[0].id));
  }, [facts]);

  useEffect(() => {
    sizeRef.current = orbitSize;
  }, [orbitSize]);

  useEffect(() => {
    bubbleOffsetRef.current.clear();
  }, [bubbles]);

  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setOrbitSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    wide ? "full-bleed px-6 sm:px-10 lg:px-14 py-8 sm:py-10" : "p-6 sm:p-10",
  );

  const orbitCardClasses = "relative overflow-hidden border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 p-4 sm:p-6";

  const orbitClasses = clsx(
    "relative z-10 overflow-hidden rounded-[22px] border border-[color:var(--glass-stroke)] bg-black",
    wide ? "min-h-[520px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[700px]" : "min-h-[520px]",
  );

  const Wrapper = disableReveal ? "div" : Reveal;

  return (
    <section id="nadh" className={sectionClasses}>
      <div className="pointer-events-none absolute inset-[-28px] -z-10 rounded-[42px] bg-[radial-gradient(circle_at_40%_28%,rgba(47,183,255,0.2),transparent_55%),radial-gradient(circle_at_72%_72%,rgba(65,224,196,0.16),transparent_55%)] blur-[76px] opacity-80 animate-[softGlow_5.4s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-b from-[rgba(90,160,220,0.18)] via-transparent to-[rgba(10,20,40,0.2)]" />

      <Wrapper className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <GlassBadge tone="mint">NADH</GlassBadge>
        </div>

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

        <GlassCard className={orbitCardClasses}>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_24%_24%,rgba(47,183,255,0.14),transparent_36%),radial-gradient(circle_at_82%_60%,rgba(65,224,196,0.12),transparent_32%)] blur-[38px]" />

          <div ref={bubbleLayerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {(() => {
              const width = orbitSize.width || 640;
              const height = orbitSize.height || 520;

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
            className={orbitClasses}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetMouse}
          >
            {!reduceMotion && (
              <div className="absolute inset-0 z-0">
                <Galaxy
                  mouseRepulsion
                  mouseInteraction={!isMobile}
                  mouseTarget="window"
                  density={1.35}
                  glowIntensity={0.38}
                  saturation={0}
                  hueShift={200}
                  twinkleIntensity={0.4}
                  rotationSpeed={0.1}
                  repulsionStrength={2.4}
                  autoCenterRepulsion={0}
                  starSpeed={0.6}
                  speed={1.05}
                  transparent={false}
                  disableAnimation={false}
                  className="h-full w-full"
                />
              </div>
            )}

            <div className={clsx(styles.factsLayer, reduceMotion && styles.noMotion)}>
              <div className={styles.factHint} aria-hidden>
                Нажмите на факт
              </div>
              {facts.map((fact) => {
                const motionStyle = {
                  "--fact-duration": `${fact.duration}s`,
                  "--fact-delay": `${fact.delay}s`,
                } as CSSProperties;
                const radius = Math.round(factBaseRadius * fact.ring);
                const isActive = activeFact?.id === fact.id;
                return (
                  <div
                    key={fact.id}
                    className={fact.reverse ? styles.factOrbitReverse : styles.factOrbit}
                    style={motionStyle}
                  >
                    <div
                      className={styles.factAnchor}
                      style={{ transform: `translate(-50%, -50%) rotate(${fact.angle}deg) translateX(${radius}px)` }}
                    >
                      <div className={styles.factCounterBase} style={{ transform: `rotate(${-fact.angle}deg)` }}>
                        <div className={fact.reverse ? styles.factCounterReverse : styles.factCounterForward} style={motionStyle}>
                          <button
                            type="button"
                            className={clsx(styles.factButton, isActive && styles.factButtonActive)}
                            style={{ animationDelay: `${Math.abs(fact.delay)}s` }}
                            onClick={() => setActiveFactId((current) => (current === fact.id ? null : fact.id))}
                            aria-expanded={isActive}
                            aria-controls={`nadh-fact-${fact.id}`}
                          >
                            <span className={styles.factDot} aria-hidden />
                            <span className={styles.factLabel}>{fact.title}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {activeFact && (
                <div id={`nadh-fact-${activeFact.id}`} className={styles.factDetails}>
                  <div className={styles.factDetailsHead}>
                    <h4 className={styles.factDetailsTitle}>{activeFact.title}</h4>
                    <button
                      type="button"
                      className={styles.factClose}
                      onClick={() => setActiveFactId(null)}
                      aria-label="Скрыть факт"
                    >
                      ×
                    </button>
                  </div>
                  <p className={styles.factDetailsBody}>{activeFact.summary}</p>
                </div>
              )}
            </div>

            <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center">
              <NadhEnergyModel />
            </div>
          </div>
        </GlassCard>

        
      </Wrapper>
    </section>
  );
};

export default NadhRouter;
