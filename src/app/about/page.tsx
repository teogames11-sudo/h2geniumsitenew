import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { NadhRouter } from "@/components/home/nadh-router";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">О компании</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">H2GENIUM</h1>
        <p className="text-[color:var(--muted)]">
          Наша компания специализируется на продаже оборудования для водородной терапии.
        </p>
      </Reveal>

      <Reveal className="grid gap-4">
        <GlassCard className="space-y-3 p-6 md:p-8">
          <h3 className="text-2xl font-semibold text-[color:var(--text)]">Специализация</h3>
          <p className="text-base leading-relaxed text-[color:var(--muted)]">
            Наша компания специализируется на продаже оборудования для водородной терапии.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3 p-6 md:p-8">
          <h3 className="text-2xl font-semibold text-[color:var(--text)]">Оборудование</h3>
          <p className="text-base leading-relaxed text-[color:var(--muted)]">
            Мы предлагаем широкий ассортимент оборудования, включая водородные ингаляторы, водородные генераторы для доставки молекулярного водорода в организм и другие продукты для поддержания здоровья и укрепления иммунитета.
          </p>
        </GlassCard>
      </Reveal>

      <NadhRouter />
    </div>
  );
}
