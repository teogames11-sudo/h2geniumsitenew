"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
      duration: Math.max(PAGE_FADE_DURATION * 0.58, isHome ? 420 : 240) / 1000,
      ease: [0.22, 1, 0.36, 1],
    };
    return (
      <div className={styles.transitionRoot}>
        <motion.div
          key={pathname}
          initial={{ opacity: isHome ? 0.35 : 0.2 }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={reducedTransition}
          style={{ willChange: "opacity, filter" }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  const drift = isHome ? 0 : 10;
  const transition = {
    duration: Math.max(PAGE_FADE_DURATION, isHome ? 760 : 520) / 1000,
    ease: [0.22, 1, 0.36, 1],
  };
  const sheenDuration = Math.max(PAGE_FADE_DURATION, 960) / 1000;
  const showSheen = false;
  const showRipple = false;

  const initialState = (() => {
    if (transitionMeta.to === "/") {
      return { opacity: 0.36, scale: 1.01, filter: "blur(6px)" };
    }
    if (transitionMeta.from === "/") {
      return { opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" };
    }
    return {
      opacity: 0.08,
      y: transitionMeta.direction >= 0 ? drift : -drift,
      scale: 0.994,
      filter: "blur(5px)",
    };
  })();

  return (
    <div className={styles.transitionRoot}>
      <motion.div
        key={pathname}
        initial={initialState}
        animate={isHome ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={transition}
        className={styles.transitionShell}
        style={{
          willChange: "transform, opacity, filter",
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
      {!isHome && !lowPerf && (
        <motion.div
          key={`veil-${pathname}`}
          aria-hidden
          className={styles.transitionVeil}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.18, 0] }}
          transition={{ duration: transition.duration, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] }}
        />
      )}
    </div>
  );
};
