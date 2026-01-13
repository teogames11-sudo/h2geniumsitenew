"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, memo, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { NAV_ITEMS } from "@/lib/nav";
import styles from "./CinematicHero.module.css";

const SceneTree = dynamic(() => import("./SceneTree").then((mod) => mod.SceneTree), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

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
  const delay = index * 0.18;
  const duration = 3.2 + (index % 9) * 0.2;
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
  const pathname = usePathname();
  const navRows = splitNavItems();
  const mobileRows = [navRows.outer, navRows.inner].filter((row) => row.length > 0);
  const desktopRows = [navRows.inner, navRows.outer].filter((row) => row.length > 0);
  const stars = useMemo(() => createStars(STAR_COUNT, 202501), []);
  const starsBottom = useMemo(() => createStarsInRange(180, 202503, 48, 100), []);
  const treeSlotRef = useRef<HTMLDivElement | null>(null);

  const hero = (
    <section data-hero-root className={styles.heroFixed} aria-label="HYDROGENIUM hero section">
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

      <Link href="/nadh" className={styles.sideLinkLeft} aria-label="NADH CLINIC">
        <div className={styles.sideObjectLeft} aria-hidden="true">
          <span className={styles.capsuleCore} />
        </div>
        <div className={styles.sideLabel}>NADH CLINIC</div>
      </Link>

      <Link href="/application" className={styles.sideLinkRight} aria-label="Эпигенетическая коррекция">
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
        <div className={styles.orbitTitleWrap} aria-label={TITLE}>
          <svg className={styles.orbitTitleSvg} viewBox="0 0 1200 420" role="img" aria-hidden="true">
            <defs>
              <path id="orbitLine" d="M 140 262 L 1060 262" />
              <linearGradient id="orbitFadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orbitFadeRight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
              <mask id="orbitMaskLeft" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1200" height="420" fill="url(#orbitFadeLeft)" />
              </mask>
              <mask id="orbitMaskRight" maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="1200" height="420" fill="url(#orbitFadeRight)" />
              </mask>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <use href="#orbitLine" className={styles.orbitTitlePath} />
            <g filter="url(#glow)">
              <text className={styles.orbitTitleText} x="600" y="244" textAnchor="middle">
                {TITLE}
              </text>
              <text
                className={clsx(styles.orbitTitleText, styles.orbitTitleTextCurlLeft)}
                x="600"
                y="244"
                textAnchor="middle"
                mask="url(#orbitMaskLeft)"
              >
                {TITLE}
              </text>
              <text
                className={clsx(styles.orbitTitleText, styles.orbitTitleTextCurlRight)}
                x="600"
                y="244"
                textAnchor="middle"
                mask="url(#orbitMaskRight)"
              >
                {TITLE}
              </text>
            </g>
          </svg>
        </div>
        <div className={styles.treeStage}>
          <div ref={treeSlotRef} className={styles.treeSlot}>
            <div className={styles.treeSpin}>
              <SceneTree className={styles.treeCanvas} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rootTendrils} aria-hidden="true">
        <svg className={styles.rootSvg} viewBox="0 0 1200 360" role="presentation" aria-hidden="true">
          <path className={styles.rootLine} d="M 600 12 C 582 86 562 142 544 198 C 520 260 480 300 420 340" />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 600 12 C 622 92 662 154 690 212 C 722 272 760 310 820 340"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 600 20 C 568 120 530 178 508 238 C 478 300 456 322 390 352"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 600 20 C 632 120 670 178 692 238 C 722 300 744 322 810 352"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 600 8 C 575 70 548 130 515 190 C 480 250 430 292 360 330"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 600 8 C 625 70 652 130 685 190 C 720 250 770 292 840 330"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 600 6 C 570 50 540 110 500 160 C 460 210 410 250 330 300"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 600 6 C 630 50 660 110 700 160 C 740 210 790 250 870 300"
          />
          <path className={styles.rootLine} d="M 600 14 C 590 90 585 150 580 210 C 570 270 540 310 500 350" />
          <path className={styles.rootLine} d="M 600 14 C 610 90 615 150 620 210 C 630 270 660 310 700 350" />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 600 22 C 560 110 520 170 470 228 C 430 280 380 310 300 342"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAltTwo)}
            d="M 600 22 C 640 110 680 170 730 228 C 770 280 820 310 900 342"
          />
          <path
            className={clsx(styles.rootLine, styles.rootLineAlt)}
            d="M 600 10 C 595 120 598 180 600 240 C 602 300 610 325 630 352"
          />
        </svg>
      </div>

      <div className={styles.navDock}>
        <nav className={clsx(styles.desktopNav, "hidden lg:flex")} aria-label="Main navigation">
          {desktopRows.map((row, rowIndex) => (
            <div key={`desktop-row-${rowIndex}`} className={styles.desktopRow}>
              {row.map((item, itemIndex) => {
                const pulseVars = getPulseVars(rowIndex * 6 + itemIndex);
                const isActive = item.href === pathname;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      styles.navButton,
                      styles.desktopButton,
                      "inline-flex h-[52px] items-center justify-center rounded-full px-6 text-center text-[15px] font-medium text-white/90 backdrop-blur-xl",
                      isActive && "text-white shadow-[0_22px_52px_-20px_rgba(47,183,255,0.8)]",
                    )}
                    style={pulseVars}
                    aria-label={item.label}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <nav className={clsx(styles.mobileNav, "lg:hidden")} aria-label="Main navigation">
          <div className="flex flex-col gap-3">
            {mobileRows.map((row, rowIndex) => (
              <div
                key={`mobile-row-${rowIndex}`}
                className={clsx("flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1", styles.noScrollbar)}
              >
                {row.map((item, itemIndex) => {
                  const pulseVars = getPulseVars(rowIndex * 6 + itemIndex);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        styles.navButton,
                        "inline-flex h-[52px] min-w-[210px] shrink-0 snap-center items-center justify-center whitespace-nowrap rounded-full px-7 text-[17px] font-medium text-white/90 backdrop-blur-xl md:h-[60px] md:px-8 md:text-lg",
                      )}
                      style={pulseVars}
                      aria-label={item.label}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );

  return hero;
};

export const CinematicHero = memo(CinematicHeroComponent);
CinematicHero.displayName = "CinematicHero";



