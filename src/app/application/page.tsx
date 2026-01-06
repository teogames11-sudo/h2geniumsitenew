import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

type Section = {
  id: string;
  title: string;
  what: string;
  how: string;
  forWhom: string;
  selection: string;
  bullets: string[];
  image: string;
};

const sections: Section[] = [
  {
    id: "inhalation",
    title: "Ингаляционные системы",
    what: "Компрессорные ингаляторы HYDROGENIUM 6000/8400/12000 с регулируемым потоком молекулярного водорода.",
    how: "Сдвоенная секция электролиза, поток 4000–8000 мл/мин (в зависимости от модели), чистота 99,9%. Минимальная длительность сеанса 20–30 минут.",
    forWhom: "Клиники, реабилитационные центры, спортивная медицина — формат групповых и индивидуальных процедур.",
    selection: "Выбор модели зависит от пропускной способности: 6000 — до 4 клиентов/час, 8400 — до 6, 12000 — до 8.",
    bullets: [
      "Поток регулируется под сценарий кабинета.",
      "Прозрачные регламенты по времени и контролю параметров.",
      "Поддерживает программы профилактики и восстановления.",
    ],
    image: "/assets/rooms/inhalation.jpg",
  },
  {
    id: "capsule",
    title: "Водородные капсулы",
    what: "Профессиональные капсулы для чрескожного введения водорода в сочетании с тепло-, арома-, фито- и хромотерапией.",
    how: "Сеанс около 20 минут, до двух клиентов в час. Управляемые сценарии экспозиции и температура для комфортного пребывания.",
    forWhom: "Кабинеты реабилитации, медспа и wellness-центры, где важен мультисенсорный формат.",
    selection: "Учитывайте площадь помещения, климат-контроль и планируемую нагрузку (параллельные сеансы).",
    bullets: [
      "Синергия нескольких физических факторов воздействия.",
      "Простое управление и обслуживание персоналом.",
      "Интеграция в существующие программы без изменения маршрута клиентов.",
    ],
    image: "/assets/rooms/capsule.jpg",
  },
  {
    id: "iv",
    title: "HYDROGENIUM IV",
    what: "Аппарат для насыщения стерильных растворов молекулярным водородом и другими газами под избыточным давлением.",
    how: "Интегрируется в протоколы инфузионной терапии и локальных процедур. Управляемая концентрация и контроль параметров.",
    forWhom: "Медицинские центры и клиники, где водород включён в существующие протоколы под наблюдением специалистов.",
    selection: "Оцените текущие инфузионные маршруты и требования к концентрациям газов в растворах.",
    bullets: [
      "Работает в связке с имеющимися процедурами.",
      "Контроль состава растворов и времени подготовки.",
      "Поддержка документацией и регламентами.",
    ],
    image: "/assets/rooms/iv.jpg",
  },
  {
    id: "carboxy",
    title: "HYDROGENIUM Carboxy",
    what: "Бальнео-генератор для подготовки воды, насыщенной молекулярным водородом и CO2.",
    how: "Комбинирует антиоксидантный потенциал водорода и микроциркуляторный эффект CO2. Работает в контролируемых режимах.",
    forWhom: "Клиники, бальнео- и медспа-программы, где нужен управляемый водородный и CO2 формат.",
    selection: "Важно учесть требования к водоподготовке, отводам и сценариям бальнео-процедур.",
    bullets: [
      "Готовит воду с клинически значимыми концентрациями газов.",
      "Подходит для локальных и общих бальнео-программ.",
      "Расширяет спектр водородных кабинетов без замены инфраструктуры.",
    ],
    image: "/assets/rooms/carboxy.jpg",
  },
];

export default function ApplicationPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Кабинеты и решения</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Hydrogenium — применение</h1>
        <p className="text-[color:var(--muted)]">
          Форматы оснащения и готовые кабинеты для ингаляции, чрескожных капсул, бальнео и IV-решений. Материалы — из буклета и действующих спецификаций.
        </p>
      </Reveal>

      <div className="relative space-y-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_10%,rgba(47,183,255,0.18),transparent_40%),radial-gradient(circle_at_100%_90%,rgba(65,224,196,0.18),transparent_40%)] blur-[32px]" />

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Reveal key={section.id} id={section.id}>
              <GlassCard className="relative grid gap-6 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
                <div className="space-y-3">
                  <GlassBadge tone="neutral">{`0${idx + 1}`}</GlassBadge>
                  <h2 className="text-2xl font-semibold text-[color:var(--text)]">{section.title}</h2>
                  <div className="space-y-2 text-[color:var(--muted)]">
                    <p><strong className="text-[color:var(--text)]">Что это:</strong> {section.what}</p>
                    <p><strong className="text-[color:var(--text)]">Как проходит:</strong> {section.how}</p>
                    <p><strong className="text-[color:var(--text)]">Для кого:</strong> {section.forWhom}</p>
                    <p><strong className="text-[color:var(--text)]">Как выбрать формат:</strong> {section.selection}</p>
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-[color:var(--muted)]">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="flex gap-3 pt-1">
                    <GlassButton as="a" href="/catalog" variant="ghost">
                      Каталог
                    </GlassButton>
                    <GlassButton as="a" href="/contacts#form" variant="primary">
                      Запросить консультацию
                    </GlassButton>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-[-16px] rounded-3xl bg-[radial-gradient(circle_at_50%_50%,rgba(47,183,255,0.2),transparent_65%)] blur-2xl" />
                  <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-[var(--shadow-1)] backdrop-blur-xl">
                    <img src={section.image} alt={section.title} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

