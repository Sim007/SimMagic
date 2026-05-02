"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Localized = {
  nl: string;
  en?: string;
};

type FlowStep = {
  title: Localized;
  description: Localized;
  screenshot?: string;
  codeSnippet?: string;
  demoUrl?: string;
  repoUrl?: string;
};

type FlowData = {
  problem: FlowStep;
  magic: FlowStep;
  solution: FlowStep;
};

type FlowLabels = {
  problem: string;
  magic: string;
  solution: string;
  ctaDemo: string;
  ctaRepo: string;
};

type ModelFlowProps = {
  locale: Locale;
  flow: FlowData;
  labels: FlowLabels;
};

function localized(value: Localized, locale: Locale): string {
  if (locale === "en" && value.en && value.en.trim()) {
    return value.en;
  }

  return value.nl;
}

function AnimatedMagicWord({ word }: { word: string }) {
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let frame: ReturnType<typeof setTimeout>;

    function tick() {
      if (!deleting) {
        const next = word.slice(0, text.length + 1);
        setText(next);

        if (next === word) {
          frame = setTimeout(() => setDeleting(true), 850);
          return;
        }

        frame = setTimeout(tick, 85);
        return;
      }

      const next = word.slice(0, Math.max(0, text.length - 1));
      setText(next);

      if (next.length === 0) {
        frame = setTimeout(() => setDeleting(false), 260);
        return;
      }

      frame = setTimeout(tick, 48);
    }

    frame = setTimeout(tick, 180);

    return () => clearTimeout(frame);
  }, [deleting, text, word]);

  return <span className="typewriter-caret pr-1">{text}</span>;
}

function StepCard({
  locale,
  step,
  title,
  cyan,
  labels,
  animatedWord
}: {
  locale: Locale;
  step: FlowStep;
  title: string;
  cyan?: boolean;
  labels: FlowLabels;
  animatedWord?: string;
}) {
  const stepTitle = localized(step.title, locale);
  const stepDescription = localized(step.description, locale);

  return (
    <article
      className={
        cyan
          ? "rounded-xl border border-cyan-500/50 bg-cyan-950/20 p-4 shadow-neon"
          : "rounded-xl border border-cyan-900/35 bg-slate-900/55 p-4"
      }
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300">{title}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-100">
        {animatedWord ? <AnimatedMagicWord word={animatedWord} /> : stepTitle}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{stepDescription}</p>

      {step.screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={step.screenshot}
          alt={stepTitle}
          className="mt-3 h-auto w-full rounded-md border border-cyan-900/40"
        />
      ) : null}

      {step.codeSnippet ? (
        <pre className="mt-3 overflow-x-auto rounded-md border border-cyan-900/35 bg-slate-950/70 p-3 text-xs text-cyan-100">
          <code>{step.codeSnippet}</code>
        </pre>
      ) : null}

      {step.demoUrl || step.repoUrl ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {step.demoUrl ? (
            <Link
              href={step.demoUrl}
              target="_blank"
              className="rounded-md border border-cyan-700/60 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-950/40"
            >
              {labels.ctaDemo}
            </Link>
          ) : null}

          {step.repoUrl ? (
            <Link
              href={step.repoUrl}
              target="_blank"
              className="rounded-md border border-cyan-700/60 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-950/40"
            >
              {labels.ctaRepo}
            </Link>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default function ModelFlow({ locale, flow, labels }: ModelFlowProps) {
  const magicWord = useMemo(() => labels.magic, [labels.magic]);

  return (
    <section className="space-y-3 md:space-y-0">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start">
        <StepCard locale={locale} step={flow.problem} title={labels.problem} cyan labels={labels} />
        <div className="hidden items-center justify-center text-cyan-300 md:flex">→</div>
        <StepCard
          locale={locale}
          step={flow.magic}
          title={labels.magic}
          labels={labels}
          animatedWord={magicWord}
        />
        <div className="hidden items-center justify-center text-cyan-300 md:flex">→</div>
        <StepCard locale={locale} step={flow.solution} title={labels.solution} cyan labels={labels} />
      </div>
    </section>
  );
}
