"use client";

import { cn } from "@/lib/utils";

import {
  BLOG_LOCALES,
  type BlogLocale,
} from "@/features/blogs/utils/blog-localization";

const BLOG_LOCALE_META: Record<BlogLocale, { label: string; short: string }> = {
  en: { label: "English", short: "EN" },
  vi: { label: "Vietnamese", short: "VI" },
  cn: { label: "Chinese", short: "CN" },
};

type BlogLocaleSwitchProps = {
  activeLocale: BlogLocale;
  onChange: (locale: BlogLocale) => void;
  getStatus?: (locale: BlogLocale) => "complete" | "incomplete" | "neutral";
};

export function BlogLocaleSwitch({
  activeLocale,
  onChange,
  getStatus,
}: BlogLocaleSwitchProps) {
  const activeIndex = BLOG_LOCALES.findIndex(
    (locale) => locale === activeLocale,
  );

  return (
    <div className="relative inline-flex rounded-full border border-border/75 bg-white/78 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 bottom-1 left-1 w-20 rounded-full bg-[linear-gradient(180deg,rgba(205,174,111,0.24),rgba(205,174,111,0.12))] shadow-[0_10px_22px_-16px_rgba(185,125,70,0.6)] transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {BLOG_LOCALES.map((locale) => {
        const status = getStatus?.(locale) ?? "neutral";
        const isActive = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
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
                  status === "complete" && "bg-emerald-500",
                  status === "incomplete" && "bg-amber-400",
                  status === "neutral" && "bg-border",
                )}
              />
              {BLOG_LOCALE_META[locale].short}
            </span>
          </button>
        );
      })}
    </div>
  );
}
