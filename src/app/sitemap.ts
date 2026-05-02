import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllSolutions } from "@/lib/content";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://simmagic.example.com";

const LOCALES = ["nl", "en"] as const;

const STATIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/model", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/solutions", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" as const }
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, solutions] = await Promise.all([
    getAllBlogPosts("nl"),
    getAllSolutions("nl")
  ]);

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}${path}`])
        )
      }
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    blogs.map((post) => ({
      url: `${BASE}/${locale}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}/blog/${post.slug}`])
        )
      }
    }))
  );

  const solutionEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    solutions.map((sol) => ({
      url: `${BASE}/${locale}/solutions/${sol.slug}`,
      lastModified: sol.date ? new Date(sol.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE}/${l}/solutions/${sol.slug}`])
        )
      }
    }))
  );

  return [...staticEntries, ...blogEntries, ...solutionEntries];
}
