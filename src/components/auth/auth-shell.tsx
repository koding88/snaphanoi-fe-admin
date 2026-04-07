import type { ReactNode } from "react";

import { AppLogo } from "@/components/shared/app-logo";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[--color-canvas] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,174,111,0.16),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(248,210,132,0.12),transparent_22%),linear-gradient(135deg,rgba(7,10,17,0.94),rgba(12,18,30,0.98))]" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/8 xl:block" />
      <div className="relative mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 px-4 py-4 lg:px-6 xl:grid-cols-[1.1fr_0.9fr] xl:px-8 xl:py-8">
        <section className="flex min-h-[24rem] flex-col justify-between rounded-[2.25rem] border border-white/8 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur md:p-8 xl:mr-5 xl:min-h-full xl:p-12">
          <AppLogo className="text-white" />
          <div className="max-w-2xl space-y-6 py-16">
            <p className="text-xs font-semibold tracking-[0.34em] text-[--color-brand-muted] uppercase">
              editorial foundation
            </p>
            <h1 className="font-heading text-5xl leading-[0.94] tracking-[0.05em] text-balance md:text-6xl xl:text-7xl">
              Built for a premium photography operation, not a generic dashboard.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/72 md:text-base">
              Stage 1 establishes the polished visual system, route groups, shell composition,
              and integration foundation that later auth and admin workflows will plug into.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-white/72 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
              Responsive public shell
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
              Shared API and state foundation
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
              Ready for auth and admin stages
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center py-8 xl:py-0">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </main>
  );
}
