"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.dataset.theme = "snap-hanoi";
  }, []);

  return <>{children}</>;
}
