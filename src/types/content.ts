import type { Locale } from "@/lib/i18n";

export type LocalizedString = {
  nl: string;
  en?: string;
};

export type LocalizedRichText = {
  nl: string;
  en?: string;
};

export type ContentKind = "page" | "blog" | "solution";

export type ModelFlowStep = {
  title: LocalizedString;
  description: LocalizedRichText;
  screenshot?: string;
  codeSnippet?: string;
  demoUrl?: string;
  repoUrl?: string;
};

export type ModelFlow = {
  problem: ModelFlowStep;
  magic: ModelFlowStep;
  solution: ModelFlowStep;
};

export type BaseEntry = {
  slug: string;
  kind: ContentKind;
  date?: string;
  tags?: string[];
};

export type PageEntry = BaseEntry & {
  kind: "page";
  title: LocalizedString;
  summary: LocalizedString;
  body: LocalizedRichText;
};

export type BlogEntry = BaseEntry & {
  kind: "blog";
  title: LocalizedString;
  summary: LocalizedString;
  body: LocalizedRichText;
  coverImage?: string;
};

export type SolutionEntry = BaseEntry & {
  kind: "solution";
  title: LocalizedString;
  summary: LocalizedString;
  body: LocalizedRichText;
  featured?: boolean;
  flow: ModelFlow;
};

export type SiteEntry = PageEntry | BlogEntry | SolutionEntry;

export type ResolvedContent<T extends SiteEntry> = T & {
  locale: Locale;
  usedFallback: boolean;
  translatedTitle: string;
  translatedSummary: string;
  translatedBody: string;
};

export type SearchRecord = {
  title: string;
  snippet: string;
  href: string;
  type: ContentKind;
  locale: Locale;
};
