import type { ReactNode } from "react";

type AuthFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
};

export function AuthField({
  label,
  htmlFor,
  hint,
  error,
  children,
}: AuthFieldProps) {
  return (
    <label htmlFor={htmlFor} className="block space-y-2.5">
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white/92">{label}</span>
        {hint ? (
          <span className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
            {hint}
          </span>
        ) : null}
      </span>
      {children}
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
    </label>
  );
}
