import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogSlugs } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type BlogDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
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
    month: "long",
    day: "2-digit"
  }).format(date);
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return ["nl", "en"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const messages = await getMessages(locale);
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <span className="hidden" data-pagefind-filter="locale">
        {locale}
      </span>
      <span className="hidden" data-pagefind-filter="type">
        blog
      </span>
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">
          {t(messages, "blog.publishedOn")}: {formatDate(post.date, locale)}
        </p>

        <h1 className="page-title" data-pagefind-meta="title">
          {post.translatedTitle}
        </h1>
        <p className="page-subtitle">{post.translatedSummary}</p>

        {post.tags && post.tags.length > 0 ? (
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
            {t(messages, "blog.tag")}: {post.tags.join(" / ")}
          </p>
        ) : null}

        {post.usedFallback ? (
          <p className="text-xs uppercase tracking-[0.14em] text-amber-300">
            {t(messages, "search.fallbackNotice")}
          </p>
        ) : null}
      </header>

      {post.coverImage ? (
        <div className="overflow-hidden rounded-xl border border-cyan-900/40">
          <Image
            src={post.coverImage}
            alt={post.translatedTitle}
            width={1400}
            height={800}
            className="h-auto w-full"
          />
        </div>
      ) : null}

      <section
        className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
        dangerouslySetInnerHTML={{ __html: post.translatedBody }}
      />
    </article>
  );
}
