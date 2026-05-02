import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { fallbackLocale, isLocale, type Locale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";
import { getNavigation } from "@/lib/navigation";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return [{ locale: "nl" }, { locale: "en" }];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = fallbackLocale(localeParam) as Locale;
  const messages = await getMessages(locale);
  const navItems = await getNavigation(locale, messages);

  return (
    <div className="min-h-screen">
      <Header
        locale={locale}
        siteName={t(messages, "site.name")}
        navItems={navItems}
        openMenuLabel={t(messages, "nav.openMenu")}
        closeMenuLabel={t(messages, "nav.closeMenu")}
        searchPlaceholder={t(messages, "search.placeholder")}
        searchButton={t(messages, "search.button")}
      />

      <main
        className="shell py-8 md:py-10"
        data-pagefind-body
        data-pagefind-filter={`locale:${locale}`}
      >
        {children}
      </main>

      <footer className="border-t border-cyan-950/40 py-6 text-center text-xs text-slate-500">
        <div className="shell">{t(messages, "site.tagline")}</div>
      </footer>
    </div>
  );
}
