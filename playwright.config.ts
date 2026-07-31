import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for blog-frontend e2e tests.
 *
 * Run against a locally built + started production server:
 *   npm run build && npm run start
 *   npm run test:e2e
 *
 * Or let Playwright start the server automatically by uncommenting the
 * webServer block below.
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  /* Run each test file in parallel */
  fullyParallel: true,
  /* Fail the build on CI if test.only is accidentally left in source */
  forbidOnly: !!process.env.CI,
  /* Retry once on CI */
  retries: process.env.CI ? 1 : 0,
  /* Limit workers on CI to avoid flakiness */
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,
    /* Collect trace on first retry to help debug CI failures */
    trace: "on-first-retry",
    /* Screenshot only on failure */
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Uncomment to start the server automatically before running tests:
  webServer: {
    command: "npm run start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  */
});
