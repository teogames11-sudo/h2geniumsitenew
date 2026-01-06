"use client";

import { useState } from "react";
import { GlassBadge, GlassButton, GlassCard, GlassTabs } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const sections = [
  {
    id: "what",
    title: "Что такое NADH",
    text: [
      "NADH (никотинамидадениндинуклеотид, восстановленная форма) участвует в переносе электронов и поддерживает синтез АТФ в митохондриях.",
      "Баланс NAD+/NADH связан с эффективностью клеточного метаболизма и восстановлением.",
      "Hydrogenium рассматривает NADH как основу программ поддержки энергии и баланса.",
    ],
  },
  {
    id: "why",
    title: "Почему важно",
    text: [
      "Баланс NADH важен для адаптации к нагрузкам в реабилитации, спорте и превентивных программах.",
      "Материалы Hydrogenium NADH+ акцентируют контролируемые параметры процедур и прозрачную документацию.",
      "Команды клиентов используют регламенты длительности сеансов и сочетания методов для работы в безопасных коридорах.",
    ],
  },
  {
    id: "hydrogen",
    title: "Связь с водородом",
    text: [
      "Молекулярный водород используется как инструмент превентивной медицины, физиотерапии и реабилитации; материалы буклета отмечают снижение оксидативного стресса и воспаления на клеточном уровне.",
      "Решения HYDROGENIUM создают инфраструктуру для безопасного и контролируемого применения водорода в клиниках, реабилитационных центрах, медспа и спортивной медицине.",
      "Сочетание водорода и контроля NAD+/NADH помогает поддерживать энергетические процессы в рамках существующих протоколов.",
    ],
  },
  {
    id: "approach",
    title: "Подход компании",
    text: [
      "Ингаляционные линии HYDROGENIUM 6000/8400/12000 обеспечивают регулируемый поток до 4–8 клиентов в час с чистотой 99,9% (минимальная длительность 20–30 минут).",
      "Чрескожные капсулы комбинируют молекулярный водород с тепло-, арома-, фито- и хромотерапией; сеанс — около 20 минут, до двух клиентов в час.",
      "HYDROGENIUM IV насыщает стерильные растворы водородом и другими газами, а HYDROGENIUM Carboxy готовит воду с водородом и CO2 для бальнеопрограмм.",
    ],
  },
  {
    id: "solutions",
    title: "Связь с решениями/кабинетами",
    text: [
      "Кабинеты проектируются под конкретные форматы: ингаляция, капсулы, бальнео и IV-решения.",
      "Документы и сертификаты доступны для подтверждения параметров оборудования и методик.",
      "Переход к каталогу и разделу «Кабинеты» помогает подобрать конфигурацию под клинику, реабилитацию или медспа.",
    ],
  },
];

const tabs = [
  {
    id: "cell",
    label: "NADH в клетке",
    content:
      "NADH участвует в цепочке переноса электронов и поддерживает синтез АТФ. Баланс NAD+/NADH влияет на эффективность метаболизма и адаптацию к нагрузкам.",
  },
  {
    id: "hydrogen",
    label: "Связь с водородом",
    content:
      "Молекулярный водород используется для снижения оксидативного стресса и воспаления; в сочетании с контролем NADH/NAD+ поддерживает энергетические процессы.",
  },
  {
    id: "approach",
    label: "Подход Hydrogenium",
    content:
      "Контролируемые параметры оборудования, регламенты времени сеансов и документация позволяют интегрировать решения в клиники, реабилитацию и медспа.",
  },
];

const glossary = [
  { term: "NADH", desc: "Восстановленная форма никотинамидадениндинуклеотида, перенос электронов, синтез АТФ." },
  { term: "NAD+", desc: "Окисленная форма, работает в паре с NADH; баланс важен для метаболизма." },
  { term: "Молекулярный водород", desc: "Используется в программах снижения оксидативного стресса (по материалам Hydrogenium)." },
  { term: "Поток", desc: "Объём водорода в мл/мин; регулируется для безопасных режимов." },
];

const faq = [
  {
    q: "Как Hydrogenium использует NADH+ в программах?",
    a: "Через контроль длительности сеансов, потоков водорода и сочетание с NAD+/NADH-фокусом, чтобы поддерживать обмен в рамках существующих протоколов.",
  },
  {
    q: "Где применяются решения?",
    a: "В клиниках, реабилитационных центрах, медспа и спортивной медицине — акцент на контролируемой доставке водорода и документации.",
  },
  {
    q: "Какие параметры безопасности заданы?",
    a: "Для ингаляторов: поток до 4000–8000 мл/мин, чистота 99,9%, минимальная сессия 20–30 минут. Для капсул — до двух клиентов в час при управляемых сценариях.",
  },
  {
    q: "Как перейти к решениям?",
    a: "Используйте раздел «Кабинеты» для форматов и «Каталог» — для оборудования; документы и сертификаты доступны в соответствующих разделах.",
  },
  {
    q: "Можно ли комбинировать форматы?",
    a: "Да, ингаляция, капсулы, бальнео и IV могут сочетаться в одной инфраструктуре при соблюдении регламентов и параметров.",
  },
];

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
  const [open, setOpen] = useState<string | null>(faq[0]?.q ?? null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  const toggle = (id: string) => {
    setOpen((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">NADH</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)] sm:text-4xl">Hydrogenium NADH+</h1>
        <p className="max-w-3xl text-[color:var(--muted)]">
          Материалы о роли NADH и молекулярного водорода, собранные для специалистов, которые внедряют решения Hydrogenium в клиниках, реабилитации и медспа.
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

      <Reveal className="relative">
        <GlassCard className="relative mx-auto max-w-5xl space-y-6 overflow-hidden border-white/35 bg-white/85 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl md:p-10">
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
                    className="rounded-full border border-white/45 bg-white/75 px-3 py-1 shadow-[var(--shadow-2)] transition hover:text-[color:var(--text)]"
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
                На рынок омолаживающих средств стремительно ворвались препараты NAD+ (никотинамид-аденин-динуклеотид) — настоящая революция в поддержании клеточной энергии и здоровья. Этот мощный кофермент стал звездой биохимического мира и ключом к сохранению молодости и жизненной силы.
              </p>
              <p>
                Роль NAD+ трудно переоценить: он участвует в метаболизме, способствует восстановлению ДНК и даже регулирует наши биологические часы. Внутривенное введение, ранее считавшееся самым быстрым методом, постепенно уступает место более безопасным и эффективным альтернативам. Среди них лидирует чрескожное введение, превращающее привычный уход за кожей в поистине омолаживающий ритуал.
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
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
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div id="transdermal-methods" className="space-y-3">
              <h3 className="text-xl font-semibold text-[color:var(--text)]">Три ведущих метода чрескожного введения NAD+</h3>
              <p className="text-[color:var(--muted)]">
                Чрескожные форматы органично встраиваются в существующие процедуры ухода и легко дополняют программы водородной терапии.
              </p>
              <ul className="space-y-2 list-disc pl-5 text-[color:var(--muted)] marker:text-[color:var(--accent-blue)]">
                {transdermalMethods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div id="intranasal" className="space-y-3">
              <h3 className="text-xl font-semibold text-[color:var(--text)]">Интраназальное введение NAD+</h3>
              <p className="text-[color:var(--muted)]">
                Кроме того, следует отметить интраназальное введение NAD+ — эффективный способ активировать мозговую деятельность и улучшить когнитивные функции. Это делает NAD+ не только средством омоложения, но и мощным инструментом для поддержания общего здоровья.
              </p>
            </div>
            <p className="text-[color:var(--muted)]">
              Сегодня чрескожные технологии применения препаратов NAD+ — это не просто тренд, а новая реальность, эффективный путь к сохранению молодости и красоты.
              Осталось лишь решить, готовы ли вы принять участие в этой революции?
            </p>
          </div>
        </GlassCard>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Reveal key={section.id} id={section.id}>
            <GlassCard className="space-y-3 p-6">
              <GlassBadge tone="neutral">{section.title}</GlassBadge>
              <ul className="space-y-2 text-[color:var(--muted)]">
                {section.text.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="space-y-4 rounded-[24px] border border-white/30 bg-white/70 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl md:p-8">
        <div className="flex items-center gap-3">
          <GlassBadge tone="mint">Интерактив</GlassBadge>
        </div>
        <GlassTabs tabs={tabs} initial={activeTab} onChange={setActiveTab} className="max-w-xl" />
        <p className="text-[color:var(--muted)]">
          {tabs.find((t) => t.id === activeTab)?.content}
        </p>
      </Reveal>

      <Reveal className="rounded-[24px] border border-white/30 bg-white/75 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl md:p-8">
        <div className="flex items-center gap-3">
          <GlassBadge tone="neutral">Термины</GlassBadge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {glossary.map((item) => (
            <GlassCard key={item.term} className="p-4">
              <div className="text-base font-semibold text-[color:var(--text)]">{item.term}</div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Reveal>

      <Reveal className="grid gap-4 rounded-[24px] border border-white/30 bg-white/70 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="space-y-3">
          <GlassBadge tone="mint">FAQ · Интерактив</GlassBadge>
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">Частые вопросы</h2>
          <p className="text-[color:var(--muted)]">
            Ответы основаны на материалах из буклета и действующих разделов сайта. Формулировки нейтральные и без медицинских обещаний.
          </p>
        </div>
        <div className="space-y-2">
          {faq.map((item) => {
            const isOpen = open === item.q;
            return (
              <GlassCard key={item.q} className="p-4">
                <button
                  type="button"
                  onClick={() => toggle(item.q)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-[color:var(--text)]">{item.q}</span>
                  <span className="text-xl font-semibold text-[color:var(--muted)]">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="mt-2 text-sm text-[color:var(--muted)]">{item.a}</p>}
              </GlassCard>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}




