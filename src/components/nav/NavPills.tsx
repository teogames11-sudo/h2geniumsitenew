"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { NavItem } from "@/config/nav";
import { NAV_ITEMS } from "@/config/nav";
import { useNavMorph } from "@/components/transitions/NavMorphProvider";

type NavPillsProps = {
  variant: "homeDock" | "header";
  items?: NavItem[];
  className?: string;
  itemClassName?: string;
  itemWrapperClassName?: string;
  activeClassName?: string;
  ariaLabel?: string;
  as?: "nav" | "div" | "fragment";
  heroMode?: boolean;
  getItemStyle?: (item: NavItem, index: number) => CSSProperties | undefined;
  getItemRef?: (item: NavItem, index: number) => ((node: HTMLButtonElement | null) => void) | undefined;
  onItemClick?: (item: NavItem) => void;
};

const MotionLink = motion(Link);

export const NavPills = ({
  variant,
  items = NAV_ITEMS,
  className,
  itemClassName,
  itemWrapperClassName,
  activeClassName,
  ariaLabel = "Main navigation",
  as = "div",
  heroMode = false,
  getItemStyle,
  getItemRef,
  onItemClick,
}: NavPillsProps) => {
  const pathname = usePathname();
  const { isMorphing, startMorph } = useNavMorph();
  if (variant === "header") {
    const navText = "text-white/85";
    const navActiveText = "text-white";
    const navHover = "hover:text-white";
    if (as === "fragment") {
      return (
        <>
          {items.map((item, index) => {
            const active = pathname === item.href;
            return (
              <MotionLink
                key={item.key}
                href={item.href}
                data-nav-key={item.key}
                data-nav-target="header"
                data-nav-index={index}
                data-ui-sound="nav"
                className={clsx(
                  "headerNavPill relative inline-flex h-12 min-w-[130px] max-w-[210px] items-center justify-center whitespace-nowrap rounded-full px-4 text-center text-[12px] font-semibold leading-snug transition-colors",
                  active ? navActiveText : navText,
                  !active && navHover,
                  itemClassName,
                )}
                style={getItemStyle?.(item, index)}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className={clsx(
                      "absolute inset-0 rounded-full bg-[rgba(18,110,235,0.3)]",
                    )}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                {active && (
                  <span className="absolute inset-x-3 bottom-[4px] h-[2px] rounded-full bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-cyan)]" />
                )}
                <span className="headerPillLabel relative z-10">{item.label}</span>
              </MotionLink>
            );
          })}
        </>
      );
    }

    const Wrapper = as;
    const navClassName = clsx("relative", className);
    return (
      <Wrapper className={navClassName} aria-label={ariaLabel}>
        {items.map((item, index) => {
          const active = pathname === item.href;
          return (
            <MotionLink
              key={item.key}
              href={item.href}
              data-nav-key={item.key}
              data-nav-target="header"
              data-nav-index={index}
              data-ui-sound="nav"
              className={clsx(
                "headerNavPill relative inline-flex h-12 min-w-[130px] max-w-[210px] items-center justify-center whitespace-nowrap rounded-full px-4 text-center text-[12px] font-semibold leading-snug transition-colors",
                active ? navActiveText : navText,
                !active && navHover,
                itemClassName,
              )}
              style={getItemStyle?.(item, index)}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className={clsx(
                    "absolute inset-0 rounded-full bg-[rgba(18,110,235,0.3)]",
                  )}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              {active && (
                <span className="absolute inset-x-3 bottom-[4px] h-[2px] rounded-full bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-cyan)]" />
              )}
              <span className="headerPillLabel relative z-10">{item.label}</span>
            </MotionLink>
          );
        })}
      </Wrapper>
    );
  }

  if (as === "fragment") {
    return (
      <>
        {items.map((item, index) => {
          const active = pathname === item.href;
          const baseStyle = { opacity: isMorphing ? 0 : 1, transition: "opacity 220ms ease" };
          const itemStyle = getItemStyle?.(item, index);
          const wrapperStyle = itemWrapperClassName ? { ...baseStyle, ...(itemStyle ?? {}) } : undefined;
          const buttonStyle = itemWrapperClassName ? undefined : { ...baseStyle, ...(itemStyle ?? {}) };
          const button = (
            <button
              key={item.key}
              type="button"
              data-nav-key={item.key}
              data-nav-origin="home"
              data-nav-index={index}
              data-ui-sound="nav"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={clsx(itemClassName, active && activeClassName)}
              ref={getItemRef?.(item, index)}
              style={buttonStyle}
              onClick={() => {
                if (isMorphing || active) return;
                onItemClick?.(item);
                startMorph?.(item);
              }}
            >
              <span className="homeTileInner">
                <span className="homeTileLabel">{item.label}</span>
                <span className="homeTileSheen" aria-hidden />
              </span>
            </button>
          );
          if (!itemWrapperClassName) {
            return button;
          }
          return (
            <span
              key={item.key}
              className={itemWrapperClassName}
              style={wrapperStyle}
            >
              {button}
            </span>
          );
        })}
      </>
    );
  }

  const Wrapper = as;
  const navClassName = clsx("relative", className);
  return (
    <Wrapper className={navClassName} aria-label={ariaLabel}>
      {items.map((item, index) => {
        const active = pathname === item.href;
        const baseStyle = { opacity: isMorphing ? 0 : 1, transition: "opacity 220ms ease" };
        const itemStyle = getItemStyle?.(item, index);
        const wrapperStyle = itemWrapperClassName ? { ...baseStyle, ...(itemStyle ?? {}) } : undefined;
        const buttonStyle = itemWrapperClassName ? undefined : { ...baseStyle, ...(itemStyle ?? {}) };
        const button = (
        <button
          key={item.key}
          type="button"
          data-nav-key={item.key}
          data-nav-origin="home"
          data-nav-index={index}
          data-ui-sound="nav"
          aria-label={item.label}
          aria-current={active ? "page" : undefined}
          className={clsx(itemClassName, active && activeClassName)}
          ref={getItemRef?.(item, index)}
            style={buttonStyle}
            onClick={() => {
              if (isMorphing || active) return;
              onItemClick?.(item);
              startMorph?.(item);
            }}
          >
            <span className="homeTileInner">
              <span className="homeTileLabel">{item.label}</span>
              <span className="homeTileSheen" aria-hidden />
            </span>
          </button>
        );
        if (!itemWrapperClassName) {
          return button;
        }
        return (
          <span key={item.key} className={itemWrapperClassName} style={wrapperStyle}>
            {button}
          </span>
        );
      })}
    </Wrapper>
  );
};
