import { notFound } from "next/navigation";
import ModelFlow from "@/components/ModelFlow";
import { getSolutionBySlug, getSolutionSlugs } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type SolutionDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getSolutionSlugs();
  return ["nl", "en"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default async function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const messages = await getMessages(locale);
  const solution = await getSolutionBySlug(slug, locale);

  if (!solution) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <span className="hidden" data-pagefind-filter="locale">
        {locale}
      </span>
      <span className="hidden" data-pagefind-filter="type">
        solution
      </span>
      <section>
        <h1 className="page-title" data-pagefind-meta="title">
          {solution.translatedTitle}
        </h1>
        <p className="page-subtitle">{solution.translatedSummary}</p>

        {solution.usedFallback ? (
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-amber-300">
            {t(messages, "search.fallbackNotice")}
          </p>
        ) : null}
      </section>

      <ModelFlow
        locale={locale}
        flow={solution.flow}
        labels={{
          problem: t(messages, "modelFlow.problem"),
          magic: t(messages, "modelFlow.magic"),
          solution: t(messages, "modelFlow.solution"),
          ctaDemo: t(messages, "modelFlow.ctaDemo"),
          ctaRepo: t(messages, "modelFlow.ctaRepo")
        }}
      />

      <article
        className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
        dangerouslySetInnerHTML={{ __html: solution.translatedBody }}
      />
    </div>
  );
}
