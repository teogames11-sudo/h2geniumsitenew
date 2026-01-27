"use client";

import { usePathname } from "next/navigation";
import { GlassButton } from "@/components/ui/glass";

export const StickyCta = () => {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 px-4 py-2 shadow-[0_18px_40px_-18px_rgba(18,110,235,0.55)] backdrop-blur-2xl">
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-[color:var(--text)]">Нужна консультация?</span>
          <span className="text-[11px] text-[color:var(--muted)]">Подбор и расчет за 24 часа</span>
        </div>
        <GlassButton
          as="a"
          href="/contacts#form"
          variant="primary"
          className="h-9 px-4 text-xs shadow-[0_14px_30px_-16px_rgba(18,110,235,0.75)]"
        >
          Запросить КП
        </GlassButton>
      </div>
    </div>
  );
};

