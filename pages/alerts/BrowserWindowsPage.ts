import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { SamplePage } from './SamplePage';

export class BrowserWindowsPage extends BasePage {
  protected readonly path = '/browser-windows';

  private readonly newTabButton: Locator;

  constructor(page: Page) {
    super(page);
    this.newTabButton = page.getByRole('button', { name: 'New Tab' });
  }

  async openNewTab(): Promise<SamplePage> {
    const newPage = this.page.context().waitForEvent('page');
    await this.newTabButton.click();
    const tab = await newPage;
    await tab.waitForLoadState('domcontentloaded');
    return new SamplePage(tab);
  }
}
