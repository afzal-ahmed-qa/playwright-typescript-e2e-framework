import type { Locator, Page } from '@playwright/test';
import { BasePage, type DialogInfo } from '../BasePage';

/** Details of a single book, reached from the store at /books?search=<isbn>. */
export class BookDetailPage extends BasePage {
  protected readonly path = '/books';

  readonly isbn: Locator;
  readonly title: Locator;
  readonly author: Locator;
  readonly publisher: Locator;
  private readonly addToCollectionButton: Locator;
  private readonly backToStoreButton: Locator;

  constructor(page: Page) {
    super(page);
    const value = (wrapperId: string) => page.locator(`#${wrapperId}-wrapper #userName-value`);
    this.isbn = value('ISBN');
    this.title = value('title');
    this.author = value('author');
    this.publisher = value('publisher');
    this.addToCollectionButton = page.getByRole('button', { name: 'Add To Your Collection' });
    this.backToStoreButton = page.getByRole('button', { name: 'Back To Book Store' });
  }

  /** Returns the alert the site shows, e.g. "Book added to your collection." */
  addToCollection(): Promise<DialogInfo> {
    return this.handleDialog(() => this.addToCollectionButton.click());
  }

  async backToStore(): Promise<void> {
    await this.backToStoreButton.click();
  }
}
