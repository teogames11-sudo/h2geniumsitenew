import { Hero } from "@/components/home/hero";
import { NadhRouter } from "@/components/home/nadh-router";
import { GlassBadge, GlassCard, GlassButton } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const applicationItems = [
  { title: "Каталог", description: "Позиции оборудования и решений." },
  { title: "Применение", description: "Сценарии использования и кабинеты." },
  { title: "Результаты", description: "Кейсы и итоги внедрения." },
  { title: "Сертификат (РУ)", description: "Разрешительная документация." },
  { title: "Публикации", description: "Материалы и ссылки." },
  { title: "Контакты", description: "Связаться с командой H2GENIUM." },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <NadhRouter />

      <section className="rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[var(--shadow-2)] backdrop-blur-2xl sm:p-10">
        <Reveal cascade className="space-y-6">
          <div className="flex items-center gap-3">
            <GlassBadge tone="accent">Навигация</GlassBadge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {applicationItems.map((item, idx) => (
              <GlassCard key={`${item.title}-${idx}`} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-[color:var(--accent-blue)]/10" />
                <div className="relative z-10 space-y-2">
                  <h3 className="text-lg font-semibold text-[color:var(--text)]">{item.title}</h3>
                  <p className="text-sm text-[color:var(--muted)]">{item.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="cta" className="rounded-[28px] border border-white/35 bg-[color:var(--glass-bg)]/80 p-6 shadow-[var(--shadow-1)] backdrop-blur-2xl sm:p-10">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <GlassBadge tone="mint">Заявка</GlassBadge>
            <h3 className="text-2xl font-semibold text-[color:var(--text)]">Оставьте заявку на консультацию</h3>
            <p className="text-[color:var(--muted)]">Ответим на вопросы и подготовим коммерческое предложение.</p>
          </div>
          <div className="flex gap-3">
            <GlassButton as="a" href="/contacts" variant="ghost">
              Контакты
            </GlassButton>
            <GlassButton as="a" href="/contacts#form" variant="primary">
              Оставить заявку
            </GlassButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
