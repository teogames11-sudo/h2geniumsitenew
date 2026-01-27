"use client";

import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const MICRO_STATS = [
  { label: "Стартовый ввод", value: "14–21 день" },
  { label: "Площадь", value: "18–32 м²" },
  { label: "Сценарии", value: "3–5 протоколов" },
  { label: "Персонал", value: "2 смены" },
];

const STORY_STEPS = [
  {
    id: "signal",
    title: "Контур спроса",
    description:
      "Определяем ядро аудитории, формат запросов и плотность потока. Это задает правильную конфигурацию кабинета и ритм процедуры.",
    metrics: [
      { label: "Поток", value: "120–180 клиентов/мес" },
      { label: "Слоты", value: "18–24 в день" },
      { label: "Средний цикл", value: "20–30 мин" },
    ],
  },
  {
    id: "build",
    title: "Сборка решения",
    description:
      "Собираем модуль под сценарий: ингаляции, капсулы, бальнео или IV. Добавляем регламенты, контент и карту сервиса.",
    metrics: [
      { label: "Форматов", value: "2–4" },
      { label: "Кабинетов", value: "1–3" },
      { label: "Оборудование", value: "4 блока" },
    ],
  },
  {
    id: "launch",
    title: "Запуск и обучение",
    description:
      "Проводим запуск, обучаем команду, настраиваем скрипты и KPI. В первые недели собираем обратную связь и калибруем маршрут.",
    metrics: [
      { label: "Обучение", value: "2 смены" },
      { label: "Скрипты", value: "6 сценариев" },
      { label: "Контроль", value: "еженедельно" },
    ],
  },
  {
    id: "scale",
    title: "Стабилизация и рост",
    description:
      "Выходим на стабильную загрузку, фиксируем метрики и подключаем новые услуги. Это превращает кабинет в устойчивую бизнес-единицу.",
    metrics: [
      { label: "Загрузка", value: "65–85%" },
      { label: "Повторы", value: "35–45%" },
      { label: "Окупаемость", value: "9–14 мес" },
    ],
  },
];

export const EcosystemStory = () => {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(47,183,255,0.18),transparent_55%),radial-gradient(circle_at_82%_70%,rgba(65,224,196,0.16),transparent_60%)] opacity-90" />
      <div className="pointer-events-none absolute -left-12 top-12 h-40 w-40 rounded-full bg-[rgba(47,183,255,0.22)] blur-[80px]" />
      <div className="pointer-events-none absolute -right-10 bottom-12 h-40 w-40 rounded-full bg-[rgba(65,224,196,0.18)] blur-[80px]" />

      <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <GlassBadge tone="accent">Экосистема</GlassBadge>
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">Сценарий развития кабинета</h2>
          <p className="text-[color:var(--muted)]">
            Пошаговый путь от замера спроса до стабильной работы. Каждый этап фиксирует результат и дает команде
            предсказуемый темп роста.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {MICRO_STATS.map((stat) => (
              <GlassCard
                key={stat.label}
                className="space-y-1 rounded-2xl border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 px-4 py-3"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">{stat.label}</div>
                <div className="text-base font-semibold text-[color:var(--text)]">{stat.value}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {STORY_STEPS.map((step, index) => (
            <Reveal key={step.id}>
              <GlassCard className="relative overflow-hidden rounded-[26px] border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 p-5 shadow-[var(--shadow-2)]">
                <div className="absolute right-4 top-4 rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Этап {index + 1}
                </div>
                <div className="space-y-3">
                  <div className="text-lg font-semibold text-[color:var(--text)]">{step.title}</div>
                  <p className="text-sm text-[color:var(--muted)]">{step.description}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {step.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-2 text-sm"
                      >
                        <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                          {metric.label}
                        </div>
                        <div className="text-sm font-semibold text-[color:var(--text)]">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
