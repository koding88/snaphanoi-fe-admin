export type BlogLocale = "en" | "vi" | "cn";

export type BlogLocalizedText = {
  en: string;
  vi: string;
  cn: string;
};

export const BLOG_LOCALES: BlogLocale[] = ["en", "vi", "cn"];

export function isBlogLocalizedText(
  value: unknown,
): value is BlogLocalizedText {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as BlogLocalizedText).en === "string" &&
    typeof (value as BlogLocalizedText).vi === "string" &&
    typeof (value as BlogLocalizedText).cn === "string",
  );
}

export function createEmptyBlogLocalizedText(seed = ""): BlogLocalizedText {
  return {
    en: seed,
    vi: "",
    cn: "",
  };
}

export function normalizeBlogLocalizedText(value: unknown): BlogLocalizedText {
  if (isBlogLocalizedText(value)) {
    return {
      en: value.en,
      vi: value.vi,
      cn: value.cn,
    };
  }

  if (typeof value === "string") {
    return {
      en: value,
      vi: value,
      cn: value,
    };
  }

  return createEmptyBlogLocalizedText();
}

export function resolveBlogLocalizedText(
  value: unknown,
  locale: BlogLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  const normalized = normalizeBlogLocalizedText(value);
  const fallbackOrder: BlogLocale[] = [locale, "en", "vi", "cn"];

  for (const candidate of fallbackOrder) {
    if (normalized[candidate].trim().length > 0) {
      return normalized[candidate];
    }
  }

  return normalized.en || normalized.vi || normalized.cn || "";
}

export function getBlogPrimaryName(
  name: BlogLocalizedText,
  locale: BlogLocale = "en",
) {
  return resolveBlogLocalizedText(name, locale);
}

export function getBlogSecondaryNameLines(
  name: BlogLocalizedText,
  locale: BlogLocale = "en",
) {
  return BLOG_LOCALES.filter((candidate) => candidate !== locale)
    .map((candidate) => ({ locale: candidate, value: name[candidate].trim() }))
    .filter((entry) => entry.value.length > 0);
}
