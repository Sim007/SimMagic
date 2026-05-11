declare global {
  interface Window {
    pagefind?: PagefindApi;
  }
}

export type PagefindApi = {
  search: (
    term: string,
    options?: {
      filters?: Record<string, string | string[]>;
    }
  ) => Promise<{
    results: Array<{
      data: () => Promise<{
        url: string;
        meta: {
          title?: string;
          type?: string;
          locale?: string;
        };
        excerpt?: string;
      }>;
    }>;
  }>;
};
