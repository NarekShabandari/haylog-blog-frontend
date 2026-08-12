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

test.describe("Login page — submit button disabled state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/login");
  });

  test("Sign in button is disabled when both fields are empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });

  test("Sign in button is disabled when only email is filled", async ({ page }) => {
    await page.getByPlaceholder("you@example.com").fill("user@example.com");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });

  test("Sign in button is disabled when only password is filled", async ({ page }) => {
    await page.getByPlaceholder("••••••••").fill("secret123");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });

  test("Sign in button is enabled once both fields are filled", async ({ page }) => {
    await page.getByPlaceholder("you@example.com").fill("user@example.com");
    await page.getByPlaceholder("••••••••").fill("secret123");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });
});

test.describe("Login page — auth flow (network-intercepted)", () => {
  /**
   * These tests intercept the real API call so they work without a running
   * backend. They use Playwright's route() to mock the POST /auth/login
   * and GET /auth/me endpoints.
   */

  test("successful login redirects to the locale home page", async ({ page }) => {
    // Mock a successful login response
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "u1", name: "Alice", email: "alice@example.com" },
          token: "mock-jwt",
        }),
      })
    );

    await page.goto("/en/login");
    await page.getByPlaceholder("you@example.com").fill("alice@example.com");
    await page.getByPlaceholder("••••••••").fill("correctpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    // useLogin's onSuccess calls router.push(`/${locale}/`)
    await expect(page).toHaveURL(/\/en\/?$/, { timeout: 10000 });
  });

  test("Login nav link is hidden in the header after successful login", async ({ page }) => {
    // Mock both login and the subsequent /auth/me check
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "u1", name: "Alice", email: "alice@example.com" },
          token: "mock-jwt",
        }),
      })
    );
    await page.route("**/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "u1", name: "Alice", email: "alice@example.com" },
        }),
      })
    );

    await page.goto("/en/login");
    await page.getByPlaceholder("you@example.com").fill("alice@example.com");
    await page.getByPlaceholder("••••••••").fill("correctpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    // After redirect, the header should no longer show the Login link
    await page.waitForURL(/\/en\/?$/, { timeout: 10000 });
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Login" })
    ).not.toBeVisible();
  });

  test("invalid credentials shows the error banner", async ({ page }) => {
    // Mock a 401 response with an API error message
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid email or password" }),
      })
    );

    await page.goto("/en/login");
    await page.getByPlaceholder("you@example.com").fill("wrong@example.com");
    await page.getByPlaceholder("••••••••").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Error banner should appear with the API message
    await expect(
      page.getByText("Invalid email or password")
    ).toBeVisible({ timeout: 8000 });
  });

  test("error banner shows fallback text when API returns no message", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({}),
      })
    );

    await page.goto("/en/login");
    await page.getByPlaceholder("you@example.com").fill("user@example.com");
    await page.getByPlaceholder("••••••••").fill("anypassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(
      page.getByText("Invalid credentials")
    ).toBeVisible({ timeout: 8000 });
  });

  test("failed login does not navigate away from /en/login", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unauthorized" }),
      })
    );

    await page.goto("/en/login");
    await page.getByPlaceholder("you@example.com").fill("user@example.com");
    await page.getByPlaceholder("••••••••").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Should stay on the login page
    await expect(page).toHaveURL(/\/en\/login/, { timeout: 8000 });
  });

  test("shows 'Signing in...' spinner while the request is in-flight", async ({ page }) => {
    // Delay the response so the pending state is visible
    await page.route("**/auth/login", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "u1", name: "Alice", email: "alice@example.com" },
          token: "mock-jwt",
        }),
      });
    });

    await page.goto("/en/login");
    await page.getByPlaceholder("you@example.com").fill("alice@example.com");
    await page.getByPlaceholder("••••••••").fill("correctpassword");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText(/signing in/i)).toBeVisible({ timeout: 3000 });
  });
});
