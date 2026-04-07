import type { ReactNode } from "react";

type AdminSectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminSectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: AdminSectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.26em] text-[--color-brand-muted] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1.5">
          <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
