import countryToCurrency from "country-to-currency";
import getCurrencySymbol from "currency-symbol-map";

import { COUNTRY_OPTIONS, type CountryOption } from "@/lib/constants/countries";
import type { PackageLocalizedText, PackagePricing } from "@/features/packages/types/packages.types";

export type PackageCurrencyOption = {
  countryCode: string;
  countryName: string;
  flag: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  searchableText: string;
};

const CURRENCY_LABELS =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "currency" })
    : null;

const PREFERRED_CURRENCY_COUNTRIES: Partial<Record<string, string>> = {
  AED: "AE",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  CNY: "CN",
  EUR: "FR",
  GBP: "GB",
  HKD: "HK",
  IDR: "ID",
  INR: "IN",
  JPY: "JP",
  KRW: "KR",
  MYR: "MY",
  PHP: "PH",
  SGD: "SG",
  THB: "TH",
  USD: "US",
  VND: "VN",
};

function getCurrencyName(currencyCode: string) {
  const label = CURRENCY_LABELS?.of(currencyCode);

  if (!label || label === currencyCode) {
    return currencyCode;
  }

  return label;
}

function getCurrencySymbolLabel(currencyCode: string) {
  const symbol = getCurrencySymbol(currencyCode);

  return symbol && symbol !== currencyCode ? symbol : currencyCode;
}

export const PACKAGE_CURRENCY_OPTIONS: PackageCurrencyOption[] = COUNTRY_OPTIONS.map(
  (country: CountryOption) => {
    const currencyCode =
      countryToCurrency[country.code as keyof typeof countryToCurrency] ?? "USD";
    const currencyName = getCurrencyName(currencyCode);
    const symbol = getCurrencySymbolLabel(currencyCode);

    return {
      countryCode: country.code,
      countryName: country.name,
      flag: country.flag,
      currencyCode,
      currencyName,
      symbol,
      searchableText: `${country.name} ${country.code} ${currencyCode} ${currencyName} ${symbol}`.toLowerCase(),
    };
  },
);

export function getPreferredPackageCurrencyOption(currencyCode: string) {
  const normalizedCode = currencyCode.trim().toUpperCase();

  if (!normalizedCode) {
    return PACKAGE_CURRENCY_OPTIONS.find((option) => option.countryCode === "VN") ?? PACKAGE_CURRENCY_OPTIONS[0];
  }

  const preferredCountryCode = PREFERRED_CURRENCY_COUNTRIES[normalizedCode];

  if (preferredCountryCode) {
    const preferred = PACKAGE_CURRENCY_OPTIONS.find(
      (option) =>
        option.currencyCode === normalizedCode &&
        option.countryCode === preferredCountryCode,
    );

    if (preferred) {
      return preferred;
    }
  }

  return (
    PACKAGE_CURRENCY_OPTIONS.find((option) => option.currencyCode === normalizedCode) ??
    PACKAGE_CURRENCY_OPTIONS[0]
  );
}

export function formatPackageAmountInput(value: number | null | undefined) {
  if (!Number.isFinite(value)) {
    return "";
  }

  return Math.trunc(Number(value)).toLocaleString("en-US");
}

export function parsePackageAmountInput(rawValue: string) {
  const digitsOnly = rawValue.replace(/[^\d]/g, "");

  if (!digitsOnly) {
    return null;
  }

  return Number.parseInt(digitsOnly, 10);
}

export function formatPackageDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0 sec";
  }

  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (hours === 0 && remainingSeconds > 0) {
    parts.push(`${remainingSeconds} sec`);
  }

  return parts.join(" ");
}

export function formatPackagePrice(pricing: PackagePricing) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: pricing.currency,
      maximumFractionDigits: 0,
    }).format(pricing.amount);
  } catch {
    return `${pricing.amount.toLocaleString()} ${pricing.currency}`;
  }
}

export function getPackageLocalizedSecondaryLines(value: PackageLocalizedText) {
  return [`vi: ${value.vi}`, `cn: ${value.cn}`];
}

export function getPackageBestForSummary(bestFor: PackageLocalizedText) {
  return bestFor.en.trim();
}

export function packageDurationSecondsToMinutes(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 0;
  }

  return Math.round(seconds / 60);
}

export function packageDurationMinutesToSeconds(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return 0;
  }

  return Math.round(minutes * 60);
}
