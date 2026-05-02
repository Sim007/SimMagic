import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import SearchResultsView from "@/components/SearchResultsView";

const mockSearch = vi.fn();
vi.mock("@/lib/pagefind-loader", () => ({
  loadPagefind: () => Promise.resolve({ search: mockSearch }),
}));

const mockGet = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mockGet }),
}));

const labels = {
  results: "Zoekresultaten",
  noResults: "Geen resultaten gevonden",
  typeBlog: "Blog",
  typePage: "Pagina",
  typeSolution: "Oplossing",
};

function makePagefindMock(results: Array<{ url: string; title: string; type: string; excerpt: string }>) {
  return results.map((r) => ({
    data: () =>
      Promise.resolve({
        url: r.url,
        meta: { title: r.title, type: r.type },
        excerpt: r.excerpt,
      }),
  }));
}

describe("SearchResultsView (integratie)", () => {
  beforeEach(() => {
    mockSearch.mockReset();
    mockSearch.mockResolvedValue({ results: [] });
    mockGet.mockReset();
    mockGet.mockReturnValue(null);
  });

  it("toont niets zonder zoekterm in de URL", async () => {
    mockGet.mockReturnValue(null);
    await act(async () => {
      render(<SearchResultsView locale="nl" labels={labels} />);
    });
    expect(screen.queryByText("Zoekresultaten")).not.toBeInTheDocument();
    expect(screen.queryByText("Geen resultaten gevonden")).not.toBeInTheDocument();
  });

  it("toont de resultaten kop bij een zoekopdracht", async () => {
    mockGet.mockReturnValue("test");
    mockSearch.mockResolvedValue({ results: [] });
    render(<SearchResultsView locale="nl" labels={labels} />);
    await waitFor(() => {
      expect(screen.getByText("Zoekresultaten")).toBeInTheDocument();
    });
  });

  it("toont 'geen resultaten' als Pagefind niets vindt", async () => {
    mockGet.mockReturnValue("xyzbestaatniet");
    mockSearch.mockResolvedValue({ results: [] });
    render(<SearchResultsView locale="nl" labels={labels} />);
    await waitFor(() => {
      expect(screen.getByText("Geen resultaten gevonden")).toBeInTheDocument();
    });
  });

  it("toont resultaten als Pagefind resultaten teruggeeft", async () => {
    mockGet.mockReturnValue("test");
    mockSearch.mockResolvedValue({
      results: makePagefindMock([
        { url: "/nl/blog/testpost", title: "Test Blog Post", type: "blog", excerpt: "Een excerpt" },
      ]),
    });
    render(<SearchResultsView locale="nl" labels={labels} />);
    await waitFor(() => {
      expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
      expect(screen.getByText("Een excerpt")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });
  });

  it("toont meerdere resultaten", async () => {
    mockGet.mockReturnValue("sim");
    mockSearch.mockResolvedValue({
      results: makePagefindMock([
        { url: "/nl/blog/a", title: "Artikel A", type: "blog", excerpt: "" },
        { url: "/nl/solutions/b", title: "Oplossing B", type: "solution", excerpt: "Beschrijving" },
      ]),
    });
    render(<SearchResultsView locale="nl" labels={labels} />);
    await waitFor(() => {
      expect(screen.getByText("Artikel A")).toBeInTheDocument();
      expect(screen.getByText("Oplossing B")).toBeInTheDocument();
      expect(screen.getByText("Oplossing")).toBeInTheDocument();
    });
  });
});
