"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type SoundKind = "nav" | "cta";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (kind?: SoundKind) => void;
};

type SoundEngine = {
  ctx: AudioContext;
  master: GainNode;
  play: (kind: SoundKind) => void;
  dispose: () => void;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => undefined,
  play: () => undefined,
});

const STORAGE_KEY = "h2genium-ui-sound";

const createEngine = async (): Promise<SoundEngine | null> => {
  const AudioCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;

  const ctx = new AudioCtor();
  const master = ctx.createGain();
  master.gain.value = 0.14;
  master.connect(ctx.destination);

  const play = (kind: SoundKind) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const baseFreq = kind === "cta" ? 520 : 760;
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, now + 0.08);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(kind === "cta" ? 0.14 : 0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.22);
  };

  const dispose = () => {
    master.disconnect();
    ctx.close().catch(() => undefined);
  };

  try {
    await ctx.resume();
  } catch {
    dispose();
    return null;
  }

  return { ctx, master, play, dispose };
};

type SoundProviderProps = {
  children: ReactNode;
  disabled?: boolean;
};

export const SoundProvider = ({ children, disabled = false }: SoundProviderProps) => {
  const [enabled, setEnabled] = useState(false);
  const engineRef = useRef<SoundEngine | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setEnabled(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    if ((!enabled || disabled) && engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }
  }, [disabled, enabled]);

  const ensureEngine = useCallback(async () => {
    if (engineRef.current) return engineRef.current;
    const engine = await createEngine();
    if (!engine) return null;
    engineRef.current = engine;
    return engine;
  }, []);

  const play = useCallback(
    (kind: SoundKind = "nav") => {
      if (!enabled || disabled) return;
      void (async () => {
        const engine = await ensureEngine();
        if (!engine) return;
        engine.play(kind);
      })();
    },
    [disabled, enabled, ensureEngine],
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!enabled || disabled) return;
    const handlePointer = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-ui-sound]");
      if (!target) return;
      const kind = (target.dataset.uiSound as SoundKind) ?? "nav";
      play(kind);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-ui-sound]");
      if (!target) return;
      const kind = (target.dataset.uiSound as SoundKind) ?? "nav";
      play(kind);
    };
    document.addEventListener("pointerdown", handlePointer, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointer, true);
      document.removeEventListener("keydown", handleKey, true);
    };
  }, [disabled, enabled, play]);

  const value = useMemo(
    () => ({ enabled: enabled && !disabled, toggle, play }),
    [disabled, enabled, play, toggle],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useUiSound = () => useContext(SoundContext);
