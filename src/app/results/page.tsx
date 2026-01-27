import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Reveal } from "@/components/ui/reveal";

const caseStudies = [
  {
    id: "clinic-inhalation",
    badge: "Клиника превентивной медицины",
    title: "Ингаляционный кабинет с потоковой нагрузкой",
    description:
      "Сценарий для клиник с устойчивым потоком пациентов: запуск двух ингаляционных зон с регламентами по времени сеанса и контролем параметров.",
    metrics: [
      { label: "Кабинетов", value: "2" },
      { label: "Пропускная способность", value: "до 6 клиентов/час" },
      { label: "Длительность сеанса", value: "20–30 минут" },
      { label: "Срок запуска", value: "14 дней" },
    ],
    media: { type: "image" as const, src: "/assets/rooms/inhalation.jpg", alt: "Ингаляционный кабинет" },
    ctas: [
      { label: "Запросить КП", href: "/contacts#form", variant: "primary" as const },
      { label: "Рассчитать кабинет", href: "/application#configurator", variant: "ghost" as const },
    ],
  },
  {
    id: "medspa-capsule",
    badge: "MedSPA",
    title: "Капсульные процедуры с NAD+ программой",
    description:
      "Компактный кабинет для коротких циклов (около 20 минут) с чрескожными программами и комфортной логистикой.",
    metrics: [
      { label: "Капсул", value: "1" },
      { label: "Пропускная способность", value: "до 2 клиентов/час" },
      { label: "Площадь кабинета", value: "от 18 м²" },
      { label: "Сервисный цикл", value: "5 минут" },
    ],
    media: { type: "image" as const, src: "/assets/rooms/capsule.jpg", alt: "Водородная капсула" },
    ctas: [
      { label: "Получить сценарии", href: "/contacts#form", variant: "primary" as const },
      { label: "Посмотреть оборудование", href: "/catalog", variant: "ghost" as const },
    ],
  },
  {
    id: "rehab-iv-carboxy",
    badge: "Реабилитация",
    title: "IV + Carboxy формат для расширения услуг",
    description:
      "Комбинированный формат для центров реабилитации: IV-решения и бальнео-насыщение с контролируемыми режимами.",
    metrics: [
      { label: "Форматов", value: "2" },
      { label: "Процедур в день", value: "до 12" },
      { label: "Маршрут клиента", value: "40–50 минут" },
      { label: "Срок внедрения", value: "3 недели" },
    ],
    media: {
      type: "video" as const,
      src: "/video/home-hero.mp4",
      poster: "/assets/rooms/iv.jpg",
      alt: "Видео кабинета IV",
    },
    ctas: [
      { label: "Получить расчет ROI", href: "/application#configurator", variant: "primary" as const },
      { label: "Запросить консультацию", href: "/contacts#form", variant: "ghost" as const },
    ],
  },
] as const;

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Результаты</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Кейсы и итоги</h1>
        <p className="text-[color:var(--muted)]">
          Практические сценарии внедрения и ключевые показатели форматов HYDROGENIUM без медицинских обещаний.
        </p>
      </Reveal>

      <Reveal>
        <BeforeAfterSlider
          beforeSrc="/assets/rooms/cover-rooms.jpg"
          afterSrc="/assets/rooms/inhalation.jpg"
          beforeAlt="РЎС†РµРЅР°СЂРёР№ РґРѕ РІРЅРµРґСЂРµРЅРёСЏ"
          afterAlt="РЎС†РµРЅР°СЂРёР№ РїРѕСЃР»Рµ РІРЅРµРґСЂРµРЅРёСЏ"
          beforeLabel="До"
          afterLabel="После"
          caption="РџСЂРµРІСЂР°С‰РµРЅРёРµ Р·РѕРЅС‹ СѓСЃР»СѓРі РІ РІРѕРґРѕСЂРѕРґРЅС‹Р№ РєР°Р±РёРЅРµС‚"
        />
      </Reveal>

      <div className="space-y-6">
        {caseStudies.map((item) => (
          <Reveal key={item.id}>
            <GlassCard className="grid gap-6 md:grid-cols-[1fr_1.05fr]">
              <div className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/60 shadow-[var(--shadow-1)]">
                {item.media.type === "video" ? (
                  <video
                    className="h-full w-full object-cover"
                    src={item.media.src}
                    poster={item.media.poster}
                    controls
                    preload="metadata"
                  />
                ) : (
                  <img src={item.media.src} alt={item.media.alt} className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="space-y-4">
                <GlassBadge tone="neutral">{item.badge}</GlassBadge>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-[color:var(--text)]">{item.title}</h2>
                  <p className="text-sm text-[color:var(--muted)]">{item.description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {item.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-4 py-3 text-sm shadow-[var(--shadow-2)]"
                    >
                      <div className="text-xs text-[color:var(--muted)]">{metric.label}</div>
                      <div className="text-base font-semibold text-[color:var(--text)]">{metric.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.ctas.map((cta) => (
                    <GlassButton key={cta.label} as="a" href={cta.href} variant={cta.variant}>
                      {cta.label}
                    </GlassButton>
                  ))}
                </div>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
