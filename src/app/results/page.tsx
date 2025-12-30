import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Результаты</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Кейсы и итоги</h1>
        <p className="text-[color:var(--muted)]">
          Здесь собраны ключевые кейсы и результаты внедрения. Каждый кейс отражает практический опыт работы с решениями
          H2GENIUM.
        </p>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((idx) => (
          <GlassCard key={idx} className="space-y-2">
            <h3 className="text-lg font-semibold text-[color:var(--text)]">Кейс {idx}</h3>
          </GlassCard>
        ))}
      </Reveal>
    </div>
  );
}
