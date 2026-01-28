import snapshot from "@/content/h2genium.snapshot.json";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import type { SnapshotData, SnapshotPage } from "@/types/content";

const privacy: SnapshotPage | undefined = (snapshot as SnapshotData).pages?.find((p) => p.url.includes("/privacy"));
const sanitizeText = (text: string) =>
  text
    .replace(/info@h2genium\.ru/gi, "контактный email")
    .replace(/https?:\/\/(www\.)?h2genium\.ru/gi, "")
    .replace(/\b(www\.)?h2genium\.ru\b/gi, "сайте компании");

export default function PrivacyPage() {
  const paragraphs: string[] = privacy?.paragraphs || [];
  const lists: string[] = privacy?.lists || [];

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Политика конфиденциальности</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Политика конфиденциальности</h1>
        <p className="text-[color:var(--muted)]">Политика сайта HYDROGENIUM.</p>
      </Reveal>
      <Reveal className="space-y-4">
        <GlassCard className="space-y-3">
          {paragraphs.map((text, idx) => (
            <p key={idx} className="text-sm text-[color:var(--muted)]">
              {sanitizeText(text)}
            </p>
          ))}
          {lists.length > 0 && (
            <ul className="list-disc space-y-2 pl-4 text-sm text-[color:var(--muted)]">
              {lists.map((item, idx) => (
                <li key={idx}>{sanitizeText(item)}</li>
              ))}
            </ul>
          )}
        </GlassCard>
      </Reveal>
    </div>
  );
}
