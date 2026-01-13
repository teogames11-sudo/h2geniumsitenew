"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { GlassButton } from "@/components/ui/glass";
import { NAV_ITEMS } from "@/lib/nav";

export const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastYRef = useRef(0);
  const lastDirRef = useRef<"up" | "down">("up");
  const tickingRef = useRef(false);
  const scrolledRef = useRef(false);
  const visibleRef = useRef(true);
  const heroMode = isHome && !scrolled;

  useEffect(() => {
    const hideAt = 160;
    const showAt = 80;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const delta = currentY - lastYRef.current;
        const dir = delta > 6 ? "down" : delta < -6 ? "up" : lastDirRef.current;
        lastDirRef.current = dir;
        const nextScrolled = currentY > 12;
        if (scrolledRef.current !== nextScrolled) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
        if (visibleRef.current && dir === "down" && currentY > hideAt) {
          visibleRef.current = false;
          setVisible(false);
        } else if (!visibleRef.current && dir === "up" && currentY < showAt) {
          visibleRef.current = true;
          setVisible(true);
        }
        lastYRef.current = currentY;
        tickingRef.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const idleCb: typeof window.requestIdleCallback =
      // @ts-expect-error - not available in all browsers
      window.requestIdleCallback ?? ((fn: IdleRequestCallback) => window.setTimeout(fn, 600));
    // @ts-expect-error - not available in all browsers
    const cancelIdle: typeof window.cancelIdleCallback = window.cancelIdleCallback ?? clearTimeout;
    const id = idleCb(() => {
      import("@/components/home/SceneTree").catch(() => undefined);
    });
    return () => cancelIdle(id);
  }, []);

  const glassHeader = clsx(
    "rounded-full border border-[color:var(--glass-stroke)] backdrop-blur-2xl",
    heroMode
      ? "bg-[color:var(--glass-bg)]/45 text-white shadow-[0_20px_60px_-28px_rgba(0,0,0,0.65),0_10px_30px_-18px_rgba(0,0,0,0.35)]"
      : "bg-[color:var(--glass-bg)]/78 text-[color:var(--text)] shadow-[0_20px_60px_-28px_rgba(0,0,0,0.45),0_10px_30px_-18px_rgba(0,0,0,0.3)]",
  );
  const logoSrc = "/brand/logo-sky-blue.svg";
  const navText = heroMode ? "text-white/70" : "text-[color:var(--muted)]";
  const navActiveText = heroMode ? "text-white" : "text-[color:var(--text)]";
  const navHover = heroMode ? "hover:text-white" : "hover:text-[color:var(--text)]";

  if (isHome) {
    return null;
  }

  return (
    <header className="fixed top-0 z-40 w-full">
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          heroMode
            ? "bg-gradient-to-b from-black/70 via-black/25 to-transparent opacity-70"
            : "bg-gradient-to-b from-[#050b16]/80 via-[#050b16]/35 to-transparent opacity-100",
        )}
      />
      <div
        className={clsx(
          "mx-auto flex w-full max-w-[1560px] justify-center px-4 transition-all sm:px-6 md:px-8",
          scrolled ? "py-2.5" : "py-3.5",
        )}
        style={{
          transform: visible ? "translate3d(0,0,0)" : "translate3d(0,-130%,0)",
          opacity: visible ? 1 : 0,
          transition: "transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="flex w-full items-center justify-between gap-2 sm:gap-3 lg:gap-4">
          <Link
            href="/"
            aria-label="HYDROGENIUM — на главную"
            className={clsx(
              glassHeader,
              "flex h-[72px] min-w-0 shrink-0 items-center justify-center rounded-full px-3.5 sm:h-[82px] sm:px-4.5 lg:h-[88px] lg:px-5.5",
            )}
          >
            <span className="relative h-[78px] w-[78px] shrink-0 sm:h-[86px] sm:w-[86px] lg:h-[92px] lg:w-[92px]">
              <img
                src={logoSrc}
                alt="Hydrogenium NADH+"
                className="h-full w-full object-contain drop-shadow-[0_14px_36px_rgba(18,110,235,0.55)]"
              />
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <div
              className={clsx(
                glassHeader,
                "inline-flex min-w-[680px] items-center gap-1 rounded-full px-3 py-2.5 lg:px-4 lg:py-3 xl:px-5",
              )}
            >
              <nav className="flex items-center gap-1 xl:gap-2 2xl:gap-3">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold transition-colors",
                        active ? navActiveText : navText,
                        !active && navHover,
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className={clsx(
                            "absolute inset-0 rounded-full shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28),0_8px_24px_-12px_rgba(0,0,0,0.18)]",
                            heroMode ? "bg-[color:var(--glass-bg)]/50" : "bg-[color:var(--glass-bg)]/80",
                          )}
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
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <GlassButton
              as="a"
              href="/contacts#form"
              variant="primary"
              className="glass-surface h-11 min-w-[118px] justify-center rounded-full bg-gradient-to-r from-[color:var(--accent-blue)] via-[color:var(--accent-cyan)] to-[color:var(--accent-mint)] text-sm font-semibold shadow-[0_18px_38px_-18px_rgba(18,110,235,0.65)] hover:shadow-[0_22px_52px_-18px_rgba(18,110,235,0.8)] sm:h-12 sm:min-w-[150px]"
            >
              <span className="hidden sm:inline">Оставить заявку</span>
              <span className="sm:hidden">Заявка</span>
            </GlassButton>

            <button
              className={clsx(glassHeader, "inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden")}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
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
            <div className="mx-4 mb-4 rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/95 p-4 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28),0_8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={clsx(
                        "whitespace-nowrap rounded-2xl px-3 py-2 text-sm font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]",
                        active && "bg-[color:var(--glass-bg)]/80 text-white",
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
                  href="/contacts#form"
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
    </header>
  );
};
