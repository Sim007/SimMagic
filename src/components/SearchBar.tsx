"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  placeholder: string;
  button: string;
  results: string;
  noResults: string;
  typeBlog: string;
  typePage: string;
  typeSolution: string;
};

type SearchBarProps = {
  locale: Locale;
  labels: SearchLabels;
};

declare global {
  interface Window {
    pagefind?: PagefindApi;
  }
}

function labelForType(value: string | undefined, labels: SearchLabels): string {
  if (value === "blog") {
    return labels.typeBlog;
  }

  if (value === "solution") {
    return labels.typeSolution;
  }

  return labels.typePage;
}

export default function SearchBar({ locale, labels }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [api, setApi] = useState<PagefindApi | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        if (window.pagefind?.search) {
          setApi(window.pagefind);
          return;
        }

        const mod = await loadPagefind();
        if (active && mod) {
          setApi(mod);
        }
      } catch {
        setApi(null);
      }
    }

    load();

    return () => {
      active = false;
    };
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

    return () => {
      active = false;
    };
  }, [api, locale, query]);

  const showEmpty = useMemo(() => !loading && query.trim().length > 0 && results.length === 0, [
    loading,
    query,
    results.length
  ]);

  return (
    <section className="sticky top-16 z-30 border-b border-cyan-900/30 bg-slate-950/70 backdrop-blur">
      <div className="shell py-3">
        <div className="panel p-2 md:p-3">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.placeholder}
              className="w-full rounded-md border border-cyan-900/40 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-1"
            />
            <button
              type="submit"
              className="rounded-md border border-cyan-800/70 bg-cyan-900/25 px-3 py-2 text-sm text-cyan-200"
            >
              {labels.button}
            </button>
          </form>

          {query.trim().length > 0 ? (
            <div className="mt-3">
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-cyan-300">{labels.results}</p>

              {showEmpty ? <p className="text-sm text-slate-400">{labels.noResults}</p> : null}

              {results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((item) => (
                    <li key={`${item.url}-${item.meta.title ?? "untitled"}`} className="rounded-md border border-cyan-900/30 bg-slate-900/50 p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-cyan-300">
                          {labelForType(item.meta.type, labels)}
                        </span>
                      </div>
                      <Link href={item.url} className="text-sm font-medium text-slate-100 hover:text-cyan-300">
                        {item.meta.title ?? item.url}
                      </Link>
                      {item.excerpt ? (
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.excerpt}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
