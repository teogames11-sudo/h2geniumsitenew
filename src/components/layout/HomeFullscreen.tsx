"use client";

import { ReactNode, useEffect, useRef } from "react";

type HomeFullscreenProps = {
  children: ReactNode;
};

export const HomeFullscreen = ({ children }: HomeFullscreenProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("home-fullscreen");
    body.classList.add("home-fullscreen");
    return () => {
      root.classList.remove("home-fullscreen");
      body.classList.remove("home-fullscreen");
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    let raf = 0;
    let tries = 0;
    const measure = () => {
      const wrapper = wrapperRef.current;
      const hero = document.querySelector<HTMLElement>("[data-hero-root]");
      if (!wrapper || !hero) {
        if (tries < 5) {
          tries += 1;
          raf = requestAnimationFrame(measure);
        }
        return;
      }
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const wrapperRect = wrapper?.getBoundingClientRect();
      const heroRect = hero?.getBoundingClientRect();
      console.info("[home-fullscreen] metrics", { viewport, wrapperRect, heroRect });
      const scrollWidth = document.documentElement.scrollWidth;
      if (scrollWidth > viewport.width + 1) {
        console.warn("[home-fullscreen] horizontal scroll detected", { scrollWidth, viewportWidth: viewport.width });
      }
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-10 w-screen h-[100dvh] overflow-hidden">
      {children}
    </div>
  );
};
