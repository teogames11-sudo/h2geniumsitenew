"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PAGE_FADE_DURATION } from "@/config/transitions";
import { NAV_ITEMS } from "@/config/nav";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import styles from "./page-transition.module.css";

export const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduceMotion = useReducedMotion();
  const perfMode = usePerformanceMode();
  const lowPerf = perfMode === "low";
  const prevPathRef = useRef(pathname);
  const navOrder = useMemo(
    () => [
      ...NAV_ITEMS.map((item) => item.href),
      "/product",
      "/certificate",
      "/privacy",
      "/cookie",
    ],
    [],
  );
  const transitionMeta = useMemo(() => {
    const from = prevPathRef.current;
    const to = pathname;
    if (from === to) {
      return { from, to, direction: 0 };
    }
    const prevIndex = navOrder.indexOf(from);
    const nextIndex = navOrder.indexOf(to);
    if (prevIndex === -1 || nextIndex === -1) return { from, to, direction: 1 };
    return { from, to, direction: nextIndex >= prevIndex ? 1 : -1 };
  }, [navOrder, pathname]);

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);


  if (reduceMotion || lowPerf) {
    const reducedTransition = {
      duration: Math.max(PAGE_FADE_DURATION, isHome ? 720 : 260) / 1000,
      ease: [0.22, 1, 0.36, 1],
    };
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedTransition}
          style={{ willChange: "opacity" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  const drift = isHome ? 0 : 10;
  const transition = {
    duration: Math.max(PAGE_FADE_DURATION, isHome ? 980 : 720) / 1000,
    ease: [0.22, 1, 0.36, 1],
  };
  const sheenDuration = Math.max(PAGE_FADE_DURATION, 960) / 1000;
  const showSheen = !isHome && !lowPerf;
  const showRipple = !lowPerf && !isHome;

  return (
    <AnimatePresence mode={isHome ? "sync" : "wait"} custom={transitionMeta}>
      <motion.div
        key={pathname}
        custom={transitionMeta}
        initial={(meta) => {
          if (meta.to === "/") {
            return { opacity: 1 };
          }
          if (meta.from === "/") {
            return { opacity: 0, y: 24, scale: 0.97 };
          }
          return {
            opacity: 0,
            y: meta.direction >= 0 ? drift : -drift,
            scale: 0.995,
          };
        }}
        animate={isHome ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={(meta) => {
          if (meta.from === "/") {
            return { opacity: 0, y: -18, scale: 1.03 };
          }
          if (meta.to === "/") {
            return { opacity: 0 };
          }
          return {
            opacity: 0,
            y: meta.direction >= 0 ? -drift : drift,
            scale: 0.995,
          };
        }}
        transition={transition}
        className={styles.transitionShell}
        style={{
          willChange: isHome ? "opacity" : "transform, opacity",
          backfaceVisibility: "hidden",
          transformOrigin: "50% 45%",
          transformPerspective: 1200,
        }}
      >
        {showSheen && (
          <motion.div
            key={`sheen-${pathname}`}
            aria-hidden
            className={styles.transitionSheen}
            custom={transitionMeta}
            initial={(meta) => ({ opacity: 0, x: meta.direction >= 0 ? "-40%" : "40%" })}
            animate={(meta) => ({
              opacity: [0, 0.9, 0],
              x: meta.direction >= 0 ? "120%" : "-120%",
            })}
            transition={{ duration: sheenDuration, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
          />
        )}
        {showRipple && (
          <div
            key={`ripple-${pathname}`}
            className={isHome ? `${styles.transitionRipple} ${styles.transitionRippleHome}` : styles.transitionRipple}
            aria-hidden
          />
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
