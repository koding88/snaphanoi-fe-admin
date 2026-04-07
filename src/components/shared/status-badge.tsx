import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  children: string;
  tone?: "default" | "success" | "warning" | "danger" | "neutral";
};

export function StatusBadge({ children, tone = "default" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase",
        tone === "default" && "border-[--color-brand]/20 bg-[--color-brand-soft] text-[--color-brand]",
        tone === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
        tone === "warning" && "border-amber-500/20 bg-amber-500/10 text-amber-700",
        tone === "danger" && "border-red-500/20 bg-red-500/10 text-red-700",
        tone === "neutral" && "border-border bg-white/70 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
