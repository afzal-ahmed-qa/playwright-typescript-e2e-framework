import { test, expect } from '../../../fixtures';

// The page changes these buttons 5 seconds after it loads. Instead of a fixed
// sleep, we rely on Playwright's auto-retrying assertions with a longer timeout.
const AFTER_DELAY = { timeout: 10_000 };

test.describe('Elements › Dynamic Properties', () => {
  test.beforeEach(async ({ dynamicPropertiesPage }) => {
    await dynamicPropertiesPage.open();
  });

  test('TC-DP-01 button becomes enabled after a delay', async ({ dynamicPropertiesPage }) => {
    await expect(dynamicPropertiesPage.enableAfterButton).toBeDisabled();

    await expect(dynamicPropertiesPage.enableAfterButton).toBeEnabled(AFTER_DELAY);
  });

  test('TC-DP-02 button appears after a delay', async ({ dynamicPropertiesPage }) => {
    await expect(dynamicPropertiesPage.visibleAfterButton).toBeHidden();

    await expect(dynamicPropertiesPage.visibleAfterButton).toBeVisible(AFTER_DELAY);
  });
});
