import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getPageBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type BlogPageProps = {
  params: {
    locale: string;
  };
};

function formatDate(value: string | undefined, locale: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

export default async function BlogPage({ params }: BlogPageProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale;
  const messages = await getMessages(locale);
  const [posts, blogPage] = await Promise.all([getAllBlogPosts(locale), getPageBySlug("blog", locale)]);

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
          {blogPage?.translatedTitle || t(messages, "blog.title")}
        </h1>
        <p className="page-subtitle">{blogPage?.translatedSummary || t(messages, "blog.intro")}</p>
      </section>

      {blogPage ? (
        <article
          className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
          dangerouslySetInnerHTML={{ __html: blogPage.translatedBody }}
        />
      ) : null}

      <section className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-slate-400">{t(messages, "blog.empty")}</p>
        ) : (
          posts.map((item) => (
            <article key={item.slug} className="panel p-5">
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-cyan-300">
                <span>
                  {t(messages, "blog.publishedOn")}: {formatDate(item.date, locale)}
                </span>
                {item.tags && item.tags.length > 0 ? (
                  <span>
                    {t(messages, "blog.tag")}: {item.tags.join(" / ")}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-2 text-xl font-semibold text-slate-100">{item.translatedTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.translatedSummary}</p>

              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={`/${locale}/blog/${item.slug}`}
                  className="rounded-md border border-cyan-800/70 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cyan-200 hover:bg-cyan-950/40"
                >
                  {t(messages, "blog.readPost")}
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
