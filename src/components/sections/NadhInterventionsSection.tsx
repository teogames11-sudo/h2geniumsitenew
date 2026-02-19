"use client";

import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import styles from "./NadhInterventionsSection.module.css";

type CosmeticItem = {
  title: string;
  volume: string;
  composition: string[];
};

const cosmetics: CosmeticItem[] = [
  {
    title: "Крем восстанавливающий",
    volume: "Тело, 250 мл",
    composition: ["NAD+", "Гидролизат коллагена", "Фосфолипиды"],
  },
  {
    title: "Гель-маска с экзосомами",
    volume: "Тело, 500 мл",
    composition: ["NAD+", "Аквабиолис"],
  },
  {
    title: "Маска регенерирующая",
    volume: "Тело, 500 мл",
    composition: ["NAD 2%", "Экзосомы", "Гидролизат коллагена", "Экстракт зеленого чая", "Фосфолипиды"],
  },
  {
    title: "Маска ламинария & пелоид",
    volume: "Тело, 500 мл",
    composition: ["NAD+", "Ламинария", "Спирулина", "Белая глина"],
  },
  {
    title: "Скраб солевой",
    volume: "Тело, 500 мл",
    composition: ["NAD+", "Экстракт ламинарии", "Морская соль Мертвого моря"],
  },
  {
    title: "Пилинг энзимный",
    volume: "Тело, 250 мл",
    composition: ["NAD 2%", "Папаин", "Фруктовая кислота"],
  },
  {
    title: "Пенка очищающая",
    volume: "Лицо, 250 мл",
    composition: ["NAD+", "Мочевина", "Бетаин"],
  },
];

export function NadhInterventionsSection() {
  if (!cosmetics.length) {
    return (
      <GlassCard className={styles.fallback}>
        <p className="text-sm text-[color:var(--muted)]">Каталог косметики временно недоступен.</p>
      </GlassCard>
    );
  }

  return (
    <section className={styles.section} aria-label="NADH и косметика для водородных интервенций">
      <Reveal className={styles.heroWrap}>
        <GlassCard className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <GlassBadge tone="accent">NADH / Косметика HYDROGENIUM</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)] sm:text-3xl">
              Водородные интервенции + уходовые протоколы с NAD+
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
              Логика экосистемы: сочетание водородных интервенций и косметики HYDROGENIUM с акцентом на восстановление
              NAD+ до NADH и пролонгированный эффект программы.
            </p>
            <div className={styles.tags}>
              <span>Корректор эпигенома</span>
              <span>Регенерация</span>
              <span>Метаболизм</span>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <Reveal>
        <div className={styles.grid}>
          {cosmetics.map((item) => (
            <article key={item.title} className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className="text-base font-semibold text-[color:var(--text)]">{item.title}</h3>
                <span className={styles.volume}>{item.volume}</span>
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.08em] text-[color:var(--muted)]">Состав</div>
              <ul className={styles.composition}>
                {item.composition.map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

