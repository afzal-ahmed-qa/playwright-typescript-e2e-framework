import { test, expect, type Page } from '@playwright/test';

/**
 * DemoQA "Buttons" page: https://demoqa.com/buttons
 * Verifies that each button responds to its matching mouse interaction
 * (double click, right click, single click) with the correct message.
 */

async function blockAds(page: Page) {
  // demoqa.com serves heavy third-party ads that slow down and destabilise tests.
  await page.route(/googlesyndication|doubleclick|adservice|adplus|pubads/, (route) => route.abort());
}

test.describe('Buttons page', () => {
  test.beforeEach(async ({ page }) => {
    await blockAds(page);
    await page.goto('/buttons', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/buttons$/);
  });

  test('double click shows the double click message', async ({ page }) => {
    await page.getByRole('button', { name: 'Double Click Me' }).dblclick();

    await expect(page.locator('#doubleClickMessage')).toHaveText('You have done a double click');
    await expect(page.locator('#rightClickMessage')).toBeHidden();
    await expect(page.locator('#dynamicClickMessage')).toBeHidden();
  });

  test('right click shows the right click message', async ({ page }) => {
    await page.getByRole('button', { name: 'Right Click Me' }).click({ button: 'right' });

    await expect(page.locator('#rightClickMessage')).toHaveText('You have done a right click');
    await expect(page.locator('#doubleClickMessage')).toBeHidden();
    await expect(page.locator('#dynamicClickMessage')).toBeHidden();
  });

  test('single click shows the dynamic click message', async ({ page }) => {
    await page.getByRole('button', { name: 'Click Me', exact: true }).click();

    await expect(page.locator('#dynamicClickMessage')).toHaveText('You have done a dynamic click');
    await expect(page.locator('#doubleClickMessage')).toBeHidden();
    await expect(page.locator('#rightClickMessage')).toBeHidden();
  });

  test('a single click on "Double Click Me" shows no message', async ({ page }) => {
    await page.getByRole('button', { name: 'Double Click Me' }).click();

    await expect(page.locator('#doubleClickMessage')).toBeHidden();
  });
});
