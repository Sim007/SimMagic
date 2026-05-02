import Link from "next/link";
import { notFound } from "next/navigation";
import ModelFlow from "@/components/ModelFlow";
import { getAllSolutions, getPageBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type SolutionsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const messages = await getMessages(locale);
  const [solutions, solutionsPage] = await Promise.all([
    getAllSolutions(locale),
    getPageBySlug("solutions", locale)
  ]);

  return (
    <div className="space-y-6">
      <span className="hidden" data-pagefind-filter="locale">
        {locale}
      </span>
      <span className="hidden" data-pagefind-filter="type">
        page
      </span>
      <section>
        <h1 className="page-title" data-pagefind-meta="title">
          {solutionsPage?.translatedTitle || t(messages, "solutions.title")}
        </h1>
        <p className="page-subtitle">
          {solutionsPage?.translatedSummary || t(messages, "solutions.intro")}
        </p>
      </section>

      {solutionsPage ? (
        <article
          className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
          dangerouslySetInnerHTML={{ __html: solutionsPage.translatedBody }}
        />
      ) : null}

      <section className="grid gap-6">
        {solutions.length === 0 ? (
          <p className="text-sm text-slate-400">{t(messages, "solutions.empty")}</p>
        ) : (
          solutions.map((item) => (
            <article key={item.slug} className="panel p-5">
              {item.tags && item.tags.length > 0 ? (
                <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-300">
                  {item.tags.join(" / ")}
                </p>
              ) : null}

              <h2 className="mt-1 text-xl font-semibold text-slate-100">{item.translatedTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.translatedSummary}</p>

              <div className="mt-4">
                <ModelFlow
                  locale={locale}
                  flow={item.flow}
                  labels={{
                    problem: t(messages, "modelFlow.problem"),
                    magic: t(messages, "modelFlow.magic"),
                    solution: t(messages, "modelFlow.solution"),
                    ctaDemo: t(messages, "modelFlow.ctaDemo"),
                    ctaRepo: t(messages, "modelFlow.ctaRepo")
                  }}
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Link
                  href={`/${locale}/solutions/${item.slug}`}
                  className="rounded-md border border-cyan-800/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-200 hover:bg-cyan-950/40"
                >
                  {t(messages, "solutions.readMore")}
                </Link>

                {item.usedFallback ? (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-amber-300">
                    {t(messages, "search.fallbackNotice")}
                  </span>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
