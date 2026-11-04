import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LinksPage extends BasePage {
  protected readonly path = '/links';

  readonly homeLink: Locator;
  readonly response: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink = page.getByRole('link', { name: 'Home', exact: true });
    this.response = page.locator('#linkResponse');
  }

  apiLink(name: string): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  /** Clicks "Home" and returns the new tab it opens. */
  async openHomeInNewTab(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.homeLink.click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }
}
