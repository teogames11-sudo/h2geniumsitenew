"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { GlassButton } from "@/components/ui/glass";
import { NAV_ITEMS } from "@/config/nav";
import { GooeyNav } from "@/components/nav/GooeyNav";
import { useNavMorph } from "@/components/transitions/NavMorphProvider";
import { SHOW_HOME_3D_TREE } from "@/lib/featureFlags";
import heroStyles from "@/components/home/CinematicHero.module.css";

type HeaderProps = {
  disableHeroMode?: boolean;
};

export const Header = ({ disableHeroMode = false }: HeaderProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { homeHeaderVisible, isMorphing } = useNavMorph();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tickingRef = useRef(false);
  const scrolledRef = useRef(false);
  const heroMode = !disableHeroMode && isHome && !scrolled;
  const panelMode = !isHome;
  const showArc = false;

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 12;
        if (scrolledRef.current !== nextScrolled) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
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
    if (!SHOW_HOME_3D_TREE) return;
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
      ? "bg-[color:var(--glass-bg)]/45 text-white"
      : "bg-[color:var(--glass-bg)]/78 text-[color:var(--text)]",
    panelMode && "command-panel-module",
  );
  const logoSrc = "/brand/logo-sky-blue.svg";
  const shouldHideOnHome = isHome && !homeHeaderVisible;
  const shouldHideHeader = shouldHideOnHome || isMorphing;
  const headerStyle = {
    opacity: shouldHideHeader ? 0 : 1,
    transform: "translate3d(0,0,0)",
    pointerEvents: shouldHideHeader ? "none" : "auto",
    transition: shouldHideHeader ? "opacity 0ms" : "opacity 320ms ease",
  } as const;

  return (
    <header className={clsx("site-header fixed top-0 z-40 w-full", panelMode && "header-console")} style={headerStyle}>
      {!panelMode && (
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            heroMode
              ? "bg-gradient-to-b from-black/70 via-black/25 to-transparent opacity-70"
              : "bg-gradient-to-b from-[#050b16]/80 via-[#050b16]/35 to-transparent opacity-100",
          )}
        />
      )}
      {!panelMode && <div className="header-curve" aria-hidden />}
      <div
        className={clsx(
          "relative z-10 mx-auto flex w-full max-w-[1680px] justify-center px-4 transition-all sm:px-6 md:px-8",
          scrolled ? "py-2.5" : "py-3.5",
        )}
      >
        <div className="relative grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3 lg:gap-4">
          {isHome && (
            <Link
              href="/"
              aria-label="HYDROGENIUM — на главную"
              className={clsx(
                glassHeader,
                "absolute left-0 top-0 flex h-[72px] min-w-0 shrink-0 items-center justify-center rounded-full px-3.5 sm:h-[82px] sm:px-4.5 lg:h-[88px] lg:px-5.5",
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
          )}

          <div className="header-nav-anchor col-start-2 hidden justify-center justify-self-center xl:flex">
            <GooeyNav
              key={`header-nav-${pathname}`}
              items={NAV_ITEMS}
              ariaLabel="Main navigation"
              className={clsx("header-nav-line flex items-center gap-1 xl:gap-2 2xl:gap-3", showArc && "headerNavArc")}
              itemClassName={clsx(
                heroStyles.navButton,
                heroStyles.homeTile,
                heroStyles.dockButton,
                "inline-flex h-12 min-w-[100px] max-w-[170px] items-center justify-center px-3 text-center text-[11px] font-semibold leading-snug text-white/95 sm:min-w-[104px] sm:max-w-[176px] sm:px-3.5 sm:text-[11px] xl:min-w-[108px] xl:max-w-[190px] xl:px-4 xl:text-[12px] 2xl:min-w-[130px] 2xl:max-w-[210px]",
              )}
              activeClassName={clsx(heroStyles.navButtonActive, "text-white")}
              inactiveClassName=""
              hoverClassName=""
              contentVariant="homeTile"
              particleCount={16}
              particleDistances={[95, 12]}
              particleR={110}
              animationTime={640}
              timeVariance={240}
              colors={[1, 2, 3, 4, 2, 3, 1, 4]}
            />
          </div>

          <div className="col-start-3 flex shrink-0 items-center gap-2 justify-self-end lg:gap-3">
            <button
              className={clsx(
                glassHeader,
                "inline-flex h-11 w-11 items-center justify-center rounded-full xl:hidden",
                panelMode && "command-panel-button",
              )}
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
                      data-ui-sound="nav"
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
                  data-ui-sound="cta"
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
