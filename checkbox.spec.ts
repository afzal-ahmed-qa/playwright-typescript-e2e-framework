import { test, expect, type Page } from '@playwright/test';

/**
 * DemoQA "Check Box" page: https://demoqa.com/checkbox
 * Verifies that ticking a folder in the tree selects it and all of its
 * children, and that the selection summary reflects this.
 */

async function blockAds(page: Page) {
  // demoqa.com serves heavy third-party ads that slow down and destabilise tests.
  await page.route(/googlesyndication|doubleclick|adservice|adplus|pubads/, (route) => route.abort());
}

const checkbox = (page: Page, name: string) => page.getByRole('checkbox', { name: `Select ${name}` });

test.describe('Check Box page', () => {
  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await page.goto('/checkbox', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/checkbox$/);

    // Expand the root "Home" node so its children are visible.
    const homeNode = page.getByRole('treeitem').filter({ has: checkbox(page, 'Home') });
    await homeNode.locator('.rc-tree-switcher').click();
    await expect(homeNode).toHaveAttribute('aria-expanded', 'true');
    await expect(checkbox(page, 'Desktop')).toBeVisible();
  });

  test('nothing is selected by default', async ({ page }) => {
    await expect(checkbox(page, 'Home')).not.toBeChecked();
    await expect(checkbox(page, 'Desktop')).not.toBeChecked();
    await expect(page.locator('#result')).toBeHidden();
  });

  test('ticking "Desktop" selects it and its children', async ({ page }) => {
    await checkbox(page, 'Desktop').click();

    await expect(checkbox(page, 'Desktop')).toBeChecked();
    // Parent becomes partially selected; siblings stay unselected.
    await expect(checkbox(page, 'Home')).toHaveAttribute('aria-checked', 'mixed');
    await expect(checkbox(page, 'Documents')).not.toBeChecked();
    await expect(checkbox(page, 'Downloads')).not.toBeChecked();

    const result = page.locator('#result');
    await expect(result).toContainText('You have selected :');
    await expect(result.locator('.text-success')).toHaveText(['desktop', 'notes', 'commands']);
  });

  test('unticking "Desktop" clears the selection', async ({ page }) => {
    await checkbox(page, 'Desktop').click();
    await expect(checkbox(page, 'Desktop')).toBeChecked();

    await checkbox(page, 'Desktop').click();

    await expect(checkbox(page, 'Desktop')).not.toBeChecked();
    await expect(checkbox(page, 'Home')).not.toBeChecked();
    await expect(page.locator('#result')).toBeHidden();
  });
});
