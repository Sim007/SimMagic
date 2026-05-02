import type { PagefindApi } from "@/lib/pagefind-types";

export async function loadPagefind(): Promise<PagefindApi | null> {
  try {
    const mod = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js") as PagefindApi;
    return mod?.search ? mod : null;
  } catch {
    return null;
  }
}
