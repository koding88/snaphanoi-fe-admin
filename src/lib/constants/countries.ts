import { BACKEND_COUNTRY_CODES } from "@/lib/constants/country-codes";

export type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

const REGION_LABELS =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryCodeToFlag(code: string) {
  return code
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function countryCodeToName(code: string) {
  const label = REGION_LABELS?.of(code);

  if (!label || label === code) {
    return code;
  }

  return label;
}

export const COUNTRY_OPTIONS: CountryOption[] = [...BACKEND_COUNTRY_CODES]
  .map((code) => ({
    code,
    name: countryCodeToName(code),
    flag: countryCodeToFlag(code),
  }))
  .sort((first, second) =>
    first.name.localeCompare(second.name, "en", { sensitivity: "base" }),
  );

export const DEFAULT_COUNTRY_CODE = "VN";

export function getCountryByCode(code: string | null | undefined) {
  if (!code) {
    return null;
  }

  const normalizedCode = code.trim().toUpperCase();

  return COUNTRY_OPTIONS.find((country) => country.code === normalizedCode) ?? null;
}
