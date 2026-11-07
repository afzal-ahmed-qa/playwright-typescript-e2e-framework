import { test, expect } from '../../fixtures';

// Baselines are OS-specific (fonts render differently), so this is excluded on CI.
// After an intentional UI change: npm run test:visual:update
test('TC-NF-01 practice form looks the same as the baseline', { tag: '@visual' }, async ({
  practiceFormPage,
  page,
  headless,
}) => {
  test.skip(!headless, 'baseline was captured headless; headed Chrome renders slightly differently');

  await practiceFormPage.open();
  await page.evaluate(() => document.fonts.ready);

  await expect(practiceFormPage.form).toHaveScreenshot('practice-form.png', {
    mask: [practiceFormPage.dateOfBirth], // defaults to today's date
    maxDiffPixelRatio: 0.01,
  });
});
