import type { PagefindApi } from "@/lib/pagefind-types";

export async function loadPagefind(): Promise<PagefindApi | null> {
  try {
    // @ts-expect-error — pagefind.js is generated at build time, not in the TypeScript module graph
    const mod = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
    return typeof mod?.search === "function" ? (mod as PagefindApi) : null;
  } catch {
    return null;
  }
}
