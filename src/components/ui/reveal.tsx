"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import clsx from "clsx";

type Direction = "up" | "down" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  cascade?: boolean;
};

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
};

export const Reveal = ({ children, className, direction = "up", delay = 0, cascade = false }: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();

  const baseOffset = directionMap[direction];

  const transition = reduceMotion
      ? { duration: 0.01 }
      : {
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
          delay,
          type: "spring",
          bounce: 0.12,
        };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(8px)", ...baseOffset }}
      animate={inView ? { opacity: 1, filter: "blur(0px)", x: 0, y: 0 } : undefined}
      transition={transition}
      className={clsx(cascade && "space-y-3", className)}
    >
      {cascade ? (
        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
              },
            },
          }}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};
