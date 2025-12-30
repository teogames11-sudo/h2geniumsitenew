"use client";

import Link from "next/link";
import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const heroText = {
  title: "Водородные генераторы для профессиональной терапии",
  description: "Возвращаем молодость и укрепляем здоровье инновационным способом.",
};

const quickLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "Применение", href: "/application" },
  { label: "Результаты", href: "/results" },
  { label: "Сертификат (РУ)", href: "/documents" },
];

export const Hero = () => {
  return (
    <section className="full-bleed relative overflow-hidden pb-14 pt-12 sm:pt-16">
      <div className="absolute inset-0 -z-10 flex items-start justify-center overflow-visible">
        <div className="relative overflow-visible">
          <div
            className="absolute inset-[-90px] rounded-[40px] opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 55% 45%, rgba(47,183,255,0.28), transparent 55%), radial-gradient(circle at 60% 55%, rgba(65,224,196,0.22), transparent 60%)",
              WebkitMaskImage: "radial-gradient(80% 88% at 55% 50%, #000 55%, transparent 100%)",
              maskImage: "radial-gradient(80% 88% at 55% 50%, #000 55%, transparent 100%)",
            }}
          />
          <img
            src="/hero/derevo.png"
            alt="Визуальная сцена дерева H2GENIUM"
            className="h-[760px] w-[1480px] max-w-none object-contain drop-shadow-[0_24px_80px_rgba(18,110,235,0.35)] lg:translate-x-[320px] xl:translate-x-[420px] 2xl:translate-x-[500px]"
            style={{
              maskImage: "radial-gradient(74% 66% at 74% 50%, #000 58%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(74% 66% at 74% 50%, #000 58%, transparent 100%)",
              filter: "blur(1.5px)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[56px] blur-[55px] animate-pulse"
            style={{
              background:
                "radial-gradient(52% 52% at 55% 50%, rgba(47,183,255,0.42) 0%, rgba(47,183,255,0.28) 38%, transparent 76%)",
              WebkitMaskImage: "radial-gradient(82% 88% at 50% 50%, #000 60%, transparent 100%)",
              maskImage: "radial-gradient(82% 88% at 50% 50%, #000 60%, transparent 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[60px] blur-[75px] animate-pulse"
            style={{
              background:
                "radial-gradient(60% 60% at 55% 50%, rgba(47,183,255,0.25) 0%, rgba(47,183,255,0.16) 42%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(88% 94% at 50% 50%, #000 55%, transparent 100%)",
              maskImage: "radial-gradient(88% 94% at 50% 50%, #000 55%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <div className="page-shell relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-7">
            <GlassBadge tone="accent">HYDROGENIUM</GlassBadge>
            <div className="space-y-4">
              <h1 className="text-[clamp(46px,4.5vw,68px)] font-semibold leading-[1.08] text-[color:var(--text)]">
                {heroText.title}
              </h1>
              <p className="text-lg leading-relaxed text-[color:var(--muted)] sm:text-xl">{heroText.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <GlassButton as="a" href="#cta" variant="primary" className="h-12 px-6 text-base">
                Оставить заявку
              </GlassButton>
              <GlassButton as="a" href="/catalog" variant="ghost" className="h-12 px-6 text-base">
                Смотреть каталог
              </GlassButton>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  <GlassCard className="p-3 text-sm font-semibold text-[color:var(--text)]">
                    {item.label}
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[620px]">
            <p className="absolute -bottom-7 left-4 text-xs text-[color:var(--muted)]">(Motion 3D сцена)</p>
          </div>
        </div>
      </div>
    </section>
  );
};
