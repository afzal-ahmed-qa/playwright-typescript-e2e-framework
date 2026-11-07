import type { Locator, Page } from '@playwright/test';
import { BasePage, type DialogInfo } from '../BasePage';
import { ConfirmDialog } from '../components/ConfirmDialog';

export class ProfilePage extends BasePage {
  protected readonly path = '/profile';

  readonly userName: Locator;
  readonly bookTitles: Locator;
  readonly notLoggedInMessage: Locator;
  readonly confirmDialog: ConfirmDialog;

  private readonly logoutButton: Locator;
  private readonly goToStoreButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userName = page.locator('#userName-value');
    this.bookTitles = page.locator('table tbody tr td:nth-child(2)');
    this.notLoggedInMessage = page.getByText('Currently you are not logged into the Book Store application');
    this.confirmDialog = new ConfirmDialog(page);
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.goToStoreButton = page.getByRole('button', { name: 'Go To Book Store' });
  }

  async goToBookStore(): Promise<void> {
    await this.goToStoreButton.click();
  }

  async requestBookDeletion(title: string): Promise<void> {
    await this.page.locator('table tbody tr').filter({ hasText: title }).getByTitle('Delete').click();
  }

  /** Confirms the delete modal; the site then shows a native "Book deleted." alert. */
  confirmBookDeletion(): Promise<DialogInfo> {
    return this.handleDialog(() => this.confirmDialog.confirm());
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
