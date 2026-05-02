import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";

// Mock the pagefind loader so no /public file is imported during tests
const mockSearch = vi.fn();
vi.mock("@/lib/pagefind-loader", () => ({
  loadPagefind: () => Promise.resolve({ search: mockSearch })
}));

const labels = {
  placeholder: "Zoeken...",
  button: "Zoek",
  results: "Resultaten",
  noResults: "Geen resultaten gevonden",
  typeBlog: "Blog",
  typePage: "Pagina",
  typeSolution: "Oplossing"
};

function makePagefindMock(results: Array<{ url: string; title: string; type: string; excerpt: string }>) {
  return results.map((r) => ({
    data: () =>
      Promise.resolve({
        url: r.url,
        meta: { title: r.title, type: r.type },
        excerpt: r.excerpt
      })
  }));
}

describe("SearchBar (integratie)", () => {
  beforeEach(() => {
    mockSearch.mockReset();
    // Default: return empty results
    mockSearch.mockResolvedValue({ results: [] });
  });

  it("toont het zoekinput veld en de knop", () => {
    render(<SearchBar locale="nl" labels={labels} />);
    expect(screen.getByPlaceholderText("Zoeken...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoek" })).toBeInTheDocument();
  });

  it("toont geen resultaten sectie bij lege zoekopdracht", () => {
    render(<SearchBar locale="nl" labels={labels} />);
    expect(screen.queryByText("Resultaten")).not.toBeInTheDocument();
  });

  it("toont 'geen resultaten' als Pagefind niets vindt", async () => {
    mockSearch.mockResolvedValue({ results: [] });
    render(<SearchBar locale="nl" labels={labels} />);

    fireEvent.change(screen.getByPlaceholderText("Zoeken..."), { target: { value: "xyzbestaatniet" } });

    await waitFor(() => {
      expect(screen.getByText("Geen resultaten gevonden")).toBeInTheDocument();
    });
  });

  it("toont resultaten als Pagefind resultaten teruggeeft", async () => {
    mockSearch.mockResolvedValue({ results: makePagefindMock([
      { url: "/nl/blog/testpost", title: "Test Blog Post", type: "blog", excerpt: "Een excerpt" }
    ])});

    render(<SearchBar locale="nl" labels={labels} />);
    fireEvent.change(screen.getByPlaceholderText("Zoeken..."), { target: { value: "test" } });

    await waitFor(() => {
      expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
      expect(screen.getByText("Een excerpt")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });
  });

  it("wist resultaten als zoekveld leeggemaakt wordt", async () => {
    mockSearch.mockResolvedValue({ results: makePagefindMock([
      { url: "/nl/blog/testpost", title: "Test Blog Post", type: "blog", excerpt: "" }
    ])});

    render(<SearchBar locale="nl" labels={labels} />);
    const input = screen.getByPlaceholderText("Zoeken...");

    fireEvent.change(input, { target: { value: "test" } });
    await waitFor(() => expect(screen.getByText("Test Blog Post")).toBeInTheDocument());

    fireEvent.change(input, { target: { value: "" } });
    await waitFor(() => expect(screen.queryByText("Test Blog Post")).not.toBeInTheDocument());
  });
});
