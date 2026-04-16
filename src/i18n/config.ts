export const locales = ["en", "vi"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const localeCookieName = "snaphanoi-admin-locale";

export function isValidLocale(locale: string | null | undefined): locale is AppLocale {
  return Boolean(locale && locales.includes(locale as AppLocale));
}

export function resolveLocaleFromAcceptLanguage(header: string | null): AppLocale {
  if (!header) {
    return defaultLocale;
  }

  const firstLang = header.split(",")[0]?.trim().toLowerCase() ?? "";

  if (firstLang.startsWith("vi")) {
    return "vi";
  }

  return defaultLocale;
}
