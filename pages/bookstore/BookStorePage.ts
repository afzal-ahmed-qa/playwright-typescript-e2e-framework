import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BookStorePage extends BasePage {
  protected readonly path = '/books';

  readonly bookTitles: Locator;
  readonly loggedInUser: Locator;
  private readonly searchBox: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('#searchBox');
    this.bookTitles = page.locator('table tbody tr td:nth-child(2)');
    this.loggedInUser = page.locator('#userName-value');
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  async openBook(title: string): Promise<void> {
    await this.page.getByRole('link', { name: title, exact: true }).click();
  }
}
