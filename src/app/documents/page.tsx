"use client";

import { useMemo, useState } from "react";
import documents from "@/content/documents.json";
import { GlassBadge, GlassCard, GlassInput } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { DocumentLink } from "@/types/content";

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const docs = documents as DocumentLink[];
  const isImage = (url: string) => /\.(png|jpe?g|webp|gif)$/i.test(url);
  const filtered = useMemo(() => {
    return docs.filter((doc) => {
      return query ? doc.title?.toLowerCase().includes(query.toLowerCase()) : true;
    });
  }, [query, docs]);

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Сертификаты</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Сертификаты и разрешительная документация</h1>
        <p className="text-[color:var(--muted)]">
          Актуальные сертификаты и регистрационные удостоверения на оборудование HYDROGENIUM.
        </p>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <GlassInput placeholder="Поиск по сертификатам" value={query} onChange={(e) => setQuery(e.target.value)} />
        <p className="text-sm text-[color:var(--muted)]">Поддерживаются форматы PDF, PNG и DOCX.</p>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 && (
          <GlassCard className="md:col-span-2">
            <p className="text-[color:var(--muted)]">Сертификаты не найдены.</p>
          </GlassCard>
        )}
        {filtered.map((doc) => (
          <GlassCard
            key={doc.url}
            className="col-span-2 w-full max-w-[1400px] justify-center gap-8 p-5 md:flex md:items-center md:gap-10 md:p-10 lg:mx-auto lg:gap-14 lg:p-12"
          >
            <div className="max-w-xl space-y-3 text-center md:text-left">
              <p className="text-xl font-semibold text-[color:var(--text)] lg:text-2xl">{doc.title}</p>
              {doc.description && <p className="text-base text-[color:var(--muted)]">{doc.description}</p>}
            </div>
            {isImage(doc.url) && (
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/20 shadow-[var(--shadow-1)]">
                <img
                  src={doc.url}
                  alt={doc.title}
                  className="block h-full w-full max-h-[1080px] object-contain"
                  loading="lazy"
                />
              </div>
            )}
          </GlassCard>
        ))}
      </Reveal>
    </div>
  );
}
