"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import products from "@/content/products.json";
import { GlassBadge, GlassButton, GlassCard, GlassInput, GlassTabs } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { ProductContent } from "@/types/content";

export default function CatalogPage() {
  const productList = products as ProductContent[];
  const categories = useMemo(() => {
    const set = new Set<string>();
    productList.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [productList]);
  const [active, setActive] = useState(categories[0] ?? "");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, { item: ProductContent; qty: number }>>({});
  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((sum, entry) => sum + entry.qty, 0), [cartItems]);

  const addToCart = (item: ProductContent) => {
    if (!item.slug) return;
    setCart((prev) => {
      const existing = prev[item.slug!];
      return {
        ...prev,
        [item.slug!]: {
          item,
          qty: existing ? existing.qty + 1 : 1,
        },
      };
    });
  };

  const removeFromCart = (slug: string) => {
    setCart((prev) => {
      const existing = prev[slug];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[slug];
        return next;
      }
      return { ...prev, [slug]: { ...existing, qty: existing.qty - 1 } };
    });
  };

  const clearCart = () => setCart({});

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
    <div className="space-y-10">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">Каталог</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Позиции H2GENIUM</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Ингаляционные системы, трансдермальные капсулы и новые решения HYDROGENIUM для внедрения водородной терапии.
        </p>
      </Reveal>

      <div className="full-bleed">
        <div className="mx-auto w-full max-w-[1920px] px-[clamp(18px,3vw,40px)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div className="space-y-10">
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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => {
                const inCart = item.slug ? Boolean(cart[item.slug]) : false;
                const summary = item.summary ?? item.description;
                return (
                  <GlassCard key={item.slug} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <GlassBadge tone="neutral">{item.category || "Без категории"}</GlassBadge>
                    </div>
                    <div className="space-y-2">
                      {item.images?.[0] && (
                        <div className="overflow-hidden rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/30 p-4 shadow-[var(--shadow-1)]">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="mx-auto h-48 w-full max-w-[260px] object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-[color:var(--text)]">{item.title}</h3>
                      {summary && <p className="text-sm text-[color:var(--muted)]">{summary}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <GlassButton
                        as="a"
                        href={`/product/${item.slug}`}
                        variant="ghost"
                        className="flex-1 min-w-[120px] justify-center"
                      >
                        Подробнее
                      </GlassButton>
                      <GlassButton
                        as="a"
                        href="/contacts#form"
                        variant="primary"
                        className="flex-1 min-w-[120px] justify-center"
                      >
                        Запросить КП
                      </GlassButton>
                      <GlassButton
                        as="button"
                        type="button"
                        variant={inCart ? "primary" : "ghost"}
                        onClick={() => addToCart(item)}
                        className="flex-1 min-w-[120px] justify-center"
                      >
                        {inCart ? "В корзине" : "В корзину"}
                      </GlassButton>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
              </Reveal>
            </div>

            <div className="flex flex-col items-end gap-3 lg:pt-2">
              <button
                type="button"
                onClick={() => setCartOpen((open) => !open)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 shadow-[var(--shadow-2)] backdrop-blur-2xl"
                aria-label="Корзина"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path
                    d="M7 7V6a5 5 0 0 1 10 0v1h3v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7h3Zm2 0h6V6a3 3 0 0 0-6 0v1Z"
                    fill="currentColor"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-[0_6px_16px_-8px_rgba(255,0,0,0.7)]">
                    {cartCount}
                  </span>
                )}
              </button>

              <div
                className={clsx(
                  "w-[300px] max-w-[88vw] rounded-[28px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 p-5 shadow-[var(--shadow-1)] backdrop-blur-2xl transition-all duration-300",
                  cartOpen ? "translate-x-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
                )}
              >
                <div className="flex items-center justify-between">
                  <GlassBadge tone="neutral">Корзина</GlassBadge>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                  >
                    Очистить
                  </button>
                </div>
                {cartItems.length === 0 ? (
                  <p className="mt-3 text-sm text-[color:var(--muted)]">Добавьте позиции из каталога.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {cartItems.map(({ item, qty }) => (
                      <div
                        key={item.slug}
                        className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 p-3"
                      >
                        <div className="text-sm font-semibold text-[color:var(--text)]">{item.title}</div>
                        {item.category && <div className="text-[11px] text-[color:var(--muted)]">{item.category}</div>}
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-[color:var(--muted)]">Кол-во</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.slug!)}
                              className="h-6 w-6 rounded-full border border-[color:var(--glass-stroke)] text-[color:var(--text)]"
                            >
                              –
                            </button>
                            <span className="min-w-[20px] text-center text-[color:var(--text)]">{qty}</span>
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              className="h-6 w-6 rounded-full border border-[color:var(--glass-stroke)] text-[color:var(--text)]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <GlassButton as="a" href="/contacts#form" variant="primary" className="w-full justify-center">
                      Запросить КП по корзине
                    </GlassButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
