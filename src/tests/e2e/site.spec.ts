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
    const count = await nav.locator("a").count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("taalschakelaar schakelt naar EN", async ({ page }) => {
    await page.goto("/nl");
    // Target the EN link precisely via the language switcher container
    const switcher = page.locator("header").getByRole("link", { name: "EN", exact: true });
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
    const html = page.locator("html");

    const htmlClass = await html.getAttribute("class");
    const wasDark = (htmlClass ?? "").includes("dark");

    await toggle.click();

    await expect
      .poll(async () => ((await html.getAttribute("class")) ?? "").includes("dark"))
      .toBe(!wasDark);
  });
});

test.describe("404 pagina", () => {
  test("onbekende URL toont 404 respons", async ({ page }) => {
    const response = await page.goto("/nl/bestaat-niet");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Zoeken", () => {
  test("zoekbalk is zichtbaar in de header", async ({ page }) => {
    await page.goto("/nl");
    const input = page.locator("header input[type='search']");
    await expect(input).toBeVisible();
  });

  test("zoeken navigeert naar zoekpagina met query in URL", async ({ page }) => {
    await page.goto("/nl");
    const input = page.locator("header input[type='search']");
    await input.fill("sim");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/nl\/search\?q=sim/);
  });

  test("zoekpagina toont resultaten bij bestaande term", async ({ page }) => {
    await page.goto("/nl/search?q=simmagic");
    await expect(page.locator("main ul li").first()).toBeVisible({ timeout: 8000 });
    const count = await page.locator("main ul li").count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("zoekpagina toont geen-resultaten melding bij onbekende term", async ({ page }) => {
    await page.goto("/nl/search?q=xyzbestaatniet99999");
    await expect(page.getByText("Geen resultaten gevonden.")).toBeVisible({ timeout: 5000 });
  });

  test("zoekbalk werkt ook op de EN versie", async ({ page }) => {
    await page.goto("/en");
    const input = page.locator("header input[type='search']");
    await input.fill("simmagic");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/en\/search\?q=simmagic/);
    await expect(page.locator("main ul li").first()).toBeVisible({ timeout: 8000 });
  });
});
