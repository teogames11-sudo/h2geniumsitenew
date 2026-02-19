"use client";

import dynamic from "next/dynamic";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { SectionErrorBoundary } from "@/components/sections/SectionErrorBoundary";
import type { CompressorModel } from "./EquipmentCapacityBoard";
import styles from "./EquipmentEcosystemSection.module.css";

const compressorModels: CompressorModel[] = [
  {
    name: "HYDROGENIUM 6000",
    flow: "до 4000 мл/мин",
    throughput: 4,
    minDuration: "30 минут",
    purity: "Чистота 99,9%",
  },
  {
    name: "HYDROGENIUM 8400",
    flow: "до 5600 мл/мин",
    throughput: 6,
    minDuration: "20 минут",
    purity: "Чистота 99,9%",
  },
  {
    name: "HYDROGENIUM 12000",
    flow: "до 8000 мл/мин",
    throughput: 8,
    minDuration: "30 минут",
    purity: "Чистота 99,9%",
  },
];

const capsules = [
  {
    name: "SPA H01 (лежа)",
    specs: "225×78×116 см, 85 кг",
    compatibility: "Совместима с обертываниями и аппликациями",
    source: "Источник H2: 6000/8400",
  },
  {
    name: "SPA V01 (сидя)",
    specs: "138×76×130 см, 60 кг",
    compatibility: "Компактный формат для процедурного кабинета",
    source: "Источник H2: 6000/8400",
  },
];

const capsuleBenefits = [
  "Эффективная длительность 20 минут.",
  "До 2 пациентов в час.",
  "Синергия физических факторов и H2.",
  "Простое сервисное обслуживание.",
];

const innovations = [
  {
    title: "HYDROGENIUM IV",
    description:
      "Насыщение стерильных растворов H2 и другими газами под избыточным давлением для инфузионных и локальных протоколов.",
  },
  {
    title: "HYDROGENIUM CARBOXY",
    description:
      "Вода с H2 + CO2 (балнео) с фокусом на микроциркуляцию, регенерацию и трофику тканей.",
  },
];

const EquipmentCapacityBoard = dynamic(
  () => import("./EquipmentCapacityBoard").then((module) => module.EquipmentCapacityBoard),
  {
    ssr: false,
    loading: () => <p className="text-sm text-[color:var(--muted)]">Загрузка спецификаций оборудования...</p>,
  },
);

export function EquipmentEcosystemSection() {
  if (!compressorModels.length) {
    return (
      <GlassCard className={styles.fallback}>
        <p className="text-sm text-[color:var(--muted)]">Каталог оборудования временно недоступен.</p>
      </GlassCard>
    );
  }

  return (
    <section className={styles.section} aria-label="Оборудование HYDROGENIUM">
      <Reveal className={styles.heroWrap}>
        <article className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <GlassBadge tone="accent">Оборудование HYDROGENIUM</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)] sm:text-3xl">
              Инфраструктура для безопасной и контролируемой водородной терапии
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
              Решения для клиник, реабилитации, medical spa и спортивной медицины с акцентом на стандартизированную
              эксплуатацию и прогнозируемую пропускную способность.
            </p>
          </div>
        </article>
      </Reveal>

      <Reveal>
        <GlassCard className={styles.blockCard}>
          <div className="space-y-2">
            <GlassBadge tone="mint">Компрессорная линейка</GlassBadge>
            <h3 className="text-xl font-semibold text-[color:var(--text)] sm:text-2xl">Ингаляторы HYDROGENIUM</h3>
          </div>
          <SectionErrorBoundary
            fallback={<p className="text-sm text-[color:var(--muted)]">Не удалось загрузить карточки оборудования.</p>}
          >
            <EquipmentCapacityBoard models={compressorModels} />
          </SectionErrorBoundary>
        </GlassCard>
      </Reveal>

      <div className={styles.cols}>
        <Reveal>
          <GlassCard className={styles.blockCard}>
            <GlassBadge tone="neutral">Трансдермальные капсулы</GlassBadge>
            <div className="mt-3 space-y-3">
              {capsules.map((capsule) => (
                <article key={capsule.name} className={styles.itemCard}>
                  <h4 className="text-base font-semibold text-[color:var(--text)]">{capsule.name}</h4>
                  <p className="text-sm text-[color:var(--muted)]">{capsule.specs}</p>
                  <p className="text-sm text-[color:var(--muted)]">{capsule.compatibility}</p>
                  <p className="text-sm text-[color:var(--muted)]">{capsule.source}</p>
                </article>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard className={styles.blockCard}>
            <GlassBadge tone="neutral">Преимущества формата</GlassBadge>
            <ul className={styles.benefits}>
              {capsuleBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>

      <Reveal>
        <GlassCard className={styles.blockCard}>
          <div className="space-y-2">
            <GlassBadge tone="neutral">Новинки</GlassBadge>
            <h3 className="text-xl font-semibold text-[color:var(--text)] sm:text-2xl">Расширение экосистемы</h3>
          </div>
          <div className={styles.newsGrid}>
            {innovations.map((item) => (
              <article key={item.title} className={styles.newsItem}>
                <h4 className="text-base font-semibold text-[color:var(--text)]">{item.title}</h4>
                <p className="text-sm text-[color:var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

