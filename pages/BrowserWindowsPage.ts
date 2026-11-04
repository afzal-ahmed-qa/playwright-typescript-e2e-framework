import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BrowserWindowsPage extends BasePage {
  protected readonly path = '/browser-windows';

  readonly newTabButton: Locator;

  constructor(page: Page) {
    super(page);
    this.newTabButton = page.getByRole('button', { name: 'New Tab' });
  }

  /** Clicks "New Tab" and returns the tab it opens. */
  async openNewTab(): Promise<Page> {
    const tabPromise = this.page.context().waitForEvent('page');
    await this.newTabButton.click();
    const tab = await tabPromise;
    await tab.waitForLoadState('domcontentloaded');
    return tab;
  }
}
