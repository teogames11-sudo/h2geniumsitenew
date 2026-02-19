"use client";

import { Reveal } from "@/components/ui/reveal";
import styles from "./EquipmentCapacityBoard.module.css";

export type CompressorModel = {
  name: string;
  flow: string;
  throughput: number;
  minDuration: string;
  purity: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function EquipmentCapacityBoard({ models }: { models: CompressorModel[] }) {
  if (!models.length) {
    return <p className="text-sm text-[color:var(--muted)]">Линейка оборудования временно недоступна.</p>;
  }

  return (
    <div className={styles.grid}>
      {models.map((model) => {
        const percent = clamp((model.throughput / 8) * 100, 0, 100);
        return (
          <Reveal key={model.name}>
            <article className={styles.card}>
              <div className={styles.cardTop}>
                <h4 className="text-lg font-semibold text-[color:var(--text)]">{model.name}</h4>
                <span className={styles.purity}>{model.purity}</span>
              </div>
              <ul className={styles.specList}>
                <li>
                  Поток H2: <strong>{model.flow}</strong>
                </li>
                <li>
                  Мин. эффективная длительность: <strong>{model.minDuration}</strong>
                </li>
                <li>
                  Пропускная способность: <strong>до {model.throughput} пациентов/час</strong>
                </li>
              </ul>

              <div className={styles.gaugeWrap}>
                <div className={styles.gaugeLabel}>Scale 0-8 пациентов/час</div>
                <div className={styles.gaugeTrack}>
                  <span className={styles.gaugeFill} style={{ width: `${percent}%` }} />
                </div>
                <div className={styles.gaugeTicks}>
                  {[0, 2, 4, 6, 8].map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

