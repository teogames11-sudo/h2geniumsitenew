"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { SectionErrorBoundary } from "@/components/sections/SectionErrorBoundary";
import styles from "./EnterpriseCabinetSection.module.css";

type ProtocolCard = {
  id: string;
  title: string;
  duration: string;
  frequency: string;
  format: string;
  goal: string;
};

const missionCards = [
  {
    title: "Миссия",
    description:
      "Корпоративное пространство профилактического оздоровления с молекулярной водородной терапией: снижение профессиональной инвалидизации, преждевременного старения и хронической усталости.",
  },
  {
    title: "Подход",
    description:
      "Научно-доказанные неинвазивные методы и регулярный мониторинг состояния сотрудников превращают рабочее место в источник восстановления.",
  },
  {
    title: "Фокус программы",
    description: "Энергия, сон, стресс, концентрация, артериальное давление и метаболический профиль в динамике.",
  },
];

const principles = [
  "Профилактика вместо лечения и долгий горизонт корпоративного здоровья.",
  "Короткие сеансы: 20-30 минут, 2-3 раза в неделю.",
  "Селективная работа молекулярного водорода с оксидативным стрессом.",
  "Противовоспалительное и иммуномодулирующее действие в рамках программ сопровождения.",
  "Поддержка митохондрий и эндотелия с контролем по данным мониторинга и опросников.",
];

const protocols: ProtocolCard[] = [
  {
    id: "cardio",
    title: "Кардио-метаболический риск (40+)",
    duration: "8-12 недель",
    frequency: "3 раза в неделю по 30 минут",
    format: "Ингаляции + водородная вода",
    goal: "Поддержка метаболического и сосудистого профиля в рамках профилактической программы.",
  },
  {
    id: "stress",
    title: "Стресс и выгорание",
    duration: "3-4 недели",
    frequency: "20 минут на сессию",
    format: "Короткие восстановительные протоколы",
    goal: "Снижение выраженности стресса и признаков выгорания в рабочем цикле.",
  },
  {
    id: "shift",
    title: "Сменные и ночные команды",
    duration: "Встроено в график смен",
    frequency: "До или после смены",
    format: "Ингаляция + водородная вода",
    goal: "Поддержка бодрствования и восстановления при нестабильных циркадных нагрузках.",
  },
  {
    id: "oda",
    title: "Программы для ОДА",
    duration: "По курсовому плану",
    frequency: "Согласно протоколу кабинета",
    format: "Ингаляции + локальные аппликации водородной воды",
    goal: "Поддержка восстановительных программ для опорно-двигательного аппарата.",
  },
  {
    id: "silver",
    title: "Серебряное ядро (45-60)",
    duration: "Пролонгированная поддержка",
    frequency: "Регулярно в течение цикла",
    format: "Мониторинг + когнитивный тренинг + водородные сессии",
    goal: "Стабильное сопровождение ресурсного и когнитивного статуса сотрудников 45-60 лет.",
  },
];

const services = [
  {
    title: "Ингаляции H2 2-4% через канюли",
    description: "Сеансы в разных форматах с обязательной оценкой противопоказаний и мониторингом SpO2, АД и ЧСС.",
  },
  {
    title: "Водородная вода 12-16 ppm",
    description: "Прием, курсы и аппликации; активность сохраняется до 6-8 часов при правильном хранении.",
  },
  {
    title: "Комплексные релакс-сеансы",
    description: "Ингаляция + свет/звук + кресло, продолжительность 30-40 минут.",
  },
];

const standards = [
  "Первичное и периодическое измерение АД, ЧСС и SpO2.",
  "Опросники: сон, усталость, выгорание, тревога.",
  "По требованию: анализ ВСР (вариабельность сердечного ритма).",
  "Пример режима: утро 08:00-12:00, день 12:00-17:00, вечер 17:00-20:00.",
  "Контроль противопоказаний: абсолютные и относительные.",
];

const sessionFlow = ["Подготовка", "Процедура", "Финал"];

const EnterpriseCabinetInsights = dynamic(
  () => import("./EnterpriseCabinetInsights").then((module) => module.EnterpriseCabinetInsights),
  {
    ssr: false,
    loading: () => (
      <GlassCard className={styles.loading}>
        <p className="text-sm text-[color:var(--muted)]">Загрузка диаграмм и roadmap...</p>
      </GlassCard>
    ),
  },
);

export function EnterpriseCabinetSection() {
  const [activeProtocol, setActiveProtocol] = useState(protocols[0]?.id ?? "");
  const introRef = useRef<HTMLElement | null>(null);

  const currentProtocol = useMemo(
    () => protocols.find((item) => item.id === activeProtocol) ?? protocols[0],
    [activeProtocol],
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const element = introRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    element.style.setProperty("--pointer-x", x.toFixed(3));
    element.style.setProperty("--pointer-y", y.toFixed(3));
  };

  const handlePointerLeave = () => {
    const element = introRef.current;
    if (!element) return;
    element.style.setProperty("--pointer-x", "0");
    element.style.setProperty("--pointer-y", "0");
  };

  if (!protocols.length || !services.length) {
    return (
      <GlassCard className={styles.loading}>
        <p className="text-sm text-[color:var(--muted)]">Контент программы временно недоступен.</p>
      </GlassCard>
    );
  }

  return (
    <section className={styles.section} aria-label="Кабинет водородного здоровья предприятия">
      <Reveal className={styles.sectionIntro}>
        <article
          ref={introRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={styles.hero}
        >
          <div className={styles.heroGlow} />
          <div className={styles.heroContent}>
            <GlassBadge tone="accent">Кабинет водородного здоровья предприятия</GlassBadge>
            <h2 className="text-2xl font-semibold text-[color:var(--text)] sm:text-3xl">
              Экосистема корпоративной профилактики на базе молекулярного водорода
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
              Формат кабинета объединяет неинвазивные протоколы и наблюдение по данным, чтобы рабочая среда давала не
              только нагрузку, но и ресурс восстановления.
            </p>
          </div>
        </article>
      </Reveal>

      <div className={styles.missionGrid}>
        {missionCards.map((card) => (
          <Reveal key={card.title}>
            <GlassCard className={styles.missionCard}>
              <h3 className="text-lg font-semibold text-[color:var(--text)]">{card.title}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--muted)]">{card.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="space-y-4">
        <GlassCard className={styles.principlesCard}>
          <div className="space-y-2">
            <GlassBadge tone="neutral">Принципы программы</GlassBadge>
            <h3 className="text-xl font-semibold text-[color:var(--text)] sm:text-2xl">Профилактический контур</h3>
          </div>
          <ul className={styles.principlesList}>
            {principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal className="space-y-4">
        <GlassCard className={styles.protocolCard}>
          <div className="space-y-2">
            <GlassBadge tone="mint">Целевые протоколы</GlassBadge>
            <h3 className="text-xl font-semibold text-[color:var(--text)] sm:text-2xl">Группы и сценарии применения</h3>
          </div>

          <div className={styles.protocolTabs} role="tablist" aria-label="Выбор целевой группы">
            {protocols.map((item, index) => (
              <button
                key={item.id}
                id={`protocol-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={item.id === currentProtocol.id}
                aria-controls={`protocol-panel-${item.id}`}
                onClick={() => setActiveProtocol(item.id)}
                className={clsx(styles.protocolTab, item.id === currentProtocol.id && styles.protocolTabActive)}
              >
                <span className={styles.protocolStep}>{index + 1}</span>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <article
            id={`protocol-panel-${currentProtocol.id}`}
            role="tabpanel"
            aria-labelledby={`protocol-tab-${currentProtocol.id}`}
            className={styles.protocolPanel}
          >
            <div className={styles.protocolMeta}>
              <div>
                <span className={styles.metaLabel}>Длительность</span>
                <span className={styles.metaValue}>{currentProtocol.duration}</span>
              </div>
              <div>
                <span className={styles.metaLabel}>Частота</span>
                <span className={styles.metaValue}>{currentProtocol.frequency}</span>
              </div>
              <div>
                <span className={styles.metaLabel}>Формат</span>
                <span className={styles.metaValue}>{currentProtocol.format}</span>
              </div>
            </div>
            <p className="text-sm text-[color:var(--muted)]">{currentProtocol.goal}</p>
          </article>
        </GlassCard>
      </Reveal>

      <div className={styles.twoColumnGrid}>
        <Reveal>
          <GlassCard className={styles.infoCard}>
            <GlassBadge tone="neutral">Услуги</GlassBadge>
            <div className="mt-3 space-y-3">
              {services.map((item) => (
                <article key={item.title} className={styles.infoRow}>
                  <h4 className="text-sm font-semibold text-[color:var(--text)]">{item.title}</h4>
                  <p className="text-sm text-[color:var(--muted)]">{item.description}</p>
                </article>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard className={styles.infoCard}>
            <GlassBadge tone="neutral">Стандарты и безопасность</GlassBadge>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
              {standards.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.flowRow}>
              {sessionFlow.map((step, index) => (
                <div key={step} className={styles.flowStep}>
                  <span>{step}</span>
                  {index < sessionFlow.length - 1 && <span className={styles.flowArrow}>→</span>}
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>

      <SectionErrorBoundary
        fallback={
          <GlassCard className={styles.loading}>
            <p className="text-sm text-[color:var(--muted)]">Блок метрик и roadmap временно недоступен.</p>
          </GlassCard>
        }
      >
        <EnterpriseCabinetInsights />
      </SectionErrorBoundary>
    </section>
  );
}
