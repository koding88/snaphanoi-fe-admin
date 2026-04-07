import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminPageContainerProps = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "hero";
};

export function AdminPageContainer({
  children,
  className,
  tone = "default",
}: AdminPageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-5 md:px-6 lg:px-8",
        tone === "hero" && "pt-6 md:pt-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
