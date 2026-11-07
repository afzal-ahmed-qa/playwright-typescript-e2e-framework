import { test, expect } from '../../../fixtures';

// No sleeps here: the assertions keep retrying until the change happens or 10s pass.
const AFTER_FIVE_SECONDS = { timeout: 10_000 };

test.describe('Dynamic Properties', () => {
  test.beforeEach(async ({ dynamicPropertiesPage }) => {
    await dynamicPropertiesPage.open();
  });

  test('TC-DP-01 button is enabled after a delay', async ({ dynamicPropertiesPage }) => {
    await expect(dynamicPropertiesPage.enableAfterButton).toBeDisabled();
    await expect(dynamicPropertiesPage.enableAfterButton).toBeEnabled(AFTER_FIVE_SECONDS);
  });

  test('TC-DP-02 button appears after a delay', async ({ dynamicPropertiesPage }) => {
    await expect(dynamicPropertiesPage.visibleAfterButton).toBeHidden();
    await expect(dynamicPropertiesPage.visibleAfterButton).toBeVisible(AFTER_FIVE_SECONDS);
  });
});
