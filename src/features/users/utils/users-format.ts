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

export function formatCreatorDisplayName(value: string | null | undefined) {
  if (!value) {
    return "Deleted user";
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Deleted user";
}

export function formatGalleryDisplayName(value: string | null | undefined) {
  if (!value) {
    return "Deleted gallery";
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Deleted gallery";
}
