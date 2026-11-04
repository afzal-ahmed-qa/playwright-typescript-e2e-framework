import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BooksPage extends BasePage {
  protected readonly path = '/books';

  readonly searchBox: Locator;
  readonly bookTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('#searchBox');
    this.bookTitles = page.locator('table tbody tr td:nth-child(2)');
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }
}
