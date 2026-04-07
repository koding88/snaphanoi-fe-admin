import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPalette, faWandMagicSparkles } from "@/lib/icons/fa";

export function AdminShellBanner() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.45fr_0.95fr]">
      <section className="surface-enter relative overflow-hidden rounded-[2.25rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(18,25,36,0.98),rgba(12,18,30,0.96),rgba(48,38,26,0.9))] px-6 py-7 text-white shadow-[0_28px_90px_rgba(15,23,42,0.24)] md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,174,111,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="relative space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-[--color-brand-muted] uppercase">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Editorial Control Room
          </p>
          <div className="space-y-3">
            <h2 className="max-w-2xl font-heading text-4xl leading-[0.95] tracking-[0.04em] md:text-5xl">
              The admin shell now feels like the product, not a scaffold.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/74 md:text-base">
              The shell now carries the same restraint as the public auth area: clear hierarchy,
              warmer surfaces, and responsive utility without visual noise.
            </p>
          </div>
        </div>
      </section>
      <section className="surface-enter rounded-[2.25rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))] p-6 shadow-soft md:p-7">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
            <FontAwesomeIcon icon={faPalette} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.24em] text-[--color-brand-muted] uppercase">
              Final pass
            </p>
            <h3 className="font-heading text-3xl tracking-[0.04em] text-foreground">
              Refined, not overbuilt
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Auth, users, and roles remain grounded in the backend handoff. This pass only
              improves readability, responsiveness, and consistency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
