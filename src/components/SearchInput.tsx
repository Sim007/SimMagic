"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

type SearchInputProps = {
  locale: Locale;
  placeholder: string;
  buttonLabel: string;
  className?: string;
};

export default function SearchInput({ locale, placeholder, buttonLabel, className = "" }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-1.5 ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-md border border-cyan-900/40 bg-slate-950/50 px-2 py-1.5 text-xs text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring-1 md:w-36 lg:w-48 md:flex-none"
      />
      <button
        type="submit"
        className="shrink-0 whitespace-nowrap rounded-md border border-cyan-800/70 bg-cyan-900/25 px-2.5 py-1.5 text-xs text-cyan-200 hover:bg-cyan-900/40"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
