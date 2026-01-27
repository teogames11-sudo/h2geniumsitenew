"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NAV_ITEMS } from "@/config/nav";
import styles from "./NavConstellation.module.css";

type Point = {
  key: string;
  index: number;
  x: number;
  y: number;
};

type Line = {
  id: string;
  from: Point;
  to: Point;
};

type NavConstellationProps = {
  containerRef: RefObject<HTMLElement | null>;
  navSelector: string;
  variant?: "home" | "header";
  className?: string;
};

const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));

const buildRows = (points: Point[], tolerance: number) => {
  const rows: { y: number; points: Point[] }[] = [];
  points.forEach((point) => {
    const row = rows.find((entry) => Math.abs(entry.y - point.y) <= tolerance);
    if (!row) {
      rows.push({ y: point.y, points: [point] });
      return;
    }
    row.points.push(point);
    row.y = (row.y * (row.points.length - 1) + point.y) / row.points.length;
  });
  return rows;
};

const buildHomeMesh = (rows: { y: number; points: Point[] }[]) => {
  const lines: Line[] = [];
  const seen = new Set<string>();

  const addLine = (from: Point, to: Point) => {
    if (from.key === to.key) return;
    const id = from.key < to.key ? `${from.key}-${to.key}` : `${to.key}-${from.key}`;
    if (seen.has(id)) return;
    seen.add(id);
    lines.push({ id, from, to });
  };

  rows.forEach((row) => {
    const rowPoints = [...row.points].sort((a, b) => a.x - b.x || a.index - b.index);
    for (let i = 0; i < rowPoints.length - 1; i += 1) {
      addLine(rowPoints[i], rowPoints[i + 1]);
    }
    for (let i = 0; i < rowPoints.length - 2; i += 1) {
      addLine(rowPoints[i], rowPoints[i + 2]);
    }
  });

  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex += 1) {
    const current = [...rows[rowIndex].points].sort((a, b) => a.x - b.x || a.index - b.index);
    const next = [...rows[rowIndex + 1].points].sort((a, b) => a.x - b.x || a.index - b.index);
    current.forEach((point) => {
      const sortedByDist = [...next].sort((a, b) => Math.abs(a.x - point.x) - Math.abs(b.x - point.x));
      if (sortedByDist[0]) addLine(point, sortedByDist[0]);
      if (sortedByDist[1]) {
        const spread = Math.abs(sortedByDist[1].x - point.x);
        if (spread < 160) {
          addLine(point, sortedByDist[1]);
        }
      }
    });
  }

  return lines;
};

export const NavConstellation = ({
  containerRef,
  navSelector,
  variant = "header",
  className,
}: NavConstellationProps) => {
  const pathname = usePathname();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const hoverKeyRef = useRef<string | null>(null);
  const [, setHoverTick] = useState(0);

  const activeKey = useMemo(
    () => NAV_ITEMS.find((item) => item.href === pathname)?.key ?? null,
    [pathname],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        setSize({ width: 0, height: 0 });
        setPoints([]);
        setLines([]);
        return;
      }

      const nodes = Array.from(container.querySelectorAll<HTMLElement>(navSelector));
      const nextPoints: Point[] = nodes
        .map((node, index) => {
          const nodeRect = node.getBoundingClientRect();
          if (nodeRect.width < 4 || nodeRect.height < 4) return null;
          const key = node.dataset.navKey ?? `node-${index}`;
          const navIndex = Number(node.dataset.navIndex ?? index);
          return {
            key,
            index: Number.isFinite(navIndex) ? navIndex : index,
            x: nodeRect.left - rect.left + nodeRect.width / 2,
            y: nodeRect.top - rect.top + nodeRect.height / 2,
          };
        })
        .filter((entry): entry is Point => Boolean(entry));

      if (nextPoints.length === 0) {
        setSize({ width: rect.width, height: rect.height });
        setPoints([]);
        setLines([]);
        return;
      }

      const sorted = [...nextPoints].sort((a, b) => a.y - b.y || a.index - b.index);
      const tolerance = clamp(16, rect.height * 0.06, 28);
      const rows = buildRows(sorted, tolerance);
      const nextLines: Line[] =
        variant === "home"
          ? buildHomeMesh(rows)
          : rows.flatMap((row, rowIndex) => {
              const rowPoints = [...row.points].sort((a, b) => a.x - b.x || a.index - b.index);
              const rowLines: Line[] = [];
              for (let i = 0; i < rowPoints.length - 1; i += 1) {
                const from = rowPoints[i];
                const to = rowPoints[i + 1];
                rowLines.push({
                  id: `${rowIndex}-${from.key}-${to.key}`,
                  from,
                  to,
                });
              }
              return rowLines;
            });

      setSize({ width: rect.width, height: rect.height });
      setPoints(sorted);
      setLines(nextLines);
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(container);
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    if ("fonts" in document) {
      document.fonts.ready.then(schedule).catch(() => undefined);
    }
    schedule();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [containerRef, navSelector, variant]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointer = (event: Event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-nav-key]");
      hoverKeyRef.current = target?.dataset.navKey ?? null;
      setHoverTick((tick) => tick + 1);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-nav-key]");
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      hoverKeyRef.current = null;
      setHoverTick((tick) => tick + 1);
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-nav-key]");
      if (!target) return;
      if (target.contains(event.relatedTarget as Node)) return;
      hoverKeyRef.current = null;
      setHoverTick((tick) => tick + 1);
    };

    container.addEventListener("pointerover", handlePointer);
    container.addEventListener("focusin", handlePointer);
    container.addEventListener("pointerout", handlePointerOut);
    container.addEventListener("focusout", handleFocusOut);
    return () => {
      container.removeEventListener("pointerover", handlePointer);
      container.removeEventListener("focusin", handlePointer);
      container.removeEventListener("pointerout", handlePointerOut);
      container.removeEventListener("focusout", handleFocusOut);
    };
  }, [containerRef]);

  const hoverKey = hoverKeyRef.current;
  const highlightKey = hoverKey ?? activeKey;

  if (size.width <= 0 || size.height <= 0 || points.length === 0) return null;

  return (
    <svg
      className={clsx(
        styles.constellation,
        variant === "home" ? styles.constellationHome : styles.constellationHeader,
        className,
      )}
      viewBox={`0 0 ${size.width} ${size.height}`}
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      {lines.map((line) => {
        const midX = (line.from.x + line.to.x) / 2;
        const lift = clamp(8, Math.abs(line.to.x - line.from.x) * 0.08, 22);
        const midY = Math.min(line.from.y, line.to.y) - lift;
        const path =
          variant === "home"
            ? `M ${line.from.x} ${line.from.y} L ${line.to.x} ${line.to.y}`
            : `M ${line.from.x} ${line.from.y} Q ${midX} ${midY} ${line.to.x} ${line.to.y}`;
        const isHighlight =
          highlightKey !== null &&
          (line.from.key === highlightKey || line.to.key === highlightKey);
        const isHover =
          hoverKey !== null && (line.from.key === hoverKey || line.to.key === hoverKey);
        return (
          <path
            key={line.id}
            d={path}
            className={clsx(
              styles.line,
              variant === "home" ? styles.lineHome : styles.lineHeader,
              isHighlight && styles.lineActive,
              isHover && styles.lineHover,
            )}
          />
        );
      })}
      {points.map((point) => {
        const isHighlight = highlightKey !== null && point.key === highlightKey;
        const isHover = hoverKey !== null && point.key === hoverKey;
        return (
          <circle
            key={point.key}
            cx={point.x}
            cy={point.y}
            r={isHighlight ? 3 : 2.2}
            className={clsx(
              styles.node,
              variant === "home" ? styles.nodeHome : styles.nodeHeader,
              isHighlight && styles.nodeActive,
              isHover && styles.nodeHover,
            )}
          />
        );
      })}
    </svg>
  );
};
