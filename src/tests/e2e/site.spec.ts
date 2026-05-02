import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("NL homepage laadt correct", async ({ page }) => {
    await page.goto("/nl");
    await expect(page).toHaveTitle(/SimMagic/i);
    await expect(page.locator("header")).toBeVisible();
  });

  test("EN homepage laadt correct", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/SimMagic/i);
    await expect(page.locator("header")).toBeVisible();
  });

  test("root redirect naar /nl", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(nl|en)/);
  });
});

test.describe("Navigatie", () => {
  test("nav links zijn zichtbaar op desktop", async ({ page }) => {
    await page.goto("/nl");
    const nav = page.locator("header nav");
    await expect(nav).toBeVisible();
    await expect(nav.locator("a")).toHaveCount({ minimum: 3 } as never);
  });

  test("taalschakelaar schakelt naar EN", async ({ page }) => {
    await page.goto("/nl");
    const switcher = page.getByRole("link", { name: /EN/i });
    await switcher.click();
    await expect(page).toHaveURL(/\/en/);
  });

  test("navigeren naar About pagina", async ({ page }) => {
    await page.goto("/nl");
    await page.getByRole("link", { name: /over/i }).first().click();
    await expect(page).toHaveURL(/\/nl\/about/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("navigeren naar Blog pagina", async ({ page }) => {
    await page.goto("/nl");
    await page.getByRole("link", { name: /blog/i }).first().click();
    await expect(page).toHaveURL(/\/nl\/blog/);
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Thema toggle", () => {
  test("toggle knop is aanwezig", async ({ page }) => {
    await page.goto("/nl");
    const toggle = page.getByRole("button", { name: /modus/i });
    await expect(toggle).toBeVisible();
  });

  test("toggle schakelt dark/light class op html element", async ({ page }) => {
    await page.goto("/nl");
    const toggle = page.getByRole("button", { name: /modus/i });

    const htmlClass = await page.locator("html").getAttribute("class");
    const wasDark = (htmlClass ?? "").includes("dark");

    await toggle.click();

    const htmlClassAfter = await page.locator("html").getAttribute("class");
    const isDarkAfter = (htmlClassAfter ?? "").includes("dark");

    expect(isDarkAfter).toBe(!wasDark);
  });
});

test.describe("404 pagina", () => {
  test("onbekende URL toont 404 respons", async ({ page }) => {
    const response = await page.goto("/nl/bestaat-niet");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Zoeken", () => {
  test("zoekbalk is zichtbaar op de homepage", async ({ page }) => {
    await page.goto("/nl");
    const input = page.getByPlaceholderText(/zoek/i);
    await expect(input).toBeVisible();
  });

  test("zoeken toont resultaten sectie na invoer", async ({ page }) => {
    await page.goto("/nl");
    const input = page.getByPlaceholderText(/zoek/i);
    await input.fill("sim");
    // Resultaten-header moet verschijnen (Pagefind index aanwezig na npm run build)
    await expect(page.getByText(/resultaten/i)).toBeVisible({ timeout: 5000 });
  });

  test("zoeken naar bestaande term toont minstens één resultaat", async ({ page }) => {
    await page.goto("/nl");
    const input = page.getByPlaceholderText(/zoek/i);
    await input.fill("simmagic");
    await expect(page.locator("ul li")).toHaveCount({ minimum: 1 } as never, { timeout: 5000 });
  });

  test("zoeken naar onbekende term toont geen-resultaten melding", async ({ page }) => {
    await page.goto("/nl");
    const input = page.getByPlaceholderText(/zoek/i);
    await input.fill("xyzbestaatniet99999");
    await expect(page.getByText(/geen resultaten/i)).toBeVisible({ timeout: 5000 });
  });

  test("zoekbalk werkt ook op de EN versie", async ({ page }) => {
    await page.goto("/en");
    const input = page.getByPlaceholderText(/.+/);
    await input.fill("simmagic");
    await expect(page.locator("ul li").first()).toBeVisible({ timeout: 5000 });
  });
});
