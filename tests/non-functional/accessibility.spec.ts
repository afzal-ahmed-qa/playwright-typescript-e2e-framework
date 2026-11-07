import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures';

// Critical issues already logged in docs/defects.md. Anything else makes the scan fail.
const KNOWN_VIOLATIONS = ['label']; // DEF-001

test.describe('Accessibility: Text Box', { tag: '@a11y' }, () => {
  test.beforeEach(async ({ textBoxPage }) => {
    await textBoxPage.open();
  });

  test('TC-NF-02 the form can be completed with the keyboard alone', async ({ textBoxPage }) => {
    await textBoxPage.submitDetailsWithKeyboard({ fullName: 'Keyboard User', email: 'keyboard@example.com' });

    await expect(textBoxPage.outputName).toHaveText('Name:Keyboard User');
    await expect(textBoxPage.outputEmail).toHaveText('Email:keyboard@example.com');
  });

  test('TC-NF-02 axe finds no new critical WCAG issues', async ({ page }, testInfo) => {
    const results = await new AxeBuilder({ page }).include('#userForm').withTags(['wcag2a', 'wcag2aa']).analyze();

    await testInfo.attach('axe-violations.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const newCritical = results.violations
      .filter((v) => v.impact === 'critical' && !KNOWN_VIOLATIONS.includes(v.id))
      .map((v) => `${v.id}: ${v.help}`);
    expect(newCritical).toEqual([]);
  });
});
