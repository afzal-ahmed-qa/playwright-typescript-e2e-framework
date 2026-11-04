import { test, expect } from '../../../fixtures';

// Each link calls an endpoint that answers with a fixed HTTP status.
const apiLinks = [
  { name: 'Created', endpoint: 'created', status: 201, statusText: 'Created' },
  { name: 'No Content', endpoint: 'no-content', status: 204, statusText: 'No Content' },
  { name: 'Moved', endpoint: 'moved', status: 301, statusText: 'Moved Permanently' },
  { name: 'Bad Request', endpoint: 'bad-request', status: 400, statusText: 'Bad Request' },
  { name: 'Unauthorized', endpoint: 'unauthorized', status: 401, statusText: 'Unauthorized' },
  { name: 'Forbidden', endpoint: 'forbidden', status: 403, statusText: 'Forbidden' },
  { name: 'Not Found', endpoint: 'invalid-url', status: 404, statusText: 'Not Found' },
];

test.describe('Elements › Links', () => {
  test.beforeEach(async ({ linksPage }) => {
    await linksPage.open();
  });

  test('TC-LK-01 "Home" link opens the home page in a new tab', { tag: '@smoke' }, async ({ linksPage, page }) => {
    const newTab = await linksPage.openHomeInNewTab();

    await expect(newTab).toHaveURL('https://demoqa.com/');
    await expect(page).toHaveURL(/\/links$/); // original tab is unchanged
    await newTab.close();
  });

  for (const link of apiLinks) {
    test(`TC-LK-02 "${link.name}" link shows HTTP ${link.status}`, async ({ linksPage, page }) => {
      const responsePromise = page.waitForResponse((r) => r.url().endsWith(`/${link.endpoint}`));
      await linksPage.apiLink(link.name).click();
      const response = await responsePromise;

      expect(response.status()).toBe(link.status);
      // The site's message has a typo ("staus"), so accept either spelling.
      await expect(linksPage.response).toHaveText(
        new RegExp(`responded with stat?us ${link.status} and status text ${link.statusText}`),
      );
    });
  }
});
