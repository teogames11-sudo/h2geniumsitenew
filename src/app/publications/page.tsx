"use client";

import { useMemo, useState } from "react";
import articles from "@/content/articles.json";
import { GlassBadge, GlassCard, GlassInput } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { ArticleContent } from "@/types/content";

export default function PublicationsPage() {
  const [query, setQuery] = useState("");
  const articleList = articles as ArticleContent[];

  const filtered = useMemo(() => {
    return articleList.filter((item) =>
      query
        ? item.title?.toLowerCase().includes(query.toLowerCase()) || item.url?.toLowerCase().includes(query.toLowerCase())
        : true,
    );
  }, [articleList, query]);

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Публикации</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Материалы и ссылки</h1>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <GlassInput placeholder="Поиск по публикациям" value={query} onChange={(e) => setQuery(e.target.value)} />
      </Reveal>

      {filtered.length > 0 && (
        <Reveal className="grid gap-4 md:grid-cols-2">
          {filtered.map((item, idx) => (
            <GlassCard key={item.url + idx} className="space-y-2">
              <p className="text-lg font-semibold text-[color:var(--text)]">{item.title || "Материал"}</p>
              <a className="text-sm text-[color:var(--accent-blue)] hover:underline" href={item.url} target="_blank">
                {item.url}
              </a>
              {item.excerpt && <p className="text-sm text-[color:var(--muted)]">{item.excerpt}</p>}
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
