import { test, expect } from "@playwright/test";

/**
 * Blog post page — /en/blog/:slug
 *
 * Strategy: navigate to the home page, pick the first card link and follow it.
 * If no posts exist we skip gracefully. All assertions target the post detail UI.
 */

test.describe("Blog post page", () => {
  test("renders loading skeleton then post content", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(2000);

    const firstLink = page.locator("a[href*='/blog/']").first();
    if ((await firstLink.count()) === 0) {
      test.skip(); // no posts available — skip
      return;
    }

    await firstLink.click();

    // Should either show skeleton or resolved post
    const skeleton = page.locator(".animate-pulse");
    const heading = page.getByRole("heading", { level: 1 });

    await expect(skeleton.or(heading)).toBeVisible({ timeout: 10_000 });

    // Wait for heading to appear (skeleton should disappear)
    await expect(heading).toBeVisible({ timeout: 15_000 });
  });

  test("post page URL contains /blog/", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(2000);

    const firstLink = page.locator("a[href*='/blog/']").first();
    if ((await firstLink.count()) === 0) {
      test.skip();
      return;
    }

    await firstLink.click();
    await expect(page).toHaveURL(/\/blog\//);
  });

  test("post page shows author name and date", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(2000);

    const firstLink = page.locator("a[href*='/blog/']").first();
    if ((await firstLink.count()) === 0) {
      test.skip();
      return;
    }

    await firstLink.click();
    // Wait for the post to fully load
    await page.getByRole("heading", { level: 1 }).waitFor({ timeout: 15_000 });

    // Author block: small avatar + name paragraph
    const authorName = page.locator("p.text-sm.font-medium");
    await expect(authorName.first()).toBeVisible();

    // Date — formatted as "Month DD, YYYY"
    const dateEl = page.locator("p.font-mono.text-xs");
    await expect(dateEl.first()).toBeVisible();
  });

  test("post page has markdown content area", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(2000);

    const firstLink = page.locator("a[href*='/blog/']").first();
    if ((await firstLink.count()) === 0) {
      test.skip();
      return;
    }

    await firstLink.click();
    await page.getByRole("heading", { level: 1 }).waitFor({ timeout: 15_000 });

    // The prose wrapper exists
    await expect(page.locator(".prose")).toBeVisible();
  });

  test("header and footer are present on post page", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(2000);

    const firstLink = page.locator("a[href*='/blog/']").first();
    if ((await firstLink.count()) === 0) {
      test.skip();
      return;
    }

    await firstLink.click();
    await page.getByRole("heading", { level: 1 }).waitFor({ timeout: 15_000 });

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("returns 404 for a non-existent slug", async ({ page }) => {
    const response = await page.goto("/en/blog/this-post-does-not-exist-xyz");
    // Next.js notFound() results in a 404
    expect(response?.status()).toBe(404);
  });
});
