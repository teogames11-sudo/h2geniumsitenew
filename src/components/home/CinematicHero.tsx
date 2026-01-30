"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { NAV_ITEMS } from "@/config/nav";
import { GooeyNav } from "@/components/nav/GooeyNav";
import { useNavMorph } from "@/components/transitions/NavMorphProvider";
import { SplashCursor } from "@/components/ui/SplashCursor";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import styles from "./CinematicHero.module.css";

const TITLE_TOP = "ЭКОСИСТЕМА";
const TITLE_BOTTOM = "HYDROGENIUM";
const TITLE = `${TITLE_TOP} ${TITLE_BOTTOM}`;
const NAV_NADH_KEY = "nadh";
const NAV_CABINETS_KEY = "cabinets";
const ENABLE_NAV_MAGNET = false;
const SPLASH_DURATION = 2800;
const SPLASH_FORCE = 3200;
const PARALLAX_X = 34;
const PARALLAX_Y = 28;
const STAR_PARALLAX = 2.1;
const STAR_BLUR = 14;
const VIDEO_SOURCES = [
  "/video/1 VID 4K.mp4",
  "/video/2 VID 4K.mp4",
];
const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const createStars = (
  count: number,
  seed: number,
  options: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    sizeMin: number;
    sizeMax: number;
    opacityMin: number;
    opacityMax: number;
  },
) => {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }).map((_, idx) => {
    const x = options.xMin + rnd() * (options.xMax - options.xMin);
    const y = options.yMin + rnd() * (options.yMax - options.yMin);
    const size = options.sizeMin + rnd() * (options.sizeMax - options.sizeMin);
    const twinkle = 3 + rnd() * 2.4;
    const delay = rnd() * 1.6;
    const floatX = (rnd() - 0.5) * 18;
    const floatY = (rnd() - 0.5) * 18;
    const floatDuration = 11 + rnd() * 6;
    const spread = 18 + rnd() * 16;
    const influence = 200 + rnd() * 140;
    const opacity = options.opacityMin + rnd() * (options.opacityMax - options.opacityMin);
    return {
      id: `star-auto-${seed}-${idx}`,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      size: Number(size.toFixed(2)),
      twinkle: Number(twinkle.toFixed(2)),
      delay: Number(delay.toFixed(2)),
      floatX: Number(floatX.toFixed(2)),
      floatY: Number(floatY.toFixed(2)),
      floatDuration: Number(floatDuration.toFixed(2)),
      spread: Number(spread.toFixed(2)),
      influence: Number(influence.toFixed(2)),
      opacity: Number(opacity.toFixed(2)),
    };
  });
};

const BASE_STARFIELD = [
  { id: "star-1", x: 6, y: 10, size: 1.6, twinkle: 3.8, delay: 0.2, floatX: 14, floatY: -10, floatDuration: 12, spread: 26, influence: 220, opacity: 0.9 },
  { id: "star-2", x: 12, y: 22, size: 2.2, twinkle: 4.4, delay: 0.7, floatX: -12, floatY: 16, floatDuration: 14, spread: 28, influence: 260, opacity: 0.85 },
  { id: "star-3", x: 18, y: 6, size: 1.2, twinkle: 3.4, delay: 1.1, floatX: 10, floatY: 8, floatDuration: 11, spread: 20, influence: 200, opacity: 0.8 },
  { id: "star-4", x: 24, y: 28, size: 1.9, twinkle: 4.1, delay: 0.4, floatX: -10, floatY: -12, floatDuration: 13, spread: 30, influence: 240, opacity: 0.9 },
  { id: "star-5", x: 30, y: 14, size: 1.5, twinkle: 3.6, delay: 0.9, floatX: 16, floatY: 10, floatDuration: 12.5, spread: 22, influence: 210, opacity: 0.86 },
  { id: "star-6", x: 36, y: 32, size: 2.4, twinkle: 4.6, delay: 0.5, floatX: -14, floatY: 12, floatDuration: 15, spread: 34, influence: 280, opacity: 0.9 },
  { id: "star-7", x: 42, y: 8, size: 1.3, twinkle: 3.2, delay: 1.3, floatX: 12, floatY: -14, floatDuration: 12, spread: 18, influence: 190, opacity: 0.8 },
  { id: "star-8", x: 48, y: 20, size: 2.1, twinkle: 4.2, delay: 0.6, floatX: -16, floatY: 14, floatDuration: 13.5, spread: 30, influence: 260, opacity: 0.88 },
  { id: "star-9", x: 54, y: 34, size: 1.4, twinkle: 3.7, delay: 0.8, floatX: 14, floatY: -10, floatDuration: 12.5, spread: 24, influence: 230, opacity: 0.82 },
  { id: "star-10", x: 60, y: 12, size: 1.8, twinkle: 4.1, delay: 1.4, floatX: -10, floatY: 12, floatDuration: 14.5, spread: 26, influence: 240, opacity: 0.9 },
  { id: "star-11", x: 66, y: 26, size: 2.6, twinkle: 4.8, delay: 0.3, floatX: 18, floatY: -16, floatDuration: 16, spread: 36, influence: 300, opacity: 0.92 },
  { id: "star-12", x: 72, y: 8, size: 1.2, twinkle: 3.5, delay: 1.2, floatX: -8, floatY: 10, floatDuration: 11.5, spread: 20, influence: 200, opacity: 0.78 },
  { id: "star-13", x: 78, y: 18, size: 1.7, twinkle: 4.0, delay: 0.9, floatX: 12, floatY: 14, floatDuration: 13, spread: 24, influence: 230, opacity: 0.86 },
  { id: "star-14", x: 84, y: 30, size: 2.3, twinkle: 4.5, delay: 0.5, floatX: -16, floatY: -12, floatDuration: 15, spread: 32, influence: 270, opacity: 0.9 },
  { id: "star-15", x: 90, y: 14, size: 1.4, twinkle: 3.6, delay: 1.6, floatX: 10, floatY: 12, floatDuration: 12.2, spread: 22, influence: 220, opacity: 0.82 },
  { id: "star-16", x: 16, y: 38, size: 1.6, twinkle: 3.9, delay: 0.4, floatX: -12, floatY: 8, floatDuration: 13.8, spread: 26, influence: 240, opacity: 0.86 },
  { id: "star-17", x: 26, y: 42, size: 2.0, twinkle: 4.3, delay: 0.8, floatX: 14, floatY: -12, floatDuration: 14.2, spread: 30, influence: 260, opacity: 0.88 },
  { id: "star-18", x: 38, y: 44, size: 1.3, twinkle: 3.3, delay: 1.1, floatX: -10, floatY: 14, floatDuration: 12.8, spread: 20, influence: 210, opacity: 0.78 },
  { id: "star-19", x: 50, y: 40, size: 2.2, twinkle: 4.6, delay: 0.5, floatX: 16, floatY: -18, floatDuration: 15.5, spread: 34, influence: 280, opacity: 0.9 },
  { id: "star-20", x: 62, y: 42, size: 1.5, twinkle: 3.7, delay: 1.0, floatX: -14, floatY: 12, floatDuration: 13.4, spread: 22, influence: 230, opacity: 0.82 },
  { id: "star-21", x: 74, y: 36, size: 2.1, twinkle: 4.2, delay: 0.6, floatX: 12, floatY: -10, floatDuration: 14.4, spread: 30, influence: 260, opacity: 0.88 },
  { id: "star-22", x: 82, y: 40, size: 1.4, twinkle: 3.5, delay: 1.3, floatX: -10, floatY: 10, floatDuration: 12.6, spread: 20, influence: 210, opacity: 0.8 },
  { id: "star-23", x: 92, y: 32, size: 2.0, twinkle: 4.4, delay: 0.7, floatX: 16, floatY: -14, floatDuration: 15, spread: 32, influence: 270, opacity: 0.9 },
  { id: "star-24", x: 8, y: 26, size: 1.2, twinkle: 3.4, delay: 1.4, floatX: 12, floatY: 8, floatDuration: 11.2, spread: 18, influence: 200, opacity: 0.76 },
  { id: "star-25", x: 4, y: 4, size: 1.1, twinkle: 3.1, delay: 0.2, floatX: 8, floatY: -8, floatDuration: 11.8, spread: 18, influence: 180, opacity: 0.72 },
  { id: "star-26", x: 10, y: 16, size: 1.6, twinkle: 3.8, delay: 1.1, floatX: -12, floatY: 10, floatDuration: 13.4, spread: 22, influence: 210, opacity: 0.8 },
  { id: "star-27", x: 15, y: 3, size: 1.3, twinkle: 3.4, delay: 0.6, floatX: 10, floatY: -12, floatDuration: 12.2, spread: 20, influence: 200, opacity: 0.78 },
  { id: "star-28", x: 21, y: 12, size: 2.0, twinkle: 4.2, delay: 0.9, floatX: -14, floatY: 12, floatDuration: 14.6, spread: 28, influence: 250, opacity: 0.88 },
  { id: "star-29", x: 27, y: 6, size: 1.2, twinkle: 3.3, delay: 1.3, floatX: 9, floatY: -10, floatDuration: 11.6, spread: 18, influence: 190, opacity: 0.76 },
  { id: "star-30", x: 33, y: 18, size: 2.1, twinkle: 4.5, delay: 0.4, floatX: -12, floatY: 14, floatDuration: 15.2, spread: 30, influence: 260, opacity: 0.9 },
  { id: "star-31", x: 39, y: 4, size: 1.4, twinkle: 3.6, delay: 0.8, floatX: 12, floatY: -8, floatDuration: 12.4, spread: 22, influence: 210, opacity: 0.8 },
  { id: "star-32", x: 45, y: 14, size: 2.3, twinkle: 4.7, delay: 1.2, floatX: -16, floatY: 16, floatDuration: 16.2, spread: 32, influence: 280, opacity: 0.92 },
  { id: "star-33", x: 51, y: 2, size: 1.0, twinkle: 3.0, delay: 0.5, floatX: 8, floatY: -6, floatDuration: 11.2, spread: 16, influence: 180, opacity: 0.7 },
  { id: "star-34", x: 57, y: 10, size: 1.8, twinkle: 4.0, delay: 0.7, floatX: -10, floatY: 12, floatDuration: 13.8, spread: 24, influence: 230, opacity: 0.84 },
  { id: "star-35", x: 63, y: 6, size: 1.3, twinkle: 3.5, delay: 1.4, floatX: 10, floatY: -10, floatDuration: 12.6, spread: 20, influence: 200, opacity: 0.78 },
  { id: "star-36", x: 69, y: 16, size: 2.2, twinkle: 4.4, delay: 0.3, floatX: -14, floatY: 14, floatDuration: 15.4, spread: 30, influence: 260, opacity: 0.9 },
  { id: "star-37", x: 75, y: 4, size: 1.1, twinkle: 3.2, delay: 1.0, floatX: 8, floatY: -8, floatDuration: 11.8, spread: 18, influence: 190, opacity: 0.74 },
  { id: "star-38", x: 81, y: 12, size: 1.9, twinkle: 4.1, delay: 0.6, floatX: -12, floatY: 12, floatDuration: 14.2, spread: 26, influence: 240, opacity: 0.86 },
  { id: "star-39", x: 87, y: 6, size: 1.4, twinkle: 3.7, delay: 1.5, floatX: 12, floatY: -12, floatDuration: 12.9, spread: 22, influence: 220, opacity: 0.8 },
  { id: "star-40", x: 93, y: 16, size: 2.0, twinkle: 4.3, delay: 0.8, floatX: -14, floatY: 16, floatDuration: 15.0, spread: 30, influence: 260, opacity: 0.9 },
  { id: "star-41", x: 7, y: 20, size: 1.7, twinkle: 4.0, delay: 0.9, floatX: 12, floatY: 10, floatDuration: 13.0, spread: 24, influence: 230, opacity: 0.82 },
  { id: "star-42", x: 23, y: 20, size: 2.1, twinkle: 4.5, delay: 0.5, floatX: -10, floatY: 12, floatDuration: 14.8, spread: 28, influence: 250, opacity: 0.88 },
  { id: "star-43", x: 49, y: 20, size: 1.5, twinkle: 3.8, delay: 1.1, floatX: 14, floatY: 10, floatDuration: 13.6, spread: 24, influence: 230, opacity: 0.82 },
  { id: "star-44", x: 71, y: 20, size: 2.2, twinkle: 4.6, delay: 0.4, floatX: -12, floatY: 12, floatDuration: 15.6, spread: 30, influence: 260, opacity: 0.9 },
];

const STARFIELD = [
  ...BASE_STARFIELD,
  ...createStars(46, 20260126, {
    xMin: 4,
    xMax: 96,
    yMin: 4,
    yMax: 58,
    sizeMin: 1.2,
    sizeMax: 3.2,
    opacityMin: 0.72,
    opacityMax: 1,
  }),
  ...createStars(32, 20260127, {
    xMin: 8,
    xMax: 92,
    yMin: 52,
    yMax: 74,
    sizeMin: 1.0,
    sizeMax: 2.4,
    opacityMin: 0.58,
    opacityMax: 0.88,
  }),
];

const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));
const CinematicHeroComponent = () => {
  const reduceMotion = useReducedMotion();
  const perfMode = usePerformanceMode();
  const lowPerf = perfMode === "low";
  const videoEnabled = !lowPerf;
  const pathname = usePathname();
  const router = useRouter();
  const { startMorph, isMorphing } = useNavMorph();
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [slotSources, setSlotSources] = useState(() => [
    VIDEO_SOURCES[0],
    VIDEO_SOURCES[0],
  ]);
  const preloadTimeoutRef = useRef<number | null>(null);
  const swapLockRef = useRef(false);
  const pendingSwapRef = useRef<{ slot: number; index: number; prevSlot: number } | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoState, setVideoState] = useState<"enter" | "ready" | "exit">("enter");
  const prevLowPerfRef = useRef(lowPerf);
  const starRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());
  const starOffsetsRef = useRef<Map<string, { x: number; y: number; blur: number }>>(new Map());
  const starPointerRef = useRef({ x: 0.5, y: 0.25 });
  const navMap = useMemo(() => new Map(NAV_ITEMS.map((item) => [item.key, item])), []);
  const nadhHref = navMap.get(NAV_NADH_KEY)?.href ?? "/nadh";
  const cabinetsHref = navMap.get(NAV_CABINETS_KEY)?.href ?? "/application";
  const [introReady, setIntroReady] = useState(() => reduceMotion || lowPerf);
  const [splashDone, setSplashDone] = useState(() => reduceMotion || lowPerf);
  const starField = useMemo(() => (lowPerf ? BASE_STARFIELD : STARFIELD), [lowPerf]);
  const splashColor = useMemo(() => ({ r: 0.32, g: 0.1, b: 1 }), []);
  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
    setIntroReady(true);
  }, []);
  const shouldAnimateIntro = !reduceMotion && !lowPerf;
  const introState = shouldAnimateIntro ? (introReady ? "show" : "hidden") : "show";
  const introInitial = shouldAnimateIntro ? "hidden" : "show";
  const introEase = [0.22, 1, 0.36, 1] as const;
  const introFade = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };
  const introLift = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };
  const introDrop = {
    hidden: { opacity: 0, y: -14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  useEffect(() => {
    if (reduceMotion || lowPerf) {
      setIntroReady(true);
      setSplashDone(true);
    }
  }, [lowPerf, reduceMotion]);

  useEffect(() => {
    if (!shouldAnimateIntro || introReady) return;
    const timeout = window.setTimeout(() => {
      setIntroReady(true);
    }, 240);
    return () => window.clearTimeout(timeout);
  }, [introReady, shouldAnimateIntro]);

  useEffect(() => {
    if (!shouldAnimateIntro || splashDone) return;
    const timeout = window.setTimeout(() => {
      setSplashDone(true);
      setIntroReady(true);
    }, SPLASH_DURATION + 200);
    return () => window.clearTimeout(timeout);
  }, [shouldAnimateIntro, splashDone]);

  useEffect(() => {
    if (reduceMotion || lowPerf) {
      setVideoReady(true);
    }
  }, [lowPerf, reduceMotion]);

  const attemptPlay = useCallback(() => {
    const active = videoRefs.current[activeSlot];
    if (!active) return;
    active.muted = true;
    active.playsInline = true;
    const playPromise = active.play();
    if (playPromise?.catch) {
      playPromise.catch(() => undefined);
    }
  }, [activeSlot]);

  useEffect(() => {
    if (prevLowPerfRef.current === lowPerf) return;
    prevLowPerfRef.current = lowPerf;
    if (lowPerf) {
      videoRefs.current.forEach((video) => video?.pause());
      return;
    }
    setVideoReady(false);
    setVideoState("enter");
    const raf = requestAnimationFrame(attemptPlay);
    return () => cancelAnimationFrame(raf);
  }, [activeSlot, attemptPlay, lowPerf]);

  useEffect(() => {
    if (reduceMotion || lowPerf || !videoEnabled) return;
    const active = videoRefs.current[activeSlot];
    if (!active) return;
    const handleCanPlay = () => attemptPlay();
    const handleLoaded = () => attemptPlay();
    const handleVisibility = () => {
      if (!document.hidden) attemptPlay();
    };
    const unlockPlayback = () => attemptPlay();

    active.addEventListener("canplay", handleCanPlay);
    active.addEventListener("loadedmetadata", handleLoaded);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointerdown", unlockPlayback, { passive: true, once: true });
    const raf = requestAnimationFrame(attemptPlay);

    return () => {
      active.removeEventListener("canplay", handleCanPlay);
      active.removeEventListener("loadedmetadata", handleLoaded);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerdown", unlockPlayback);
      cancelAnimationFrame(raf);
    };
  }, [activeSlot, attemptPlay, lowPerf, reduceMotion, videoEnabled]);

  useEffect(() => {
    if (VIDEO_SOURCES.length < 2) return;
    if (reduceMotion || lowPerf) return;
    if (!videoReady) return;
    if (preloadTimeoutRef.current) {
      window.clearTimeout(preloadTimeoutRef.current);
    }
    const nextIndex = (videoIndex + 1) % VIDEO_SOURCES.length;
    const inactiveSlot = activeSlot === 0 ? 1 : 0;
    preloadTimeoutRef.current = window.setTimeout(() => {
      setSlotSources((prev) => {
        if (prev[inactiveSlot] === VIDEO_SOURCES[nextIndex]) return prev;
        const next = [...prev];
        next[inactiveSlot] = VIDEO_SOURCES[nextIndex];
        return next;
      });
      const nextVideo = videoRefs.current[inactiveSlot];
      if (nextVideo) {
        nextVideo.preload = "auto";
        nextVideo.load();
      }
    }, 600);
    return () => {
      if (preloadTimeoutRef.current) {
        window.clearTimeout(preloadTimeoutRef.current);
        preloadTimeoutRef.current = null;
      }
    };
  }, [activeSlot, lowPerf, reduceMotion, videoIndex, videoReady]);

  useEffect(() => {
    if (reduceMotion || lowPerf) {
      setVideoState("ready");
      return;
    }
    setVideoState(videoReady ? "ready" : "enter");
  }, [lowPerf, reduceMotion, videoReady]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    if (reduceMotion || lowPerf) {
      root.style.setProperty("--mx", "0px");
      root.style.setProperty("--my", "0px");
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);
      root.style.setProperty("--mx", `${currentX.toFixed(2)}px`);
      root.style.setProperty("--my", `${currentY.toFixed(2)}px`);
      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      const rect = root.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetX = dx * PARALLAX_X;
      targetY = dy * PARALLAX_Y;
      if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    if (!finePointer) return;
    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lowPerf, reduceMotion]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    let idleTimer: number | null = null;
    const setIdle = () => {
      root.dataset.idle = "true";
    };
    const clearIdle = () => {
      delete root.dataset.idle;
    };
    const schedule = () => {
      clearIdle();
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(setIdle, 5200);
    };
    schedule();
    const handleActivity = () => schedule();
    window.addEventListener("pointermove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("wheel", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });
    return () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      delete root.dataset.idle;
    };
  }, []);

  const finalizeSwap = () => {
    const pending = pendingSwapRef.current;
    if (!pending) return;
    const prevVideo = videoRefs.current[pending.prevSlot];
    if (prevVideo) {
      prevVideo.pause();
    }
    setActiveSlot(pending.slot);
    setVideoIndex(pending.index);
    setVideoReady(true);
    pendingSwapRef.current = null;
  };

  const requestSwap = () => {
    if (swapLockRef.current || pendingSwapRef.current) return;
    if (VIDEO_SOURCES.length < 2) return;
    swapLockRef.current = true;
    const nextIndex = (videoIndex + 1) % VIDEO_SOURCES.length;
    const nextSlot = activeSlot === 0 ? 1 : 0;
    const nextVideo = videoRefs.current[nextSlot];
    pendingSwapRef.current = { slot: nextSlot, index: nextIndex, prevSlot: activeSlot };

    if (nextVideo) {
      nextVideo.currentTime = 0;
      const playPromise = nextVideo.play();
      if (playPromise?.catch) {
        playPromise.catch(() => undefined);
      }
      if (!nextVideo.paused && nextVideo.readyState >= 2) {
        finalizeSwap();
      } else {
        window.setTimeout(() => {
          finalizeSwap();
        }, 140);
      }
    }

    window.setTimeout(() => {
      swapLockRef.current = false;
    }, 160);
  };

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || lowPerf || !finePointer) {
      starRefs.current.forEach((node) => {
        if (!node) return;
        node.style.setProperty("--star-offset-x", "0px");
        node.style.setProperty("--star-offset-y", "0px");
        node.style.setProperty("--star-blur", "0px");
      });
      return;
    }

    let raf = 0;

    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

    const updateStars = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const cursor = starPointerRef.current;
      const cursorX = rect.left + rect.width * cursor.x;
      const cursorY = rect.top + rect.height * cursor.y;
      starField.forEach((star) => {
        const node = starRefs.current.get(star.id);
        if (!node) return;
        const baseX = rect.left + rect.width * (star.x / 100);
        const baseY = rect.top + rect.height * (star.y / 100);
        const dx = baseX - cursorX;
        const dy = baseY - cursorY;
        const dist = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - dist / star.influence);
        const nx = dist > 0 ? dx / dist : 1;
        const ny = dist > 0 ? dy / dist : 0;
        const targetX = nx * influence * star.spread * STAR_PARALLAX;
        const targetY = ny * influence * star.spread * STAR_PARALLAX;
        const targetBlur = influence * STAR_BLUR;
        const prev = starOffsetsRef.current.get(star.id) ?? { x: 0, y: 0, blur: 0 };
        const lerp = 0.14;
        const next = {
          x: prev.x + (targetX - prev.x) * lerp,
          y: prev.y + (targetY - prev.y) * lerp,
          blur: prev.blur + (targetBlur - prev.blur) * lerp,
        };
        starOffsetsRef.current.set(star.id, next);
        node.style.setProperty("--star-offset-x", `${next.x.toFixed(2)}px`);
        node.style.setProperty("--star-offset-y", `${next.y.toFixed(2)}px`);
        node.style.setProperty("--star-blur", `${next.blur.toFixed(2)}px`);
      });
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(updateStars);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      starPointerRef.current = { x, y };
      schedule();
    };

    const handlePointerLeave = () => {
      starPointerRef.current = { x: 0.5, y: 0.25 };
      schedule();
    };

    const handleResize = () => schedule();

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", handleResize);
    schedule();

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lowPerf, reduceMotion, starField]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const buttons = Array.from(root.querySelectorAll<HTMLElement>('[data-nav-origin="home"]'));
    if (!buttons.length) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const enableMagnet = ENABLE_NAV_MAGNET && finePointer && !reduceMotion && !lowPerf;
    let raf = 0;
    let pendingTarget: HTMLElement | null = null;
    let pendingMagX = 0;
    let pendingMagY = 0;
    let pendingTiltX = 0;
    let pendingTiltY = 0;

    const resetButton = (button: HTMLElement) => {
      button.style.setProperty("--mag-x", "0px");
      button.style.setProperty("--mag-y", "0px");
      button.style.setProperty("--tilt-x", "0deg");
      button.style.setProperty("--tilt-y", "0deg");
    };

    const applyMagnet = () => {
      raf = 0;
      if (!pendingTarget) return;
      pendingTarget.style.setProperty("--mag-x", `${pendingMagX.toFixed(2)}px`);
      pendingTarget.style.setProperty("--mag-y", `${pendingMagY.toFixed(2)}px`);
      pendingTarget.style.setProperty("--tilt-x", `${pendingTiltX.toFixed(2)}deg`);
      pendingTarget.style.setProperty("--tilt-y", `${pendingTiltY.toFixed(2)}deg`);
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(applyMagnet);
    };

    if (!enableMagnet) {
      buttons.forEach(resetButton);
    }

    const setNavHover = (key?: string) => {
      if (key) {
        root.dataset.navHover = "true";
        root.dataset.navHoverKey = key;
      } else {
        delete root.dataset.navHover;
        delete root.dataset.navHoverKey;
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-nav-origin="home"]');
      if (!target) return;
      setNavHover(target.dataset.navKey);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-nav-origin="home"]');
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      setNavHover();
      resetButton(target);
      pendingTarget = null;
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-nav-origin="home"]');
      if (!target) return;
      setNavHover(target.dataset.navKey);
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-nav-origin="home"]');
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      setNavHover();
      resetButton(target);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enableMagnet) return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-nav-origin="home"]');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      pendingTarget = target;
      pendingMagX = dx * 4;
      pendingMagY = dy * 4;
      pendingTiltX = clamp(-6, -dy * 12, 6);
      pendingTiltY = clamp(-10, dx * 20, 10);
      schedule();
    };

    root.addEventListener("pointerover", handlePointerOver);
    root.addEventListener("pointerout", handlePointerOut);
    if (enableMagnet) {
      root.addEventListener("pointermove", handlePointerMove, { passive: true });
    }
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);

    return () => {
      root.removeEventListener("pointerover", handlePointerOver);
      root.removeEventListener("pointerout", handlePointerOut);
      if (enableMagnet) {
        root.removeEventListener("pointermove", handlePointerMove);
      }
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [lowPerf, reduceMotion]);

  const handleSideHover = (key?: string) => {
    const root = heroRef.current;
    if (!root) return;
    if (key) {
      root.dataset.highlight = key;
    } else {
      delete root.dataset.highlight;
    }
  };

  const handleRipple = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    target.dataset.pressed = "true";
    window.setTimeout(() => {
      delete target.dataset.pressed;
    }, 260);
  };

  const handleDirectNav = (event: MouseEvent<HTMLElement>, key: string, href: string) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href === pathname) return;
    event.preventDefault();
    const item = navMap.get(key);
    if (item && startMorph) {
      startMorph(item);
      return;
    }
    router.push(href);
  };

  const hero = (
    <section
      ref={heroRef}
      data-hero-root
      data-hero-intro={introReady ? "true" : "false"}
      data-video-state={videoState}
      data-nav-morph={isMorphing ? "true" : "false"}
      className={styles.heroRoot}
      aria-label="HYDROGENIUM hero section"
    >
      <div className={styles.videoWrap} aria-hidden>
        {videoEnabled &&
          [0, 1].map((slot) => {
            const isActive = slot === activeSlot;
            return (
              <video
                key={`hero-video-${slot}`}
                ref={(node) => {
                  videoRefs.current[slot] = node;
                }}
                className={styles.heroVideo}
                data-active={isActive ? "true" : "false"}
                autoPlay={isActive}
                muted
                playsInline
                preload={VIDEO_SOURCES.length < 2 ? "auto" : isActive ? "auto" : "none"}
                disablePictureInPicture
                controls={false}
                loop={VIDEO_SOURCES.length < 2}
                src={slotSources[slot]}
                onCanPlay={() => {
                  if (slot === activeSlot) setVideoReady(true);
                }}
                onEnded={() => {
                  if (slot !== activeSlot) return;
                  requestSwap();
                }}
                onPlaying={() => {
                  const pending = pendingSwapRef.current;
                  if (!pending || pending.slot !== slot) return;
                  finalizeSwap();
                }}
              />
            );
          })}
        <div className={styles.videoBloom} />
        <div className={styles.videoOverlay} />
        <div className={styles.videoVignette} />
      </div>

      <div className={styles.starField} aria-hidden>
        {starField.map((star) => (
          <span
            key={star.id}
            ref={(node) => {
              if (!node) {
                starRefs.current.delete(star.id);
                return;
              }
              starRefs.current.set(star.id, node);
            }}
            className={styles.starParticle}
            style={
              {
                "--star-x": `${star.x}%`,
                "--star-y": `${star.y}%`,
                "--star-size": `${star.size}px`,
                "--star-opacity": `${star.opacity}`,
                "--star-twinkle-duration": `${star.twinkle}s`,
                "--star-twinkle-delay": `${star.delay}s`,
                "--star-float-x": `${star.floatX}px`,
                "--star-float-y": `${star.floatY}px`,
                "--star-float-duration": `${star.floatDuration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {!lowPerf && <div className={styles.heroBreath} aria-hidden />}

      <div className={styles.uiLayer}>
        {shouldAnimateIntro && !splashDone && (
          <SplashCursor
            active={!splashDone}
            SPLAT_RADIUS={0.19}
            SPLAT_FORCE={SPLASH_FORCE}
            BACK_COLOR={splashColor}
            COLOR_UPDATE_SPEED={14}
            DURATION={SPLASH_DURATION}
            TRANSPARENT
            onComplete={handleSplashComplete}
          />
        )}

        <motion.div
          className={styles.introStage}
          variants={introDrop}
          initial={introInitial}
          animate={introState}
          transition={{ duration: 1.1, delay: 0.16, ease: introEase }}
        >
          <div className={styles.orbitTitleWrap} aria-label={TITLE}>
          <div className={styles.orbitTitleParallax} aria-hidden="true">
            <div className={styles.titleOrbits} aria-hidden="true">
              <svg className={styles.titleOrbitSvg} viewBox="0 0 600 220" role="presentation" aria-hidden="true">
                <defs>
                  <linearGradient id="heroOrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(90, 225, 255, 0.4)" />
                    <stop offset="45%" stopColor="rgba(110, 235, 255, 0.95)" />
                    <stop offset="100%" stopColor="rgba(70, 210, 255, 0.45)" />
                  </linearGradient>
                </defs>
                <g className={styles.titleOrbitGroup}>
                  <ellipse className={styles.titleOrbit} cx="300" cy="110" rx="250" ry="80" />
                  <ellipse className={clsx(styles.titleOrbit, styles.titleOrbitAlt)} cx="300" cy="110" rx="280" ry="100" />
                </g>
                <g className={clsx(styles.titleOrbitGroup, styles.titleOrbitGroupAlt)}>
                  <ellipse className={clsx(styles.titleOrbit, styles.titleOrbitThin)} cx="300" cy="110" rx="210" ry="64" />
                </g>
              </svg>
              <div className={styles.orbitBalls} aria-hidden="true">
                <span className={clsx(styles.orbitBall, styles.orbitBallOne)} />
                <span className={clsx(styles.orbitBall, styles.orbitBallTwo)} />
                <span className={clsx(styles.orbitBall, styles.orbitBallThree)} />
              </div>
            </div>
            <div className={styles.titlePlanetOrbit} aria-hidden="true" />
            <div className={styles.titlePlanetTrack} aria-hidden="true">
              <div className={styles.titlePlanetSpin}>
                <span className={styles.titlePlanet} />
              </div>
            </div>
            <h1 className={styles.titleStack}>
              <span className={styles.titleLine} data-text={TITLE_TOP}>
                {TITLE_TOP}
              </span>
              <span className={clsx(styles.titleLine, styles.titleLineAccent)} data-text={TITLE_BOTTOM}>
                {TITLE_BOTTOM}
              </span>
            </h1>
          </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.introStage}
          variants={introFade}
          initial={introInitial}
          animate={introState}
          transition={{ duration: 1.1, delay: 0.2, ease: introEase }}
        >
          <Link
            href={nadhHref}
            className={styles.sideLinkLeft}
            aria-label="NADH CLINIC"
            data-ui-sound="nav"
            onPointerEnter={() => handleSideHover(NAV_NADH_KEY)}
            onPointerLeave={() => handleSideHover()}
            onFocus={() => handleSideHover(NAV_NADH_KEY)}
            onBlur={() => handleSideHover()}
            onPointerDown={handleRipple}
            onClick={(event) => handleDirectNav(event, NAV_NADH_KEY, nadhHref)}
          >
            <div className={styles.sideObjectLeft} aria-hidden="true">
              <span className={styles.capsuleCore} />
            </div>
            <div className={styles.sideLabel}>NADH CLINIC</div>
          </Link>
        </motion.div>

        <motion.div
          className={styles.introStage}
          variants={introFade}
          initial={introInitial}
          animate={introState}
          transition={{ duration: 1.1, delay: 0.2, ease: introEase }}
        >
          <Link
            href={cabinetsHref}
            className={styles.sideLinkRight}
            aria-label="Эпигенетическая коррекция"
            data-ui-sound="nav"
            onPointerEnter={() => handleSideHover(NAV_CABINETS_KEY)}
            onPointerLeave={() => handleSideHover()}
            onFocus={() => handleSideHover(NAV_CABINETS_KEY)}
            onBlur={() => handleSideHover()}
            onPointerDown={handleRipple}
            onClick={(event) => handleDirectNav(event, NAV_CABINETS_KEY, cabinetsHref)}
          >
            <div className={styles.sideObjectRight} aria-hidden="true">
              <svg className={styles.starSvg} viewBox="0 0 200 200" role="presentation" aria-hidden="true">
                <defs>
                  <linearGradient id="heroStarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(120, 210, 255, 0.95)" />
                    <stop offset="55%" stopColor="rgba(120, 140, 255, 0.75)" />
                    <stop offset="100%" stopColor="rgba(170, 90, 255, 0.6)" />
                  </linearGradient>
                  <radialGradient id="heroStarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(150, 220, 255, 0.9)" />
                    <stop offset="55%" stopColor="rgba(120, 140, 255, 0.55)" />
                    <stop offset="100%" stopColor="rgba(120, 60, 255, 0)" />
                  </radialGradient>
                </defs>
              <circle cx="100" cy="100" r="72" fill="url(#heroStarGlow)" />
              <polygon
                className={styles.starStroke}
                points="100,16 178,150 22,150"
                fill="none"
                stroke="url(#heroStarStroke)"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              <polygon
                className={styles.starStroke}
                points="100,184 178,50 22,50"
                fill="none"
                stroke="url(#heroStarStroke)"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.sideLabelRu}>
            ЭПИГЕНЕТИЧЕСКАЯ
            <br />
            КОРРЕКЦИЯ
          </div>
          </Link>
        </motion.div>

      </div>
      <motion.div
        className={styles.introStage}
        variants={introLift}
        initial={introInitial}
        animate={introState}
        transition={{ duration: 1.1, delay: 0.24, ease: introEase }}
      >
        <nav className={styles.navDock} role="navigation" aria-label="Primary navigation">
          {!lowPerf && <div className={styles.navMorphPulse} aria-hidden />}
          {!lowPerf && <div className={styles.navDockWires} aria-hidden />}
          <GooeyNav
            items={NAV_ITEMS}
            origin="home"
            ariaLabel="Primary navigation"
            className={styles.navDockItems}
            itemClassName={clsx(
              styles.navButton,
              styles.homeTile,
              styles.dockButton,
              "inline-flex h-8 min-w-[86px] max-w-[140px] items-center justify-center px-2.5 text-center text-[9px] font-semibold leading-snug text-white/95 sm:h-10 sm:min-w-[108px] sm:max-w-[170px] sm:px-3 sm:text-[10px] md:h-11 md:min-w-[120px] md:max-w-[190px] md:px-3.5 md:text-[11px] lg:h-12 lg:min-w-[130px] lg:max-w-[210px] lg:px-4 lg:text-[12px]",
            )}
            activeClassName={clsx(styles.navButtonActive, "text-white")}
            inactiveClassName="text-white/95"
            hoverClassName=""
            contentVariant="homeTile"
            particleCount={16}
            particleDistances={[70, 8]}
            particleR={80}
            animationTime={900}
            timeVariance={360}
            colors={[1, 2, 3, 4, 2, 3, 1, 4]}
          />
        </nav>
      </motion.div>
    </section>
  );

  return hero;
};

export const CinematicHero = memo(CinematicHeroComponent);
CinematicHero.displayName = "CinematicHero";



