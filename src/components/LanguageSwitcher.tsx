"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getOppositeLocale, type Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
};

function swapLocaleInPath(pathname: string, from: Locale, to: Locale): string {
  if (!pathname || pathname === "/") {
    return `/${to}`;
  }

  const prefixed = pathname.startsWith(`/${from}`);
  if (!prefixed) {
    return `/${to}${pathname}`;
  }

  return pathname.replace(`/${from}`, `/${to}`) || `/${to}`;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const otherLocale = getOppositeLocale(locale);

  const nlHref = locale === "nl" ? pathname : swapLocaleInPath(pathname, locale, "nl");
  const enHref = locale === "en" ? pathname : swapLocaleInPath(pathname, locale, "en");

  return (
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
      <Link
        href={nlHref}
        className={
          locale === "nl"
            ? "rounded px-2 py-1 text-cyan-400"
            : "rounded px-2 py-1 text-slate-300 hover:text-cyan-300"
        }
      >
        NL
      </Link>
      <span className="text-slate-500">|</span>
      <Link
        href={enHref}
        className={
          locale === "en"
            ? "rounded px-2 py-1 text-cyan-400"
            : "rounded px-2 py-1 text-slate-300 hover:text-cyan-300"
        }
      >
        EN
      </Link>
    </div>
  );
}
