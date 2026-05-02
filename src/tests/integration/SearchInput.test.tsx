import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "@/components/SearchInput";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("SearchInput (integratie)", () => {
  beforeEach(() => mockPush.mockReset());

  it("toont het zoekinput veld en de zoekknop", () => {
    render(<SearchInput locale="nl" placeholder="Zoeken..." buttonLabel="Zoek" />);
    expect(screen.getByPlaceholderText("Zoeken...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zoek" })).toBeInTheDocument();
  });

  it("navigeert naar zoekpagina bij submit", () => {
    render(<SearchInput locale="nl" placeholder="Zoeken..." buttonLabel="Zoek" />);
    fireEvent.change(screen.getByPlaceholderText("Zoeken..."), { target: { value: "test" } });
    fireEvent.submit(screen.getByPlaceholderText("Zoeken...").closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/nl/search?q=test");
  });

  it("navigeert niet bij lege invoer", () => {
    render(<SearchInput locale="nl" placeholder="Zoeken..." buttonLabel="Zoek" />);
    fireEvent.submit(screen.getByPlaceholderText("Zoeken...").closest("form")!);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("gebruikt de opgegeven locale in de URL", () => {
    render(<SearchInput locale="en" placeholder="Search..." buttonLabel="Search" />);
    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "hello" } });
    fireEvent.submit(screen.getByPlaceholderText("Search...").closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/en/search?q=hello");
  });

  it("encodeert spaties in de zoekterm correct", () => {
    render(<SearchInput locale="nl" placeholder="Zoeken..." buttonLabel="Zoek" />);
    fireEvent.change(screen.getByPlaceholderText("Zoeken..."), { target: { value: "open source" } });
    fireEvent.submit(screen.getByPlaceholderText("Zoeken...").closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/nl/search?q=open%20source");
  });
});
