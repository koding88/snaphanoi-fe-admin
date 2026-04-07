"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/shared/app-logo";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const pathname = usePathname();
  const isCenteredPage = pathname === "/login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[--color-canvas] text-white xl:h-[100dvh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,174,111,0.18),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(248,210,132,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,rgba(7,10,17,0.96),rgba(12,18,30,0.98))]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/8 xl:block" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 px-4 py-4 lg:px-6 xl:h-full xl:grid-cols-[1.1fr_0.9fr] xl:px-8 xl:py-8">
        <section className="surface-enter flex min-h-[24rem] flex-col justify-between rounded-[2.25rem] border border-white/8 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur md:p-8 xl:mr-5 xl:h-full xl:min-h-0 xl:p-12">
          <AppLogo className="text-white" />
          <div className="max-w-2xl space-y-6 py-16">
            <p className="text-xs font-semibold tracking-[0.34em] text-[--color-brand-muted] uppercase">
              studio access
            </p>
            <h1 className="font-heading text-5xl leading-[0.94] tracking-[0.05em] text-balance md:text-6xl xl:text-7xl">
              Built for a premium photography operation, not a generic back office.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/72 md:text-base">
              The public auth surface carries the same calm visual discipline as the admin area:
              editorial tone, direct hierarchy, and clean access flows.
            </p>
          </div>
          <div className="stagger-fade grid gap-4 text-sm text-white/72 md:grid-cols-3">
            <div className="surface-float rounded-2xl border border-white/8 bg-white/6 p-4">
              Authentication with clear recovery paths
            </div>
            <div className="surface-float rounded-2xl border border-white/8 bg-white/6 p-4">
              Quiet session recovery when the workspace is still valid
            </div>
            <div className="surface-float rounded-2xl border border-white/8 bg-white/6 p-4">
              Refined mobile-to-desktop experience
            </div>
          </div>
        </section>
        <section
          className={
            isCenteredPage
              ? "flex items-center justify-center py-8 xl:py-0 xl:pr-2"
              : "flex items-start justify-center py-8 xl:h-full xl:min-h-0 xl:items-center xl:py-0 xl:pr-2"
          }
        >
          <div className="w-full max-w-xl">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
