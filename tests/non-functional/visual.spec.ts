import { test, expect } from '../../fixtures';

/**
 * Visual regression. The first run creates a baseline screenshot in
 * visual.spec.ts-snapshots/. Later runs compare against it.
 * Baselines depend on the OS and browser, so this only runs on Chromium.
 * Refresh it with: npx playwright test --grep @visual --update-snapshots
 */
test.describe('Non-functional › Visual', () => {
  test('TC-NF-01 practice form layout', { tag: '@visual' }, async ({ practiceFormPage, page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Baseline is kept for Chromium only');

    await practiceFormPage.open();
    await page.evaluate(() => document.fonts.ready);

    await expect(practiceFormPage.form).toHaveScreenshot('practice-form.png', {
      mask: [practiceFormPage.dateOfBirth], // shows today's date, so it changes every day
      maxDiffPixelRatio: 0.01,
    });
  });
});
