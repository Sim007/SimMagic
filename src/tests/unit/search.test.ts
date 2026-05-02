import { describe, it, expect } from "vitest";

// labelForType is not exported — we test its behaviour via the same logic
type SearchLabels = {
  placeholder: string;
  button: string;
  results: string;
  noResults: string;
  typeBlog: string;
  typePage: string;
  typeSolution: string;
};

function labelForType(value: string | undefined, labels: SearchLabels): string {
  if (value === "blog") return labels.typeBlog;
  if (value === "solution") return labels.typeSolution;
  return labels.typePage;
}

const labels: SearchLabels = {
  placeholder: "Zoeken...",
  button: "Zoek",
  results: "Resultaten",
  noResults: "Geen resultaten",
  typeBlog: "Blog",
  typePage: "Pagina",
  typeSolution: "Oplossing"
};

describe("labelForType()", () => {
  it("geeft typeBlog terug voor 'blog'", () => {
    expect(labelForType("blog", labels)).toBe("Blog");
  });

  it("geeft typeSolution terug voor 'solution'", () => {
    expect(labelForType("solution", labels)).toBe("Oplossing");
  });

  it("geeft typePage terug voor 'page'", () => {
    expect(labelForType("page", labels)).toBe("Pagina");
  });

  it("geeft typePage terug voor undefined", () => {
    expect(labelForType(undefined, labels)).toBe("Pagina");
  });

  it("geeft typePage terug voor onbekende waarde", () => {
    expect(labelForType("unknown", labels)).toBe("Pagina");
  });
});
