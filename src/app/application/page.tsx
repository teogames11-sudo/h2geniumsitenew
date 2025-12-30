import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const rooms = ["Комната 1", "Комната 2", "Комната 3", "Комната 4"];

export default function ApplicationPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Применение</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Кабинеты и сценарии</h1>
      </Reveal>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_0%_10%,rgba(47,183,255,0.2),transparent_35%),radial-gradient(circle_at_100%_90%,rgba(65,224,196,0.2),transparent_32%)] blur-[32px]" />
        <div className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen">
          <div className="absolute left-[-80px] top-1/4 h-1 w-48 skew-x-[18deg] bg-gradient-to-r from-transparent via-[rgba(47,183,255,0.9)] to-transparent blur-lg animate-pulse" />
          <div className="absolute right-[-80px] top-2/3 h-1 w-60 skew-x-[-18deg] bg-gradient-to-r from-transparent via-[rgba(65,224,196,0.9)] to-transparent blur-lg animate-pulse delay-150" />
        </div>

        <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room, idx) => (
            <GlassCard
              key={room}
              className={`relative space-y-3 p-6 ${idx === 0 ? "md:col-span-2 xl:col-span-3" : ""}`}
            >
              <GlassBadge tone="neutral">{`0${idx + 1}`}</GlassBadge>
              <h3 className="text-xl font-semibold text-[color:var(--text)]">{room}</h3>
              {idx === 0 && (
                <div className="relative overflow-hidden rounded-3xl border border-white/40 shadow-[var(--shadow-1)]">
                  <div className="pointer-events-none absolute inset-[-10px] rounded-[30px] border border-[color:var(--accent-blue)]/30 blur-lg animate-pulse" />
                  <img
                    src="/application/apparat.png"
                    alt="Аппарат"
                    className="h-[400px] w-full object-cover"
                  />
                </div>
              )}
            </GlassCard>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
