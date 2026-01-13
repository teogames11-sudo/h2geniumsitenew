"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { useOrbit } from "@/hooks/useOrbit";

const SceneTree = dynamic(() => import("./SceneTree").then((mod) => mod.SceneTree), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

export const heroText = {
  title: "Водородные генераторы для профессиональной терапии",
  description: "Интегратор решений на базе молекулярного водорода для кабинетов, клиник и wellness-проектов.",
};

const orbitLinks = [
  { label: "Оставить заявку", href: "/contacts#form", hint: "Подберем конфигурацию кабинета и формат терапии." },
  { label: "Применение", href: "/application", hint: "Форматы кабинетов: ингаляции, капсулы, бальнео и IV." },
  { label: "Каталог", href: "/catalog", hint: "Оборудование и комплектации HYDROGENIUM." },
  { label: "NADH", href: "/nadh", hint: "Материалы о NADH и водородной терапии." },
];

const HeroTree3DComponent = () => {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [treeReady, setTreeReady] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [sceneMounted, setSceneMounted] = useState(false);
  const [sceneVisible, setSceneVisible] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 900);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSceneMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const buttonRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const positionsRef = useRef<{ x: number; y: number }[]>(Array.from({ length: orbitLinks.length }, () => ({ x: 0, y: 0 })));

  const { center, size, radii } = useOrbit({
    count: orbitLinks.length,
    containerRef: orbitRef,
    duration: 36,
    rxFactor: 0.42,
    ryFactor: 0.28,
    minRx: isMobile ? 180 : 260,
    maxRx: isMobile ? 260 : 460,
    minRy: isMobile ? 130 : 180,
    maxRy: isMobile ? 210 : 320,
    disableAnimation: reduceMotion,
    offsetX: isMobile ? 0 : 60,
    onUpdate: (positions, meta) => {
      positionsRef.current = positions;
      const cx = meta?.center.cx ?? center.cx;
      const cy = meta?.center.cy ?? center.cy;
      positions.forEach((pos, idx) => {
        const el = buttonRefs.current[idx];
        const lift = buttonsVisible ? 0 : 12;
        const x = pos.x || cx;
        const y = pos.y || cy;
        if (el) {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${lift}px, 0)`;
          el.style.willChange = "transform, opacity";
        }
      });
    },
  });

  const ready = size.width > 0 && size.height > 0;

  useEffect(() => {
    if (!treeReady) return;
    const ringTimer = window.setTimeout(() => setRingVisible(true), 220);
    const buttonTimer = window.setTimeout(() => setButtonsVisible(true), 420);
    const visibleTimer = requestAnimationFrame(() => setSceneVisible(true));
    return () => {
      window.clearTimeout(ringTimer);
      window.clearTimeout(buttonTimer);
      cancelAnimationFrame(visibleTimer);
    };
  }, [treeReady]);

  useEffect(() => {
    const fallback = window.setTimeout(() => {
      setRingVisible(true);
      setButtonsVisible(true);
      setSceneVisible(true);
    }, 2200);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    positionsRef.current.forEach((pos, idx) => {
      const el = buttonRefs.current[idx];
      const lift = buttonsVisible ? 0 : 12;
      const x = pos.x || center.cx;
      const y = pos.y || center.cy;
      if (el) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `translate3d(-50%, -50%, 0) translate3d(0, ${lift}px, 0)`;
        el.style.willChange = "transform, opacity";
      }
    });
  }, [buttonsVisible, center.cx, center.cy]);

  return (
    <section
      className="full-bleed relative overflow-visible pb-14 pt-16 sm:pt-20 lg:pt-24"
      aria-label="HYDROGENIUM hero section"
    >
      <div ref={shellRef} className="page-shell relative z-10 min-h-[680px] space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.05fr] lg:items-center">
          <Reveal className="space-y-7">
            <GlassBadge tone="accent">HYDROGENIUM</GlassBadge>
            <div className="space-y-4">
              <h1 className="text-[clamp(46px,4.5vw,68px)] font-semibold leading-[1.08] text-[color:var(--text)]">
                {heroText.title}
              </h1>
              <p className="text-lg leading-relaxed text-[color:var(--muted)] sm:text-xl">{heroText.description}</p>
            </div>
          </Reveal>

          <div className="relative flex items-center justify-end">
            <div className="relative isolate w-full max-w-[1100px] translate-y-6 overflow-visible sm:translate-y-8 lg:translate-x-16">
              <div className="pointer-events-none absolute inset-[-24%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(18,110,235,0.16),transparent_60%)] blur-[110px]" />
              <div className="pointer-events-none absolute inset-[-18%] rounded-full bg-[radial-gradient(circle_at_48%_42%,rgba(47,183,255,0.32),transparent_68%)] blur-[110px]" />

              <div className="relative h-[620px] w-full overflow-visible sm:h-[740px] lg:h-[880px]">
                <div className="absolute inset-y-0 left-[-16vw] right-[-16vw] overflow-visible sm:left-[-18vw] sm:right-[-18vw] lg:left-[-14vw] lg:right-[-14vw]">
                  <div
                    ref={orbitRef}
                    className="relative h-full w-full overflow-visible"
                    style={{ willChange: "transform" }}
                  >
                    <div className="pointer-events-none absolute inset-[-18%] sm:inset-[-20%] lg:inset-[-16%]">
                      {sceneMounted ? (
                        <div
                          className="h-full w-full transition-opacity duration-600 ease-out will-change-[opacity]"
                          style={{ opacity: sceneVisible ? 1 : 0 }}
                        >
                          <SceneTree
                            className="pointer-events-none scale-[1.18] lg:scale-[1.28]"
                            onReady={() => setTreeReady(true)}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="h-[64%] w-[64%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(80,160,255,0.5),rgba(18,110,235,0.08))] blur-3xl opacity-70" />
                        </div>
                      )}
                    </div>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(18,110,235,0.3),transparent_62%)] blur-[70px]" />
                    {!reduceMotion && (
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(47,183,255,0.22),transparent_64%)] blur-[110px] animate-[softGlow_4.6s_ease-in-out_infinite]" />
                    )}

                    {ready && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{ transform: `translateX(${isMobile ? 0 : 60}px)` }}
                      >
                        <svg
                          className="absolute inset-0"
                          viewBox={`0 0 ${Math.max(1, size.width)} ${Math.max(1, size.height)}`}
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <defs>
                            <linearGradient id="heroRing" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="rgba(120,200,255,0.8)" />
                              <stop offset="100%" stopColor="rgba(80,160,255,0.35)" />
                            </linearGradient>
                          </defs>
                          <g
                            style={{
                              opacity: ringVisible ? 1 : 0,
                              transition: "opacity 0.9s ease",
                              transformOrigin: "50% 50%",
                            }}
                          >
                            <ellipse
                              cx={center.cx}
                              cy={center.cy}
                              rx={radii.rx * 1.02}
                              ry={radii.ry * 1.02}
                              fill="none"
                              stroke="url(#heroRing)"
                              strokeWidth="2"
                              style={{
                                animation: reduceMotion ? "none" : "heroRingPulse 3.8s ease-in-out infinite",
                                filter: "drop-shadow(0 0 28px rgba(80,170,255,0.25))",
                              }}
                            />
                            <ellipse
                              cx={center.cx}
                              cy={center.cy}
                              rx={radii.rx * 0.9}
                              ry={radii.ry * 0.9}
                              fill="none"
                              stroke="url(#heroRing)"
                              strokeWidth="1.6"
                              opacity={0.85}
                              style={{
                                animation: reduceMotion ? "none" : "heroRingPulse 4.4s ease-in-out infinite",
                                filter: "drop-shadow(0 0 22px rgba(70,160,255,0.2))",
                                animationDelay: "0.3s",
                              }}
                            />
                          </g>
                        </svg>
                      </div>
                    )}

                    {ready &&
                      orbitLinks.map((item, idx) => {
                        const delay = buttonsVisible ? 240 + idx * 100 : 0;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            ref={(node) => {
                              buttonRefs.current[idx] = node;
                            }}
                            className="absolute z-10 w-[210px] max-w-[230px]"
                            style={{
                              opacity: buttonsVisible ? 1 : 0,
                              transform: `translate3d(-50%, -50%, 0) translate3d(0, ${buttonsVisible ? 0 : 12}px, 0)`,
                              transition: "opacity 0.92s ease, transform 0.92s ease",
                              transitionDelay: `${delay}ms`,
                            }}
                            aria-label={item.label}
                          >
                            <div
                              className="relative"
                              style={{
                                transformOrigin: "50% 50%",
                              }}
                            >
                              <GlassCard className="group rounded-full border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 px-4 py-3 text-left shadow-[0_22px_52px_-22px_rgba(18,110,235,0.45)] transition hover:-translate-y-[2px]">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-sm font-semibold text-[color:var(--text)]">{item.label}</div>
                                  <span className="h-2 w-2 rounded-full bg-[color:var(--accent-blue)]/70 shadow-[0_0_0_8px_rgba(18,110,235,0.14)] transition duration-200 group-hover:shadow-[0_0_0_10px_rgba(65,224,196,0.18)]" />
                                </div>
                                <p className="text-[11px] leading-snug text-[color:var(--muted)]">{item.hint}</p>
                              </GlassCard>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const HeroTree3D = memo(HeroTree3DComponent);
HeroTree3D.displayName = "HeroTree3D";
