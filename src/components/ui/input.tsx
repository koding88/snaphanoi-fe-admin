import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const fieldChrome =
  "flex h-12 w-full rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,247,241,0.92))] px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 placeholder:text-muted-foreground/80 focus:border-[--color-brand]/40 focus:bg-white focus:ring-3 focus:ring-[--color-brand]/12 disabled:cursor-not-allowed disabled:opacity-60";
export const selectChrome = cn(fieldChrome, "appearance-none pr-10");

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        fieldChrome,
        className,
      )}
      {...props}
    />
  );
}
