import { GlassBadge } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { NadhRouter } from "@/components/home/nadh-router";
import { EcosystemStory } from "@/components/about/EcosystemStory";
import { EcosystemMap } from "@/components/about/EcosystemMap";
import { TeamGrid } from "@/components/about/TeamGrid";
import { PartnersGallery } from "@/components/about/PartnersGallery";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">О компании</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">H2GENIUM</h1>
        <p className="text-[color:var(--muted)]">Интегратор решений на базе молекулярного водорода для кабинетов, клиник и wellness-проектов.</p>
      </Reveal>

      <EcosystemStory />

      <EcosystemMap />

      <TeamGrid />

      <PartnersGallery />

      <NadhRouter />
    </div>
  );
}

