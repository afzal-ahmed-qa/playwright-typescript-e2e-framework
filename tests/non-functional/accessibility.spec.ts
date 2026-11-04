import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures';

/**
 * Critical axe rules DemoQA already breaks, tracked in docs/defects.md.
 * - label (DEF-001): <label> elements are not linked to their inputs.
 */
const KNOWN_VIOLATIONS = ['label'];

test.describe('Non-functional › Accessibility (Text Box)', () => {
  test.beforeEach(async ({ textBoxPage }) => {
    await textBoxPage.open();
  });

  test('TC-NF-02 form can be completed with the keyboard only', { tag: '@a11y' }, async ({ textBoxPage, page }) => {
    await textBoxPage.fullName.focus();
    await page.keyboard.type('Keyboard User');
    await page.keyboard.press('Tab');
    await expect(textBoxPage.email).toBeFocused();
    await page.keyboard.type('keyboard@example.com');
    await page.keyboard.press('Tab');
    await expect(textBoxPage.currentAddress).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(textBoxPage.permanentAddress).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(textBoxPage.submitButton).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(textBoxPage.outputName).toHaveText('Name:Keyboard User');
  });

  test('TC-NF-02 automated axe scan has no critical violations', { tag: '@a11y' }, async ({ page }, testInfo) => {
    const results = await new AxeBuilder({ page })
      .include('#userForm')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Attach the full report to the HTML report for review.
    await testInfo.attach('axe-results', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });

    // Known, already-reported issues are allowed so the test catches NEW regressions.
    const critical = results.violations
      .filter((v) => v.impact === 'critical')
      .filter((v) => !KNOWN_VIOLATIONS.includes(v.id));
    expect(critical.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
