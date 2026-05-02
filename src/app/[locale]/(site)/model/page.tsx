import { notFound } from "next/navigation";
import ModelFlow from "@/components/ModelFlow";
import { getPageBySlug } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages, t } from "@/lib/messages";

type ModelPageProps = {
  params: {
    locale: string;
  };
};

export default async function ModelPage({ params }: ModelPageProps) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale;
  const messages = await getMessages(locale);
  const modelPage = await getPageBySlug("model", locale);

  const flow = {
    problem: {
      title: { nl: t(messages, "modelFlow.problem"), en: "Problem" },
      description: {
        nl: t(messages, "model.problemDesc"),
        en: "Define the real pain and context."
      }
    },
    magic: {
      title: { nl: t(messages, "modelFlow.magic"), en: "Magic" },
      description: {
        nl: t(messages, "model.magicDesc"),
        en: "Iterate until the core idea clicks."
      }
    },
    solution: {
      title: { nl: t(messages, "modelFlow.solution"), en: "Solution" },
      description: {
        nl: t(messages, "model.solutionDesc"),
        en: "Build, validate, and publish a concrete solution."
      }
    }
  };

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
          {modelPage?.translatedTitle || t(messages, "model.title")}
        </h1>
        <p className="page-subtitle">{modelPage?.translatedSummary || t(messages, "model.intro")}</p>
      </section>

      <ModelFlow
        locale={locale}
        flow={flow}
        labels={{
          problem: t(messages, "modelFlow.problem"),
          magic: t(messages, "modelFlow.magic"),
          solution: t(messages, "modelFlow.solution"),
          ctaDemo: t(messages, "modelFlow.ctaDemo"),
          ctaRepo: t(messages, "modelFlow.ctaRepo")
        }}
      />

      {modelPage ? (
        <article
          className="panel prose prose-invert max-w-none p-6 prose-headings:text-cyan-200 prose-a:text-cyan-300"
          dangerouslySetInnerHTML={{ __html: modelPage.translatedBody }}
        />
      ) : null}
    </div>
  );
}
