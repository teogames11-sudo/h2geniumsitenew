"use client";

import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const TEAM = [
  {
    name: "Ирина Волошина",
    role: "Медицинский директор",
    focus: "Клинические протоколы, безопасность, контроль качества",
    stats: "12+ лет",
    tags: ["реабилитация", "NADH", "медSPA"],
  },
  {
    name: "Дмитрий Корнеев",
    role: "Руководитель по оборудованию",
    focus: "Конфигурации кабинетов, инженерия, ввод в эксплуатацию",
    stats: "9 лет",
    tags: ["H2-оборудование", "IV", "бальнео"],
  },
  {
    name: "Алёна Пак",
    role: "Методолог сервиса",
    focus: "Скрипты, обучение персонала, сервисные маршруты",
    stats: "8 лет",
    tags: ["обучение", "маршруты", "KPI"],
  },
  {
    name: "Григорий Мельников",
    role: "ROI и бизнес-модель",
    focus: "Экономика кабинета, финмодель, аналитика потока",
    stats: "10+ лет",
    tags: ["ROI", "поток", "запуск"],
  },
  {
    name: "Кира Сереброва",
    role: "Коммуникации и бренд",
    focus: "Контент, позиционирование, партнерства",
    stats: "7 лет",
    tags: ["контент", "бренд", "воронка"],
  },
  {
    name: "Никита Лозин",
    role: "Сервис и поддержка",
    focus: "Плановое ТО, расходники, сопровождение",
    stats: "6 лет",
    tags: ["SLA", "сервис", "апдейты"],
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const TeamGrid = () => {
  return (
    <section className="space-y-5">
      <Reveal className="space-y-2">
        <GlassBadge tone="mint">Команда</GlassBadge>
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Эксперты, которые собирают экосистему</h2>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Кросс-функциональная команда: медицина, инженерия, экономика и сервис. Вместе мы доводим проект от аудита до устойчивого потока.
        </p>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TEAM.map((person) => (
          <GlassCard key={person.name} className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85">
            <div className="flex items-center gap-3">
              <div className="relative grid h-12 w-12 place-items-center rounded-full border border-[color:var(--glass-stroke)] bg-gradient-to-br from-[rgba(47,183,255,0.35)] to-[rgba(65,224,196,0.2)] text-sm font-semibold text-white shadow-[0_14px_32px_-18px_rgba(18,110,235,0.65)]">
                {initials(person.name)}
                <span className="absolute inset-[-10%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(47,183,255,0.25),transparent_70%)]" />
              </div>
              <div>
                <div className="text-lg font-semibold text-[color:var(--text)]">{person.name}</div>
                <div className="text-xs text-[color:var(--muted)]">{person.role}</div>
              </div>
              <div className="ml-auto text-xs font-semibold text-[color:var(--accent-cyan)]">{person.stats}</div>
            </div>
            <p className="text-sm text-[color:var(--muted)]">{person.focus}</p>
            <div className="flex flex-wrap gap-2">
              {person.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-1 text-[11px] font-semibold text-[color:var(--text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        ))}
      </Reveal>
    </section>
  );
};

