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
        "rounded-[1.35rem] border px-4 py-3.5 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        variant === "error" &&
          "border-red-400/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.34),rgba(127,29,29,0.18))] text-red-50",
        variant === "success" &&
          "border-emerald-400/25 bg-[linear-gradient(180deg,rgba(6,95,70,0.34),rgba(6,95,70,0.18))] text-emerald-50",
        variant === "info" &&
          "border-white/12 bg-white/6 text-white/80",
      )}
    >
      {children}
    </div>
  );
}
