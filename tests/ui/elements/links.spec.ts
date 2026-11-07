import { test, expect } from '../../../fixtures';

const apiLinks = [
  { link: 'Created', endpoint: 'created', status: 201, statusText: 'Created' },
  { link: 'No Content', endpoint: 'no-content', status: 204, statusText: 'No Content' },
  { link: 'Moved', endpoint: 'moved', status: 301, statusText: 'Moved Permanently' },
  { link: 'Bad Request', endpoint: 'bad-request', status: 400, statusText: 'Bad Request' },
  { link: 'Unauthorized', endpoint: 'unauthorized', status: 401, statusText: 'Unauthorized' },
  { link: 'Forbidden', endpoint: 'forbidden', status: 403, statusText: 'Forbidden' },
  { link: 'Not Found', endpoint: 'invalid-url', status: 404, statusText: 'Not Found' },
];

test.describe('Links', () => {
  test.beforeEach(async ({ linksPage }) => {
    await linksPage.open();
  });

  test('TC-LK-01 "Home" opens the home page in a new tab', { tag: '@smoke' }, async ({ linksPage, page }) => {
    const newTab = await linksPage.openHomeInNewTab();

    await expect(newTab).toHaveURL('https://demoqa.com/');
    await expect(page).toHaveURL(/\/links$/);
    await newTab.close();
  });

  for (const { link, endpoint, status, statusText } of apiLinks) {
    test(`TC-LK-02 "${link}" reports HTTP ${status}`, async ({ linksPage }) => {
      const response = await linksPage.clickApiLink(link, endpoint);

      expect(response.status()).toBe(status);
      // the site spells it "staus" (DEF-003), accept either
      await expect(linksPage.responseMessage).toHaveText(
        new RegExp(`responded with stat?us ${status} and status text ${statusText}`),
      );
    });
  }
});
