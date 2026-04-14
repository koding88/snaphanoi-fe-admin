"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LocaleKey = "en" | "vi" | "cn";

type LocalizedNameEditorProps = {
  value: Record<LocaleKey, string>;
  errors?: Partial<Record<LocaleKey, string>>;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  fieldLabel: string;
  placeholders: Record<LocaleKey, string>;
  onChange: (locale: LocaleKey, value: string) => void;
};

const LOCALE_OPTIONS: Array<{ key: LocaleKey; label: string; shortLabel: string }> = [
  { key: "en", label: "English", shortLabel: "EN" },
  { key: "vi", label: "Vietnamese", shortLabel: "VI" },
  { key: "cn", label: "Chinese", shortLabel: "CN" },
];

export function LocalizedNameEditor({
  value,
  errors,
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
  fieldLabel,
  placeholders,
  onChange,
}: LocalizedNameEditorProps) {
  const [activeLocale, setActiveLocale] = useState<LocaleKey>("en");
  const activeLocaleMeta = useMemo(
    () => LOCALE_OPTIONS.find((locale) => locale.key === activeLocale),
    [activeLocale],
  );
  const activeIndex = LOCALE_OPTIONS.findIndex((locale) => locale.key === activeLocale);
  const completedCount = LOCALE_OPTIONS.filter((locale) => value[locale.key].trim().length > 0).length;

  return (
    <section className="rounded-[1.8rem] border border-border/75 bg-white/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] md:p-6">
      <div className="mb-5 space-y-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[--color-brand-muted] uppercase">
          {sectionEyebrow}
        </p>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{sectionTitle}</h3>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{sectionDescription}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-border/70 bg-white/78 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-[--color-brand-muted] uppercase">
          {completedCount}/3 ready
        </span>
        <div className="relative inline-flex rounded-full border border-border/75 bg-white/78 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1 bottom-1 left-1 w-20 rounded-full bg-[linear-gradient(180deg,rgba(205,174,111,0.24),rgba(205,174,111,0.12))] shadow-[0_10px_22px_-16px_rgba(185,125,70,0.6)] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {LOCALE_OPTIONS.map((locale) => {
            const hasValue = value[locale.key].trim().length > 0;
            const hasError = Boolean(errors?.[locale.key]);
            const isActive = locale.key === activeLocale;

            return (
              <button
                key={locale.key}
                type="button"
                onClick={() => setActiveLocale(locale.key)}
                className={cn(
                  "relative z-10 flex w-20 cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200",
                  "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand]/20",
                  isActive ? "text-[--color-brand]" : "text-muted-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border border-white/60 transition-[transform,background-color] duration-200",
                      isActive && "scale-110",
                      hasError && "bg-red-500",
                      !hasError && hasValue && "bg-emerald-500",
                      !hasError && !hasValue && "bg-border",
                    )}
                  />
                  {locale.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-border/70 bg-white/86 p-4 md:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[--color-brand]/20 bg-[--color-brand-soft] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[--color-brand] uppercase">
            {activeLocaleMeta?.shortLabel}
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">{fieldLabel}</p>
            <p className="text-xs text-muted-foreground">{activeLocaleMeta?.label} locale</p>
          </div>
        </div>
        <Input
          value={value[activeLocale]}
          onChange={(event) => onChange(activeLocale, event.target.value)}
          placeholder={placeholders[activeLocale]}
          aria-invalid={Boolean(errors?.[activeLocale])}
        />
        {errors?.[activeLocale] ? (
          <p className="mt-2 text-sm text-red-600">{errors[activeLocale]}</p>
        ) : null}
      </div>
    </section>
  );
}
