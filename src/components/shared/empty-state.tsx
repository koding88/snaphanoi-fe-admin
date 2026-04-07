type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card/70 px-8 py-14 text-center shadow-soft">
      <h2 className="font-heading text-3xl tracking-[0.04em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}
