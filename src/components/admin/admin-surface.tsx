import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSurfaceProps = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "soft" | "contrast";
};

export function AdminSurface({
  children,
  className,
  tone = "default",
}: AdminSurfaceProps) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border shadow-soft",
        tone === "default" &&
          "border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,237,0.88))]",
        tone === "soft" &&
          "border-white/50 bg-[linear-gradient(180deg,rgba(252,249,244,0.94),rgba(246,241,233,0.72))]",
        tone === "contrast" &&
          "border-slate-900/12 bg-[linear-gradient(180deg,rgba(22,28,39,0.96),rgba(12,18,28,0.98))] text-white",
        className,
      )}
    >
      {children}
    </section>
  );
}
