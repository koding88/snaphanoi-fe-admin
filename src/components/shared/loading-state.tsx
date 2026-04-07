export function LoadingState() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-[2rem] border border-border/80 bg-card/85 px-6 py-12 text-center shadow-soft">
      <div className="size-12 animate-pulse rounded-full border border-[--color-brand]/30 bg-[radial-gradient(circle_at_top,rgba(205,174,111,0.42),transparent_62%)]" />
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          Preparing surface
        </p>
        <p className="text-sm text-muted-foreground">
          Foundation components are loading into the workspace.
        </p>
      </div>
    </div>
  );
}
