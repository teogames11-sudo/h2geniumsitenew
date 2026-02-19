"use client";

import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { NadhRouter } from "@/components/home/nadh-router";
import { NadhInterventionsSection } from "@/components/sections/NadhInterventionsSection";

const transdermalBenefits = [
  {
    title: "Несравненное удобство",
    description: "Процедура занимает всего 20 минут, в отличие от длительных внутривенных инфузий (2–3 часа).",
  },
  {
    title: "Стабильный и долгосрочный эффект",
    description: "Концентрация NAD+ в крови постепенно нарастает и поддерживается.",
  },
  {
    title: "Уникальное депо",
    description: "Депо в подкожно-жировой клетчатке обеспечивает постоянный приток энергии и бодрости.",
  },
  {
    title: "Минимальный риск",
    description: "Мягкое, безболезненное нанесение на кожу исключает системные побочные эффекты и аллергические реакции.",
  },
  {
    title: "Неинвазивность",
    description: "Без страха перед иглами и инфекциями.",
  },
  {
    title: "Упрощение работы медицинского персонала",
    description: "Процедура доступна для разных клиник без узких специалистов.",
  },
  {
    title: "Сочетание с водородной терапией",
    description: "Усиливает омолаживающий эффект и обеспечивает дополнительную антиоксидантную защиту.",
  },
];

const transdermalMethods = [
  "Применение NAD+-геля в паровых водородных капсулах",
  "Нанесение NAD+-геля под водородную маску",
  "Аппликация NAD+-геля под гипербарические аппликаторы",
];

export default function NadhPage() {
  return (
    <div className="space-y-8">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">NADH</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)] sm:text-4xl">Hydrogenium NADH+</h1>
        <p className="max-w-3xl text-[color:var(--muted)]">
          Материалы о роли NADH и молекулярного водорода, собранные для специалистов, которые внедряют решения Hydrogenium
          в клиниках, реабилитации и медспа.
        </p>
        <div className="flex gap-3">
          <GlassButton as="a" href="/application" variant="ghost">
            Кабинеты и решения
          </GlassButton>
          <GlassButton as="a" href="/documents" variant="primary">
            Сертификаты
          </GlassButton>
        </div>
      </Reveal>

      <NadhRouter wide disableReveal />

      <Reveal className="relative">
        <GlassCard className="relative mx-auto max-w-5xl space-y-6 overflow-hidden border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(47,183,255,0.12),transparent_36%),radial-gradient(circle_at_86%_20%,rgba(65,224,196,0.12),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(18,110,235,0.08),transparent_40%)]" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <GlassBadge tone="accent">NAD+</GlassBadge>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[color:var(--muted)]">
                {[
                  { href: "#transdermal-benefits", label: "Почему эффективно" },
                  { href: "#transdermal-methods", label: "Методы" },
                  { href: "#intranasal", label: "Интраназально" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-1 shadow-[var(--shadow-2)] transition hover:text-[color:var(--text)]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-[color:var(--text)] sm:text-3xl">
              Чрескожное введение NAD+: удобная и эффективная альтернатива внутривенным инъекциям
            </h2>
            <div className="space-y-3 text-[color:var(--muted)]">
              <p>Забудьте об иглах и часах под капельницами. Откройте для себя революционный и простой способ!</p>
              <p>
                На рынок омолаживающих средств стремительно ворвались препараты NAD+ (никотинамид-аденин-динуклеотид) —
                настоящая революция в поддержании клеточной энергии и здоровья. Этот мощный кофермент стал звездой
                биохимического мира и ключом к сохранению молодости и жизненной силы.
              </p>
              <p>
                Роль NAD+ трудно переоценить: он участвует в метаболизме, способствует восстановлению ДНК и даже регулирует
                наши биологические часы. Внутривенное введение, ранее считавшееся самым быстрым методом, постепенно уступает
                место более безопасным и эффективным альтернативам. Среди них лидирует чрескожное введение, превращающее
                привычный уход за кожей в поистине омолаживающий ритуал.
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[rgba(120,210,255,0.35)] to-transparent" />
            <div id="transdermal-benefits" className="space-y-3">
              <h3 className="text-xl font-semibold text-[color:var(--text)]">Почему этот метод так эффективен?</h3>
              <ol className="space-y-3 list-decimal pl-5 text-[color:var(--muted)] marker:text-[color:var(--accent-blue)]">
                {transdermalBenefits.map((item) => (
                  <li key={item.title} className="leading-relaxed">
                    <span className="font-semibold text-[color:var(--text)]">{item.title}:</span> {item.description}
                  </li>
                ))}
              </ol>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[rgba(120,210,255,0.35)] to-transparent" />
            <div id="transdermal-methods" className="space-y-3">
              <h3 className="text-xl font-semibold text-[color:var(--text)]">
                Три ведущих метода чрескожного введения NAD+
              </h3>
              <p className="text-[color:var(--muted)]">
                Чрескожные форматы органично встраиваются в существующие процедуры ухода и легко дополняют программы
                водородной терапии.
              </p>
              <ul className="space-y-2 list-disc pl-5 text-[color:var(--muted)] marker:text-[color:var(--accent-blue)]">
                {transdermalMethods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[rgba(120,210,255,0.35)] to-transparent" />
            <div id="intranasal" className="space-y-3">
              <h3 className="text-xl font-semibold text-[color:var(--text)]">Интраназальное введение NAD+</h3>
              <p className="text-[color:var(--muted)]">
                Кроме того, следует отметить интраназальное введение NAD+ — эффективный способ активировать мозговую
                деятельность и улучшить когнитивные функции. Это делает NAD+ не только средством омоложения, но и мощным
                инструментом для поддержания общего здоровья.
              </p>
            </div>
            <p className="text-[color:var(--muted)]">
              Сегодня чрескожные технологии применения препаратов NAD+ — это не просто тренд, а новая реальность,
              эффективный путь к сохранению молодости и красоты. Осталось лишь решить, готовы ли вы принять участие в этой
              революции?
            </p>
          </div>
        </GlassCard>
      </Reveal>

      <NadhInterventionsSection />
    </div>
  );
}
