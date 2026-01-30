"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LayoutGroup } from "framer-motion";
import { Header } from "@/components/layout/header";
import { MainShell } from "@/components/layout/MainShell";
import { PageTransition } from "@/components/layout/page-transition";
import { HomeFullscreen } from "@/components/layout/HomeFullscreen";
import { NavMorphProvider } from "@/components/transitions/NavMorphProvider";
import { BubblesBackground } from "@/components/ui/bubbles-background";
import { AmbientGrid } from "@/components/ui/ambient-grid";
import { ScanSweep } from "@/components/ui/scan-sweep";
import { ColorBends } from "@/components/ui/color-bends";
import { SoundProvider } from "@/components/ui/ui-sound";
import { PerformanceToggle } from "@/components/ui/performance-toggle";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const perfMode = usePerformanceMode();
  const lowPerf = perfMode === "low";

  useEffect(() => {
    const root = document.documentElement;
    const measureScrollbar = () => {
      const probe = document.createElement("div");
      probe.style.width = "100px";
      probe.style.height = "100px";
      probe.style.overflow = "scroll";
      probe.style.position = "absolute";
      probe.style.top = "-9999px";
      document.body.appendChild(probe);
      const width = probe.offsetWidth - probe.clientWidth;
      document.body.removeChild(probe);
      root.style.setProperty("--scrollbar-width", `${width}px`);
    };
    measureScrollbar();
    window.addEventListener("resize", measureScrollbar);
    return () => window.removeEventListener("resize", measureScrollbar);
  }, []);

  return (
    <LayoutGroup id="app-shell">
      <SoundProvider disabled={isHome}>
        <NavMorphProvider>
          {isHome && !lowPerf && (
            <>
              <div className="edge-flash edge-left" aria-hidden />
              <div className="edge-flash edge-right" aria-hidden />
            </>
          )}
          {!isHome && !lowPerf && (
            <>
              <ColorBends
                className="color-bends-layer"
                colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
                rotation={0}
                speed={0.14}
                scale={0.82}
                frequency={1}
                warpStrength={0.95}
                mouseInfluence={0.3}
                parallax={0.35}
                noise={0.06}
                transparent
                autoRotate={0.1}
              />
              <AmbientGrid />
              <BubblesBackground />
              <ScanSweep />
            </>
          )}
          {!isHome && lowPerf && <AmbientGrid />}
          <div className="relative z-10 flex min-h-screen min-h-[100svh] min-h-[100dvh] flex-col">
            <Header disableHeroMode={!isHome} />
            <PageTransition>
              {isHome ? <HomeFullscreen>{children}</HomeFullscreen> : <MainShell>{children}</MainShell>}
            </PageTransition>
          </div>
          <PerformanceToggle />
        </NavMorphProvider>
      </SoundProvider>
    </LayoutGroup>
  );
};
