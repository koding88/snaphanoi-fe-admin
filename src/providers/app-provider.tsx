"use client";

import type { ReactNode } from "react";

import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthBootstrap>
        {children}
        <Toaster position="top-right" closeButton duration={4200} />
      </AuthBootstrap>
    </ThemeProvider>
  );
}
