import documents from "@/content/documents.json";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { DocumentLink } from "@/types/content";

export default function CertificatePage() {
  const docs = documents as DocumentLink[];
  const isImage = (url: string) => /\.(png|jpe?g|webp|gif)$/i.test(url);

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Сертификаты</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Сертификаты и регистрационные удостоверения</h1>
        <p className="text-[color:var(--muted)]">Разрешительные материалы на оборудование HYDROGENIUM.</p>
      </Reveal>

      <Reveal className="space-y-3">
        {docs.length === 0 && (
          <GlassCard>
            <p className="text-[color:var(--muted)]">Сертификаты не найдены.</p>
          </GlassCard>
        )}
        {docs.map((doc) => (
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
