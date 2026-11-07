import { test, expect } from '../../../fixtures';

test('TC-WN-01 "New Tab" opens the sample page', { tag: '@smoke' }, async ({ browserWindowsPage }) => {
  await browserWindowsPage.open();

  const tab = await browserWindowsPage.openNewTab();

  await expect(tab.page).toHaveURL(/\/sample$/);
  await expect(tab.heading).toHaveText('This is a sample page');
  await tab.close();
});

test('TC-FR-01 content inside an iframe can be read', async ({ framesPage }) => {
  await framesPage.open();

  await expect(framesPage.largeFrameHeading).toHaveText('This is a sample page');
});
