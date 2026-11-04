import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if test.only was left in the source code. */
  forbidOnly: isCI,
  /* demoqa.com is a shared public site, so allow retries on CI for network hiccups. */
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  /*
   * Locally: an HTML report in playwright-report/.
   * On CI: each job writes a "blob" report; the workflow merges them into one
   * HTML report and publishes it to GitHub Pages.
   */
  reporter: isCI ? [['list'], ['blob'], ['github']] : [['list'], ['html', { open: 'never' }]],

  /* Visual baselines are OS-specific and kept for local (Windows) runs only. */
  grepInvert: isCI ? /@visual/ : undefined,

  use: {
    baseURL: process.env.BASE_URL ?? 'https://demoqa.com',
    /* Evidence for every test, embedded in the HTML report. */
    screenshot: 'on',
    video: 'on',
    /* Step-by-step trace (DOM, network, console) whenever a test fails. */
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
    },
    {
      name: 'chromium',
      testIgnore: 'api/**',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
