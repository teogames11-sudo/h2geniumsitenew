"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

type MapNode = {
  id: string;
  label: string;
  description: string;
  focus: string[];
  metrics: { label: string; value: string }[];
  x: number;
  y: number;
  tone: "accent" | "mint" | "neutral";
};

const NODES: MapNode[] = [
  {
    id: "audit",
    label: "ROI и аудит",
    description:
      "Фиксируем целевую нагрузку, параметры потока и экономику. Это база для правильной конфигурации кабинета и планов запуска.",
    focus: ["оценка потока", "экономика кабинета", "KPI запуска"],
    metrics: [
      { label: "Окупаемость", value: "9–14 мес" },
      { label: "Поток/мес", value: "120–180" },
      { label: "Средний чек", value: "3200–4200 ?" },
    ],
    x: 18,
    y: 26,
    tone: "accent",
  },
  {
    id: "design",
    label: "Проектирование",
    description:
      "Подбираем формат кабинета, оборудование и сценарии обслуживания. Учитываем площадь, вентиляцию, маршруты и регламенты.",
    focus: ["планировка", "инженерия", "регламенты"],
    metrics: [
      { label: "Срок", value: "2–4 недели" },
      { label: "Форматов", value: "2–4" },
      { label: "Кабинетов", value: "1–3" },
    ],
    x: 78,
    y: 22,
    tone: "mint",
  },
  {
    id: "equipment",
    label: "Оборудование",
    description:
      "Линейка ингаляторов, капсулы, IV и бальнео. Комплектуем под нагрузку и даем контрольные точки качества.",
    focus: ["H2 6000/8400/12000", "капсулы", "IV/Carboxy"],
    metrics: [
      { label: "Чистота", value: "99,9%" },
      { label: "Поток", value: "до 8000 мл/мин" },
      { label: "Сеанс", value: "20–30 мин" },
    ],
    x: 86,
    y: 55,
    tone: "accent",
  },
  {
    id: "protocols",
    label: "Протоколы",
    description:
      "Готовые сценарии процедур и мониторинга. Пакеты под профилактику, реабилитацию и медSPA.",
    focus: ["стандарты", "контроль параметров", "обучение"],
    metrics: [
      { label: "Сценариев", value: "6–9" },
      { label: "Регламент", value: "20–30 мин" },
      { label: "Поддержка", value: "онлайн" },
    ],
    x: 58,
    y: 80,
    tone: "mint",
  },
  {
    id: "education",
    label: "Обучение",
    description:
      "Подготовка команды: сценарии сервиса, маршруты пациента, контроль безопасности и коммуникации.",
    focus: ["2 смены", "скрипты", "контроль качества"],
    metrics: [
      { label: "Смен", value: "2" },
      { label: "Скриптов", value: "6" },
      { label: "Срок", value: "7 дней" },
    ],
    x: 26,
    y: 72,
    tone: "neutral",
  },
  {
    id: "marketing",
    label: "Маркетинг",
    description:
      "Позиционирование, материалы и контент. Формируем воронку первичных и повторных клиентов.",
    focus: ["контент", "воронка", "партнерства"],
    metrics: [
      { label: "Повторы", value: "35–45%" },
      { label: "CPA", value: "ниже мед. SPA" },
      { label: "Запуск", value: "10 дней" },
    ],
    x: 10,
    y: 52,
    tone: "accent",
  },
  {
    id: "service",
    label: "Сервис",
    description:
      "Техническая поддержка, расходники, контроль качества и обновление протоколов.",
    focus: ["плановое ТО", "расходники", "апдейты"],
    metrics: [
      { label: "ТО", value: "каждые 3–6 мес" },
      { label: "SLA", value: "48 часов" },
      { label: "Контроль", value: "онлайн" },
    ],
    x: 42,
    y: 18,
    tone: "neutral",
  },
];

const toneStyles: Record<MapNode["tone"], string> = {
  accent: "from-[rgba(30,120,210,0.45)] to-[rgba(18,110,235,0.25)]",
  mint: "from-[rgba(65,224,196,0.4)] to-[rgba(47,183,255,0.2)]",
  neutral: "from-[rgba(20,40,70,0.6)] to-[rgba(10,20,40,0.4)]",
};

export const EcosystemMap = () => {
  const [activeId, setActiveId] = useState(NODES[0].id);
  const active = useMemo(() => NODES.find((node) => node.id === activeId) ?? NODES[0], [activeId]);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(47,183,255,0.2),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(65,224,196,0.16),transparent_48%)]" />
      <div className="pointer-events-none absolute -right-12 top-12 h-40 w-40 rounded-full bg-[rgba(47,183,255,0.2)] blur-[80px]" />
      <div className="pointer-events-none absolute -left-16 bottom-6 h-44 w-44 rounded-full bg-[rgba(65,224,196,0.16)] blur-[90px]" />

      <Reveal className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="space-y-2">
            <GlassBadge tone="accent">Карта экосистемы</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)]">Как экосистема HYDROGENIUM складывается в результат</h2>
            <p className="text-[color:var(--muted)]">
              Наведите на узел карты, чтобы увидеть ключевые роли, метрики и точки управления проектом.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-stroke)] bg-gradient-to-br from-[rgba(7,12,20,0.88)] via-[rgba(9,18,30,0.75)] to-[rgba(12,24,42,0.7)] shadow-[var(--shadow-1)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(47,183,255,0.16),transparent_55%)]" />
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="eco-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(47,183,255,0.75)" />
                  <stop offset="100%" stopColor="rgba(65,224,196,0.55)" />
                </linearGradient>
              </defs>
              {NODES.map((node) => (
                <line
                  key={`line-${node.id}`}
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke="url(#eco-line)"
                  strokeWidth={node.id === activeId ? 0.7 : 0.4}
                  strokeLinecap="round"
                  opacity={node.id === activeId ? 0.85 : 0.45}
                />
              ))}
            </svg>

            <div className="relative h-[420px] sm:h-[460px]">
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 px-5 py-4 text-center shadow-[0_24px_50px_-24px_rgba(18,110,235,0.65)]">
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">ядро</div>
                <div className="text-lg font-semibold text-[color:var(--text)]">HYDROGENIUM</div>
                <div className="text-[11px] text-[color:var(--muted)]">операционная экосистема</div>
              </div>

              {NODES.map((node) => {
                const isActive = node.id === activeId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setActiveId(node.id)}
                    onFocus={() => setActiveId(node.id)}
                    onClick={() => setActiveId(node.id)}
                    className={clsx(
                      "group absolute -translate-x-1/2 -translate-y-1/2",
                      isActive ? "z-20" : "z-10",
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <span
                      className={clsx(
                        "flex items-center gap-2 rounded-full border border-[color:var(--glass-stroke)] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_16px_40px_-22px_rgba(18,110,235,0.55)] transition",
                        "bg-gradient-to-r",
                        toneStyles[node.tone],
                        isActive ? "scale-[1.04]" : "opacity-80",
                      )}
                    >
                      <span
                        className={clsx(
                          "h-2.5 w-2.5 rounded-full",
                          node.tone === "mint" ? "bg-[color:var(--accent-mint)]" : "bg-[color:var(--accent-blue)]",
                        )}
                      />
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85">
            <div className="flex items-center gap-2">
              <GlassBadge tone={active.tone}>{active.label}</GlassBadge>
              <span className="text-xs text-[color:var(--muted)]">Активный узел</span>
            </div>
            <p className="text-sm text-[color:var(--muted)]">{active.description}</p>
            <div className="flex flex-wrap gap-2">
              {active.focus.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-1 text-[11px] font-semibold text-[color:var(--text)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80">
            <div className="text-sm font-semibold text-[color:var(--text)]">Ключевые показатели</div>
            <div className="grid gap-3 sm:grid-cols-3">
              {active.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-2"
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">{metric.label}</div>
                  <div className="text-sm font-semibold text-[color:var(--text)]">{metric.value}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-3 sm:grid-cols-2">
            <GlassButton as="a" href="/application" variant="ghost" className="w-full justify-center">
              Кабинеты и решения
            </GlassButton>
            <GlassButton as="a" href="/contacts#form" variant="primary" className="w-full justify-center">
              Запросить КП
            </GlassButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

