import type { Locator, Page } from '@playwright/test';

/** The small OK / Cancel modal the Book Store shows before deleting something. */
export class ConfirmDialog {
  readonly root: Locator;
  readonly title: Locator;
  readonly message: Locator;
  private readonly okButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('dialog');
    this.title = this.root.locator('.modal-title');
    this.message = this.root.locator('.modal-body');
    this.okButton = this.root.locator('#closeSmallModal-ok');
    this.cancelButton = this.root.locator('#closeSmallModal-cancel');
  }

  async confirm(): Promise<void> {
    await this.okButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
