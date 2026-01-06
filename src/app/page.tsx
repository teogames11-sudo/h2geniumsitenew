import { Hero } from "@/components/home/hero";
import { NadhRouter } from "@/components/home/nadh-router";
import { EffectsFloatingCloud } from "@/components/sections/EffectsFloatingCloud";
import { GlassBadge, GlassButton, GlassCard, GlassInput } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const cabinets = [
  {
    id: "inhalation",
    title: "Ингаляционные залы",
    description: "Регулируемые потоки 4000–8000 мл/мин, 4–8 клиентов в час, чистота 99,9%.",
    href: "/application#inhalation",
    image: "/assets/rooms/inhalation.jpg",
  },
  {
    id: "capsule",
    title: "Водородные капсулы",
    description: "Сеансы ~20 минут, до двух клиентов в час, мультисенсорные программы.",
    href: "/application#capsule",
    image: "/assets/rooms/capsule.jpg",
  },
  {
    id: "iv",
    title: "Бальнео и IV-решения",
    description: "HYDROGENIUM IV и Carboxy — работа с водородом и CO2 в контролируемых протоколах.",
    href: "/application#iv",
    image: "/assets/rooms/iv.jpg",
  },
];

const applicationAreas = [
  {
    title: "Антиэйдж",
    description:
      "Водородная терапия предлагает инновационное и эффективное решение этой проблемы, обладая тройным воздействием на организм.",
  },
  {
    title: "Спорт",
    description:
      "Применение водородной терапии между тренировочными сессиями или непосредственно во время упражнений оказывает заметное положительное воздействие на организм спортсмена.",
  },
  {
    title: "Кардиология",
    description:
      "Исследования показывают, что водород способен влиять на множество ключевых процессов, связанных с функционированием сердечно-сосудистой системы.",
  },
  {
    title: "Пульмонология",
    description:
      "Применение данного метода терапии способствует не только улучшению функциональных показателей легких, но и значительному повышению качества жизни пациентов.",
  },
  {
    title: "Неврология",
    description:
      "Путем нейтрализации свободных радикалов водородная терапия не просто предотвращает каскад реакций, приводящих к гликированию и повреждению белков, но и способствует восстановлению уже окисленных белков, тем самым оказывая терапевтическое действие на клеточном уровне.",
  },
  {
    title: "Эндокринология",
    description:
      "Метод основывается на антиоксидантных свойствах молекулярного водорода, который способен нейтрализовать свободные радикалы, уменьшая оксидативный стресс и воспаление в организме.",
  },
];

const effects = [
  {
    title: "Антиоксидантное действие",
    description:
      "Естественное противодействие оксидативному стрессу и повреждениям им обусловленных (повреждение ДНК, белков и липидов).",
  },
  { title: "Запуск омоложения", description: "Запуск процессов репарации, регенерации и омоложения." },
  { title: "Антифиброз", description: "Антифиброзное действие." },
  {
    title: "Восстановление",
    description: "Восстановление поврежденных клеточных структур, в том числе клеток головного мозга, печени, кожи и т.д.",
  },
  { title: "Активизация клеток", description: "Активизация процессов апоптоза – борьба с «дряхлыми клетками»." },
  {
    title: "Улучшение микроциркуляции",
    description:
      "Глобальное улучшение микроциркуляции вследствие нейтрализации пироксинитрита и активизации аэробного производства энергии.",
  },
  { title: "Повышение выносливости", description: "Повышение толерантности к физическим нагрузкам." },
  { title: "Восстановление сил", description: "Снятие астенического синдрома." },
  {
    title: "Реваскуляризация",
    description: "Реваскуляризация – стимулирование неоангиогенеза, в особенности в очагах ишемии.",
  },
  { title: "Улучшение обмена веществ", description: "Интенсификация базального уровня метаболизма." },
  {
    title: "Повышение потребления кислорода",
    description:
      "Повышение потребления кислорода за счет активизации использования свободных жирных кислот в аэробном производстве энергии.",
  },
  { title: "Снижение уровня глюкозы", description: "Снижение уровней глюкозы, триглицеридов, ЛПНП." },
  { title: "Повышение эффективности мозга", description: "Улучшение когнитивных функций." },
  { title: "Омоложение", description: "Снижение биологического возраста и запуск процессов омоложения." },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />

      <section id="about" className="rounded-[28px] border border-white/30 bg-white/75 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10">
        <Reveal className="space-y-4">
          <div className="flex items-center gap-3">
            <GlassBadge tone="accent">О HYDROGENIUM</GlassBadge>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.2fr]">
            <GlassCard className="space-y-3">
              <p className="text-[color:var(--muted)]">
                Молекулярный водород становится признанным инструментом превентивной медицины, реабилитации и физиотерапии, помогая снижать оксидативный стресс и воспаление на клеточном уровне.
              </p>
              <p className="text-[color:var(--muted)]">
                Решения HYDROGENIUM создают инфраструктуру для безопасного и контролируемого применения водородной терапии в клиниках, реабилитационных центрах, medspa и спортивной медицине, усиливая результаты привычных протоколов и открывая новые форматы ухода за пациентами.
              </p>
            </GlassCard>
          </div>
        </Reveal>
      </section>

      <NadhRouter wide />

      <section
        id="application"
        className="rounded-[28px] border border-white/30 bg-white/80 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10"
      >
        <Reveal className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <GlassBadge tone="accent">Применение</GlassBadge>
              <h2 className="text-3xl font-semibold text-[color:var(--text)]">Применение</h2>
              <p className="max-w-3xl text-[color:var(--muted)]">
                Ключевые направления использования водородной терапии: комфортные форматы, измеримый эффект и расширение
                возможностей здоровья и восстановления.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {applicationAreas.map((item, idx) => (
              <Reveal key={item.title} delay={idx * 0.04}>
                <GlassCard className="group relative h-full overflow-hidden border-white/35 bg-white/85 p-6 shadow-[var(--shadow-1)] transition hover:-translate-y-[3px] hover:border-[color:var(--accent-blue)]/35 hover:shadow-[0_24px_64px_-22px_rgba(18,110,235,0.45)]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(47,183,255,0.12),transparent_35%),radial-gradient(circle_at_80%_82%,rgba(65,224,196,0.12),transparent_32%)]" />
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-blue)]/12 shadow-[0_0_0_10px_rgba(18,110,235,0.08)] ring-1 ring-white/70">
                        <span className="absolute inline-flex h-8 w-8 rounded-full bg-[color:var(--accent-blue)]/20 blur-[4px] opacity-80 animate-ping" aria-hidden />
                        <span className="relative h-3.5 w-3.5 rounded-full bg-[color:var(--accent-blue)] shadow-[0_0_0_10px_rgba(18,110,235,0.18)]" aria-hidden />
                        <span className="sr-only">Пульсирующая метка</span>
                      </span>
                      <h3 className="text-xl font-semibold text-[color:var(--text)]">{item.title}</h3>
                    </div>
                    <p className="leading-relaxed text-[color:var(--muted)]">{item.description}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="effects" className="relative space-y-4 rounded-[32px] border border-white/10 bg-transparent px-1 py-4 sm:px-3 sm:py-6">
        <Reveal className="space-y-3 px-3 sm:px-4 md:px-6">
          <GlassBadge tone="mint">Результаты и воздействия</GlassBadge>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-[color:var(--text)]">Результаты и воздействия</h2>
            <p className="max-w-4xl text-[color:var(--muted)]">
              Водород - естественный для организма газ, запускающий положительные процессы в теле человека.
            </p>
          </div>
        </Reveal>
        <div className="relative left-1/2 w-screen max-w-[1800px] -translate-x-1/2 px-4 sm:px-10">
          <EffectsFloatingCloud items={effects} />
        </div>
        <p className="text-center text-xs text-[color:var(--muted)] opacity-80">Имеются противопоказания. Требуется консультация специалиста.</p>
      </section>

      <section id="rooms" className="rounded-[28px] border border-white/35 bg-white/75 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl sm:p-10">
        <Reveal className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <GlassBadge tone="accent">Кабинеты и форматы</GlassBadge>
              <p className="text-[color:var(--muted)]">Планирование, площадь, сценарии и масштабирование.</p>
            </div>
            <GlassButton as="a" href="/application" variant="ghost">
              Перейти к описанию
            </GlassButton>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {cabinets.map((room) => (
              <GlassCard key={room.id} className="overflow-hidden p-0 transition hover:-translate-y-[2px]">
                <div className="relative h-44 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
                  <img src={room.image} alt={room.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-[color:var(--text)]">{room.title}</h3>
                    <span className="h-2 w-2 rounded-full bg-[color:var(--accent-blue)]/40 shadow-[0_0_0_6px_rgba(18,110,235,0.12)]" />
                  </div>
                  <p className="text-sm text-[color:var(--muted)]">{room.description}</p>
                  <GlassButton as="a" href={room.href} variant="ghost" className="w-full justify-center text-sm">
                    Подробнее
                  </GlassButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </Reveal>
      </section>

      <div id="contacts" className="sr-only" aria-hidden="true" />

      <section
        id="lead"
        className="rounded-[28px] border border-white/35 bg-[color:var(--glass-bg)]/80 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl sm:p-10"
      >
        <Reveal className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-3">
            <GlassBadge tone="accent">Оставить заявку</GlassBadge>
            <h3 className="text-2xl font-semibold text-[color:var(--text)]">Свяжитесь с нами</h3>
            <p className="text-[color:var(--muted)]">
              Подберём конфигурацию кабинета, покажем регламенты и поможем встроить решения в ваши программы.
            </p>
          </div>
          <GlassCard className="space-y-3">
            <GlassInput placeholder="Имя" />
            <GlassInput placeholder="Телефон" />
            <GlassInput placeholder="Комментарий" />
            <div className="flex flex-wrap gap-3">
              <GlassButton as="a" href="/contacts#form" variant="primary">
                Отправить
              </GlassButton>
              <GlassButton as="a" href="/contacts" variant="ghost">
                Контакты
              </GlassButton>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </div>
  );
}


