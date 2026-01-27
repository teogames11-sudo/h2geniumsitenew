"use client";

import { useReducedMotion } from "framer-motion";

export const ScanSweep = () => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return <div className="scan-sweep" aria-hidden />;
};
