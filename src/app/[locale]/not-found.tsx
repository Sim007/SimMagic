import Link from "next/link";
import { getMessages, t } from "@/lib/messages";
import { fallbackLocale } from "@/lib/i18n";

type NotFoundProps = {
  params?: Promise<{
    locale: string;
  }>;
};

export default async function NotFound({ params }: NotFoundProps) {
  const resolved = params ? await params : undefined;
  const locale = fallbackLocale(resolved?.locale);
  const messages = await getMessages(locale);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="panel max-w-lg p-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">{t(messages, "common.notFound")}</h1>
        <p className="mt-3 text-sm text-slate-300">{t(messages, "errors.contentMissing")}</p>
        <Link
          href={`/${locale}`}
          className="mt-5 inline-block rounded-md border border-cyan-700/70 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-950/40"
        >
          {t(messages, "common.goHome")}
        </Link>
      </div>
    </div>
  );
}
