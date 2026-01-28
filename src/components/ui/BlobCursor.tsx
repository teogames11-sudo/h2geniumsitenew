"use client";

import { useEffect, useId, useMemo, useRef, type RefObject } from "react";
import clsx from "clsx";
import { useReducedMotion } from "framer-motion";
import styles from "./BlobCursor.module.css";

type BlobCursorProps = {
  targetRef: RefObject<HTMLElement | null>;
  className?: string;
  blobType?: "circle" | "square";
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
};

const fillArray = (values: number[] | undefined, count: number, fallback: number) => {
  const base = values && values.length > 0 ? values : [fallback];
  return Array.from({ length: count }, (_, i) => base[Math.min(i, base.length - 1)]);
};

const resolveEase = (ease?: string) => {
  if (!ease) return "cubic-bezier(0.22, 1, 0.36, 1)";
  const normalized = ease.toLowerCase();
  if (normalized.includes("power3")) return "cubic-bezier(0.22, 1, 0.36, 1)";
  if (normalized.includes("power2")) return "cubic-bezier(0.25, 0.8, 0.25, 1)";
  if (normalized.includes("power1")) return "cubic-bezier(0.25, 0.1, 0.25, 1)";
  return ease;
};

export const BlobCursor = ({
  targetRef,
  className,
  blobType = "circle",
  fillColor = "#5227FF",
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = "rgba(255,255,255,0.8)",
  opacities = [0.6, 0.6, 0.6],
  shadowColor = "rgba(0,0,0,0.75)",
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId,
  filterStdDeviation = 30,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = "cubic-bezier(0.22, 1, 0.36, 1)",
  slowEase = "cubic-bezier(0.25, 0.1, 0.25, 1)",
  zIndex = 100,
}: BlobCursorProps) => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const rectRef = useRef({ left: 0, top: 0 });
  const id = useId().replace(/:/g, "");
  const resolvedFilterId = filterId ?? `blob-${id}`;

  const sizesList = useMemo(() => fillArray(sizes, trailCount, 60), [sizes, trailCount]);
  const innerSizesList = useMemo(() => fillArray(innerSizes, trailCount, 18), [innerSizes, trailCount]);
  const opacitiesList = useMemo(() => fillArray(opacities, trailCount, 0.6), [opacities, trailCount]);
  const fastEaseResolved = useMemo(() => resolveEase(fastEase), [fastEase]);
  const slowEaseResolved = useMemo(() => resolveEase(slowEase), [slowEase]);

  useEffect(() => {
    const target = targetRef.current;
    const container = containerRef.current;
    if (!target || !container || reduceMotion) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const connection = nav.connection;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const lowPower = Boolean(connection?.saveData) || lowMemory || connection?.effectiveType?.includes("2g");
    if (lowPower) return;

    const updateZoom = () => {
      const rootZoom = Number.parseFloat(window.getComputedStyle(document.documentElement).zoom || "1");
      zoomRef.current = Number.isFinite(rootZoom) && rootZoom > 0 ? rootZoom : 1;
    };

    const updateRect = () => {
      const rect = target.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top };
    };

    const updatePosition = () => {
      rafRef.current = null;
      const { x, y } = pointerRef.current;
      container.style.setProperty("--blob-x", `${x}px`);
      container.style.setProperty("--blob-y", `${y}px`);
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const scale = zoomRef.current;
      const rect = rectRef.current;
      const x = (event.clientX - rect.left) / scale;
      const y = (event.clientY - rect.top) / scale;
      pointerRef.current = { x, y };
      container.dataset.active = "true";
      schedule();
    };

    const handlePointerLeave = () => {
      container.dataset.active = "false";
    };

    let resizeRaf = 0;
    const scheduleRect = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        updateZoom();
        updateRect();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleRect);
    resizeObserver.observe(target);
    window.addEventListener("resize", scheduleRect);
    window.addEventListener("scroll", scheduleRect, { passive: true });
    target.addEventListener("pointermove", handlePointerMove, { passive: true });
    target.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    updateZoom();
    updateRect();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleRect);
      window.removeEventListener("scroll", scheduleRect);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      container.dataset.active = "false";
    };
  }, [reduceMotion, targetRef]);

  return (
    <div ref={containerRef} className={clsx(styles.blobContainer, className)} style={{ zIndex }}>
      {useFilter && (
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <filter id={resolvedFilterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}
      <div className={styles.blobMain} style={{ filter: useFilter ? `url(#${resolvedFilterId})` : undefined }}>
        {Array.from({ length: trailCount }).map((_, i) => {
          const size = sizesList[i];
          const innerSize = innerSizesList[i];
          const radius = blobType === "circle" ? "50%" : "0%";
          const duration = i === 0 ? fastDuration : slowDuration;
          const ease = i === 0 ? fastEaseResolved : slowEaseResolved;
          return (
            <div
              key={i}
              className={styles.blob}
              style={{
                width: size,
                height: size,
                borderRadius: radius,
                backgroundColor: fillColor,
                opacity: opacitiesList[i],
                boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
                transition: `transform ${duration}s ${ease}`,
              }}
            >
              <div
                className={styles.innerDot}
                style={{
                  width: innerSize,
                  height: innerSize,
                  top: (size - innerSize) / 2,
                  left: (size - innerSize) / 2,
                  backgroundColor: innerColor,
                  borderRadius: radius,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
