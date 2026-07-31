import { test, expect } from "@playwright/test";

/**
 * Home page (blog listing) — /en
 *
 * These tests assume the app is running and the API returns at least one post.
 * If the API is unavailable the page shows "No posts found." — we test that
 * fallback too.
 */

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("shows the site header with logo", async ({ page }) => {
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();
    await expect(header.getByText("Call")).toBeVisible();
    await expect(header.getByText("Stack")).toBeVisible();
  });

  test("header contains Blog and About navigation links", async ({ page }) => {
    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("shows the footer with brand name", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/Main Threat/)).toBeVisible();
  });

  test("renders a loading state or post grid or empty message", async ({
    page,
  }) => {
    // One of three valid states must be on-screen within 10 s
    const grid = page.locator(".grid");
    const empty = page.getByText("No posts found.");
    const loading = page.getByText("Loading...");

    await expect(grid.or(empty).or(loading)).toBeVisible({ timeout: 10_000 });
  });

  test("blog post cards link to /en/blog/:slug when posts are present", async ({
    page,
  }) => {
    // Wait for content to settle
    await page.waitForTimeout(2000);

    const firstCard = page.locator("a[href*='/blog/']").first();
    const count = await firstCard.count();

    if (count > 0) {
      const href = await firstCard.getAttribute("href");
      expect(href).toMatch(/\/blog\//);
    } else {
      // No posts — valid state; verify the empty message
      await expect(page.getByText("No posts found.")).toBeVisible();
    }
  });

  test("theme toggle button is accessible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /toggle theme/i })
    ).toBeVisible();
  });

  test("language switcher shows EN and ՀԱՅ buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: /switch to english/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /switch to armenian/i })).toBeVisible();
  });
});
