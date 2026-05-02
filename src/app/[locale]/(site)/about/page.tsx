import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type AboutPageProps = {
  params: {
    locale: string;
  };
};

export default async function AboutPage({ params }: AboutPageProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale;
  const messages = await getMessages(locale);
  const content = await getPageBySlug("about", locale);

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
          {content?.translatedTitle || t(messages, "about.title")}
        </h1>
        <p className="page-subtitle">{content?.translatedSummary || t(messages, "about.intro")}</p>
      </section>

      {content ? (
        <article
          className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
          dangerouslySetInnerHTML={{ __html: content.translatedBody }}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h2 className="text-lg font-semibold text-cyan-200">{t(messages, "about.makerTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{t(messages, "about.makerBody")}</p>
          </article>
          <article className="panel p-5">
            <h2 className="text-lg font-semibold text-cyan-200">{t(messages, "about.philosophyTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {t(messages, "about.philosophyBody")}
            </p>
          </article>
        </section>
      )}
    </div>
  );
}
