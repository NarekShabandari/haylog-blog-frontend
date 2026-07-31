import { test, expect } from "@playwright/test";

/**
 * Language switching e2e tests.
 *
 * Verifies that the LanguageSwitcher correctly changes the URL prefix and
 * that the page content updates to the selected locale.
 */

test.describe("Language switcher", () => {
  test("EN button is highlighted on /en pages", async ({ page }) => {
    await page.goto("/en");
    const enBtn = page.getByRole("button", { name: /switch to english/i });
    await expect(enBtn).toBeVisible();
    // Active locale has bg-accent class (text is "EN")
    await expect(enBtn).toHaveText("EN");
    const cls = await enBtn.getAttribute("class");
    expect(cls).toContain("bg-accent");
  });

  test("ՀԱՅ button is highlighted on /hy pages", async ({ page }) => {
    await page.goto("/hy");
    const hyBtn = page.getByRole("button", { name: /switch to armenian/i });
    await expect(hyBtn).toBeVisible();
    await expect(hyBtn).toHaveText("ՀԱՅ");
    const cls = await hyBtn.getAttribute("class");
    expect(cls).toContain("bg-accent");
  });

  test("clicking ՀԱՅ from /en navigates to /hy", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: /switch to armenian/i }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/hy/, {
      timeout: 8000,
    });
  });

  test("clicking EN from /hy navigates to /en", async ({ page }) => {
    await page.goto("/hy");
    await page.getByRole("button", { name: /switch to english/i }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/en/, {
      timeout: 8000,
    });
  });

  test("language switch on /en/about navigates to /hy/about", async ({
    page,
  }) => {
    await page.goto("/en/about");
    await page.getByRole("button", { name: /switch to armenian/i }).click();
    await expect(page).toHaveURL(/\/hy\/about/, { timeout: 8000 });
  });

  test("language switch on /hy/about navigates to /en/about", async ({
    page,
  }) => {
    await page.goto("/hy/about");
    await page.getByRole("button", { name: /switch to english/i }).click();
    await expect(page).toHaveURL(/\/en\/about/, { timeout: 8000 });
  });

  test("about page content changes locale after switching", async ({
    page,
  }) => {
    await page.goto("/en/about");
    await expect(
      page.getByRole("heading", { name: "How this blog works" })
    ).toBeVisible();

    await page.getByRole("button", { name: /switch to armenian/i }).click();
    await expect(page).toHaveURL(/\/hy\/about/, { timeout: 8000 });
    await expect(
      page.getByRole("heading", { name: "Ինչպես է աշխատում այս բլոգը" })
    ).toBeVisible({ timeout: 8000 });
  });
});
