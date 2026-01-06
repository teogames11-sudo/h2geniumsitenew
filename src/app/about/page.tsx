import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { NadhRouter } from "@/components/home/nadh-router";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">О компании</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">H2GENIUM</h1>
        <p className="text-[color:var(--muted)]">Интегратор решений на базе молекулярного водорода для кабинетов, клиник и wellness-проектов.</p>
      </Reveal>

      <NadhRouter />
    </div>
  );
}
