"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { loadPagefind } from "@/lib/pagefind-loader";
import type { PagefindApi } from "@/lib/pagefind-types";

type SearchResultItem = {
  url: string;
  meta: {
    title?: string;
    type?: string;
    locale?: string;
  };
  excerpt?: string;
};

type SearchLabels = {
  results: string;
  noResults: string;
  typeBlog: string;
  typePage: string;
  typeSolution: string;
};

function labelForType(value: string | undefined, labels: SearchLabels): string {
  if (value === "blog") return labels.typeBlog;
  if (value === "solution") return labels.typeSolution;
  return labels.typePage;
}

type SearchResultsViewProps = {
  locale: Locale;
  labels: SearchLabels;
};

export default function SearchResultsView({ locale, labels }: SearchResultsViewProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [api, setApi] = useState<PagefindApi | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (window.pagefind?.search) { setApi(window.pagefind); return; }
        const mod = await loadPagefind();
        if (active && mod) setApi(mod);
      } catch {
        setApi(null);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    const activeApi = api;
    let active = true;

    async function runSearch() {
      if (!trimmed || !activeApi) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const raw = await activeApi.search(trimmed, { filters: { locale } });
        const mapped = await Promise.all(raw.results.map((item) => item.data()));
        if (active) setResults(mapped);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void runSearch();
    return () => { active = false; };
  }, [api, locale, query]);

  if (!query) return null;

  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.16em] text-cyan-300">{labels.results}</p>

      {loading ? (
        <p className="text-sm text-slate-400">...</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-slate-400">{labels.noResults}</p>
      ) : (
        <ul className="space-y-3">
          {results.map((item) => (
            <li
              key={`${item.url}-${item.meta.title ?? "untitled"}`}
              className="rounded-md border border-cyan-900/30 bg-slate-900/50 p-4"
            >
              <span className="text-[10px] uppercase tracking-[0.15em] text-cyan-300">
                {labelForType(item.meta.type, labels)}
              </span>
              <Link href={item.url} className="mt-1 block text-sm font-medium text-slate-100 hover:text-cyan-300">
                {item.meta.title ?? item.url}
              </Link>
              {item.excerpt ? (
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
