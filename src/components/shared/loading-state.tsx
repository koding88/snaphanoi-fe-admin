type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  title = "Preparing surface",
  description = "Foundation components are loading into the workspace.",
}: LoadingStateProps) {
  return (
    <div className="surface-enter flex min-h-56 flex-col items-center justify-center gap-5 rounded-[2rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,243,236,0.92))] px-6 py-12 text-center shadow-soft">
      <div className="relative flex size-14 items-center justify-center rounded-full border border-[--color-brand]/25 bg-[radial-gradient(circle_at_top,rgba(205,174,111,0.45),transparent_62%)]">
        <div className="size-8 animate-pulse rounded-full border border-[--color-brand]/30 bg-[--color-brand-soft]" />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          {title}
        </p>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
