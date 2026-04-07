import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  eyebrow,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,243,236,0.74))] px-8 py-14 text-center shadow-soft">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.28em] text-[--color-brand-muted] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-heading text-3xl tracking-[0.04em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
