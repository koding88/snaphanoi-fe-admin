import { getCountryByCode } from "@/lib/constants/countries";

export function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDateOnly(value: string | null) {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatCountryCode(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const country = getCountryByCode(value);

  if (!country) {
    return value;
  }

  return `${country.flag} ${country.name}`;
}
