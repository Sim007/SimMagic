import { Suspense } from "react";
import { notFound } from "next/navigation";
import SearchResultsView from "@/components/SearchResultsView";
import { fallbackLocale, isLocale, type Locale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type SearchPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = fallbackLocale(localeParam) as Locale;
  const messages = await getMessages(locale);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold text-slate-100">{t(messages, "search.results")}</h1>
      <Suspense fallback={<p className="text-sm text-slate-400">{t(messages, "common.loading")}</p>}>
        <SearchResultsView
          locale={locale}
          labels={{
            results: t(messages, "search.results"),
            noResults: t(messages, "search.noResults"),
            typeBlog: t(messages, "search.typeBlog"),
            typePage: t(messages, "search.typePage"),
            typeSolution: t(messages, "search.typeSolution"),
          }}
        />
      </Suspense>
    </div>
  );
}
