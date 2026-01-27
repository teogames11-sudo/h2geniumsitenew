"use client";

import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

const columns = ["Ингаляция", "Капсула", "IV", "Carboxy"];
const rows = [
  {
    label: "Формат",
    values: ["групповой/индивидуальный", "трансдермальный", "клинический", "бальнео"],
  },
  {
    label: "Сеанс",
    values: ["20–30 мин", "~20 мин", "по протоколу", "15–20 мин"],
  },
  {
    label: "Пропуск",
    values: ["до 8 чел/час", "до 2 чел/час", "индивидуально", "до 2 чел/час"],
  },
  {
    label: "Фокус",
    values: ["поток и профилактика", "восстановление", "инфузии", "микроциркуляция"],
  },
  {
    label: "Инфраструктура",
    values: ["стандартная вентиляция", "мокрая точка", "мед. кабинет", "водоподготовка"],
  },
];

export const ProtocolComparison = () => {
  return (
    <section className="space-y-5">
      <Reveal className="space-y-2">
        <GlassBadge tone="neutral">Сравнение</GlassBadge>
        <h2 className="text-2xl font-semibold text-[color:var(--text)]">Сравнение протоколов и форматов</h2>
        <p className="max-w-3xl text-[color:var(--muted)]">
          Быстрый ориентир для выбора формата кабинета. Для точного подбора учитываем поток, профиль клиентов и инфраструктуру.
        </p>
      </Reveal>

      <Reveal>
        <GlassCard className="overflow-hidden border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                <tr>
                  <th className="px-4 py-3">Параметр</th>
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 text-[color:var(--text)]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-[color:var(--glass-stroke)]/60">
                    <td className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
                      {row.label}
                    </td>
                    {row.values.map((value, idx) => (
                      <td key={`${row.label}-${idx}`} className="px-4 py-3 text-[color:var(--text)]">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
};

