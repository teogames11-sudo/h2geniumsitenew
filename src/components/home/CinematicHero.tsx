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
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import styles from "./CinematicHero.module.css";

const TITLE_TOP = "ЭКОСИСТЕМА";
const TITLE_BOTTOM = "HYDROGENIUM";
const TITLE = `${TITLE_TOP} ${TITLE_BOTTOM}`;
const NAV_NADH_KEY = "nadh";
const NAV_CABINETS_KEY = "cabinets";
const ENABLE_NAV_MAGNET = true;
const HOME_BOOT_STORAGE_KEY = "h2-home-boot-seen-v4";
const HOME_BOOT_STABILIZE_MIN_MS = 760;
const HOME_BOOT_STABILIZE_MAX_MS = 2200;
const HOME_BOOT_INTRO_MS = 1560;
const PARALLAX_X = 58;
const PARALLAX_Y = 46;
const STAR_PARALLAX = 2.9;
const STAR_BLUR = 14;
const VIDEO_SOURCES = [
  "/video/1 VID 4K.mp4",
  "/video/2 VID 4K.mp4",
];
const VIDEO_SWAP_EARLY_SECONDS = 1.08;
const VIDEO_WARMUP_SECONDS = 3.4;
const VIDEO_CROSSFADE_MS = 820;
const SIDE_GOOEY_PARTICLE_COUNT = 12;
const SIDE_GOOEY_PARTICLE_DISTANCES: [number, number] = [90, 8];
const SIDE_GOOEY_PARTICLE_R = 90;
const SIDE_GOOEY_ANIMATION_TIME = 900;
const SIDE_GOOEY_TIME_VARIANCE = 220;
const SIDE_GOOEY_COLORS = [1, 2, 3, 4, 2, 3, 1, 4];
const SIDE_GOOEY_HIDE_DELAY = 320;
const noise = (n = 1) => n / 2 - Math.random() * n;
const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};
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

const createSideParticle = (
  i: number,
  t: number,
  d: [number, number],
  r: number,
) => {
  const rotate = noise(r / 10);
  return {
    start: getXY(d[0], SIDE_GOOEY_PARTICLE_COUNT - i, SIDE_GOOEY_PARTICLE_COUNT),
    end: getXY(d[1] + noise(7), SIDE_GOOEY_PARTICLE_COUNT - i, SIDE_GOOEY_PARTICLE_COUNT),
    time: t,
    scale: 1 + noise(0.2),
    color: SIDE_GOOEY_COLORS[Math.floor(Math.random() * SIDE_GOOEY_COLORS.length)],
    rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
  };
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
  const playRetryRef = useRef<number | null>(null);
  const swapScheduleRef = useRef<number | null>(null);
  const warmScheduleRef = useRef<number | null>(null);
  const frameRequestRef = useRef<{ id: number; video: HTMLVideoElement } | null>(null);
  const swapFallbackRef = useRef<number | null>(null);
  const prevPauseTimeoutRef = useRef<number | null>(null);
  const sideGooeyRefs = useRef<{ left: HTMLSpanElement | null; right: HTMLSpanElement | null }>({
    left: null,
    right: null,
  });
  const sideGooeyTimeouts = useRef<{ left: number[]; right: number[] }>({ left: [], right: [] });
  const sideGooeyHideTimeouts = useRef<{ left?: number; right?: number }>({});
  const sideGooeyLastBurstRef = useRef(0);
  const bootWarmRef = useRef(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const swapLockRef = useRef(false);
  const pendingSwapRef = useRef<{ slot: number; prevSlot: number } | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoState, setVideoState] = useState<"enter" | "ready" | "exit">("enter");
  const prevLowPerfRef = useRef(lowPerf);
  const starRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());
  const starOffsetsRef = useRef<Map<string, { x: number; y: number; blur: number }>>(new Map());
  const starPointerRef = useRef({ x: 0.5, y: 0.25 });
  const bootSequenceRef = useRef(false);
  const bootStartedAtRef = useRef(0);
  const navMap = useMemo(() => new Map(NAV_ITEMS.map((item) => [item.key, item])), []);
  const nadhHref = navMap.get(NAV_NADH_KEY)?.href ?? "/nadh";
  const cabinetsHref = navMap.get(NAV_CABINETS_KEY)?.href ?? "/application";
  const [bootPhase, setBootPhase] = useState<"stabilize" | "intro" | "ready">(() =>
    reduceMotion || lowPerf ? "ready" : "stabilize",
  );
  const starField = useMemo(() => (lowPerf ? BASE_STARFIELD : STARFIELD), [lowPerf]);
  const shouldAnimateIntro = !reduceMotion && !lowPerf;
  const heroIntroReady = bootPhase === "ready";
  const showBootOverlay = shouldAnimateIntro && bootPhase !== "ready";
  const introState = shouldAnimateIntro ? (bootPhase === "ready" ? "show" : "hidden") : "show";
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

  const cancelFrameRequest = useCallback(() => {
    const current = frameRequestRef.current;
    if (!current) return;
    const { id, video } = current;
    const anyVideo = video as HTMLVideoElement & { cancelVideoFrameCallback?: (handle: number) => void };
    anyVideo.cancelVideoFrameCallback?.(id);
    frameRequestRef.current = null;
  }, []);

  const clearSwapFallback = useCallback(() => {
    if (swapFallbackRef.current) {
      window.clearTimeout(swapFallbackRef.current);
      swapFallbackRef.current = null;
    }
  }, []);

  const clearPrevPause = useCallback(() => {
    if (prevPauseTimeoutRef.current) {
      window.clearTimeout(prevPauseTimeoutRef.current);
      prevPauseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (reduceMotion || lowPerf || !videoEnabled) {
      bootSequenceRef.current = true;
      setBootPhase("ready");
      return;
    }
    if (bootSequenceRef.current) return;
    bootSequenceRef.current = true;

    let shouldRunBoot = true;
    try {
      const seen = window.sessionStorage.getItem(HOME_BOOT_STORAGE_KEY) === "1";
      shouldRunBoot = !seen;
      if (!seen) {
        window.sessionStorage.setItem(HOME_BOOT_STORAGE_KEY, "1");
      }
    } catch {
      shouldRunBoot = true;
    }

    if (!shouldRunBoot) {
      setBootPhase("ready");
      return;
    }

    bootStartedAtRef.current = performance.now();
    setBootPhase("stabilize");
  }, [lowPerf, reduceMotion, videoEnabled]);

  useEffect(() => {
    if (bootPhase !== "stabilize") return;
    const startedAt = bootStartedAtRef.current || performance.now();
    if (!bootStartedAtRef.current) {
      bootStartedAtRef.current = startedAt;
    }

    const elapsed = performance.now() - startedAt;
    const minDelay = Math.max(0, HOME_BOOT_STABILIZE_MIN_MS - elapsed);
    const maxDelay = Math.max(0, HOME_BOOT_STABILIZE_MAX_MS - elapsed);

    let minTimeout: number | undefined;
    let cancelled = false;

    const advance = () => {
      if (cancelled) return;
      setBootPhase((prev) => (prev === "stabilize" ? "intro" : prev));
    };

    const maxTimeout = window.setTimeout(advance, maxDelay);

    if (videoReady) {
      minTimeout = window.setTimeout(advance, minDelay);
    }
    return () => {
      cancelled = true;
      if (minTimeout) window.clearTimeout(minTimeout);
      window.clearTimeout(maxTimeout);
    };
  }, [bootPhase, videoReady]);

  useEffect(() => {
    if (bootPhase !== "intro") return;
    const timeout = window.setTimeout(() => {
      setBootPhase("ready");
    }, HOME_BOOT_INTRO_MS);
    return () => window.clearTimeout(timeout);
  }, [bootPhase]);

  useEffect(() => {
    return () => {
      (["left", "right"] as const).forEach((side) => {
        const timeouts = sideGooeyTimeouts.current[side];
        timeouts.forEach((id) => window.clearTimeout(id));
        sideGooeyTimeouts.current[side] = [];
        const hideId = sideGooeyHideTimeouts.current[side];
        if (hideId) {
          window.clearTimeout(hideId);
          sideGooeyHideTimeouts.current[side] = undefined;
        }
      });
    };
  }, []);

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
    if (reduceMotion || lowPerf || !videoEnabled) return;
    let attempts = 0;
    const retry = () => {
      const active = videoRefs.current[activeSlot];
      if (!active) return;
      attemptPlay();
      if (!active.paused && active.readyState >= 2) {
        if (playRetryRef.current) {
          window.clearInterval(playRetryRef.current);
          playRetryRef.current = null;
        }
        return;
      }
      attempts += 1;
      if (attempts > 10 && playRetryRef.current) {
        window.clearInterval(playRetryRef.current);
        playRetryRef.current = null;
      }
    };
    retry();
    playRetryRef.current = window.setInterval(retry, 320);
    return () => {
      if (playRetryRef.current) {
        window.clearInterval(playRetryRef.current);
        playRetryRef.current = null;
      }
    };
  }, [activeSlot, attemptPlay, lowPerf, reduceMotion, videoEnabled]);

  const warmVideoSlot = useCallback((slot: number) => {
    const video = videoRefs.current[slot];
    if (!video) return;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    if (video.readyState < 2) {
      video.load();
    }
    if (video.currentTime > 0.06) {
      try {
        video.currentTime = 0;
      } catch {
        // ignore seek errors
      }
    }

    const pauseAfterFrame = () => {
      video.pause();
    };
    const anyVideo = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: (now: number, metadata?: unknown) => void) => number;
    };
    const warmPromise = video.play();
    if (warmPromise?.catch) {
      warmPromise.catch(() => undefined);
    }
    if (anyVideo.requestVideoFrameCallback) {
      anyVideo.requestVideoFrameCallback(() => pauseAfterFrame());
    } else {
      window.setTimeout(pauseAfterFrame, 120);
    }
  }, []);

  useEffect(() => {
    if (reduceMotion || lowPerf || !videoEnabled) return;
    if (VIDEO_SOURCES.length < 2) return;
    if (bootWarmRef.current) return;

    const timeout = window.setTimeout(() => {
      warmVideoSlot(1);
      bootWarmRef.current = true;
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [lowPerf, reduceMotion, videoEnabled, warmVideoSlot]);

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
      currentX = lerp(currentX, targetX, 0.11);
      currentY = lerp(currentY, targetY, 0.11);
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
      idleTimer = window.setTimeout(setIdle, 30000);
    };
    root.dataset.heroEngaged = "true";
    schedule();
    const handleActivity = () => {
      schedule();
    };
    window.addEventListener("pointermove", handleActivity, { passive: true });
    window.addEventListener("pointerdown", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("wheel", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });
    return () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      window.removeEventListener("pointermove", handleActivity);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      delete root.dataset.idle;
      delete root.dataset.heroEngaged;
    };
  }, []);

  const finalizeSwap = useCallback(() => {
    const pending = pendingSwapRef.current;
    if (!pending) return;
    if (swapScheduleRef.current) {
      window.clearTimeout(swapScheduleRef.current);
      swapScheduleRef.current = null;
    }
    if (warmScheduleRef.current) {
      window.clearTimeout(warmScheduleRef.current);
      warmScheduleRef.current = null;
    }
    clearSwapFallback();
    clearPrevPause();
    cancelFrameRequest();
    const prevVideo = videoRefs.current[pending.prevSlot];
    if (prevVideo) {
      prevPauseTimeoutRef.current = window.setTimeout(() => {
        prevVideo.pause();
        prevPauseTimeoutRef.current = null;
      }, VIDEO_CROSSFADE_MS);
    }
    setActiveSlot(pending.slot);
    setVideoReady(true);
    pendingSwapRef.current = null;
  }, [cancelFrameRequest, clearPrevPause, clearSwapFallback]);

  const releaseSwapLock = useCallback(() => {
    window.setTimeout(() => {
      swapLockRef.current = false;
    }, VIDEO_CROSSFADE_MS);
  }, []);

  const requestSwap = useCallback(() => {
    if (swapLockRef.current || pendingSwapRef.current) return;
    if (VIDEO_SOURCES.length < 2) return;
    if (swapScheduleRef.current) {
      window.clearTimeout(swapScheduleRef.current);
      swapScheduleRef.current = null;
    }
    if (warmScheduleRef.current) {
      window.clearTimeout(warmScheduleRef.current);
      warmScheduleRef.current = null;
    }
    clearSwapFallback();
    cancelFrameRequest();
    swapLockRef.current = true;
    const nextSlot = activeSlot === 0 ? 1 : 0;
    const nextVideo = videoRefs.current[nextSlot];
    pendingSwapRef.current = { slot: nextSlot, prevSlot: activeSlot };

    const finalizeOnFrame = (video: HTMLVideoElement) => {
      const anyVideo = video as HTMLVideoElement & {
        requestVideoFrameCallback?: (callback: (now: number, metadata?: unknown) => void) => number;
      };
      if (anyVideo.requestVideoFrameCallback) {
        const id = anyVideo.requestVideoFrameCallback(() => {
          const pending = pendingSwapRef.current;
          if (!pending || pending.slot !== nextSlot) return;
          finalizeSwap();
        });
        frameRequestRef.current = { id, video };
        return;
      }
      finalizeSwap();
    };

    if (!nextVideo) {
      pendingSwapRef.current = null;
      swapLockRef.current = false;
      return;
    }

    nextVideo.preload = "auto";
    nextVideo.muted = true;
    nextVideo.playsInline = true;
    if (nextVideo.readyState < 2) {
      nextVideo.load();
    }
    if (nextVideo.currentTime > 0.06) {
      try {
        nextVideo.currentTime = 0;
      } catch {
        // ignore seek errors
      }
    }
    const playPromise = nextVideo.play();
    if (playPromise?.catch) {
      playPromise.catch(() => undefined);
    }
    if (nextVideo.readyState >= 3) {
      finalizeOnFrame(nextVideo);
    } else {
      nextVideo.addEventListener(
        "canplay",
        () => {
          const pending = pendingSwapRef.current;
          if (!pending || pending.slot !== nextSlot) return;
          if (nextVideo.readyState >= 3) {
            finalizeOnFrame(nextVideo);
          }
        },
        { once: true },
      );
    }

    swapFallbackRef.current = window.setTimeout(() => {
      const pending = pendingSwapRef.current;
      if (!pending || pending.slot !== nextSlot) return;
      finalizeSwap();
    }, 900);

    releaseSwapLock();
  }, [activeSlot, cancelFrameRequest, clearSwapFallback, finalizeSwap, releaseSwapLock]);

  const scheduleSwap = useCallback((video: HTMLVideoElement) => {
    if (VIDEO_SOURCES.length < 2) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    if (swapScheduleRef.current) {
      window.clearTimeout(swapScheduleRef.current);
    }
    if (warmScheduleRef.current) {
      window.clearTimeout(warmScheduleRef.current);
      warmScheduleRef.current = null;
    }
    const nextSlot = activeSlot === 0 ? 1 : 0;
    const warmDelayMs = Math.max(0, (video.duration - VIDEO_WARMUP_SECONDS) * 1000);
    warmScheduleRef.current = window.setTimeout(() => {
      warmVideoSlot(nextSlot);
      warmScheduleRef.current = null;
    }, warmDelayMs);
    const delayMs = Math.max(0, (video.duration - VIDEO_SWAP_EARLY_SECONDS) * 1000);
    swapScheduleRef.current = window.setTimeout(() => {
      swapScheduleRef.current = null;
      requestSwap();
    }, delayMs);
  }, [activeSlot, requestSwap, warmVideoSlot]);

  useEffect(() => {
    if (reduceMotion || lowPerf) return;
    if (VIDEO_SOURCES.length < 2) return;
    const active = videoRefs.current[activeSlot];
    if (!active) return;
    if (Number.isFinite(active.duration) && active.duration > 0) {
      scheduleSwap(active);
    }
  }, [activeSlot, lowPerf, reduceMotion, scheduleSwap]);

  useEffect(() => {
    return () => {
      if (swapScheduleRef.current) {
        window.clearTimeout(swapScheduleRef.current);
        swapScheduleRef.current = null;
      }
      if (warmScheduleRef.current) {
        window.clearTimeout(warmScheduleRef.current);
        warmScheduleRef.current = null;
      }
      clearSwapFallback();
      clearPrevPause();
      cancelFrameRequest();
    };
  }, [cancelFrameRequest, clearPrevPause, clearSwapFallback]);

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

  const clearSideHide = (side: "left" | "right") => {
    const hideId = sideGooeyHideTimeouts.current[side];
    if (hideId) {
      window.clearTimeout(hideId);
      sideGooeyHideTimeouts.current[side] = undefined;
    }
  };

  const clearSideTimeouts = (side: "left" | "right") => {
    const timeouts = sideGooeyTimeouts.current[side];
    if (!timeouts.length) return;
    timeouts.forEach((id) => window.clearTimeout(id));
    sideGooeyTimeouts.current[side] = [];
  };

  const makeSideParticles = (side: "left" | "right", element: HTMLSpanElement) => {
    const bubbleTime = SIDE_GOOEY_ANIMATION_TIME * 2 + SIDE_GOOEY_TIME_VARIANCE;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < SIDE_GOOEY_PARTICLE_COUNT; i += 1) {
      const t = SIDE_GOOEY_ANIMATION_TIME * 2 + noise(SIDE_GOOEY_TIME_VARIANCE * 2);
      const p = createSideParticle(i, t, SIDE_GOOEY_PARTICLE_DISTANCES, SIDE_GOOEY_PARTICLE_R);
      const timeoutId = window.setTimeout(() => {
        if (!element.isConnected) return;
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add(styles.sideGooeyParticle);
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--side-gooey-${p.color})`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add(styles.sideGooeyPoint);
        particle.appendChild(point);
        element.appendChild(particle);

        const removeId = window.setTimeout(() => {
          try {
            if (particle.parentElement === element) {
              element.removeChild(particle);
            }
          } catch {
            // ignore
          }
        }, t);
        sideGooeyTimeouts.current[side].push(removeId);
      }, 30);
      sideGooeyTimeouts.current[side].push(timeoutId);
    }
  };

  const burstSideGooey = (side: "left" | "right") => {
    const element = sideGooeyRefs.current[side];
    if (!element) return;
    clearSideHide(side);
    element.dataset.visible = "true";
    if (reduceMotion || lowPerf) {
      return;
    }
    const now = performance.now();
    if (now - sideGooeyLastBurstRef.current < 220) {
      element.dataset.active = "true";
      return;
    }
    sideGooeyLastBurstRef.current = now;
    element.removeAttribute("data-active");
    void element.offsetWidth;
    element.dataset.active = "true";

    const particles = element.querySelectorAll(`.${styles.sideGooeyParticle}`);
    particles.forEach((particle) => {
      try {
        if (particle.parentElement === element) {
          element.removeChild(particle);
        }
      } catch {
        // ignore
      }
    });
    clearSideTimeouts(side);
    makeSideParticles(side, element);
  };

  const scheduleSideHide = (side: "left" | "right") => {
    const element = sideGooeyRefs.current[side];
    if (!element) return;
    clearSideHide(side);
    element.removeAttribute("data-active");
    sideGooeyHideTimeouts.current[side] = window.setTimeout(() => {
      element.removeAttribute("data-visible");
      const particles = element.querySelectorAll(`.${styles.sideGooeyParticle}`);
      particles.forEach((particle) => {
        try {
          if (particle.parentElement === element) {
            element.removeChild(particle);
          }
        } catch {
          // ignore
        }
      });
      clearSideTimeouts(side);
      sideGooeyHideTimeouts.current[side] = undefined;
    }, SIDE_GOOEY_HIDE_DELAY);
  };

  const handleSideEnter = (key: string, side: "left" | "right") => {
    handleSideHover(key);
    burstSideGooey(side);
  };

  const handleSideLeave = (side: "left" | "right") => {
    handleSideHover();
    scheduleSideHide(side);
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
      data-hero-intro={heroIntroReady ? "true" : "false"}
      data-boot-phase={bootPhase}
      data-video-ready={videoReady ? "true" : "false"}
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
                style={{ zIndex: isActive ? 2 : 1 }}
                autoPlay={isActive}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                controls={false}
                loop={VIDEO_SOURCES.length < 2}
                src={VIDEO_SOURCES[slot]}
                onCanPlay={() => {
                  if (slot === activeSlot) setVideoReady(true);
                }}
                onLoadedData={(event) => {
                  if (slot !== activeSlot) return;
                  setVideoReady(true);
                  const playPromise = event.currentTarget.play();
                  if (playPromise?.catch) {
                    playPromise.catch(() => undefined);
                  }
                }}
                onLoadedMetadata={(event) => {
                  if (slot !== activeSlot) return;
                  scheduleSwap(event.currentTarget);
                }}
                onEnded={() => {
                  if (slot !== activeSlot) return;
                  requestSwap();
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

      {showBootOverlay && (
        <div className={styles.bootOverlay} data-phase={bootPhase} aria-hidden>
          <div className={styles.bootStabilizeLayer}>
            <span className={styles.bootCore} />
            <span className={styles.bootRing} />
            <span className={styles.bootRingOuter} />
            <span className={styles.bootLabel}>HYDROGENIUM</span>
          </div>
          <div className={styles.introOverlay} data-intro={bootPhase === "intro" ? "true" : "false"}>
            <span className={styles.introShade} />
            <span className={styles.introBubble} />
            <span className={styles.introRipple} />
          </div>
        </div>
      )}

      <div className={styles.uiLayer}>
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
            onPointerEnter={() => handleSideEnter(NAV_NADH_KEY, "left")}
            onPointerLeave={() => handleSideLeave("left")}
            onFocus={() => handleSideEnter(NAV_NADH_KEY, "left")}
            onBlur={() => handleSideLeave("left")}
            onPointerDown={handleRipple}
            onClick={(event) => handleDirectNav(event, NAV_NADH_KEY, nadhHref)}
          >
            <div className={styles.sideObjectLeft} aria-hidden="true">
              <span
                className={styles.sideObjectGooey}
                aria-hidden="true"
                ref={(node) => {
                  sideGooeyRefs.current.left = node;
                }}
              />
              <span className={styles.sideObjectShell} aria-hidden="true" />
              <span className={styles.sideObjectMedia}>
                <span className={styles.sideObjectGrid} aria-hidden="true" />
                <img
                  src="/pngKOR1.png"
                  alt=""
                  className={styles.sideObjectImage}
                  draggable={false}
                />
              </span>
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
            onPointerEnter={() => handleSideEnter(NAV_CABINETS_KEY, "right")}
            onPointerLeave={() => handleSideLeave("right")}
            onFocus={() => handleSideEnter(NAV_CABINETS_KEY, "right")}
            onBlur={() => handleSideLeave("right")}
            onPointerDown={handleRipple}
            onClick={(event) => handleDirectNav(event, NAV_CABINETS_KEY, cabinetsHref)}
          >
            <div className={styles.sideObjectRight} aria-hidden="true">
              <span
                className={styles.sideObjectGooey}
                aria-hidden="true"
                ref={(node) => {
                  sideGooeyRefs.current.right = node;
                }}
              />
              <span className={styles.sideObjectShell} aria-hidden="true" />
              <span className={styles.sideObjectMedia}>
                <img
                  src="/capsule_cut_trim_padded.png"
                  alt=""
                  className={clsx(styles.sideObjectImage, styles.sideObjectImageCrop)}
                  draggable={false}
                />
              </span>
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



