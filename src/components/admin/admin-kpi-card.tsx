import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type AdminKpiCardProps = {
  label: string;
  value: string;
  caption: string;
  icon: IconDefinition;
};

export function AdminKpiCard({ label, value, caption, icon }: AdminKpiCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-border/80 bg-white/78 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
            {label}
          </p>
          <p className="font-heading text-4xl leading-none tracking-[0.04em] text-foreground">
            {value}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl border border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{caption}</p>
    </article>
  );
}
