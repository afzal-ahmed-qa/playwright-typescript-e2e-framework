import { test, expect } from '../../../fixtures';

test.describe('Alerts, Frames & Windows › Browser Windows', () => {
  test('TC-WN-01 new tab shows the sample page', { tag: '@smoke' }, async ({ browserWindowsPage }) => {
    await browserWindowsPage.open();

    const tab = await browserWindowsPage.openNewTab();

    await expect(tab).toHaveURL(/\/sample$/);
    await expect(tab.locator('#sampleHeading')).toHaveText('This is a sample page');
    await tab.close();
  });
});

test.describe('Alerts, Frames & Windows › Frames', () => {
  test('TC-FR-01 read text inside an iframe', async ({ framesPage }) => {
    await framesPage.open();

    await expect(framesPage.bigFrameHeading).toHaveText('This is a sample page');
  });
});
