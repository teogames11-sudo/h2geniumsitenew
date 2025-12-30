"use client";

import { useMemo, useState } from "react";
import products from "@/content/products.json";
import { GlassBadge, GlassButton, GlassCard, GlassInput, GlassTabs } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { ProductContent } from "@/types/content";

const categories = ["Техника", "Расходники", "Аксессуары", "Мебель", "Косметика", "Концепции"];
const manualCard: ProductContent = {
  slug: "hydrogenium-8400",
  title: "Hydrogenium 8400",
  description: "Компрессорный ингалятор Hydrogenium 8400 разработан для ЛПУ и санаторно-курортных организаций, имеет регистрационное удостоверение. Поток секций можно регулировать (925, 1850 и 2800 мл/мин).",
  category: "Техника",
  url: "",
  images: ["/application/apparat.png"],
};

export default function CatalogPage() {
  const [active, setActive] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const productList = products as ProductContent[];

  const filtered = useMemo(() => {
    return productList.filter((item) => {
      const matchesCategory = active ? item.category === active || !item.category : true;
      const matchesQuery = query
        ? item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [active, query, productList]);

  return (
    <div className="space-y-8">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">Каталог</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Позиции H2GENIUM</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Выберите категорию или воспользуйтесь поиском.</p>
      </Reveal>

      <Reveal className="flex flex-col gap-4">
        <GlassTabs
          tabs={categories.map((c) => ({ id: c, label: c }))}
          onChange={(id) => setActive(id)}
          initial={active}
        />
        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <GlassInput
            placeholder="Поиск по каталогу"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <GlassButton as="a" href="/contacts#form" variant="primary" className="justify-center">
            Оставить заявку
          </GlassButton>
        </div>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[manualCard, ...filtered].map((item, idx) => (
          <GlassCard key={`${item.slug}-${idx}`} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <GlassBadge tone="neutral">{item.category || "Без категории"}</GlassBadge>
              {item.url && <span className="text-xs text-[color:var(--muted)]">{item.url.replace("https://", "")}</span>}
            </div>
            <div className="space-y-2">
              {idx === 0 && (
                <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/30 p-4 shadow-[var(--shadow-1)]">
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
            </div>
            <div className="flex gap-2">
              <GlassButton as="a" href={`/product/${item.slug}`} variant="ghost" className="flex-1">
                Подробнее
              </GlassButton>
              <GlassButton as="a" href="/contacts#form" variant="primary" className="flex-1">
                Запросить КП
              </GlassButton>
            </div>
          </GlassCard>
        ))}
      </Reveal>
    </div>
  );
}
