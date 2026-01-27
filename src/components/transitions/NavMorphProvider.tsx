"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import type { NavItem } from "@/config/nav";
import { NAV_ITEMS } from "@/config/nav";
import { HEADER_SHOW_ON_HOME_DURING_MORPH, NAV_MORPH_DURATION } from "@/config/transitions";
import styles from "./NavMorphOverlay.module.css";

type MorphRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type MorphItem = {
  key: string;
  label: string;
  href: string;
  from: MorphRect;
  dx: number;
  dy: number;
  width: number;
  height: number;
  className: string;
  delay?: number;
};

type NavMorphContextValue = {
  isMorphing: boolean;
  startMorph?: (item: NavItem) => void;
  homeHeaderVisible: boolean;
};

const NavMorphContext = createContext<NavMorphContextValue>({
  isMorphing: false,
  homeHeaderVisible: false,
});

export const useNavMorph = () => useContext(NavMorphContext);

const MORPH_STAGGER_STEP = 0.06;
const MORPH_HEADER_SHOW_FRACTION = 0.12;
const MORPH_TAIL_MS = 160;
const getViewportScale = () => {
  if (typeof window === "undefined" || !document.body) {
    return { x: 1, y: 1 };
  }
  const zoomValue = Number.parseFloat(window.getComputedStyle(document.documentElement).zoom || "1");
  if (Number.isFinite(zoomValue) && zoomValue > 0) {
    return { x: zoomValue, y: zoomValue };
  }
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.left = "0";
  probe.style.top = "0";
  probe.style.width = "100px";
  probe.style.height = "100px";
  probe.style.pointerEvents = "none";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  const scaleX = rect.width / probe.offsetWidth;
  const scaleY = rect.height / probe.offsetHeight;
  document.body.removeChild(probe);
  return {
    x: Number.isFinite(scaleX) && scaleX > 0 ? scaleX : 1,
    y: Number.isFinite(scaleY) && scaleY > 0 ? scaleY : 1,
  };
};

const getRect = (el: HTMLElement, scale: { x: number; y: number }): MorphRect => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left / scale.x,
    top: rect.top / scale.y,
    width: rect.width / scale.x,
    height: rect.height / scale.y,
  };
};


const runWithFonts = (cb: () => void, rafRef?: MutableRefObject<number | null>) => {
  if (typeof document === "undefined") {
    cb();
    return;
  }
  const schedule = () => {
    const id = requestAnimationFrame(() => requestAnimationFrame(cb));
    if (rafRef) rafRef.current = id;
  };
  const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
  if (fontsReady) {
    fontsReady.then(() => {
      schedule();
    });
    return;
  }
  schedule();
};

const isValidRect = (rect: MorphRect) => rect.width > 0 && rect.height > 0;

const applyIndexStagger = (items: MorphItem[], step: number) =>
  items.map((item, index) => ({
    ...item,
    delay: index * step,
  }));

export const NavMorphProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isMorphing, setIsMorphing] = useState(false);
  const [homeHeaderVisible, setHomeHeaderVisible] = useState(false);
  const [overlayItems, setOverlayItems] = useState<MorphItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const headerTimeoutRef = useRef<number | null>(null);
  const reverseTimeoutRef = useRef<number | null>(null);
  const reverseRafRef = useRef<number | null>(null);
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    const prevPath = prevPathRef.current;
    const enteringHome = pathname === "/" && !!prevPath && prevPath !== "/";
    setOverlayItems([]);
    setHomeHeaderVisible(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (headerTimeoutRef.current) window.clearTimeout(headerTimeoutRef.current);
    if (reverseTimeoutRef.current) window.clearTimeout(reverseTimeoutRef.current);
    if (reverseRafRef.current) cancelAnimationFrame(reverseRafRef.current);
    reverseTimeoutRef.current = null;
    reverseRafRef.current = null;
    if (reduceMotion) {
      setIsMorphing(false);
      return;
    }
    setIsMorphing(enteringHome);
  }, [mounted, pathname, reduceMotion]);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    if (!mounted || reduceMotion) return;
    if (pathname !== "/" || !prevPath || prevPath === "/") return;

    const triggerReverse = () => {
      const tryMeasure = (attempt = 0, prevMap?: Map<string, MorphRect>, stableCount = 0) => {
        const bodyReady = document.body.classList.contains("home-fullscreen");
        const originNodes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-nav-target="header"][data-nav-key]'),
        );
        const targetNodes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-nav-origin="home"][data-nav-key]'),
        );

        if ((!bodyReady || targetNodes.length === 0) && attempt < 24) {
          reverseRafRef.current = requestAnimationFrame(() => tryMeasure(attempt + 1, prevMap, stableCount));
          return;
        }

        const scale = getViewportScale();
        const originByKey = new Map<string, HTMLElement>();
        originNodes.forEach((node) => {
          const key = node.dataset.navKey;
          if (key) originByKey.set(key, node);
        });
        const targetByKey = new Map<string, HTMLElement>();
        targetNodes.forEach((node) => {
          const key = node.dataset.navKey;
          if (key) targetByKey.set(key, node);
        });

        const items: MorphItem[] = [];
        const nextMap = new Map<string, MorphRect>();
        NAV_ITEMS.forEach((navItem) => {
          const origin = originByKey.get(navItem.key);
          const target = targetByKey.get(navItem.key);
          if (!origin || !target) return;
          const originRect = getRect(origin, scale);
          const from = originRect;
          const to = getRect(target, scale);
          if (!isValidRect(from) || !isValidRect(to)) return;
          nextMap.set(navItem.key, to);
          items.push({
            key: navItem.key,
            label: navItem.label,
            href: navItem.href,
            from,
            dx: to.left - from.left,
            dy: to.top - from.top,
            width: from.width,
            height: from.height,
            className: origin.className,
          });
        });

        if (items.length === 0) {
          setIsMorphing(false);
          setOverlayItems([]);
          return;
        }

        if (prevMap) {
          let delta = 0;
          items.forEach((item) => {
            const prev = prevMap.get(item.key);
            const next = nextMap.get(item.key);
            if (!prev || !next) return;
            delta = Math.max(
              delta,
              Math.abs(next.left - prev.left),
              Math.abs(next.top - prev.top),
              Math.abs(next.width - prev.width),
              Math.abs(next.height - prev.height),
            );
          });
          const nextStable = delta < 0.6 ? stableCount + 1 : 0;
          if (nextStable < 2 && attempt < 24) {
            reverseRafRef.current = requestAnimationFrame(() => tryMeasure(attempt + 1, nextMap, nextStable));
            return;
          }
        }

        const staggered = applyIndexStagger(items, MORPH_STAGGER_STEP);
        setOverlayItems(staggered);

        const maxDelay = Math.max(0, ...staggered.map((entry) => entry.delay ?? 0));
        const totalDelay = maxDelay * 1000;
        reverseTimeoutRef.current = window.setTimeout(() => {
          setIsMorphing(false);
          setOverlayItems([]);
        }, NAV_MORPH_DURATION + totalDelay + MORPH_TAIL_MS);
      };

      tryMeasure();
    };

    setIsMorphing(true);
    setPulseKey((prev) => prev + 1);
    runWithFonts(triggerReverse, reverseRafRef);

    return () => {
      if (reverseRafRef.current) cancelAnimationFrame(reverseRafRef.current);
    };
  }, [mounted, pathname, reduceMotion]);

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  const startMorph = useCallback(
    (item: NavItem) => {
      if (isMorphing) return;
      if (item.href === pathname) return;
      if (reduceMotion) {
        router.push(item.href);
        return;
      }

      const isHome = pathname === "/";
      if (!isHome) {
        router.push(item.href);
        return;
      }

      const runMorph = () => {
        const originNodes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-nav-origin="home"][data-nav-key]'),
        );
        const targetNodes = Array.from(
          document.querySelectorAll<HTMLElement>('[data-nav-target="header"][data-nav-key]'),
        );

        const scale = getViewportScale();
        const originByKey = new Map<string, HTMLElement>();
        originNodes.forEach((node) => {
          const key = node.dataset.navKey;
          if (key) originByKey.set(key, node);
        });
        const targetByKey = new Map<string, HTMLElement>();
        targetNodes.forEach((node) => {
          const key = node.dataset.navKey;
          if (key) targetByKey.set(key, node);
        });

        const items: MorphItem[] = [];
        NAV_ITEMS.forEach((navItem) => {
          const origin = originByKey.get(navItem.key);
          const target = targetByKey.get(navItem.key);
          if (!origin || !target) return;
          const from = getRect(origin, scale);
          const targetRect = getRect(target, scale);
          const to = targetRect;
          if (!isValidRect(from) || !isValidRect(to)) return;
          items.push({
            key: navItem.key,
            label: navItem.label,
            href: navItem.href,
            from,
            dx: to.left - from.left,
            dy: to.top - from.top,
            width: from.width,
            height: from.height,
            className: origin.className,
          });
        });

        if (items.length === 0) {
          router.push(item.href);
          return;
        }

        const staggered = applyIndexStagger(items, MORPH_STAGGER_STEP);
        setOverlayItems(staggered);
        setIsMorphing(true);
        setPulseKey((prev) => prev + 1);

        if (HEADER_SHOW_ON_HOME_DURING_MORPH) {
          headerTimeoutRef.current = window.setTimeout(() => {
            setHomeHeaderVisible(true);
          }, Math.round(NAV_MORPH_DURATION * MORPH_HEADER_SHOW_FRACTION));
        }

        const maxDelay = Math.max(0, ...staggered.map((entry) => entry.delay ?? 0));
        const totalDelay = maxDelay * 1000;
        timeoutRef.current = window.setTimeout(() => {
          router.push(item.href);
        }, NAV_MORPH_DURATION + totalDelay + MORPH_TAIL_MS);
      };

      runWithFonts(runMorph);
    },
    [isMorphing, pathname, reduceMotion, router],
  );

  const contextValue = useMemo(
    () => ({
      isMorphing,
      startMorph,
      homeHeaderVisible,
    }),
    [homeHeaderVisible, isMorphing, startMorph],
  );

  return (
    <NavMorphContext.Provider value={contextValue}>
      {children}
      {mounted &&
        isMorphing &&
        createPortal(<div key={pulseKey} className={styles.neonPulse} aria-hidden />, document.body)}
      {mounted &&
        overlayItems.length > 0 &&
        createPortal(
          <div className={styles.overlayRoot} aria-hidden>
            {overlayItems.map((item) => (
              <motion.div
                key={item.key}
                className={clsx(item.className, styles.overlayPill)}
                initial={{ x: 0, y: 0, opacity: 0.95 }}
                animate={{ x: item.dx, y: item.dy, opacity: 1 }}
                transition={{
                  duration: NAV_MORPH_DURATION / 1000,
                  ease: [0.16, 1, 0.3, 1],
                  delay: item.delay ?? 0,
                }}
                style={{
                  position: "fixed",
                  left: item.from.left,
                  top: item.from.top,
                  width: item.width,
                  height: item.height,
                  transformOrigin: "50% 50%",
                }}
              >
                <span className="homeTileInner">
                  <span className="homeTileLabel">{item.label}</span>
                  <span className="homeTileSheen" aria-hidden />
                </span>
              </motion.div>
            ))}
          </div>,
          document.body,
        )}
    </NavMorphContext.Provider>
  );
};
