"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard, GlassBadge } from "@/components/ui/glass";
import clsx from "clsx";

const devices = [
  {
    id: "catalog",
    title: "Каталог",
    note: "Оборудование и решения",
    href: "/catalog",
    top: "10%",
    left: "64%",
  },
  {
    id: "documents",
    title: "Сертификаты",
    note: "Разрешительные материалы и РУ",
    href: "/documents",
    top: "65%",
    left: "68%",
  },
  {
    id: "results",
    title: "Результаты",
    note: "Кейсы и показатели",
    href: "/results",
    top: "14%",
    left: "12%",
  },
  {
    id: "contacts",
    title: "Контакты",
    note: "Заявка и консультация",
    href: "/contacts",
    top: "68%",
    left: "20%",
  },
];

export const HeroTree = () => {
  return (
    <div className="relative h-[520px] w-full lg:h-[620px]">
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/50 via-white/10 to-[rgba(65,224,196,0.14)] blur-[30px]" />
      <svg viewBox="0 0 520 620" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="treeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2FB7FF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#126EEB" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#41E0C4" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="treeAura" cx="50%" cy="35%" r="40%">
            <stop offset="0%" stopColor="#9fe4ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7cd0ff" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="260" cy="240" r="190" fill="url(#treeAura)" />
        <motion.path
          d="M260 520 C245 380 250 300 260 260 C270 300 275 380 260 520Z"
          fill="url(#treeGlow)"
          filter="url(#softGlow)"
          animate={{ opacity: [0.8, 1, 0.9], scaleY: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M260 260 C180 230 160 160 200 110 C230 80 280 80 320 110 C360 160 340 230 260 260Z"
          fill="url(#treeGlow)"
          filter="url(#softGlow)"
          animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx="260"
          cy="250"
          r="22"
          fill="#fff"
          opacity={0.9}
          animate={{ scale: [1, 1.14, 1], filter: ["blur(4px)", "blur(10px)", "blur(4px)"] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {devices.map((device, index) => {
          const targetX = (parseFloat(device.left) / 100) * 520;
          const targetY = (parseFloat(device.top) / 100) * 620;
          const controlX = (targetX + 260) / 2;
          const controlY = (targetY + 250) / 2 - 30;
          return (
            <motion.path
              key={device.id}
              d={`M260 250 C ${controlX} ${controlY} ${controlX} ${controlY} ${targetX} ${targetY}`}
              fill="none"
              stroke="url(#treeGlow)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="8 10"
              animate={{
                strokeDashoffset: [0, -80],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2 + index * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {devices.map((device) => (
        <Link
          key={device.id}
          href={device.href}
          className={clsx(
            "absolute w-[180px] max-w-[48%] -translate-x-1/2 -translate-y-1/2",
            "hover:scale-[1.02] transition-transform duration-200",
          )}
          style={{ top: device.top, left: device.left }}
        >
          <GlassCard className="p-4 backdrop-brightness-[1.08]">
            <div className="flex items-center gap-2">
              <GlassBadge tone="accent">{device.title}</GlassBadge>
            </div>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{device.note}</p>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
};

