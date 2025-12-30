import documents from "@/content/documents.json";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { DocumentLink } from "@/types/content";

export default function CertificatePage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Сертификат (РУ)</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Разрешительная документация</h1>
        <p className="text-[color:var(--muted)]">Регистрационные удостоверения и сертификаты.</p>
      </Reveal>

      <Reveal className="space-y-3">
        {(documents as DocumentLink[]).map((doc) => (
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
