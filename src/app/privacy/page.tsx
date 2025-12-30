import snapshot from "@/content/h2genium.snapshot.json";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { SnapshotData, SnapshotPage } from "@/types/content";

const privacy: SnapshotPage | undefined = (snapshot as SnapshotData).pages?.find((p) => p.url.includes("/privacy"));

export default function PrivacyPage() {
  const paragraphs: string[] = privacy?.paragraphs || [];
  const lists: string[] = privacy?.lists || [];

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Политика конфиденциальности</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Политика конфиденциальности</h1>
        <p className="text-[color:var(--muted)]">Политика сайта h2genium.ru.</p>
      </Reveal>
      <Reveal className="space-y-4">
        <GlassCard className="space-y-3">
          {paragraphs.map((text, idx) => (
            <p key={idx} className="text-sm text-[color:var(--muted)]">
              {text}
            </p>
          ))}
          {lists.length > 0 && (
            <ul className="list-disc space-y-2 pl-4 text-sm text-[color:var(--muted)]">
              {lists.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </GlassCard>
      </Reveal>
    </div>
  );
}
