import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

function toPhoneCountryCode(countryCode: string | null | undefined): CountryCode | undefined {
  const normalized = countryCode?.trim().toUpperCase();

  if (!normalized || !/^[A-Z]{2}$/.test(normalized)) {
    return undefined;
  }

  return normalized as CountryCode;
}

function sanitizePhoneCandidate(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const digitsAndPlus = trimmed.replace(/[^\d+]/g, "");

  if (digitsAndPlus.startsWith("00")) {
    return `+${digitsAndPlus.slice(2)}`;
  }

  return digitsAndPlus;
}

export function normalizePhoneNumber(value: string, countryCode?: string | null) {
  const candidate = sanitizePhoneCandidate(value);

  if (!candidate) {
    return null;
  }

  const parsed = candidate.startsWith("+")
    ? parsePhoneNumberFromString(candidate)
    : parsePhoneNumberFromString(candidate, toPhoneCountryCode(countryCode));

  if (!parsed || !parsed.isValid()) {
    return null;
  }

  return parsed.number;
}

export function formatPhoneNumberDisplay(value: string | null | undefined) {
  if (!value) {
    return "N/A";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "N/A";
  }

  const parsed = parsePhoneNumberFromString(trimmed);

  if (!parsed || !parsed.isValid()) {
    return trimmed;
  }

  return parsed.formatInternational();
}
