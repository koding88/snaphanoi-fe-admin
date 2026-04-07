import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.84),rgba(10,14,23,0.96))] p-7 text-white shadow-[0_24px_100px_rgba(3,7,18,0.36)] ring-1 ring-white/6 backdrop-blur xl:p-9",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(205,174,111,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.06),transparent_28%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
