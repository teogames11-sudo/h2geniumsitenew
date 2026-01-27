"use client";

import { useEffect, useState } from "react";

type PerfMode = "high" | "low";

const STORAGE_KEY = "h2-perf-mode";
let cachedMode: PerfMode | null = null;
const listeners = new Set<(mode: PerfMode) => void>();

const parseMode = (value: string | null): PerfMode | null => {
  if (value === "low" || value === "high") return value;
  return null;
};

const applyMode = (mode: PerfMode) => {
  cachedMode = mode;
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (mode === "low") root.dataset.performance = "low";
    else delete root.dataset.performance;
  }
  listeners.forEach((listener) => listener(mode));
};

const readStoredMode = (): PerfMode | null => {
  if (typeof window === "undefined") return null;
  try {
    return parseMode(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export const setPerformanceMode = (mode: PerfMode) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore storage failures
    }
  }
  applyMode(mode);
};

const initMode = () => {
  const stored = readStoredMode();
  applyMode(stored ?? "high");
};

export const usePerformanceMode = () => {
  const [mode, setLocalMode] = useState<PerfMode>(cachedMode ?? "high");

  useEffect(() => {
    listeners.add(setLocalMode);
    return () => listeners.delete(setLocalMode);
  }, []);

  useEffect(() => {
    if (cachedMode) {
      setLocalMode(cachedMode);
      return;
    }
    initMode();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = parseMode(event.newValue) ?? "high";
      applyMode(next);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return mode;
};
