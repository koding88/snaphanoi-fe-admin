import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-border/80 pb-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-4">
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.32em] text-[--color-brand-muted] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-heading text-[2.4rem] leading-[0.92] tracking-[0.04em] text-foreground md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {meta ? <div className="flex flex-wrap items-center gap-2.5">{meta}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}
