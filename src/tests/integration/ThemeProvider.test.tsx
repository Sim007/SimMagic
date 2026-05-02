import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeProvider, { useTheme } from "@/components/ThemeProvider";

// Simple consumer component that renders theme state and a toggle button
function ThemeConsumer() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("defaults to dark when no localStorage and no system preference", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("reads theme from localStorage", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("toggles from dark to light on button click", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("toggles from light to dark on button click", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("persists theme to localStorage after toggle", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("applies dark class on html element when theme is dark", () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class on html element when theme is light", () => {
    localStorage.setItem("theme", "light");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
