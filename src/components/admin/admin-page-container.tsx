import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminPageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function AdminPageContainer({
  children,
  className,
}: AdminPageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
