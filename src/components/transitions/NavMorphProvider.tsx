"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { NavItem } from "@/config/nav";

type NavMorphContextValue = {
  isMorphing: boolean;
  startMorph?: (item: NavItem) => void;
  homeHeaderVisible: boolean;
};

const NavMorphContext = createContext<NavMorphContextValue>({
  isMorphing: false,
  homeHeaderVisible: false,
});

export const useNavMorph = () => useContext(NavMorphContext);

export const NavMorphProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const startMorph = useCallback(
    (item: NavItem) => {
      if (item.href === pathname) return;
      router.push(item.href);
    },
    [pathname, router],
  );

  const contextValue = useMemo(
    () => ({
      isMorphing: false,
      startMorph,
      homeHeaderVisible: false,
    }),
    [startMorph],
  );

  return <NavMorphContext.Provider value={contextValue}>{children}</NavMorphContext.Provider>;
};
