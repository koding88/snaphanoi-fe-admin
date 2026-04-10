"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getPreferredPackageCurrencyOption,
  PACKAGE_CURRENCY_OPTIONS,
  type PackageCurrencyOption,
} from "@/features/packages/utils/package-format";
import { faCheck, faChevronDown, faMagnifyingGlass, faXmark } from "@/lib/icons/fa";
import { cn } from "@/lib/utils";

type PackageCurrencySelectProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id?: string;
};

export function PackageCurrencySelect({
  value,
  onChange,
  className,
  id,
}: PackageCurrencySelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null,
  );
  const [popupStyle, setPopupStyle] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    transformOrigin: string;
  } | null>(null);

  const selectedOption =
    (selectedCountryCode
      ? PACKAGE_CURRENCY_OPTIONS.find(
          (option) =>
            option.countryCode === selectedCountryCode &&
            option.currencyCode === value,
        )
      : null) ?? getPreferredPackageCurrencyOption(value);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return PACKAGE_CURRENCY_OPTIONS;
    }

    return PACKAGE_CURRENCY_OPTIONS.filter((option) =>
      option.searchableText.includes(keyword),
    );
  }, [search]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 10);

    function updatePopupPosition() {
      const rect = rootRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const spaceBelow = viewportHeight - rect.bottom - 20;
      const spaceAbove = rect.top - 20;
      const preferAbove = spaceBelow < 320 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(260, Math.min(460, preferAbove ? spaceAbove - 10 : spaceBelow));
      const top = preferAbove
        ? Math.max(12, rect.top - maxHeight - 10)
        : rect.bottom + 10;
      const preferredWidth = Math.max(rect.width, 420);
      const width = Math.min(preferredWidth, viewportWidth - 24);
      const left = Math.min(
        Math.max(12, rect.left),
        viewportWidth - width - 12,
      );

      setPopupStyle({
        top,
        left,
        width,
        maxHeight,
        transformOrigin: preferAbove ? "bottom center" : "top center",
      });
    }

    updatePopupPosition();

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePopupPosition);
    window.addEventListener("scroll", updatePopupPosition, true);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePopupPosition);
      window.removeEventListener("scroll", updatePopupPosition, true);
    };
  }, [open]);

  function handleSelect(option: PackageCurrencyOption) {
    setSelectedCountryCode(option.countryCode);
    onChange(option.currencyCode);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-14 w-full items-center justify-between rounded-2xl border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,247,241,0.92))] px-4 text-left text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-200 hover:border-[--color-brand]/30 hover:bg-white/95 active:scale-[0.996] focus-visible:border-[--color-brand]/40 focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-[--color-brand]/12"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-lg">{selectedOption.flag}</span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{selectedOption.countryName}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {selectedOption.symbol} {selectedOption.currencyCode} · {selectedOption.currencyName}
            </span>
          </span>
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="text-xs text-muted-foreground" />
      </button>

      {typeof document !== "undefined" && open && popupStyle
        ? createPortal(
            <div
              ref={popupRef}
              className="dialog-enter fixed z-[120] overflow-hidden rounded-[1.4rem] border border-[#dcd3c7] bg-[#f8f5ef] shadow-[0_24px_64px_rgba(15,23,42,0.16)]"
              style={{
                top: popupStyle.top,
                left: popupStyle.left,
                width: popupStyle.width,
                transformOrigin: popupStyle.transformOrigin,
              }}
            >
              <div className="border-b border-[#ddd5ca] bg-[#f8f5ef] p-3">
                <label className="relative block">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
                  />
                  <input
                    ref={searchRef}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search country, currency code, or symbol"
                    className="h-11 w-full rounded-2xl border border-[#ddd5ca] bg-white pl-9 pr-10 text-sm text-foreground outline-none transition focus:border-[--color-brand]/40 focus:ring-3 focus:ring-[--color-brand]/12"
                  />
                  {search ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-[--color-brand-soft] hover:text-foreground"
                      aria-label="Clear currency search"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  ) : null}
                </label>
              </div>

              <div
                className="overflow-y-auto bg-[#f8f5ef] p-1.5"
                style={{ maxHeight: popupStyle.maxHeight }}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const selected =
                      option.countryCode === selectedOption.countryCode &&
                      option.currencyCode === value;

                    return (
                      <button
                        key={`${option.countryCode}-${option.currencyCode}`}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelect(option)}
                        className={cn(
                          "group flex w-full items-center justify-between gap-3 rounded-[1rem] border border-transparent px-3 py-2.5 text-left text-sm outline-none transition-all duration-200",
                          selected
                            ? "border-[--color-brand]/14 bg-[linear-gradient(180deg,rgba(185,125,70,0.18),rgba(185,125,70,0.1))] text-foreground"
                            : "hover:border-[--color-brand]/14 hover:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.52)] focus-visible:border-[--color-brand]/14 focus-visible:bg-[linear-gradient(180deg,rgba(185,125,70,0.14),rgba(185,125,70,0.08))] active:scale-[0.997]",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="text-lg">{option.flag}</span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium transition-transform duration-200 group-hover:translate-x-0.5">
                              {option.countryName}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground/72">
                              {option.symbol} {option.currencyCode} · {option.currencyName}
                            </span>
                          </span>
                        </span>
                        {selected ? (
                          <FontAwesomeIcon icon={faCheck} className="text-[--color-brand]" />
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No currency matched your search.
                  </p>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
