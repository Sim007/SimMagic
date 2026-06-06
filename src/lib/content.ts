import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import sanitizeHtml from "sanitize-html";
import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";
import type {
  BlogEntry,
  PageEntry,
  ResolvedContent,
  SiteEntry,
  SolutionEntry
} from "@/types/content";

const contentRoot = path.join(process.cwd(), "content");

const slugPattern = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

type Section = "pages" | "blog" | "solutions";

const sectionToKind = {
  pages: "page",
  blog: "blog",
  solutions: "solution"
} as const;

async function listMarkdownFiles(section: Section): Promise<string[]> {
  const dir = path.join(contentRoot, section);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(dir, entry.name));
}

async function listSlugs(section: Section): Promise<string[]> {
  const files = await listMarkdownFiles(section);
  return files.map((file) => path.basename(file, ".md")).sort();
}

async function readEntryFile<T extends SiteEntry>(
  section: Section,
  filePath: string
): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);

  const slug = path.basename(filePath, ".md");
  const kind = sectionToKind[section];

  return {
    ...data,
    slug,
    kind
  } as T;
}

function pickLocalized(
  value: { nl: string; en?: string } | undefined,
  locale: Locale
): { text: string; usedFallback: boolean } {
  if (!value) {
    return { text: "", usedFallback: false };
  }

  if (locale === "nl") {
    return { text: value.nl ?? "", usedFallback: false };
  }

  if (value.en && value.en.trim().length > 0) {
    return { text: value.en, usedFallback: false };
  }

  return { text: value.nl ?? "", usedFallback: true };
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img",
    "h1",
    "h2",
    "figure",
    "figcaption"
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "name", "target", "rel", "title"]
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    // Prevent reverse-tabnabbing on links that open a new tab.
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" })
  }
};

async function markdownToHtml(markdown: string): Promise<string> {
  const output = await remark().use(html).process(markdown);
  return sanitizeHtml(output.toString(), sanitizeOptions);
}

async function resolveEntry<T extends SiteEntry>(
  entry: T,
  locale: Locale
): Promise<ResolvedContent<T>> {
  const title = pickLocalized(entry.title, locale);
  const summary = pickLocalized(entry.summary, locale);
  const body = pickLocalized(entry.body, locale);

  const renderedBody = await markdownToHtml(body.text);

  return {
    ...entry,
    locale,
    translatedTitle: title.text,
    translatedSummary: summary.text,
    translatedBody: renderedBody,
    usedFallback: title.usedFallback || summary.usedFallback || body.usedFallback
  };
}

function byDateDesc(a: SiteEntry, b: SiteEntry): number {
  const aTime = a.date ? Date.parse(a.date) : 0;
  const bTime = b.date ? Date.parse(b.date) : 0;
  return bTime - aTime;
}

export async function getAllPages(locale: Locale): Promise<ResolvedContent<PageEntry>[]> {
  const files = await listMarkdownFiles("pages");
  const entries = await Promise.all(files.map((file) => readEntryFile<PageEntry>("pages", file)));
  return Promise.all(entries.sort(byDateDesc).map((entry) => resolveEntry(entry, locale)));
}

export async function getAllBlogPosts(locale: Locale): Promise<ResolvedContent<BlogEntry>[]> {
  const files = await listMarkdownFiles("blog");
  const entries = await Promise.all(files.map((file) => readEntryFile<BlogEntry>("blog", file)));
  return Promise.all(entries.sort(byDateDesc).map((entry) => resolveEntry(entry, locale)));
}

export async function getAllSolutions(
  locale: Locale
): Promise<ResolvedContent<SolutionEntry>[]> {
  const files = await listMarkdownFiles("solutions");
  const entries = await Promise.all(
    files.map((file) => readEntryFile<SolutionEntry>("solutions", file))
  );
  return Promise.all(entries.sort(byDateDesc).map((entry) => resolveEntry(entry, locale)));
}

export async function getBlogSlugs(): Promise<string[]> {
  return listSlugs("blog");
}

export async function getSolutionSlugs(): Promise<string[]> {
  return listSlugs("solutions");
}

export async function getBlogPostBySlug(
  slug: string,
  locale: Locale
): Promise<ResolvedContent<BlogEntry> | null> {
  if (!slugPattern.test(slug)) return null;
  const filePath = path.join(contentRoot, "blog", `${slug}.md`);

  try {
    const entry = await readEntryFile<BlogEntry>("blog", filePath);
    return resolveEntry(entry, locale);
  } catch {
    return null;
  }
}

export async function getSolutionBySlug(
  slug: string,
  locale: Locale
): Promise<ResolvedContent<SolutionEntry> | null> {
  if (!slugPattern.test(slug)) return null;
  const filePath = path.join(contentRoot, "solutions", `${slug}.md`);

  try {
    const entry = await readEntryFile<SolutionEntry>("solutions", filePath);
    return resolveEntry(entry, locale);
  } catch {
    return null;
  }
}

export async function getPageBySlug(
  slug: string,
  locale: Locale
): Promise<ResolvedContent<PageEntry> | null> {
  if (!slugPattern.test(slug)) return null;
  const filePath = path.join(contentRoot, "pages", `${slug}.md`);

  try {
    const entry = await readEntryFile<PageEntry>("pages", filePath);
    return resolveEntry(entry, locale);
  } catch {
    return null;
  }
}

export function normalizeLocaleOrDefault(locale: string): Locale {
  return locale === "en" ? "en" : defaultLocale;
}
