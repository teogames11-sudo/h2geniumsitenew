"use client";

import { useMemo, useState } from "react";
import { GlassBadge, GlassButton, GlassCard, GlassInput, GlassTabs } from "@/components/ui/glass";

type FormatId = "inhalation" | "capsule" | "iv" | "carboxy";

const formatOptions: { id: FormatId; label: string }[] = [
  { id: "inhalation", label: "Ингаляция" },
  { id: "capsule", label: "Капсула" },
  { id: "iv", label: "IV" },
  { id: "carboxy", label: "Carboxy" },
];

const numberOrZero = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const CabinetConfigurator = () => {
  const [format, setFormat] = useState<FormatId>("inhalation");
  const [clientsPerDay, setClientsPerDay] = useState(24);
  const [workHours, setWorkHours] = useState(8);
  const [avgTicket, setAvgTicket] = useState(3500);
  const [workDays, setWorkDays] = useState(22);
  const [budget, setBudget] = useState(3000000);

  const summary = useMemo(() => {
    const clientsPerHour = workHours > 0 ? clientsPerDay / workHours : 0;
    const tiers = [
      { id: "hydrogenium-6000", name: "HYDROGENIUM 6000", capacity: 4 },
      { id: "hydrogenium-8400", name: "HYDROGENIUM 8400", capacity: 6 },
      { id: "hydrogenium-12000", name: "HYDROGENIUM 12000", capacity: 8 },
    ];

    let recommended = { name: "HYDROGENIUM 6000", capacity: 4 };
    let units = 1;
    let note = "Регулируемый поток, базовый формат.";

    if (format === "inhalation") {
      if (clientsPerHour > 6) {
        recommended = tiers[2];
        note = "Оптимален для высокой нагрузки.";
      } else if (clientsPerHour > 4) {
        recommended = tiers[1];
        note = "Сбалансирован для средних потоков.";
      } else {
        recommended = tiers[0];
      }
      units = Math.max(1, Math.ceil(clientsPerHour / recommended.capacity));
    }

    if (format === "capsule") {
      recommended = { name: "HYDROGENIUM SPA H01/V01", capacity: 2 };
      units = Math.max(1, Math.ceil(clientsPerHour / recommended.capacity));
      note = "Короткий цикл, фокус на медSPA.";
    }

    if (format === "iv") {
      recommended = { name: "HYDROGENIUM IV", capacity: 1 };
      units = Math.max(1, Math.ceil(clientsPerHour / recommended.capacity));
      note = "Интеграция в существующие протоколы.";
    }

    if (format === "carboxy") {
      recommended = { name: "HYDROGENIUM Carboxy", capacity: 2 };
      units = Math.max(1, Math.ceil(clientsPerHour / recommended.capacity));
      note = "Бальнео-формат с водородом и CO2.";
    }

    const monthlyRevenue = clientsPerDay * avgTicket * workDays;
    const paybackMonths = budget > 0 && monthlyRevenue > 0 ? budget / monthlyRevenue : 0;

    return {
      clientsPerHour,
      recommended,
      units,
      note,
      monthlyRevenue,
      paybackMonths,
      monthlyClients: clientsPerDay * workDays,
    };
  }, [avgTicket, budget, clientsPerDay, format, workDays, workHours]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value);

  return (
    <div id="configurator">
      <GlassCard className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <GlassBadge tone="mint">Конфигуратор</GlassBadge>
          <h2 className="text-2xl font-semibold text-[color:var(--text)]">Конфигуратор кабинета</h2>
          <p className="max-w-2xl text-[color:var(--muted)]">
            Заполните параметры кабинета — получите ориентировочную конфигурацию и оценку окупаемости. Расчет без
            учета операционных расходов.
          </p>
        </div>
        <GlassButton as="a" href="/contacts#form" variant="primary" className="min-w-[180px] justify-center">
          Запросить КП
        </GlassButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[color:var(--muted)]">Формат кабинета</div>
            <GlassTabs tabs={formatOptions} initial={format} onChange={(id) => setFormat(id as FormatId)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[color:var(--muted)]">Клиентов в день</label>
              <GlassInput
                type="number"
                min={1}
                value={clientsPerDay}
                onChange={(e) => setClientsPerDay(numberOrZero(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[color:var(--muted)]">Часов работы в день</label>
              <GlassInput
                type="number"
                min={1}
                value={workHours}
                onChange={(e) => setWorkHours(numberOrZero(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[color:var(--muted)]">Средний чек, руб.</label>
              <GlassInput
                type="number"
                min={0}
                step={100}
                value={avgTicket}
                onChange={(e) => setAvgTicket(numberOrZero(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[color:var(--muted)]">Рабочих дней в месяц</label>
              <GlassInput
                type="number"
                min={1}
                value={workDays}
                onChange={(e) => setWorkDays(numberOrZero(e.target.value))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-[color:var(--muted)]">Бюджет запуска, руб.</label>
              <GlassInput
                type="number"
                min={0}
                step={100000}
                value={budget}
                onChange={(e) => setBudget(numberOrZero(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/75 p-5 shadow-[var(--shadow-2)]">
            <div className="text-xs font-semibold text-[color:var(--muted)]">Рекомендуемая конфигурация</div>
            <div className="mt-2 text-xl font-semibold text-[color:var(--text)]">
              {summary.recommended.name} × {summary.units}
            </div>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{summary.note}</p>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--muted)]">Нагрузка, клиентов/час</span>
                <span className="font-semibold text-[color:var(--text)]">{formatNumber(summary.clientsPerHour)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--muted)]">Поток в месяц</span>
                <span className="font-semibold text-[color:var(--text)]">{formatNumber(summary.monthlyClients)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/75 p-5 shadow-[var(--shadow-2)]">
            <div className="text-xs font-semibold text-[color:var(--muted)]">Оценка окупаемости</div>
            <div className="mt-2 text-2xl font-semibold text-[color:var(--text)]">
              {summary.monthlyRevenue > 0 ? `${formatNumber(summary.monthlyRevenue)} руб./мес` : "—"}
            </div>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Окупаемость: {summary.paybackMonths > 0 ? `${formatNumber(summary.paybackMonths)} мес.` : "—"}
            </p>
            <GlassButton as="a" href="/contacts#form" variant="ghost" className="mt-4 w-full justify-center">
              Запросить детальный расчет
            </GlassButton>
          </div>
        </div>
      </div>
      </GlassCard>
    </div>
  );
};
