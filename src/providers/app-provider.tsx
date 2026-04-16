"use client";

import type { ReactNode } from "react";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProviderProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export function AppProvider({ children, locale, messages }: AppProviderProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthBootstrap>
          {children}
          <Toaster position="top-right" closeButton duration={4200} />
        </AuthBootstrap>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
