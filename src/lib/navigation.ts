import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n";
import type { MessageMap } from "@/lib/messages";
import { t } from "@/lib/messages";

type Localized = {
  nl?: string;
  en?: string;
};

type RawNavItem = {
  key?: string;
  label?: Localized;
  href?: string;
};

type NavItem = {
  key: string;
  label: string;
  href: string;
};

const navigationFile = path.join(process.cwd(), "content", "navigation.md");

function defaultItems(locale: Locale, messages: MessageMap): NavItem[] {
  return [
    { key: "home", label: t(messages, "nav.home"), href: `/${locale}` },
    { key: "about", label: t(messages, "nav.about"), href: `/${locale}/about` },
    { key: "model", label: t(messages, "nav.model"), href: `/${locale}/model` },
    { key: "solutions", label: t(messages, "nav.solutions"), href: `/${locale}/solutions` },
    { key: "blog", label: t(messages, "nav.blog"), href: `/${locale}/blog` }
  ];
}

function localizeLabel(label: Localized | undefined, locale: Locale): string {
  if (!label) {
    return "";
  }

  if (locale === "en" && label.en && label.en.trim().length > 0) {
    return label.en;
  }

  return label.nl ?? "";
}

function toLocaleHref(href: string | undefined, locale: Locale): string {
  const raw = (href ?? "").trim();

  if (!raw) {
    return `/${locale}`;
  }

  if (raw === "/") {
    return `/${locale}`;
  }

  if (raw.startsWith("/nl") || raw.startsWith("/en")) {
    const parts = raw.split("/").filter(Boolean);
    const rest = parts.slice(1).join("/");
    return rest.length > 0 ? `/${locale}/${rest}` : `/${locale}`;
  }

  if (raw.startsWith("/")) {
    return `/${locale}${raw}`;
  }

  return `/${locale}/${raw}`;
}

export async function getNavigation(locale: Locale, messages: MessageMap): Promise<NavItem[]> {
  try {
    const raw = await fs.readFile(navigationFile, "utf8");
    const { data } = matter(raw);
    const items = (data.items ?? []) as RawNavItem[];

    const normalized = items
      .map((item, index) => ({
        key: item.key?.trim() || `item-${index + 1}`,
        label: localizeLabel(item.label, locale),
        href: toLocaleHref(item.href, locale)
      }))
      .filter((item) => item.label.length > 0);

    if (normalized.length === 0) {
      return defaultItems(locale, messages);
    }

    return normalized;
  } catch {
    return defaultItems(locale, messages);
  }
}
