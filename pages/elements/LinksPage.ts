import type { Locator, Page, Response } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LinksPage extends BasePage {
  protected readonly path = '/links';

  readonly responseMessage: Locator;
  private readonly homeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink = page.getByRole('link', { name: 'Home', exact: true });
    this.responseMessage = page.locator('#linkResponse');
  }

  async openHomeInNewTab(): Promise<Page> {
    const newTab = this.page.waitForEvent('popup');
    await this.homeLink.click();
    const tab = await newTab;
    await tab.waitForLoadState('domcontentloaded');
    return tab;
  }

  /** Clicks one of the "API call" links and returns the HTTP response it triggered. */
  async clickApiLink(name: string, endpoint: string): Promise<Response> {
    const response = this.page.waitForResponse((r) => r.url().endsWith(`/${endpoint}`));
    await this.page.getByRole('link', { name, exact: true }).click();
    return response;
  }
}
