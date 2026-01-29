"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import products from "@/content/products.json";
import { GlassBadge, GlassButton, GlassCard, GlassInput, GlassTabs } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { ProductContent } from "@/types/content";

const categories = ["Техника", "Расходники", "Мебель", "Косметика", "Концепции"];
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


    </div>
  );
}
