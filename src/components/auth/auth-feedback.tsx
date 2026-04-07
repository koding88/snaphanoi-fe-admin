import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthFeedbackProps = {
  variant: "error" | "success" | "info";
  children: ReactNode;
};

export function AuthFeedback({ variant, children }: AuthFeedbackProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm leading-6",
        variant === "error" &&
          "border-red-500/30 bg-red-500/10 text-red-50",
        variant === "success" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-50",
        variant === "info" &&
          "border-white/12 bg-white/6 text-white/80",
      )}
    >
      {children}
    </div>
  );
}
