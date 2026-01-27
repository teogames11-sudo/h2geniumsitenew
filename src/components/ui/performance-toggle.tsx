"use client";

import { setPerformanceMode, usePerformanceMode } from "@/hooks/usePerformanceMode";
import styles from "./performance-toggle.module.css";

export const PerformanceToggle = () => {
  const mode = usePerformanceMode();
  const isLow = mode === "low";

  return (
    <button
      type="button"
      className={`${styles.toggle} ${isLow ? styles.low : styles.high}`}
      onClick={() => setPerformanceMode(isLow ? "high" : "low")}
      aria-pressed={isLow}
      aria-label={isLow ? "Enable full effects" : "Enable performance mode"}
    >
      <span className={styles.label}>FX</span>
      <span className={styles.mode}>{isLow ? "LITE" : "FULL"}</span>
      <span className={styles.dot} aria-hidden />
    </button>
  );
};
