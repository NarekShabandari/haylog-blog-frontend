import { test, expect } from "@playwright/test";

/**
 * About page — /en/about and /hy/about
 */

test.describe("About page (English)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/about");
  });

  test("page title is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "How this blog works" })
    ).toBeVisible();
  });

  test("shows the 'About this blog' tag badge", async ({ page }) => {
    await expect(page.getByText("About this blog")).toBeVisible();
  });

  test("shows lede paragraph about AI", async ({ page }) => {
    await expect(
      page.getByText(/technical blog covering web development/i)
    ).toBeVisible();
  });

  test("shows the transparency notice section", async ({ page }) => {
    await expect(page.getByText("Transparency notice")).toBeVisible();
    await expect(
      page.getByText(/drafted using AI language models/i)
    ).toBeVisible();
  });

  test("shows Why AI-assisted section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Why AI-assisted" })).toBeVisible();
  });

  test("shows Our process section with 3 steps", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Our process" })).toBeVisible();
    await expect(page.getByText(/Topic research/i)).toBeVisible();
    await expect(page.getByText(/AI drafting/i)).toBeVisible();
    await expect(page.getByText(/Human review/i)).toBeVisible();
  });

  test("shows Found an error section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Found an error?" })).toBeVisible();
  });

  test("header and footer render", async ({ page }) => {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
});

test.describe("About page (Armenian)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hy/about");
  });

  test("shows Armenian page title", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Ինչպես է աշխատում այս բլոգը",
      })
    ).toBeVisible();
  });

  test("shows Armenian tag badge", async ({ page }) => {
    await expect(page.getByText("Բլոգի մասին")).toBeVisible();
  });

  test("shows Armenian transparency notice", async ({ page }) => {
    await expect(page.getByText("Թափանցիկության ծանուցում")).toBeVisible();
  });
});
