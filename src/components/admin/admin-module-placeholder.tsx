import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { AdminSurface } from "@/components/admin/admin-surface";

type AdminModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconDefinition;
  bullets: string[];
  statusLabel: string;
};

export function AdminModulePlaceholder({
  eyebrow,
  title,
  description,
  icon,
  bullets,
  statusLabel,
}: AdminModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <AdminSurface className="overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-5">
            <AdminSectionHeading eyebrow={eyebrow} title={title} description={description} />
            <div className="grid gap-3 md:grid-cols-2">
              {bullets.map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-[1.5rem] border border-border/80 bg-white/70 px-4 py-4 text-sm leading-6 text-muted-foreground"
                >
                  {bullet}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(180deg,rgba(20,27,39,0.98),rgba(12,18,29,0.96))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-[--color-brand]">
              <FontAwesomeIcon icon={icon} />
            </div>
            <p className="mt-5 text-xs font-semibold tracking-[0.26em] text-[--color-brand-muted] uppercase">
              Current state
            </p>
            <h3 className="mt-2 font-heading text-3xl tracking-[0.04em]">{statusLabel}</h3>
            <p className="mt-3 text-sm leading-7 text-white/72">
              This route is visually ready to host real content, but data workflows are deferred to
              the dedicated implementation stage.
            </p>
          </div>
        </div>
      </AdminSurface>
    </div>
  );
}
