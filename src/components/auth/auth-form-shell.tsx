import type { ReactNode } from "react";

import { AuthCard } from "@/components/auth/auth-card";

type AuthFormShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthFormShellProps) {
  return (
    <AuthCard>
      <div className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.32em] text-[--color-brand-muted] uppercase">
          {eyebrow}
        </p>
        <h2 className="font-heading text-[2.35rem] leading-[0.92] tracking-[0.04em] text-white md:text-5xl">
          {title}
        </h2>
        <p className="max-w-xl text-sm leading-7 text-white/72 md:text-base">
          {description}
        </p>
      </div>
      <div className="mt-8 rounded-[1.7rem] border border-white/8 bg-white/5 p-4 sm:p-5">{children}</div>
      {footer ? <div className="mt-7 border-t border-white/8 pt-5 text-center">{footer}</div> : null}
    </AuthCard>
  );
}
