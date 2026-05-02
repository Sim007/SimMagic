import Link from "next/link";
import { notFound } from "next/navigation";
import ModelFlow from "@/components/ModelFlow";
import { getAllBlogPosts, getAllSolutions, getPageBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type HomePageProps = {
  params: {
    locale: string;
  };
};

export default async function HomePage({ params }: HomePageProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale;
  const messages = await getMessages(locale);

  const [posts, solutions, homePage] = await Promise.all([
    getAllBlogPosts(locale),
    getAllSolutions(locale),
    getPageBySlug("home", locale)
  ]);

  const featuredSolutions = solutions.filter((item) => item.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  const fallbackFlow = {
    problem: {
      title: { nl: t(messages, "modelFlow.problem"), en: t(messages, "modelFlow.problem") },
      description: {
        nl: t(messages, "model.problemDesc"),
        en: t(messages, "model.problemDesc")
      }
    },
    magic: {
      title: { nl: t(messages, "modelFlow.magic"), en: t(messages, "modelFlow.magic") },
      description: {
        nl: t(messages, "model.magicDesc"),
        en: t(messages, "model.magicDesc")
      }
    },
    solution: {
      title: { nl: t(messages, "modelFlow.solution"), en: t(messages, "modelFlow.solution") },
      description: {
        nl: t(messages, "model.solutionDesc"),
        en: t(messages, "model.solutionDesc")
      }
    }
  };

  return (
    <div className="space-y-10">
      <span className="hidden" data-pagefind-filter="locale">
        {locale}
      </span>
      <span className="hidden" data-pagefind-filter="type">
        page
      </span>
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">{t(messages, "site.name")}</p>
        <h1 className="page-title" data-pagefind-meta="title">
          {homePage?.translatedTitle || t(messages, "home.title")}
        </h1>
        <p className="page-subtitle">{homePage?.translatedSummary || t(messages, "home.intro")}</p>
        <p className="text-sm text-cyan-300">{t(messages, "site.tagline")}</p>
      </section>

      {homePage ? (
        <article
          className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
          dangerouslySetInnerHTML={{ __html: homePage.translatedBody }}
        />
      ) : null}

      <ModelFlow
        locale={locale}
        flow={fallbackFlow}
        labels={{
          problem: t(messages, "modelFlow.problem"),
          magic: t(messages, "modelFlow.magic"),
          solution: t(messages, "modelFlow.solution"),
          ctaDemo: t(messages, "modelFlow.ctaDemo"),
          ctaRepo: t(messages, "modelFlow.ctaRepo")
        }}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-100">{t(messages, "home.featuredSolutions")}</h2>
          <Link href={`/${locale}/solutions`} className="text-sm text-cyan-300 hover:text-cyan-200">
            {t(messages, "home.viewAllSolutions")}
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {featuredSolutions.length === 0 ? (
            <p className="text-sm text-slate-400">{t(messages, "solutions.empty")}</p>
          ) : (
            featuredSolutions.map((item) => (
              <article key={item.slug} className="panel p-4">
                <h3 className="text-base font-semibold text-slate-100">{item.translatedTitle}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.translatedSummary}</p>
                <Link
                  href={`/${locale}/solutions/${item.slug}`}
                  className="mt-3 inline-block text-xs uppercase tracking-[0.14em] text-cyan-300"
                >
                  {t(messages, "solutions.readMore")}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-100">{t(messages, "home.latestPosts")}</h2>
          <Link href={`/${locale}/blog`} className="text-sm text-cyan-300 hover:text-cyan-200">
            {t(messages, "home.viewAllPosts")}
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {latestPosts.length === 0 ? (
            <p className="text-sm text-slate-400">{t(messages, "blog.empty")}</p>
          ) : (
            latestPosts.map((item) => (
              <article key={item.slug} className="panel p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-300">{item.date}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-100">{item.translatedTitle}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.translatedSummary}</p>
                <Link
                  href={`/${locale}/blog/${item.slug}`}
                  className="mt-3 inline-block text-xs uppercase tracking-[0.14em] text-cyan-300"
                >
                  {t(messages, "blog.readPost")}
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
