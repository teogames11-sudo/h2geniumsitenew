"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { NavItem } from "@/config/nav";
import { useNavMorph } from "@/components/transitions/NavMorphProvider";

type GooeyNavProps = {
  items: NavItem[];
  className?: string;
  itemClassName?: string;
  itemWrapperClassName?: string;
  ariaLabel?: string;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
  origin?: "home" | "header";
  activeClassName?: string;
  inactiveClassName?: string;
  hoverClassName?: string;
  contentVariant?: "label" | "homeTile";
};

const noise = (n = 1) => n / 2 - Math.random() * n;

const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};

export const GooeyNav = ({
  items,
  className,
  itemClassName,
  itemWrapperClassName,
  ariaLabel = "Main navigation",
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  origin = "header",
  activeClassName = "text-white",
  inactiveClassName = "text-white/85",
  hoverClassName = "hover:text-white",
  contentVariant = "label",
}: GooeyNavProps) => {
  const pathname = usePathname();
  const { isMorphing, startMorph } = useNavMorph();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const filterRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const skipClickRef = useRef(false);
  const hoverIndexRef = useRef<number | null>(null);
  const hotTimeoutRef = useRef<number | null>(null);
  const hotTargetRef = useRef<HTMLElement | null>(null);

  const resolvedIndex = useMemo(() => {
    const matchIndex = items.findIndex((item) => item.href === pathname);
    if (matchIndex >= 0) return matchIndex;
    return Math.min(Math.max(0, initialActiveIndex), Math.max(0, items.length - 1));
  }, [initialActiveIndex, items, pathname]);

  const [activeIndex, setActiveIndex] = useState(resolvedIndex);

  useEffect(() => {
    if (activeIndex !== resolvedIndex) {
      setActiveIndex(resolvedIndex);
    }
  }, [activeIndex, resolvedIndex]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLSpanElement) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i += 1) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");

      const timeoutId = window.setTimeout(() => {
        if (!element.isConnected) return;
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("gooey-particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add("gooey-point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        const removeId = window.setTimeout(() => {
          try {
            if (particle.parentElement === element) {
              element.removeChild(particle);
            }
          } catch {
            // ignore
          }
        }, t);
        timeoutsRef.current.push(removeId);
      }, 30);
      timeoutsRef.current.push(timeoutId);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const container = containerRef.current;
    let left = 0;
    let top = 0;
    let node: HTMLElement | null = element;
    let reachedContainer = false;

    while (node && node !== container) {
      left += node.offsetLeft;
      top += node.offsetTop;
      const parent = node.offsetParent as HTMLElement | null;
      if (!parent) break;
      node = parent;
      if (node === container) {
        reachedContainer = true;
        break;
      }
    }

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    if (!reachedContainer) {
      const containerRect = container.getBoundingClientRect();
      const pos = element.getBoundingClientRect();
      left = pos.left - containerRect.left;
      top = pos.top - containerRect.top;
    }
    const styles = {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.textContent = element.textContent ?? "";
  };

  const triggerHot = (target: HTMLElement) => {
    if (hotTimeoutRef.current) {
      window.clearTimeout(hotTimeoutRef.current);
      hotTimeoutRef.current = null;
    }
    if (hotTargetRef.current && hotTargetRef.current !== target) {
      hotTargetRef.current.removeAttribute("data-gooey-hot");
    }
    target.setAttribute("data-gooey-hot", "true");
    hotTargetRef.current = target;
    hotTimeoutRef.current = window.setTimeout(() => {
      target.removeAttribute("data-gooey-hot");
      if (hotTargetRef.current === target) {
        hotTargetRef.current = null;
      }
      hotTimeoutRef.current = null;
    }, animationTime * 1.6);
  };

  const showEffect = () => {
    if (filterRef.current) {
      filterRef.current.style.opacity = "1";
    }
    if (textRef.current) {
      textRef.current.style.opacity = "1";
    }
  };

  const hideEffect = () => {
    if (filterRef.current) {
      const particles = filterRef.current.querySelectorAll(".gooey-particle");
      particles.forEach((p) => filterRef.current?.removeChild(p));
      filterRef.current.classList.remove("active");
      filterRef.current.style.opacity = "0";
    }
    if (textRef.current) {
      textRef.current.classList.remove("active");
      textRef.current.style.opacity = "0";
    }
  };

  const runEffect = (target: HTMLElement, options?: { hot?: boolean; particles?: boolean }) => {
    showEffect();
    updateEffectPosition(target);

    if (options?.particles !== false) {
      if (filterRef.current) {
        const particles = filterRef.current.querySelectorAll(".gooey-particle");
        particles.forEach((p) => filterRef.current?.removeChild(p));
      }

      if (textRef.current) {
        textRef.current.classList.remove("active");
        void textRef.current.offsetWidth;
        textRef.current.classList.add("active");
      }

      if (filterRef.current) {
        clearTimeouts();
        makeParticles(filterRef.current);
      }
    }

    if (options?.hot !== false) {
      triggerHot(target);
    }
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem, index: number) => {
    if (event.defaultPrevented) return;
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.currentTarget;
    if (activeIndex === index) {
      runEffect(link);
      return;
    }
    if (origin === "home" && startMorph) {
      event.preventDefault();
      if (isMorphing) return;
      setActiveIndex(index);
      runEffect(link);
      startMorph(item);
      return;
    }
    setActiveIndex(index);
    runEffect(link);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, item: NavItem, index: number) => {
    if (event.key !== " ") return;
    event.preventDefault();
    const link = event.currentTarget;
    if (activeIndex !== index) {
      setActiveIndex(index);
    }
    runEffect(link);
    if (origin === "home" && startMorph) {
      startMorph(item);
      return;
    }
    skipClickRef.current = true;
    link.click();
  };

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>, index: number) => {
    const target = event.currentTarget;
    if (hoverIndexRef.current === index) return;
    hoverIndexRef.current = index;
    runEffect(target);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    const next = (event.relatedTarget as HTMLElement | null)?.closest<HTMLElement>("[data-gooey-link]");
    if (next) return;
    hoverIndexRef.current = null;
    hideEffect();
  };

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>, index: number) => {
    hoverIndexRef.current = index;
    runEffect(event.currentTarget);
  };

  const handleBlur = (event: FocusEvent<HTMLAnchorElement>) => {
    const next = (event.relatedTarget as HTMLElement | null)?.closest<HTMLElement>("[data-gooey-link]");
    if (next) return;
    hoverIndexRef.current = null;
    hideEffect();
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLink = navRef.current.querySelectorAll<HTMLElement>("[data-gooey-link]")[activeIndex];
    if (activeLink) {
      updateEffectPosition(activeLink);
      hideEffect();
    }

    const handleResize = () => {
      const currentActive = navRef.current?.querySelectorAll<HTMLElement>("[data-gooey-link]")[activeIndex];
      if (currentActive) updateEffectPosition(currentActive);
    };

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      clearTimeouts();
      if (hotTimeoutRef.current) {
        window.clearTimeout(hotTimeoutRef.current);
        hotTimeoutRef.current = null;
      }
      if (hotTargetRef.current) {
        hotTargetRef.current.removeAttribute("data-gooey-hot");
        hotTargetRef.current = null;
      }
    };
  }, []);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav ref={navRef} aria-label={ariaLabel} className={clsx("relative", className)}>
        {items.map((item, index) => {
          const active = activeIndex === index;
          const fadeStyle =
            origin === "home" ? { opacity: isMorphing ? 0 : 1, transition: "opacity 220ms ease" } : undefined;
          const linkStyle = {
            ...(fadeStyle ?? {}),
            "--nav-index": index,
          } as CSSProperties;
          return (
            <Link
              key={item.key}
              href={item.href}
              data-nav-origin={origin === "home" ? "home" : undefined}
              data-nav-key={item.key}
              data-nav-target={origin === "home" ? undefined : "header"}
              data-nav-index={index}
              data-gooey-link
              data-ui-sound="nav"
              aria-current={active ? "page" : undefined}
              onClick={(event) => handleClick(event, item, index)}
              onKeyDown={(event) => handleKeyDown(event, item, index)}
              onPointerEnter={(event) => handlePointerEnter(event, index)}
              onPointerLeave={handlePointerLeave}
              onFocus={(event) => handleFocus(event, index)}
              onBlur={handleBlur}
              style={linkStyle}
              className={clsx(
                "gooey-nav-link",
                itemClassName,
                active ? activeClassName : inactiveClassName,
                !active && hoverClassName,
                itemWrapperClassName,
              )}
            >
              {contentVariant === "homeTile" ? (
                <span className="homeTileInner">
                  <span className="homeTileLabel">{item.label}</span>
                  <span className="homeTileSheen" aria-hidden />
                </span>
              ) : (
                <span className="headerPillLabel relative z-10">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <span className="effect filter" ref={filterRef} aria-hidden="true" />
      <span className="effect text" ref={textRef} aria-hidden="true" />
    </div>
  );
};
