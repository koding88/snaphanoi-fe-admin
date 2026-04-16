import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type AuthPasswordHintProps = {
  tone?: "dark" | "light";
};

export function AuthPasswordHint({ tone = "dark" }: AuthPasswordHintProps) {
  const t = useTranslations("auth");

  return (
    <p
      className={cn(
        "rounded-2xl border px-3 py-2 text-xs leading-5",
        tone === "dark"
          ? "border-white/8 bg-white/6 text-white/76"
          : "border-border/80 bg-[--color-brand-soft]/38 text-foreground/82",
      )}
    >
      {t("passwordHint")}
    </p>
  );
}
