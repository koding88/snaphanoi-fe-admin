"use client";

import type { ReactNode } from "react";

import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthBootstrap>{children}</AuthBootstrap>
    </ThemeProvider>
  );
}
