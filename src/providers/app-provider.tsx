"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
