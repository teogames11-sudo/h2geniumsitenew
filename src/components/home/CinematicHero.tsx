"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CSSProperties, memo, useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import { NAV_ITEMS } from "@/config/nav";
import { NavPills } from "@/components/nav/NavPills";
import { useNavMorph } from "@/components/transitions/NavMorphProvider";
import styles from "./CinematicHero.module.css";

const ARC_OUTER_START_DEG = 25;
const ARC_OUTER_END_DEG = 155;
const ARC_INNER_START_DEG = 35;
const ARC_INNER_END_DEG = 145;
const ARC_CENTER_X = 0.5;
const ARC_CENTER_BASE_Y = 0.62;
const ARC_BOTTOM_MARGIN = 28;
const ARC_TOP_GAP = 14;
const ARC_OUTER_RADIUS = { min: 260, vw: 0.22, max: 420 };
const ARC_INNER_RADIUS = { min: 190, vw: 0.18, max: 340 };
const STAR_COUNT = 260;
const TITLE = "ЭКОСИСТЕМА HYDROGENIUM";
const NAV_NADH_KEY = "nadh";
const NAV_CABINETS_KEY = "cabinets";

const splitNavItems = () => ({
  outer: NAV_ITEMS.slice(0, 5),
  inner: NAV_ITEMS.slice(5),
});

const getArcAngles = (count: number, start: number, end: number) => {
  if (count <= 1) return [(start + end) / 2];
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, idx) => start + step * idx);
};

const clampPx = (min: number, preferredVw: number, max: number) => {
  if (typeof window === "undefined") return min;
  return Math.min(max, Math.max(min, window.innerWidth * preferredVw));
};

const getArcOffset = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
};

type Star = {
  id: string;
  top: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
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

const createStars = (count: number, seed: number): Star[] => {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, idx) => ({
    id: `star-${seed}-${idx}`,
    top: rnd() * 100,
    left: rnd() * 100,
    size: 1 + rnd() * 2.4,
    opacity: 0.35 + rnd() * 0.55,
    delay: rnd() * 4.2,
    duration: 2.8 + rnd() * 3.2,
  }));
};

const createStarsInRange = (count: number, seed: number, minTop: number, maxTop: number): Star[] => {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, idx) => ({
    id: `star-${seed}-${idx}`,
    top: minTop + rnd() * (maxTop - minTop),
    left: rnd() * 100,
    size: 1 + rnd() * 2.8,
    opacity: 0.45 + rnd() * 0.5,
    delay: rnd() * 4.2,
    duration: 2.6 + rnd() * 3.4,
  }));
};

const getPulseVars = (index: number): CSSProperties => {
  const delay = index * 0.24;
  const duration = 3.4 + (index % 9) * 0.24;
  return {
    "--pulse-delay": `${delay.toFixed(2)}s`,
    "--pulse-duration": `${duration.toFixed(2)}s`,
  } as CSSProperties;
};

type ArcRowProps = {
  items: typeof NAV_ITEMS;
  angles: number[];
  radius: number;
  activePath: string | null;
  center: { x: number; y: number };
  className?: string;
  pulseOffset?: number;
};

const ArcRow = ({ items, angles, radius, activePath, center, className, pulseOffset = 0 }: ArcRowProps) => {
  return (
    <div className={clsx(styles.arcRow, className)}>
      {items.map((item, idx) => {
        const isActive = activePath === item.href;
        const offset = getArcOffset(angles[idx] ?? 0, radius);
        let x = offset.x;
        let y = offset.y;
        if (Number.isNaN(x) || Number.isNaN(y)) {
          console.warn("Arc position NaN", { angle: angles[idx], radius });
          x = 0;
          y = 0;
        }
        const left = center.x + x;
        const top = center.y + y;
        const pulseVars = getPulseVars(pulseOffset + idx);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              styles.arcItem,
              styles.navButton,
              "inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-center text-sm font-medium leading-snug text-white/90 backdrop-blur-xl transition hover:border-white/30 hover:bg-white/20 md:h-14 md:px-5 md:text-base",
              isActive && "border-white/35 bg-white/20 text-white shadow-[0_22px_52px_-20px_rgba(47,183,255,0.8)]",
            )}
            style={
              {
                left: `${left.toFixed(2)}px`,
                top: `${top.toFixed(2)}px`,
                transform: "translate(-50%, -50%) translateY(var(--lift))",
                ...pulseVars,
              } as CSSProperties
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

type ArcNavTwoRowsProps = {
  className?: string;
  anchorRef?: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
};

const ArcNavTwoRows = ({ className, anchorRef, containerRef }: ArcNavTwoRowsProps) => {
  const pathname = usePathname();
  const [layout, setLayout] = useState({
    outer: ARC_OUTER_RADIUS.min,
    inner: ARC_INNER_RADIUS.min,
    centerX: 0,
    centerY: 0,
  });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth || document.documentElement.clientWidth || 0;
      const height = window.innerHeight || document.documentElement.clientHeight || 0;
      const outer = clampPx(ARC_OUTER_RADIUS.min, ARC_OUTER_RADIUS.vw, ARC_OUTER_RADIUS.max);
      const innerBase = clampPx(ARC_INNER_RADIUS.min, ARC_INNER_RADIUS.vw, ARC_INNER_RADIUS.max);
      const inner = Math.max(ARC_INNER_RADIUS.min, Math.min(innerBase, outer - 70));
      let centerX = width * ARC_CENTER_X;
      let centerY = height * ARC_CENTER_BASE_Y;

      const containerRect = containerRef?.current?.getBoundingClientRect();
      const anchorRect = anchorRef?.current?.getBoundingClientRect();
      if (containerRect && anchorRect) {
        const anchorBottom = anchorRect.bottom - containerRect.top;
        const minOffsetY = Math.sin((ARC_OUTER_START_DEG * Math.PI) / 180) * outer;
        const desiredTop = anchorBottom + ARC_TOP_GAP;
        centerY = desiredTop - minOffsetY;
        const maxCenter = height - ARC_BOTTOM_MARGIN - outer;
        if (Number.isFinite(maxCenter)) {
          centerY = Math.min(centerY, maxCenter);
        }
        const minCenter = height * 0.52;
        if (Number.isFinite(minCenter)) {
          centerY = Math.max(centerY, minCenter);
        }
        centerX = anchorRect.left - containerRect.left + anchorRect.width / 2;
      }

      setLayout({
        outer,
        inner,
        centerX,
        centerY,
      });
    };

    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(() => update());
    if (anchorRef?.current) observer.observe(anchorRef.current);
    if (containerRef?.current) observer.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [anchorRef, containerRef]);

  const { outer, inner } = splitNavItems();
  const outerAngles = getArcAngles(outer.length, ARC_OUTER_START_DEG, ARC_OUTER_END_DEG);
  const innerAngles = getArcAngles(inner.length, ARC_INNER_START_DEG, ARC_INNER_END_DEG);
  const center = {
    x: layout.centerX,
    y: layout.centerY,
  };

  return (
    <nav className={clsx(styles.arcShell, className)} aria-label="Main navigation">
      <ArcRow items={outer} angles={outerAngles} radius={layout.outer} activePath={pathname} center={center} />
      {inner.length > 0 && (
        <ArcRow
          items={inner}
          angles={innerAngles}
          radius={layout.inner}
          activePath={pathname}
          center={center}
          className={styles.arcRowInner}
          pulseOffset={outer.length}
        />
      )}
    </nav>
  );
};

const CinematicHeroComponent = () => {
  const navRows = splitNavItems();
  const mobileItems = [...navRows.outer, ...navRows.inner];
  const desktopRows = [navRows.inner, navRows.outer].filter((row) => row.length > 0);
  const stars = useMemo(() => createStars(STAR_COUNT, 202501), []);
  const starsBottom = useMemo(() => createStarsInRange(180, 202503, 48, 100), []);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const { startMorph } = useNavMorph();
  const heroRef = useRef<HTMLElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const navMap = useMemo(() => new Map(NAV_ITEMS.map((item) => [item.key, item])), []);
  const nadhHref = navMap.get(NAV_NADH_KEY)?.href ?? "/nadh";
  const cabinetsHref = navMap.get(NAV_CABINETS_KEY)?.href ?? "/application";

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    if (reduceMotion) {
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
      targetX = dx * 14;
      targetY = dy * 12;
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
  }, [reduceMotion]);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const buttons = Array.from(root.querySelectorAll<HTMLElement>('button[data-nav-origin="home"]'));
    if (!buttons.length) return;
    const centerEl = centerRef.current;
    if (!centerEl) return;

    const update = () => {
      const centerRect = centerEl.getBoundingClientRect();
      const centerX = centerRect.left + centerRect.width / 2;
      const centerY = centerRect.top + centerRect.height / 2;
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = centerX - bx;
        const dy = centerY - by;
        const length = Math.min(720, Math.hypot(dx, dy));
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        button.style.setProperty("--line-length", `${length.toFixed(1)}px`);
        button.style.setProperty("--line-angle", `${angle.toFixed(2)}deg`);
      });
    };

    update();
    const raf = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(root);
    observer.observe(centerEl);
    buttons.forEach((button) => observer.observe(button));
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

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
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button[data-nav-origin="home"]');
      if (!target) return;
      setNavHover(target.dataset.navKey);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button[data-nav-origin="home"]');
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      setNavHover();
      target.style.setProperty("--mag-x", "0px");
      target.style.setProperty("--mag-y", "0px");
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button[data-nav-origin="home"]');
      if (!target) return;
      setNavHover(target.dataset.navKey);
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button[data-nav-origin="home"]');
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      setNavHover();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer) return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('button[data-nav-origin="home"]');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      target.style.setProperty("--mag-x", `${(dx * 4).toFixed(2)}px`);
      target.style.setProperty("--mag-y", `${(dy * 4).toFixed(2)}px`);
    };

    root.addEventListener("pointerover", handlePointerOver);
    root.addEventListener("pointerout", handlePointerOut);
    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);

    return () => {
      root.removeEventListener("pointerover", handlePointerOver);
      root.removeEventListener("pointerout", handlePointerOut);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  const handleSideHover = (key?: string) => {
    const root = heroRef.current;
    if (!root) return;
    if (key) {
      root.dataset.highlight = key;
    } else {
      delete root.dataset.highlight;
    }
  };

  const handleRipple = (event: PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    target.dataset.pressed = "true";
    window.setTimeout(() => {
      delete target.dataset.pressed;
    }, 260);
  };

  const handleDirectNav = (event: MouseEvent<HTMLElement>, key: string, href: string) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const item = navMap.get(key);
    if (item && startMorph) {
      startMorph(item);
      return;
    }
    router.push(href);
  };

  const hero = (
    <section ref={heroRef} data-hero-root className={styles.heroFixed} aria-label="HYDROGENIUM hero section">
      <div className={styles.backgroundLayer} aria-hidden />
      <div className={styles.starsLayer} aria-hidden>
        {stars.map((star) => (
          <span
            key={star.id}
            className={styles.star}
            style={
              {
                top: `${star.top.toFixed(2)}%`,
                left: `${star.left.toFixed(2)}%`,
                width: `${star.size.toFixed(2)}px`,
                height: `${star.size.toFixed(2)}px`,
                opacity: star.opacity,
                "--twinkle-delay": `${star.delay.toFixed(2)}s`,
                "--twinkle-duration": `${star.duration.toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
        {starsBottom.map((star) => (
          <span
            key={star.id}
            className={`${styles.star} ${styles.starBottom}`}
            style={
              {
                top: `${star.top.toFixed(2)}%`,
                left: `${star.left.toFixed(2)}%`,
                width: `${star.size.toFixed(2)}px`,
                height: `${star.size.toFixed(2)}px`,
                opacity: star.opacity,
                "--twinkle-delay": `${star.delay.toFixed(2)}s`,
                "--twinkle-duration": `${star.duration.toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className={styles.decorLayer} aria-hidden>
        <div className={styles.horizonGlow} />
        <div className={styles.groundGrid} />
        <div className={styles.baseGlow} />
      </div>

      <Link
        href={nadhHref}
        className={styles.sideLinkLeft}
        aria-label="NADH CLINIC"
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

      <Link
        href={cabinetsHref}
        className={styles.sideLinkRight}
        aria-label="Эпигенетическая коррекция"
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
                <stop offset="0%" stopColor="rgba(150,220,255,0.85)" />
                <stop offset="100%" stopColor="rgba(80,180,255,0.2)" />
              </linearGradient>
              <radialGradient id="heroStarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(160,235,255,0.8)" />
                <stop offset="100%" stopColor="rgba(60,170,255,0)" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="72" fill="url(#heroStarGlow)" />
            <polygon
              points="100,16 178,150 22,150"
              fill="none"
              stroke="url(#heroStarStroke)"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon
              points="100,184 178,50 22,50"
              fill="none"
              stroke="url(#heroStarStroke)"
              strokeWidth="2.2"
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

      <div className={styles.scene}>
        <div ref={centerRef} className={styles.heroCenter} aria-hidden />
        <div className={styles.orbitTitleWrap} aria-label={TITLE}>
          <div className={styles.orbitTitleParallax} aria-hidden="true">
            <svg className={styles.orbitTitleSvg} viewBox="0 0 1200 420" role="img" aria-hidden="true">
            <defs>
              <path id="orbitTitlePath" d="M 120 260 C 300 120 900 120 1080 260" />
              <path id="orbitRingOuter" d="M 140 278 C 320 140 880 140 1060 278" />
              <path id="orbitRingInner" d="M 170 300 C 340 176 860 176 1030 300" />
            </defs>
            <g className={styles.orbitTitleOrbits} aria-hidden="true">
              <use href="#orbitRingOuter" className={styles.orbitTitleRing} />
              <use href="#orbitRingInner" className={clsx(styles.orbitTitleRing, styles.orbitTitleRingInner)} />
            </g>
            <text className={styles.orbitTitleText}>
              <textPath href="#orbitTitlePath" startOffset="50%" textAnchor="middle">
                {TITLE}
              </textPath>
            </text>
            <use href="#orbitTitlePath" className={styles.orbitTitlePath} />
          </svg>
          </div>
        </div>
        <div className={styles.treeStage}>
          <div className={styles.treeSlot}>
            <div className={styles.treeSpin} aria-hidden />
          </div>
        </div>
      </div>

      <div className={styles.rootTendrils} aria-hidden="true">
        <svg className={styles.rootSvg} viewBox="0 0 1200 360" role="presentation" aria-hidden="true">
          <path className={styles.rootLine} d="M 580 6 C 564 80 548 138 532 196 C 510 258 474 298 414 340" />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 620 6 C 642 92 678 154 708 212 C 738 272 772 310 834 340"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 560 12 C 536 112 506 172 484 232 C 456 294 430 320 370 352"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 640 12 C 664 112 694 172 716 232 C 744 294 770 320 830 352"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 540 2 C 520 68 494 128 464 188 C 430 250 388 292 324 330"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 660 2 C 680 68 706 128 736 188 C 770 250 812 292 876 330"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 520 0 C 496 50 470 108 438 158 C 404 210 356 250 300 300"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 680 0 C 704 50 730 108 762 158 C 796 210 844 250 900 300"
          />
          <path className={styles.rootLine} d="M 595 10 C 586 90 580 150 574 210 C 564 270 536 310 498 350" />
          <path className={styles.rootLine} d="M 605 10 C 614 90 620 150 626 210 C 636 270 664 310 702 350" />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 550 14 C 516 108 478 168 432 226 C 392 278 350 310 288 342"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 650 14 C 684 108 722 168 768 226 C 808 278 850 310 912 342"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 620 6 C 614 118 616 178 618 238 C 620 298 628 324 648 352"
          />
        </svg>
      </div>

      <div className={styles.navDock}>
        <nav className={clsx(styles.desktopNav, "hidden lg:flex")} aria-label="Main navigation">
          {desktopRows.map((row, rowIndex) => (
            <div key={`desktop-row-${rowIndex}`} className={styles.desktopRow}>
              <NavPills
                variant="homeDock"
                items={row}
                as="fragment"
                itemClassName={clsx(
                  styles.navButton,
                  styles.desktopButton,
                  "inline-flex h-[52px] items-center justify-center rounded-full px-6 text-center text-[15px] font-medium text-white/90 backdrop-blur-xl",
                )}
                activeClassName="text-white shadow-[0_22px_52px_-20px_rgba(47,183,255,0.8)]"
                getItemStyle={(_, itemIndex) => getPulseVars(rowIndex * 6 + itemIndex)}
              />
            </div>
          ))}
        </nav>

        <nav className={clsx(styles.mobileNav, "lg:hidden")} aria-label="Main navigation">
          <div className={clsx("flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pt-1", styles.noScrollbar)}>
            <NavPills
              variant="homeDock"
              items={mobileItems}
              as="fragment"
              itemClassName={clsx(
                styles.navButton,
                "inline-flex h-10 min-w-[150px] shrink-0 snap-center items-center justify-center whitespace-nowrap rounded-full px-4 text-[12px] font-medium text-white/90 backdrop-blur-xl",
              )}
              getItemStyle={(_, itemIndex) => getPulseVars(itemIndex)}
            />
          </div>
        </nav>
      </div>
    </section>
  );

  return hero;
};

export const CinematicHero = memo(CinematicHeroComponent);
CinematicHero.displayName = "CinematicHero";



