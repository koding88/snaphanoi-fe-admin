type ErrorStateProps = {
  title: string;
  description: string;
};

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 px-8 py-14 text-center shadow-soft">
      <h2 className="font-heading text-3xl tracking-[0.04em] text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}
