"use client";

import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const PARTNERS = [
  { name: "Клиники превентивной медицины", focus: "реабилитация" },
  { name: "Сети wellness-центров", focus: "профилактика" },
  { name: "Медицинские SPA", focus: "эстетическая медицина" },
  { name: "Спортивные центры", focus: "восстановление" },
  { name: "Санаторно-курортные сети", focus: "бальнео" },
  { name: "Частные кабинеты", focus: "кабинетный формат" },
];

const CERTS = [
  "Регистрационные удостоверения",
  "Сертификаты соответствия",
  "Методические рекомендации",
  "Протоколы эксплуатации",
];

export const PartnersGallery = () => {
  return (
    <section className="space-y-5">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Партнерства</GlassBadge>
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Доверие, подтвержденное документами</h2>
        <p className="max-w-2xl text-[color:var(--muted)]">
          Мы работаем с клиниками, санаторными сетями и wellness-проектами. Документальная база подтверждает безопасность и готовность решений.
        </p>
      </Reveal>

      <Reveal className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="space-y-4 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[color:var(--text)]">Партнерский контур</div>
              <div className="text-xs text-[color:var(--muted)]">20+ проектов и пилотов</div>
            </div>
            <GlassButton as="a" href="/contacts#form" variant="ghost" className="h-9 px-4 text-xs">
              Обсудить партнерство
            </GlassButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-4 py-3 shadow-[var(--shadow-2)]"
              >
                <div className="text-sm font-semibold text-[color:var(--text)]">{partner.name}</div>
                <div className="text-xs text-[color:var(--muted)]">{partner.focus}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-[color:var(--text)]">Сертификаты и лицензии</div>
            <GlassButton as="a" href="/documents" variant="primary" className="h-9 px-4 text-xs">
              Смотреть документы
            </GlassButton>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/60">
            <img src="/sertificate.png" alt="Сертификат" className="h-52 w-full object-cover" loading="lazy" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,40,0),rgba(10,20,40,0.55))]" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {CERTS.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-2 text-xs font-semibold text-[color:var(--text)]"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
};

