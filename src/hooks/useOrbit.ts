import { RefObject, useEffect, useMemo, useRef, useState } from "react";

type OrbitOptions = {
  count: number;
  containerRef: RefObject<HTMLElement | null>;
  /** seconds for a full revolution */
  duration?: number;
  rxFactor?: number;
  ryFactor?: number;
  minRx?: number;
  maxRx?: number;
  minRy?: number;
  maxRy?: number;
  phases?: number[];
  disableAnimation?: boolean;
  offsetX?: number;
  offsetY?: number;
  onUpdate?: (
    positions: OrbitPosition[],
    meta: { center: { cx: number; cy: number }; radii: { rx: number; ry: number }; phase: number },
  ) => void;
};

export type OrbitPosition = { x: number; y: number };

const clamp = (value: number, min?: number, max?: number) => {
  let result = value;
  if (typeof min === "number") result = Math.max(result, min);
  if (typeof max === "number") result = Math.min(result, max);
  return result;
};

export const useOrbit = ({
  count,
  containerRef,
  duration = 28,
  rxFactor = 0.4,
  ryFactor = 0.26,
  minRx = 220,
  maxRx,
  minRy = 140,
  maxRy,
  phases,
  disableAnimation = false,
  offsetX = 0,
  offsetY = 0,
  onUpdate,
}: OrbitOptions) => {
  const basePhases = useMemo(
    () => phases ?? Array.from({ length: count }, (_, idx) => (idx * Math.PI) / 2),
    [count, phases],
  );

  const [positions, setPositions] = useState<OrbitPosition[]>(() =>
    Array.from({ length: count }, () => ({ x: 0, y: 0 })),
  );
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [center, setCenter] = useState({ cx: 0, cy: 0 });
  const [radii, setRadii] = useState({ rx: 0, ry: 0 });
  const [paused, setPausedState] = useState(false);

  const pausedRef = useRef(false);
  const phaseRef = useRef(0);
  const displayPhaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const durationMs = duration * 1000;
  const centerRef = useRef({ cx: 0, cy: 0 });
  const radiiRef = useRef({ rx: 0, ry: 0 });
  const positionsRef = useRef<OrbitPosition[]>(Array.from({ length: count }, () => ({ x: 0, y: 0 })));

  const computePositions = (phase: number) => {
    const { cx, cy } = centerRef.current;
    const { rx, ry } = radiiRef.current;
    if (!rx || !ry) return positionsRef.current;
    positionsRef.current = basePhases.map((base) => ({
      x: cx + rx * Math.cos(base + phase),
      y: cy + ry * Math.sin(base + phase),
    }));
    return positionsRef.current;
  };

  const measure = () => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = clamp(rect.width * rxFactor, minRx, maxRx);
    const ry = clamp(rect.height * ryFactor, minRy, maxRy ?? rx * 0.68);
    const cx = rect.width / 2 + offsetX;
    const cy = rect.height / 2 + offsetY;
    centerRef.current = { cx, cy };
    radiiRef.current = { rx, ry };
    setSize({ width: rect.width, height: rect.height });
    setCenter(centerRef.current);
    setRadii(radiiRef.current);
    positionsRef.current = basePhases.map((base) => ({
      x: cx + rx * Math.cos(base + phaseRef.current),
      y: cy + ry * Math.sin(base + phaseRef.current),
    }));
    setPositions(positionsRef.current);
    onUpdate?.(positionsRef.current, { center: centerRef.current, radii: radiiRef.current, phase: displayPhaseRef.current });
  };

  useEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rxFactor, ryFactor, minRx, maxRx, minRy, maxRy, basePhases, offsetX, offsetY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, rxFactor, ryFactor, minRx, maxRx, minRy, maxRy, basePhases, offsetX, offsetY]);

  useEffect(() => {
    if (disableAnimation) {
      pausedRef.current = true;
      setPausedState(true);
      displayPhaseRef.current = phaseRef.current;
      computePositions(displayPhaseRef.current);
      onUpdate?.(positionsRef.current, { center: centerRef.current, radii: radiiRef.current, phase: displayPhaseRef.current });
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    pausedRef.current = false;
    setPausedState(false);
    accumulatorRef.current = 0;
    lastTs.current = null;
    const frameIntervalMs = 1000 / 60;

    const tick = (ts: number) => {
      if (lastTs.current === null) {
        lastTs.current = ts;
        displayPhaseRef.current = phaseRef.current;
        computePositions(displayPhaseRef.current);
        onUpdate?.(positionsRef.current, { center: centerRef.current, radii: radiiRef.current });
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const delta = ts - lastTs.current;
      lastTs.current = ts;
      accumulatorRef.current += delta;

      if (!pausedRef.current) {
        phaseRef.current = (phaseRef.current + (delta / durationMs) * Math.PI * 2) % (Math.PI * 2);
      }

      if (accumulatorRef.current >= frameIntervalMs) {
        const rawTarget = phaseRef.current;
        let diff = rawTarget - displayPhaseRef.current;
        diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI; // shortest path
        displayPhaseRef.current = (displayPhaseRef.current + diff * 0.08 + Math.PI * 2) % (Math.PI * 2);
        computePositions(displayPhaseRef.current);
        if (onUpdate) {
          onUpdate(positionsRef.current, { center: centerRef.current, radii: radiiRef.current, phase: displayPhaseRef.current });
        } else {
          setPositions(positionsRef.current);
        }
        accumulatorRef.current %= frameIntervalMs;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableAnimation, durationMs, basePhases, onUpdate]);

  const setPaused = (value: boolean) => {
    pausedRef.current = value;
    setPausedState(value);
  };

  return { positions, center, size, radii, paused, setPaused };
};
