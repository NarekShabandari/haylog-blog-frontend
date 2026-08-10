import { test, expect } from "@playwright/test";

/**
 * Login page e2e tests — /en/login and /hy/login
 *
 * Covers:
 *  - Nav "Login" link is present and navigates correctly
 *  - Login page renders expected UI elements
 *  - Password visibility toggle works
 *  - "Back to blog" link navigates home
 *  - Armenian locale renders correctly
 */

test.describe("Nav Login link", () => {
  test("Login link is visible in the header on /en", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Login" })
    ).toBeVisible();
  });

  test("Login link is visible in the header on /hy", async ({ page }) => {
    await page.goto("/hy");
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Մուտք" })
    ).toBeVisible();
  });

  test("clicking Login link navigates to /en/login", async ({ page }) => {
    await page.goto("/en");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Login" })
      .click();
    await expect(page).toHaveURL(/\/en\/login/, { timeout: 8000 });
  });

  test("clicking Login link navigates to /hy/login from Armenian locale", async ({
    page,
  }) => {
    await page.goto("/hy");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Մուտք" })
      .click();
    await expect(page).toHaveURL(/\/hy\/login/, { timeout: 8000 });
  });
});

test.describe("Login page (/en/login)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
  });

  test("renders the Sign in heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Sign in" })
    ).toBeVisible();
  });

  test("renders email input", async ({ page }) => {
    const emailInput = page.getByPlaceholder("you@example.com");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("type", "email");
  });

  test("renders password input", async ({ page }) => {
    const passwordInput = page.getByPlaceholder("••••••••");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("renders the Sign in submit button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Sign in" })
    ).toBeVisible();
  });

  test("password visibility toggle switches input type", async ({ page }) => {
    const passwordInput = page.getByPlaceholder("••••••••");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Click the visibility toggle (eye icon button — only button that isn't "Sign in")
    const toggleBtn = page.locator('button[type="button"]:not([class*="w-full"])').first();
    await toggleBtn.click();

    await expect(passwordInput).toHaveAttribute("type", "text");
  });

  test("accepts typed email and password values", async ({ page }) => {
    await page.getByPlaceholder("you@example.com").fill("user@example.com");
    await page.getByPlaceholder("••••••••").fill("secret123");

    await expect(page.getByPlaceholder("you@example.com")).toHaveValue("user@example.com");
    await expect(page.getByPlaceholder("••••••••")).toHaveValue("secret123");
  });

  test("'back to blog' link points to /en", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back to blog/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/en");
  });

  test("clicking 'back to blog' navigates to home", async ({ page }) => {
    await page.getByRole("link", { name: /back to blog/i }).click();
    await expect(page).toHaveURL(/\/en$|\/en\//, { timeout: 8000 });
  });

  test("header and footer are present", async ({ page }) => {
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("logo is visible on the login page", async ({ page }) => {
    // Logo renders inside the page (not just the header) on the login page
    await expect(page.getByRole("link", { name: /hay.*log/i }).first()).toBeVisible();
  });
});

test.describe("Login page (/hy/login)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hy/login");
  });

  test("renders the Sign in heading in Armenian locale", async ({ page }) => {
    // The heading text is hard-coded English ("Sign in") — no i18n key used
    await expect(
      page.getByRole("heading", { level: 1, name: "Sign in" })
    ).toBeVisible();
  });

  test("'back to blog' link points to /hy", async ({ page }) => {
    const backLink = page.getByRole("link", { name: /back to blog/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/hy");
  });

  test("Armenian nav Login label is active on /hy/login", async ({ page }) => {
    // The header nav link reads "Մուտք" in Armenian locale
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Մուտք" })
    ).toBeVisible();
  });
});
