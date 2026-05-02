export const locales = ["nl", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nl";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function fallbackLocale(locale?: string): Locale {
  const candidate = locale ?? "";
  return isLocale(candidate) ? candidate : defaultLocale;
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === "nl" ? "en" : "nl";
}
