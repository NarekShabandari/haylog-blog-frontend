import { test, expect } from "@playwright/test";

/**
 * Theme toggle e2e tests.
 *
 * The toggle adds/removes the "dark" class on <html> and persists the
 * preference in localStorage.
 */

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Clear saved theme so each test starts from a clean slate
    await page.goto("/en");
    await page.evaluate(() => localStorage.removeItem("theme"));
    // Reload so the component mounts fresh without a saved preference
    await page.reload();
  });

  test("toggle button is visible and accessible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /toggle theme/i })
    ).toBeVisible();
  });

  test("clicking toggle once adds dark class to <html>", async ({ page }) => {
    // Start from light (no dark class)
    const htmlClass = await page.locator("html").getAttribute("class");
    const startedDark = htmlClass?.includes("dark") ?? false;

    await page.getByRole("button", { name: /toggle theme/i }).click();

    if (startedDark) {
      // Was dark → now should be light
      await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    } else {
      // Was light → now should be dark
      await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    }
  });

  test("clicking toggle twice returns to original state", async ({ page }) => {
    const before = await page.locator("html").getAttribute("class");
    const wasDark = before?.includes("dark") ?? false;

    const btn = page.getByRole("button", { name: /toggle theme/i });
    await btn.click();
    await btn.click();

    const after = await page.locator("html").getAttribute("class");
    const isDarkNow = after?.includes("dark") ?? false;

    expect(isDarkNow).toBe(wasDark);
  });

  test("persists dark preference in localStorage", async ({ page }) => {
    // Force light start
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();

    await page.getByRole("button", { name: /toggle theme/i }).click();

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("dark");
  });

  test("persists light preference in localStorage after toggling back", async ({
    page,
  }) => {
    await page.evaluate(() => localStorage.setItem("theme", "dark"));
    await page.reload();

    await page.getByRole("button", { name: /toggle theme/i }).click();

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("light");
  });

  test("dark theme persists across page navigations", async ({ page }) => {
    // Switch to dark
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();
    await page.getByRole("button", { name: /toggle theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    // Navigate to about page
    await page.goto("/en/about");

    // html should still have dark class because localStorage persisted it
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });
});
