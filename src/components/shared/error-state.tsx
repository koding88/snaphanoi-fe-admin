import type { ReactNode } from "react";

type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="surface-enter rounded-[2rem] border border-destructive/20 bg-[linear-gradient(180deg,rgba(255,245,245,0.92),rgba(255,236,236,0.84))] px-8 py-14 text-center shadow-soft">
      <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
