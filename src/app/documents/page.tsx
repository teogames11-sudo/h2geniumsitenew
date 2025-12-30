"use client";

import { useMemo, useState } from "react";
import documents from "@/content/documents.json";
import { GlassBadge, GlassCard, GlassInput } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { DocumentLink } from "@/types/content";

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const docs = documents as DocumentLink[];
  const filtered = useMemo(() => {
    return docs.filter((doc) => {
      return query ? doc.title?.toLowerCase().includes(query.toLowerCase()) : true;
    });
  }, [query, docs]);

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Документы / РУ</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Реестр документов</h1>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <GlassInput placeholder="Поиск по документам" value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="text-sm text-[color:var(--muted)]">Поддерживаются форматы PDF и DOCX.</p>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 && (
          <GlassCard className="md:col-span-2">
            <p className="text-[color:var(--muted)]">Документы не найдены.</p>
          </GlassCard>
        )}
        {filtered.map((doc) => (
          <GlassCard key={doc.url} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-[color:var(--text)]">{doc.title}</p>
              <p className="text-xs text-[color:var(--muted)]">{doc.url}</p>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[color:var(--accent-blue)] underline underline-offset-4 hover:text-[color:var(--accent-cyan)]"
            >
              Открыть
            </a>
          </GlassCard>
        ))}
      </Reveal>
    </div>
  );
}
