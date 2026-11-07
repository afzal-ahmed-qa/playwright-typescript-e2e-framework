import type { Locator, Page } from '@playwright/test';

/** "Thanks for submitting the form" summary shown after the Practice Form is submitted. */
export class SubmissionModal {
  readonly root: Locator;
  readonly title: Locator;
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByRole('dialog');
    this.title = this.root.locator('.modal-title');
    this.closeButton = this.root.getByRole('button', { name: 'Close' });
  }

  valueFor(label: string): Locator {
    return this.root
      .locator('tbody tr')
      .filter({ has: this.page.getByRole('cell', { name: label, exact: true }) })
      .locator('td')
      .nth(1);
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async closeWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
