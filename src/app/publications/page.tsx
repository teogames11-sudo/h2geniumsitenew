"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import articles from "@/content/articles.json";
import { GlassBadge, GlassCard, GlassInput, GlassTabs } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { ArticleContent } from "@/types/content";

export default function PublicationsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все темы");
  const [activeType, setActiveType] = useState("Все типы");
  const [activeTag, setActiveTag] = useState("Все теги");
  const articleList = articles as ArticleContent[];
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    articleList.forEach((item) => {
      if (item.category) categories.add(item.category);
    });
    return ["Все темы", ...Array.from(categories)];
  }, [articleList]);
  const tagOptions = useMemo(() => {
    const tags = new Set<string>();
    articleList.forEach((item) => {
      item.tags?.forEach((tag) => tags.add(tag));
    });
    return ["Все теги", ...Array.from(tags)];
  }, [articleList]);
  const typeOptions = useMemo(() => {
    const types = new Set<string>();
    articleList.forEach((item) => {
      if (item.type) types.add(item.type);
    });
    return ["Все типы", ...Array.from(types)];
  }, [articleList]);

  const evidenceSummary = useMemo(() => {
    const tags = new Set<string>();
    const categories = new Set<string>();
    const typeCounts = new Map<string, number>();
    articleList.forEach((item) => {
      if (item.category) categories.add(item.category);
      item.tags?.forEach((tag) => tags.add(tag));
      if (item.type) {
        typeCounts.set(item.type, (typeCounts.get(item.type) ?? 0) + 1);
      }
    });
    const topTypes = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    return {
      total: articleList.length,
      categories: categories.size,
      tags: tags.size,
      topTypes,
    };
  }, [articleList]);

  const filtered = useMemo(() => {
    return articleList.filter((item) => {
      const matchesQuery = query
        ? item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.url?.toLowerCase().includes(query.toLowerCase()) ||
          item.excerpt?.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesCategory = activeCategory === "Все темы" ? true : item.category === activeCategory;
      const matchesType = activeType === "Все типы" ? true : item.type === activeType;
      const matchesTag = activeTag === "Все теги" ? true : item.tags?.includes(activeTag);
      return matchesQuery && matchesCategory && matchesType && matchesTag;
    });
  }, [activeCategory, activeTag, activeType, articleList, query]);
  const sanitizeUrl = (url?: string) => url?.replace(/^https?:\/\/(www\.)?h2genium\.ru/i, "") ?? "";

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Публикации</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Материалы и ссылки</h1>
      </Reveal>

      <Reveal>
        <GlassCard className="grid gap-4 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 md:grid-cols-3">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">База</div>
            <div className="text-2xl font-semibold text-[color:var(--text)]">{evidenceSummary.total}</div>
            <div className="text-xs text-[color:var(--muted)]">материалов в библиотеке</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Темы</div>
            <div className="text-2xl font-semibold text-[color:var(--text)]">{evidenceSummary.categories}</div>
            <div className="text-xs text-[color:var(--muted)]">направлений и сценариев</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Типы</div>
            <div className="flex flex-wrap gap-2">
              {evidenceSummary.topTypes.map(([type, count]) => (
                <span
                  key={type}
                  className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-1 text-[11px] font-semibold text-[color:var(--text)]"
                >
                  {type} · {count}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <Reveal className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <GlassInput placeholder="Поиск по публикациям" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/60 px-4 py-3 text-xs text-[color:var(--muted)] shadow-[var(--shadow-2)]">
            Используйте фильтры по темам, типам и тегам, чтобы быстро найти нужные материалы.
          </div>
        </div>
        <GlassTabs
          tabs={categoryOptions.map((item) => ({ id: item, label: item }))}
          initial={activeCategory}
          onChange={(id) => setActiveCategory(id)}
          className="flex-wrap"
        />
        <GlassTabs
          tabs={typeOptions.map((item) => ({ id: item, label: item }))}
          initial={activeType}
          onChange={(id) => setActiveType(id)}
          className="flex-wrap"
        />
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
      </Reveal>

      {filtered.length > 0 && (
        <Reveal className="grid gap-4 md:grid-cols-2">
          {filtered.map((item, idx) => (
            <GlassCard key={item.url + idx} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[color:var(--muted)]">
                {item.category && (
                  <span className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-1">
                    {item.category}
                  </span>
                )}
                {item.type && (
                  <span className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/40 px-3 py-1">
                    {item.type}
                  </span>
                )}
                {item.date && <span className="text-[11px]">{item.date}</span>}
              </div>
              <p className="text-lg font-semibold text-[color:var(--text)]">{item.title || "Материал"}</p>
              {item.url && (
              <a
                className="text-sm text-[color:var(--accent-blue)] hover:underline"
                href={sanitizeUrl(item.url) || item.url}
                target="_blank"
                rel="noreferrer"
              >
                {sanitizeUrl(item.url) || item.url}
              </a>
              )}
              {item.excerpt && <p className="text-sm text-[color:var(--muted)]">{item.excerpt}</p>}
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
            </GlassCard>
          ))}
        </Reveal>
      )}

      {filtered.length === 0 && (
        <Reveal>
          <GlassCard>
            <p className="text-[color:var(--muted)]">Публикации не найдены.</p>
          </GlassCard>
        </Reveal>
      )}
    </div>
  );
}
