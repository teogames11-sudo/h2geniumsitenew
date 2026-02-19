"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import styles from "./EnterpriseCabinetInsights.module.css";

type MetricRange = {
  label: string;
  min: number;
  max: number;
};

const metricRanges: MetricRange[] = [
  { label: "Снижение больничных", min: 12, max: 18 },
  { label: "Снижение травматизма", min: 10, max: 15 },
  { label: "Снижение тревожности", min: 25, max: 35 },
  { label: "Снижение выгорания", min: 15, max: 25 },
];

const roadmapPhases = [
  {
    title: "Текущий год",
    description: "Пилотный запуск в корпоративном формате, базовый мониторинг и оценка комплаенса.",
  },
  {
    title: "1-2 года",
    description: "Расширение протоколов, интеграция в сменные графики и тиражирование в смежные подразделения.",
  },
  {
    title: "2-3 года",
    description: "Масштабирование экосистемы HYDROGENIUM с регулярной аналитикой и единым контуром здоровья.",
  },
];

const kpis = [
  { title: "Производительность", value: "5-8%" },
  { title: "Окупаемость", value: "3 месяца" },
  { title: "ROI", value: "464%" },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function EnterpriseCabinetInsights() {
  const timelineRef = useRef<HTMLElement | null>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    const element = timelineRef.current;
    if (!element) return;

    let rafId = 0;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const total = viewport + rect.height;
      const passed = viewport - rect.top;
      setTimelineProgress(clamp(passed / total, 0, 1));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const chartNodes = useMemo(() => {
    const axisX = 260;
    const axisWidth = 300;
    const scaleMax = 40;
    return metricRanges.map((item, index) => {
      const y = 36 + index * 52;
      const xStart = axisX + (item.min / scaleMax) * axisWidth;
      const xEnd = axisX + (item.max / scaleMax) * axisWidth;
      return { ...item, y, xStart, xEnd };
    });
  }, []);

  if (!metricRanges.length || !roadmapPhases.length || !kpis.length) {
    return (
      <GlassCard className={styles.fallback}>
        <p className="text-sm text-[color:var(--muted)]">Блок аналитики временно недоступен. Данные подгружаются.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <Reveal className="space-y-4">
        <GlassCard className={styles.chartCard}>
          <div className="space-y-3">
            <GlassBadge tone="mint">Целевые показатели</GlassBadge>
            <h3 className="text-xl font-semibold text-[color:var(--text)] sm:text-2xl">Ожидаемые показатели программы</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Значения представлены как целевые интервалы программы, а не как гарантированный индивидуальный результат.
            </p>
          </div>

          <div className={styles.chartWrap} role="img" aria-label="Целевые показатели эффективности программы">
            <svg viewBox="0 0 620 250" className={styles.chartSvg}>
              <defs>
                <linearGradient id="enterpriseMetricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(65,224,196,0.88)" />
                  <stop offset="100%" stopColor="rgba(47,183,255,0.95)" />
                </linearGradient>
              </defs>

              <line x1="260" y1="14" x2="260" y2="226" className={styles.chartAxis} />
              {[0, 10, 20, 30, 40].map((tick) => (
                <g key={tick}>
                  <line
                    x1={260 + tick * 7.5}
                    y1="14"
                    x2={260 + tick * 7.5}
                    y2="226"
                    className={styles.chartGridLine}
                  />
                  <text x={260 + tick * 7.5} y="244" textAnchor="middle" className={styles.chartTick}>
                    {tick}%
                  </text>
                </g>
              ))}

              {chartNodes.map((item) => (
                <g key={item.label}>
                  <text x="0" y={item.y + 4} className={styles.chartLabel}>
                    {item.label}
                  </text>
                  <line x1="260" y1={item.y} x2="560" y2={item.y} className={styles.chartTrack} />
                  <line x1={item.xStart} y1={item.y} x2={item.xEnd} y2={item.y} className={styles.chartRange} />
                  <circle cx={item.xStart} cy={item.y} r="4.2" className={styles.chartDot} />
                  <circle cx={item.xEnd} cy={item.y} r="4.2" className={styles.chartDot} />
                  <text x="577" y={item.y + 4} className={styles.chartValue}>
                    {item.min}-{item.max}%
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className={styles.kpiGrid}>
            {kpis.map((kpi) => (
              <div key={kpi.title} className={styles.kpiTile}>
                <div className={styles.kpiLabel}>{kpi.title}</div>
                <div className={styles.kpiValue}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>

      <Reveal>
        <section ref={timelineRef} className={styles.roadmap} aria-label="Roadmap масштабирования программы">
          <div className="space-y-2">
            <GlassBadge tone="neutral">Roadmap</GlassBadge>
            <h3 className="text-xl font-semibold text-[color:var(--text)] sm:text-2xl">Масштабирование в 3 фазы</h3>
          </div>
          <div className={styles.timelineRail}>
            <span className={styles.timelineTrack} />
            <span className={styles.timelineFill} style={{ transform: `scaleX(${timelineProgress})` }} />
          </div>
          <div className={styles.phaseGrid}>
            {roadmapPhases.map((phase, index) => (
              <article key={phase.title} className={styles.phaseCard}>
                <span className={styles.phaseIndex}>Фаза {index + 1}</span>
                <h4 className="text-base font-semibold text-[color:var(--text)]">{phase.title}</h4>
                <p className="text-sm text-[color:var(--muted)]">{phase.description}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}

