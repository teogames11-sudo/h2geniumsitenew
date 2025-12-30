"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard, GlassBadge } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import clsx from "clsx";

type Node = {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
  pulseDelay?: number;
};

const nodes: Node[] = [
  { id: "approach", label: "Подход", href: "/application", x: 420, y: 140, pulseDelay: 0.1 },
  { id: "protocols", label: "Протоколы", href: "/application", x: 410, y: 300, pulseDelay: 0.25 },
  { id: "integration", label: "Интеграция", href: "/catalog", x: 120, y: 170, pulseDelay: 0.35 },
  { id: "cabinets", label: "Кабинеты", href: "/catalog", x: 140, y: 320, pulseDelay: 0.5 },
  { id: "results", label: "Результаты", href: "/results", x: 220, y: 80, pulseDelay: 0.65 },
];

const routerSteps = [
  { title: "Каталог", desc: "Позиции оборудования и решений.", href: "/catalog" },
  { title: "Сертификаты", desc: "Разрешительная документация.", href: "/documents" },
  { title: "Публикации", desc: "Материалы и ссылки.", href: "/publications" },
  { title: "Контакты", desc: "Связаться с командой H2GENIUM.", href: "/contacts" },
];

const bubbles = [
  { size: 12, x: 210, y: 170, delay: 0 },
  { size: 16, x: 290, y: 140, delay: 0.18 },
  { size: 10, x: 330, y: 210, delay: 0.32 },
  { size: 18, x: 250, y: 260, delay: 0.48 },
  { size: 14, x: 180, y: 230, delay: 0.64 },
  { size: 20, x: 240, y: 110, delay: 0.8 },
  { size: 9, x: 280, y: 300, delay: 0.96 },
  { size: 15, x: 190, y: 320, delay: 1.12 },
  { size: 11, x: 150, y: 190, delay: 1.28 },
  { size: 13, x: 310, y: 260, delay: 1.44 },
  { size: 17, x: 350, y: 180, delay: 1.6 },
  { size: 12, x: 230, y: 200, delay: 1.76 },
  { size: 14, x: 260, y: 330, delay: 1.92 },
  { size: 10, x: 330, y: 120, delay: 2.08 },
];

const curveOffsets = [
  { dx: 18, dy: -14 },
  { dx: 12, dy: 22 },
  { dx: -16, dy: 10 },
  { dx: -22, dy: 28 },
  { dx: -10, dy: -18 },
];

const lineGradientId = "energyLine";
const pulseGradientId = "pulseLine";
const center = { x: 260, y: 230 };

const buildCurve = (target: { x: number; y: number }, offset: { dx: number; dy: number }) => {
  const midX = (center.x + target.x) / 2 + offset.dx;
  const midY = (center.y + target.y) / 2 + offset.dy;
  return `M ${center.x} ${center.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
};

export const NadhRouter = () => {
  const [active, setActive] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="mt-12 space-y-8 rounded-[28px] border border-white/40 bg-[color:var(--glass-bg)]/80 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <GlassBadge tone="mint">NADH · Навигация</GlassBadge>
          <h2 className="text-2xl font-semibold text-[color:var(--text)] sm:text-3xl">Сценарии и переходы</h2>
          <p className="max-w-2xl text-[color:var(--muted)]">
            Ядро NADH соединяет ключевые разделы: подход, протоколы, кабинеты, интеграция и результаты. Кликайте узлы для
            перехода к нужным страницам.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--accent-mint)] shadow-[0_0_0_6px_rgba(65,224,196,0.25)]" />
          <span className="text-sm font-semibold text-[color:var(--muted)]">Мягкая 3D-анимация</span>
        </div>
      </div>

      <Reveal className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="relative h-[500px]">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[color:var(--accent-blue)]/18 via-white/10 to-[color:var(--accent-mint)]/20 blur-3xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={reduceMotion ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Bubbles layer */}
          {!reduceMotion &&
            bubbles.map((b, idx) => (
              <motion.span
                key={idx}
                className="absolute rounded-full bg-white/35 blur-lg"
                style={{ width: b.size, height: b.size, left: b.x, top: b.y }}
                animate={{
                  x: [b.x, b.x + (idx % 2 === 0 ? 22 : -22), b.x],
                  y: [b.y, b.y + (idx % 3 === 0 ? -28 : 20), b.y],
                  opacity: [0.2, 0.55, 0.2],
                }}
                transition={{ duration: 7 + idx * 0.12, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
              />
            ))}
          {reduceMotion &&
            bubbles.map((b, idx) => (
              <span
                key={idx}
                className="absolute rounded-full bg-white/30 blur-lg"
                style={{ width: b.size, height: b.size, left: b.x, top: b.y, opacity: 0.4 }}
              />
            ))}

          <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id={lineGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2FB7FF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#41E0C4" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id={pulseGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2FB7FF" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#41E0C4" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {nodes.map((node, index) => {
              const offsets = curveOffsets[index % curveOffsets.length];
              const d = buildCurve({ x: node.x, y: node.y }, offsets);
              const highlight = active === node.id;
              const pulseTransition = {
                duration: 1.5 + index * 0.08,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.pulseDelay || 0,
              };

              return (
                <g key={`line-${node.id}`}>
                  <path
                    d={d}
                    stroke={`url(#${lineGradientId})`}
                    strokeWidth={highlight ? 3 : 2}
                    strokeLinecap="round"
                    fill="none"
                    style={{ filter: "drop-shadow(0 0 8px rgba(65,224,196,0.35))" }}
                  />
                  {!reduceMotion && (
                    <motion.path
                      d={d}
                      stroke={`url(#${pulseGradientId})`}
                      strokeWidth={highlight ? 3 : 2}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="6 16"
                      animate={{ strokeDashoffset: [0, -80] }}
                      transition={pulseTransition}
                    />
                  )}
                  {reduceMotion && (
                    <path
                      d={d}
                      stroke={`url(#${pulseGradientId})`}
                      strokeWidth={highlight ? 3 : 2}
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="6 16"
                      strokeDashoffset={0}
                      opacity={0.6}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 flex h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-[var(--shadow-2)]">
            {!reduceMotion && (
              <>
                <motion.div
                  className="pointer-events-none absolute inset-[-24%] rounded-full bg-[color:var(--accent-blue)]/40 blur-3xl"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute inset-[-14%] rounded-full bg-[color:var(--accent-blue)]/30 blur-2xl"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
                <motion.div
                  className="pointer-events-none absolute inset-[-36%] rounded-full blur-[50px]"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, rgba(47,183,255,0.25) 0 1px, transparent 1px 16px), repeating-linear-gradient(0deg, rgba(47,183,255,0.25) 0 1px, transparent 1px 16px)",
                  }}
                  animate={{ opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
            {reduceMotion && (
              <div
                className="pointer-events-none absolute inset-[-24%] rounded-full bg-[color:var(--accent-blue)]/25 blur-3xl"
                aria-hidden
              />
            )}
            <div className="absolute inset-0 rounded-full border border-white/50" />
            <span className="relative z-10 text-lg font-semibold text-[color:var(--text)]">NADH</span>
          </div>

          {nodes.map((node, index) => (
            <Link
              key={node.id}
              href={node.href}
              className="absolute"
              style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
            >
              <motion.div
                className={clsx(
                  "glass-surface rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--text)]",
                  active === node.id ? "shadow-[0_18px_50px_-18px_rgba(18,110,235,0.45)]" : "",
                )}
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.12 * index, type: "spring", stiffness: 200, damping: 26 }}
                whileHover={{ scale: 1.03 }}
                onMouseEnter={() => setActive(node.id)}
                onMouseLeave={() => setActive(null)}
              >
                {node.label}
              </motion.div>
            </Link>
          ))}
          <p className="absolute -bottom-7 left-4 text-xs text-[color:var(--muted)]">(Motion 3d навигация)</p>
        </div>

        <div className="grid gap-3">
          {routerSteps.map((step, idx) => (
            <Link key={step.title} href={step.href}>
              <GlassCard className="flex flex-col gap-1 p-4 transition-all hover:translate-y-[-2px]">
                <div className="flex items-center gap-3">
                  <span className={clsx("h-8 w-8 rounded-full", "bg-[color:var(--accent-blue)]/10")} />
                  <div>
                    <div className="text-base font-semibold text-[color:var(--text)]">{step.title}</div>
                    <p className="text-sm text-[color:var(--muted)]">{step.desc}</p>
                  </div>
                </div>
                <motion.div
                  className="h-1 rounded-full bg-gradient-to-r from-[color:var(--accent-blue)] via-[color:var(--accent-cyan)] to-[color:var(--accent-mint)]"
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.05 * idx }}
                />
              </GlassCard>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
};
