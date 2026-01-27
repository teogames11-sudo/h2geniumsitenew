"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import products from "@/content/products.json";
import { GlassBadge, GlassButton, GlassCard, GlassInput, GlassTabs } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { ProductContent } from "@/types/content";

const categories = ["Техника", "Расходники", "Аксессуары", "Мебель", "Косметика", "Концепции"];
const manualCard: ProductContent = {
  slug: "hydrogenium-8400",
  title: "Hydrogenium 8400",
  description:
    "Компрессорный ингалятор Hydrogenium 8400 разработан для ЛПУ и санаторно-курортных организаций, имеет регистрационное удостоверение. Поток секций можно регулировать (925, 1850 и 2800 мл/мин).",
  category: "Техника",
  url: "",
  images: ["/application/apparat.png"],
  documents: [],
};

const inhalationUnits = [
  {
    name: "HYDROGENIUM 6000",
    flow: "до 4000 мл/мин, регулируемый поток",
    patients: "до 4 пациентов в час",
    duration: "минимум 30 минут",
    purity: "чистота водорода 99,9%",
  },
  {
    name: "HYDROGENIUM 8400",
    flow: "до 5600 мл/мин",
    patients: "до 6 пациентов в час",
    duration: "минимум 20 минут",
    purity: "чистота водорода 99,9%",
  },
  {
    name: "HYDROGENIUM 12000",
    flow: "до 8000 мл/мин",
    patients: "до 8 пациентов в час",
    duration: "минимум 30 минут",
    purity: "чистота водорода 99,9%",
  },
];

const inhalationIndications = [
  "Сахарный диабет",
  "Метаболический синдром",
  "Астенический синдром и хроническая усталость",
  "Заболевания сердечно-сосудистой системы (артериальная гипертензия, ИБС, атеросклероз)",
  "Избыточный вес / ожирение",
  "Профессиональный спорт и чрезмерные нагрузки",
  "Профилактика и реабилитация Covid-19 и других вирусных инфекций",
  "Аллергические состояния",
  "Хронические воспалительные заболевания (ЛОР, бронхо-легочные, ЖКТ, мочеполовая система, суставы и др.)",
];

const capsuleItems = [
  {
    name: "HYDROGENIUM SPA V01",
    posture: "процедуры сидя",
    description: "Капсула с регулируемой по росту сидушкой для комфортного проведения трансдермальных процедур.",
    specs: "138×76×130 см",
    weight: "60 кг",
    note: "Терапевтическая логика аналогична HYDROGENIUM SPA H01.",
  },
  {
    name: "HYDROGENIUM SPA H01",
    posture: "процедуры лёжа",
    description:
      "Совместима с грязевыми и водорослевыми обёртываниями, аппликациями и программами с гелем HYDROGENIUM NAD+.",
    specs: "225×78×116 см",
    weight: "85 кг",
    note: "Источник H₂ — компрессорные ингаляторы HYDROGENIUM 6000/8400.",
  },
];

const capsuleBenefits = [
  "Эффективная длительность сеанса — 20 минут",
  "Пропускная способность — до 2 пациентов в час",
  "Синергия физических факторов и водородных интервенций для повышения качества реабилитации и профилактики",
  "Простое управление и обслуживание для физиотерапии, реабилитации, санаториев и medSPA",
  "Подключение к канализации/«мокрой точке» для удобства обслуживания",
];

const capsuleIndications = [
  "Сахарный диабет",
  "Кожные заболевания",
  "Метаболический синдром",
  "Астенический синдром",
  "Профессиональный спорт, чрезмерные нагрузки",
  "Заболевания костно-мышечной системы",
  "Неврологические заболевания",
];

const novelties = [
  {
    title: "HYDROGENIUM IV",
    description:
      "Аппарат насыщает стерильные растворы молекулярным водородом и другими газами, формируя контролируемую концентрацию для инфузионных и локальных протоколов. Интегрируется в существующие схемы, открывая интервенции на клеточном уровне там, где классические подходы достигли пределов.",
  },
  {
    title: "HYDROGENIUM CARBOXY",
    description:
      "Бальнео-генератор высокого давления для водородной карбокситерапии (H₂ + CO₂) с точным контролем параметров. Усиливает регенерацию, снижает воспаление и улучшает трофику тканей в бальнеотерапии, реабилитации и medical SPA.",
  },
];

const accessories = [
  "Наушники для водородной терапии",
  "Очки для водородной терапии",
  "SPA маска для водородной терапии",
  "Аппликаторы для гипербарической водородной инсуфляции на конечностях",
];

export default function CatalogPage() {
  const [active, setActive] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("Все");
  const productList = products as ProductContent[];
  const featuredSlug = manualCard.slug;
  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    productList.forEach((item) => {
      item.tags?.forEach((tag) => tags.add(tag));
    });
    return ["Все", ...Array.from(tags)];
  }, [productList]);

  const filtered = useMemo(() => {
    return productList.filter((item) => {
      if (item.slug === featuredSlug) return false;
      const matchesCategory = active ? item.category === active || !item.category : true;
      const matchesTag = activeTag === "Все" ? true : item.tags?.includes(activeTag);
      const matchesQuery = query
        ? item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [active, activeTag, featuredSlug, query, productList]);

  return (
    <div className="space-y-10">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">Каталог</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Позиции H2GENIUM</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Ингаляционные системы, трансдермальные капсулы и новые решения HYDROGENIUM для внедрения водородной терапии.
        </p>
      </Reveal>

      <Reveal className="space-y-4 rounded-[28px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <GlassBadge tone="neutral">Каталог и запрос КП</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)]">Дополнительные позиции</h2>
            <p className="text-[color:var(--muted)]">Выберите категорию или воспользуйтесь поиском.</p>
          </div>
          <GlassButton as="a" href="/contacts#form" variant="primary" className="min-w-[180px] justify-center">
            Оставить заявку
          </GlassButton>
        </div>

        <GlassTabs
          tabs={categories.map((c) => ({ id: c, label: c }))}
          onChange={(id) => setActive(id)}
          initial={active}
        />
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <GlassInput placeholder="Поиск по каталогу" value={query} onChange={(e) => setQuery(e.target.value)} />
          <GlassButton as="a" href="/contacts" variant="ghost" className="justify-center">
            Контакты
          </GlassButton>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[color:var(--muted)]">Теги:</span>
          {tagOptions.map((tag) => {
            const isActive = tag === activeTag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                aria-pressed={isActive}
                className={clsx(
                  "rounded-full border border-[color:var(--glass-stroke)] px-3 py-1 font-semibold transition",
                  isActive
                    ? "bg-[color:var(--glass-bg)]/90 text-[color:var(--text)] shadow-[var(--shadow-2)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)]",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[manualCard, ...filtered].map((item, idx) => (
            <GlassCard key={`${item.slug}-${idx}`} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <GlassBadge tone="neutral">{item.category || "Без категории"}</GlassBadge>
                {item.url && <span className="text-xs text-[color:var(--muted)]">{item.url.replace("https://", "")}</span>}
              </div>
              <div className="space-y-2">
                {idx === 0 && (
                  <div className="overflow-hidden rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/30 p-4 shadow-[var(--shadow-1)]">
                    <img
                      src={item.images?.[0] || "/application/apparat.png"}
                      alt={item.title}
                      className="mx-auto h-48 w-full max-w-[260px] object-contain"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-[color:var(--text)]">{item.title}</h3>
                {idx === 0 && (
                  <ul className="text-sm text-[color:var(--muted)]">
                    <li>Производительность по водороду: 5600 мл/мин</li>
                    <li>Чистота водорода: 99,99%</li>
                  </ul>
                )}
                {item.description && <p className="text-sm text-[color:var(--muted)]">{item.description}</p>}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[color:var(--muted)]">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-2.5 py-1 shadow-[var(--shadow-2)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <GlassButton as="a" href={`/product/${item.slug}`} variant="ghost" className="flex-1 min-w-[120px] justify-center">
                  Подробнее
                </GlassButton>
                <GlassButton as="a" href="/contacts#form" variant="primary" className="flex-1 min-w-[120px] justify-center">
                  Запросить КП
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </Reveal>

      <section className="space-y-5 rounded-[28px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10">
        <Reveal className="space-y-4">
          <div className="space-y-2">
            <GlassBadge tone="accent">Ингаляционный метод</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)]">Компрессорные ингаляторы</h2>
            <p className="max-w-3xl text-[color:var(--muted)]">
              Линейка компрессорных ингаляторов HYDROGENIUM с регулируемыми потоками и высокой пропускной
              способностью для кабинетного использования.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {inhalationUnits.map((item) => (
              <GlassCard key={item.name} className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-1)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[color:var(--text)]">{item.name}</h3>
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent-blue)]/60 shadow-[0_0_0_8px_rgba(18,110,235,0.12)]" />
                </div>
                <ul className="space-y-1 text-sm text-[color:var(--muted)]">
                  <li>{item.flow}</li>
                  <li>{item.patients}</li>
                  <li>{item.duration}</li>
                  <li>{item.purity}</li>
                </ul>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-1)]">
            <h3 className="text-lg font-semibold text-[color:var(--text)]">Показания для ингаляционного метода</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {inhalationIndications.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-2 text-sm text-[color:var(--muted)] shadow-[0_10px_30px_-18px_rgba(18,110,235,0.35)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </section>

      <section className="space-y-5 rounded-[28px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10">
        <Reveal className="space-y-4">
          <div className="space-y-2">
            <GlassBadge tone="accent">Трансдермальный метод</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)]">Водородные капсулы</h2>
            <p className="max-w-3xl text-[color:var(--muted)]">
              Профессиональные капсулы для чрескожного введения молекулярного водорода с сочетанием тепла, арома-, фито-
              и хромотерапии.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {capsuleItems.map((capsule) => (
              <GlassCard key={capsule.name} className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-1)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-[color:var(--text)]">{capsule.name}</h3>
                    <p className="text-sm text-[color:var(--muted)]">{capsule.posture}</p>
                  </div>
                  <span className="rounded-full bg-[color:var(--accent-blue)]/12 px-3 py-1 text-xs font-semibold text-[color:var(--accent-blue)] shadow-[0_0_0_10px_rgba(18,110,235,0.08)]">
                    Капсула
                  </span>
                </div>
                <p className="text-sm text-[color:var(--muted)]">{capsule.description}</p>
                {capsule.note && <p className="text-xs text-[color:var(--muted)]">{capsule.note}</p>}
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[color:var(--text)]">
                  <span className="rounded-full bg-[color:var(--glass-bg)]/80 px-3 py-1 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.22)]">
                    Габариты: {capsule.specs}
                  </span>
                  <span className="rounded-full bg-[color:var(--glass-bg)]/80 px-3 py-1 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.22)]">
                    Масса: {capsule.weight}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard className="space-y-2 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-1)]">
              <h3 className="text-lg font-semibold text-[color:var(--text)]">Ключевые преимущества</h3>
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                {capsuleBenefits.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent-blue)]/70 shadow-[0_0_0_8px_rgba(18,110,235,0.12)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-1)]">
              <h3 className="text-lg font-semibold text-[color:var(--text)]">Показания для капсул</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {capsuleIndications.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/75 px-3 py-2 text-sm text-[color:var(--muted)] shadow-[0_10px_30px_-18px_rgba(18,110,235,0.35)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Reveal>
      </section>

      <Reveal className="space-y-4">
        <div className="flex items-center gap-3">
          <GlassBadge tone="mint">Новинки</GlassBadge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {novelties.map((item) => (
            <GlassCard key={item.title} className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-1)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-[color:var(--text)]">{item.title}</h3>
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent-blue)]/60 shadow-[0_0_0_8px_rgba(18,110,235,0.12)]" />
              </div>
              <p className="text-sm text-[color:var(--muted)]">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </Reveal>

      <Reveal className="space-y-4">
        <div className="flex items-center gap-3">
          <GlassBadge tone="neutral">Аксессуары</GlassBadge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {accessories.map((item) => (
            <GlassCard
              key={item}
              className="border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 px-5 py-4 text-center text-sm font-semibold text-[color:var(--text)] shadow-[var(--shadow-1)]"
            >
              {item}
            </GlassCard>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
