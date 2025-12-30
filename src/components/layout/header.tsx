"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { GlassButton } from "@/components/ui/glass";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/application", label: "Применение" },
  { href: "/results", label: "Результаты" },
  { href: "/about", label: "О\u00a0компании" },
  { href: "/documents", label: "Документы/РУ" },
  { href: "/publications", label: "Публикации" },
  { href: "/contacts", label: "Контакты" },
];

export const Header = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const glassHeader =
    "rounded-full border border-white/35 bg-white/25 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28),0_8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent" />
      <div
        className={clsx(
          "mx-auto flex w-full max-w-[1560px] items-center justify-between px-5 transition-all sm:px-8",
          scrolled ? "py-2.5" : "py-3.5",
        )}
      >
        <Link href="/" className={clsx(glassHeader, "flex items-center gap-3 px-4 py-2 whitespace-nowrap")}>
          <span className="relative h-6 w-6 shrink-0 sm:h-[26px] sm:w-[26px]">
            <img src="/brand/ogo-green.svg" alt="H2GENIUM" className="h-full w-full object-contain" />
          </span>
          <span className="text-base font-semibold tracking-tight text-[color:var(--text)]">H2GENIUM</span>
        </Link>
        <nav className="hidden items-center gap-2 xl:gap-4 2xl:gap-6 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative rounded-full px-3 py-2 text-[13px] font-semibold text-[color:var(--muted)] transition-colors whitespace-nowrap",
                  !active && "hover:text-[color:var(--text)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/70 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28),0_8px_24px_-12px_rgba(0,0,0,0.18)]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                {active && (
                  <span className="absolute inset-x-3 bottom-[4px] h-[2px] rounded-full bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-cyan)]" />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <GlassButton
            as="a"
            href="#cta"
            variant="primary"
            className="min-w-[170px] justify-center bg-gradient-to-r from-[color:var(--accent-blue)] via-[color:var(--accent-cyan)] to-[color:var(--accent-mint)] shadow-[0_18px_38px_-18px_rgba(18,110,235,0.65)] hover:shadow-[0_22px_52px_-18px_rgba(18,110,235,0.8)] hover:-translate-y-[1px]"
          >
            Оставить заявку
          </GlassButton>
        </div>
        <button
          className={clsx(glassHeader, "inline-flex h-11 w-11 items-center justify-center lg:hidden")}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Открыть меню"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden"
          >
            <div className="mx-4 mb-4 rounded-3xl border border-white/30 bg-[color:var(--glass-bg)]/95 p-4 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28),0_8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "rounded-2xl px-3 py-2 text-sm font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)] whitespace-nowrap",
                        active && "bg-white/60 text-[color:var(--text)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-3">
                <GlassButton
                  as="a"
                  href="#cta"
                  className="w-full justify-center bg-gradient-to-r from-[color:var(--accent-blue)] via-[color:var(--accent-cyan)] to-[color:var(--accent-mint)]"
                  variant="primary"
                >
                  Оставить заявку
                </GlassButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
