"use client";

import { ReactNode, forwardRef, useState, type InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type GlassProps = {
  children?: ReactNode;
  className?: string;
};

export const GlassPanel = ({ children, className }: GlassProps) => (
  <div
    className={clsx(
      "glass-surface rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/90 p-6 text-[color:var(--text)] shadow-[var(--shadow-1)]",
      className,
    )}
  >
    {children}
  </div>
);

export const GlassCard = ({ children, className }: GlassProps) => (
  <GlassPanel className={clsx("p-6 sm:p-8", className)}>{children}</GlassPanel>
);

type ButtonProps = GlassProps & {
  as?: "button" | "a";
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const GlassButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function GlassButton(
    { children, className, variant = "primary", as = "button", href, onClick, type = "button", ...rest },
    ref,
  ) {
    const base =
      "glass-surface inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300";
    const variants: Record<typeof variant, string> = {
      primary:
        "bg-gradient-to-r from-[color:var(--accent-blue)] via-[color:var(--accent-cyan)] to-[color:var(--accent-mint)] text-white shadow-[0_18px_38px_-18px_rgba(18,110,235,0.65)]",
      ghost:
        "bg-[color:var(--glass-bg)] text-[color:var(--text)] border border-[color:var(--glass-stroke)] shadow-[var(--shadow-2)]",
      outline:
        "bg-transparent border border-[color:var(--glass-stroke)] text-[color:var(--text)] hover:bg-[color:var(--glass-bg)] shadow-[var(--shadow-2)]",
    };

    const Element = as === "a" ? "a" : "button";

    return (
      <Element
        ref={ref as never}
        href={href}
        onClick={onClick}
        type={as === "button" ? type : undefined}
        className={clsx(base, variants[variant], className)}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & { className?: string };

export const GlassInput = forwardRef<HTMLInputElement, InputProps>(function GlassInput(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={clsx(
        "glass-surface w-full rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
});

type BadgeProps = GlassProps & {
  tone?: "accent" | "mint" | "neutral";
};

export const GlassBadge = ({ children, className, tone = "accent" }: BadgeProps) => {
  const tones: Record<typeof tone, string> = {
    accent: "from-[color:var(--accent-blue)]/90 to-[color:var(--accent-cyan)]/80 text-white",
    mint: "from-[color:var(--accent-mint)]/90 to-[color:var(--accent-cyan)]/80 text-white",
    neutral: "from-[rgba(20,40,70,0.85)] to-[rgba(10,22,44,0.75)] text-white",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold shadow-[var(--shadow-2)]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};

type Tab = {
  id: string;
  label: string;
};

type GlassTabsProps = {
  tabs: Tab[];
  initial?: string;
  onChange?: (id: string) => void;
  className?: string;
};

export const GlassTabs = ({ tabs, initial, onChange, className }: GlassTabsProps) => {
  const [active, setActive] = useState<string>(initial ?? tabs[0]?.id);
  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div
      className={clsx(
        "glass-surface relative flex items-center gap-2 rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/80 px-2 py-2 text-sm",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={clsx(
              "relative rounded-full px-4 py-1.5 font-semibold transition-colors",
              isActive ? "text-[color:var(--text)]" : "text-[color:var(--muted)] hover:text-[color:var(--text)]",
            )}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  layoutId="glass-tab-pill"
                  className="absolute inset-0 rounded-full bg-[color:var(--glass-bg)]/85 shadow-[var(--shadow-2)]"
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
