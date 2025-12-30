import snapshot from "@/content/h2genium.snapshot.json";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { SnapshotData, SnapshotPage } from "@/types/content";

const cookie: SnapshotPage | undefined = (snapshot as SnapshotData).pages?.find((p) => p.url.includes("/cookie"));

export default function CookiePage() {
  const paragraphs: string[] = cookie?.paragraphs || [];
  const lists: string[] = cookie?.lists || [];

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Cookie</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Политика cookie</h1>
        <p className="text-[color:var(--muted)]">Информация об использовании файлов cookie на h2genium.ru.</p>
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
