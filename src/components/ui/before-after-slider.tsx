"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  className?: string;
  initial?: number;
};

const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));

export const BeforeAfterSlider = ({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = "До",
  afterLabel = "После",
  caption,
  className,
  initial = 50,
}: BeforeAfterSliderProps) => {
  const [value, setValue] = useState(() => clamp(10, initial, 90));
  const sliderStyle = useMemo(
    () => ({
      width: `${value}%`,
    }),
    [value],
  );

  return (
    <div className={clsx("space-y-3", className)}>
      {caption && <div className="text-sm font-semibold text-[color:var(--text)]">{caption}</div>}
      <div className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 shadow-[var(--shadow-1)]">
        <img src={afterSrc} alt={afterAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={sliderStyle}>
          <img src={beforeSrc} alt={beforeAlt} className="h-full w-full object-cover" />
        </div>
        <div
          className="absolute bottom-0 top-0 w-[2px] bg-[color:var(--accent-cyan)]/70 shadow-[0_0_14px_rgba(47,183,255,0.65)]"
          style={{ left: `${value}%` }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 text-xs font-semibold text-white shadow-[0_18px_44px_-24px_rgba(18,110,235,0.7)]"
          style={{ left: `calc(${value}% - 20px)` }}
          aria-hidden
        >
          ⇆
        </div>
        <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
          {beforeLabel}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
          {afterLabel}
        </div>
        <input
          type="range"
          min={10}
          max={90}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label="Сравнение до и после"
        />
      </div>
    </div>
  );
};
