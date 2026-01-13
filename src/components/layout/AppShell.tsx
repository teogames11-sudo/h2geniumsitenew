"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MainShell } from "@/components/layout/MainShell";
import { PageTransition } from "@/components/layout/page-transition";
import { HomeFullscreen } from "@/components/layout/HomeFullscreen";

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <HomeFullscreen>{children}</HomeFullscreen>;
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />
      <PageTransition>
        <MainShell>{children}</MainShell>
      </PageTransition>
    </div>
  );
};
