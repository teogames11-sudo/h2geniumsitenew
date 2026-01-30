"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

type Hotspot = {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
};

type Room = {
  id: string;
  title: string;
  description: string;
  image: string;
  stats: { label: string; value: string }[];
  hotspots: Hotspot[];
};

const ROOMS: Room[] = [
  {
    id: "inhalation",
    title: "Ингаляционный кабинет",
    description: "Формат для потоковой работы с клиентами, регулируемый поток молекулярного водорода и прозрачные регламенты контроля.",
    image: "/assets/rooms/inhalation.jpg",
    stats: [
      { label: "Сеанс", value: "20–30 мин" },
      { label: "Поток", value: "до 8000 мл/мин" },
      { label: "Пропуск", value: "до 8 чел/час" },
    ],
    hotspots: [
      { id: "flow", label: "Поток H2", text: "Точное управление потоком для разных протоколов.", x: 28, y: 38 },
      { id: "control", label: "Контроль", text: "Панель мониторинга параметров и тайминг сеанса.", x: 64, y: 32 },
      { id: "comfort", label: "Комфорт", text: "Зона ожидания и сценарии сопровождения клиента.", x: 70, y: 70 },
    ],
  },
  {
    id: "capsule",
    title: "Капсула H2 SPA",
    description: "Трансдермальный формат с мультисенсорным воздействием: тепло, арома, фитотерапия и водород.",
    image: "/assets/rooms/capsule.jpg",
    stats: [
      { label: "Сеанс", value: "20 мин" },
      { label: "Формат", value: "сидя/лежа" },
      { label: "Поток", value: "до 2 чел/час" },
    ],
    hotspots: [
      { id: "program", label: "Сценарии", text: "Программы экспозиции под задачи клиента.", x: 30, y: 52 },
      { id: "therapy", label: "Терапия", text: "Сочетание тепла и водорода для восстановления.", x: 62, y: 44 },
      { id: "care", label: "Сервис", text: "Гибкая настройка персоналом и быстрый оборот.", x: 70, y: 72 },
    ],
  },
  {
    id: "iv",
    title: "HYDROGENIUM IV",
    description: "Интеграция в протоколы инфузионной терапии с контролируемой концентрацией водорода.",
    image: "/assets/rooms/iv.jpg",
    stats: [
      { label: "Режим", value: "по протоколу" },
      { label: "Контроль", value: "концентрация газа" },
      { label: "Формат", value: "индивидуально" },
    ],
    hotspots: [
      { id: "solution", label: "Растворы", text: "Подготовка стерильных растворов с H2.", x: 36, y: 38 },
      { id: "monitor", label: "Мониторинг", text: "Контроль параметров для клинических протоколов.", x: 66, y: 36 },
      { id: "workflow", label: "Процесс", text: "Интеграция в существующую схему процедур.", x: 72, y: 70 },
    ],
  },
  {
    id: "carboxy",
    title: "HYDROGENIUM Carboxy",
    description: "Бальнео-формат с водородом и CO2 для восстановительных и реабилитационных программ.",
    image: "/assets/rooms/carboxy.jpg",
    stats: [
      { label: "Режим", value: "контролируемый" },
      { label: "Эффект", value: "микроциркуляция" },
      { label: "Формат", value: "бальнео" },
    ],
    hotspots: [
      { id: "h2co2", label: "H2 + CO2", text: "Синергия водорода и углекислого газа.", x: 32, y: 42 },
      { id: "bath", label: "Бальнео", text: "Локальные и общие процедуры.", x: 62, y: 46 },
      { id: "service", label: "Сервис", text: "Контроль водоподготовки и сценариев.", x: 76, y: 70 },
    ],
  },
];

export const CabinetTour = () => {
  const defaultRoom = useMemo(() => ROOMS.find((room) => room.id === "capsule") ?? ROOMS[0], []);
  const [activeId, setActiveId] = useState(defaultRoom.id);
  const activeRoom = useMemo(() => ROOMS.find((room) => room.id === activeId) ?? defaultRoom, [activeId, defaultRoom]);
  const [activeHotspot, setActiveHotspot] = useState(defaultRoom.hotspots[0]?.id ?? "");

  useEffect(() => {
    setActiveHotspot(activeRoom.hotspots[0]?.id ?? "");
  }, [activeRoom.id]);

  return (
    <section className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Обзор кабинетов</GlassBadge>
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Погружение в кабинеты HYDROGENIUM</h2>
        <p className="max-w-3xl text-[color:var(--muted)]">
          Переключайтесь между форматами и изучайте ключевые зоны кабинета.
        </p>
      </Reveal>

      <Reveal className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <GlassCard className="relative overflow-hidden border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 p-4 sm:p-6">
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/40">
            <img
              src={activeRoom.image}
              alt={activeRoom.title}
              className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[480px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.2),rgba(5,12,24,0.7))]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(47,183,255,0.18),transparent_55%)]" />
            {activeRoom.hotspots.map((spot) => {
              const isActive = spot.id === activeHotspot;
              const isLower = spot.y > 60;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspot(spot.id)}
                  className={clsx(
                    "group absolute -translate-x-1/2 -translate-y-1/2",
                    isActive ? "z-10" : "z-0",
                  )}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  aria-pressed={isActive}
                >
                  <span
                    className={clsx(
                      "cabinet-hotspot__ring relative flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--glass-stroke)] bg-[rgba(10,20,40,0.8)] shadow-[0_14px_36px_-18px_rgba(18,110,235,0.6)] transition",
                      isActive ? "scale-105" : "opacity-80",
                    )}
                  >
                    <span className="cabinet-hotspot__pulse" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--accent-cyan)] shadow-[0_0_12px_rgba(65,224,196,0.7)]" />
                  </span>
                  {isActive && (
                    <span
                      className={clsx(
                        "pointer-events-none absolute left-1/2 w-[220px] -translate-x-1/2 rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 p-3 text-left text-xs text-[color:var(--muted)] shadow-[var(--shadow-1)] backdrop-blur-2xl",
                        isLower ? "bottom-full mb-3" : "top-full mt-3",
                      )}
                    >
                      <span className="block text-sm font-semibold text-[color:var(--text)]">{spot.label}</span>
                      <span className="mt-1 block leading-relaxed">{spot.text}</span>
                      <span
                        className={clsx(
                          "absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90",
                          isLower ? "bottom-0 translate-y-1/2" : "top-0 -translate-y-1/2",
                        )}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {ROOMS.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveId(room.id)}
                className={clsx(
                  "rounded-full border border-[color:var(--glass-stroke)] px-4 py-1.5 text-xs font-semibold transition",
                  room.id === activeId
                    ? "bg-[color:var(--glass-bg)]/90 text-[color:var(--text)] shadow-[var(--shadow-2)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)]",
                )}
              >
                {room.title}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="space-y-3 border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85">
            <div>
              <div className="text-lg font-semibold text-[color:var(--text)]">{activeRoom.title}</div>
            </div>
            <p className="text-sm text-[color:var(--muted)]">{activeRoom.description}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {activeRoom.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-3 py-2"
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">{stat.label}</div>
                  <div className="text-sm font-semibold text-[color:var(--text)]">{stat.value}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-3 sm:grid-cols-2">
            <GlassButton as="a" href="/contacts#form" variant="primary" className="w-full justify-center">
              Запросить презентацию
            </GlassButton>
            <GlassButton as="a" href="/contacts#form" variant="ghost" className="w-full justify-center">
              Запросить планировку
            </GlassButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

