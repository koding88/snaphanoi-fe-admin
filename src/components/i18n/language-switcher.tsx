"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/config";
import { locales } from "@/i18n/config";

const LOCALE_META: Record<AppLocale, { flag: string; short: string }> = {
  en: { flag: "🇺🇸", short: "EN" },
  vi: { flag: "🇻🇳", short: "VI" },
};

export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleChangeLocale(nextLocale: AppLocale) {
    if (nextLocale === locale || isUpdating) {
      setOpen(false);
      return;
    }

    setIsUpdating(true);

    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: nextLocale }),
      });
      router.refresh();
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,247,241,0.92))] px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-200 hover:border-[--color-brand]/30 hover:bg-white/95 active:scale-[0.99] focus-visible:border-[--color-brand]/40 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-[--color-brand]/12 disabled:cursor-not-allowed disabled:opacity-60"
        aria-expanded={open}
        aria-label={t("label")}
        disabled={isUpdating}
      >
        <span className="text-base leading-none">{LOCALE_META[locale].flag}</span>
        <span className="hidden max-w-[7.25rem] truncate font-medium text-foreground sm:inline">
          {locale === "en" ? t("english") : t("vietnamese")}
        </span>
        <span className="text-[11px] font-semibold tracking-[0.18em] text-[--color-brand-muted] uppercase sm:hidden">
          {LOCALE_META[locale].short}
        </span>
      </button>
      {open ? (
        <div className="dialog-enter absolute right-0 top-[calc(100%+0.5rem)] z-[90] w-52 max-w-[calc(100vw-1rem)] rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,237,0.96))] p-1.5 shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
          {locales.map((optionLocale) => {
            const active = optionLocale === locale;
            const label = optionLocale === "en" ? t("english") : t("vietnamese");

            return (
              <button
                key={optionLocale}
                type="button"
                onClick={() => void handleChangeLocale(optionLocale)}
                className={[
                  "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm outline-none transition-all duration-200",
                  active
                    ? "border-[--color-brand]/16 bg-[linear-gradient(180deg,rgba(185,125,70,0.18),rgba(185,125,70,0.1))] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                    : "border-transparent text-foreground hover:border-[--color-brand]/14 hover:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.54)] focus-visible:border-[--color-brand]/16 focus-visible:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))]",
                ].join(" ")}
                disabled={isUpdating}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="shrink-0 text-base leading-none">{LOCALE_META[optionLocale].flag}</span>
                  <span className="truncate font-medium leading-5 text-foreground">{label}</span>
                </span>
                <span
                  className={active
                    ? "shrink-0 rounded-full bg-[--color-brand-soft] px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-[--color-brand] uppercase"
                    : "shrink-0 rounded-full bg-muted/60 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase"
                  }
                >
                  {LOCALE_META[optionLocale].short}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
