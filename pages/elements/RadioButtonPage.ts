import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export type Answer = 'Yes' | 'Impressive' | 'No';

export class RadioButtonPage extends BasePage {
  protected readonly path = '/radio-button';

  readonly selectedAnswer: Locator;

  constructor(page: Page) {
    super(page);
    this.selectedAnswer = page.locator('p', { hasText: 'You have selected' }).locator('.text-success');
  }

  radio(answer: Answer): Locator {
    return this.page.getByRole('radio', { name: answer });
  }

  async choose(answer: Answer): Promise<void> {
    // The input itself is hidden behind a styled label, which is what a user clicks.
    await this.page.locator('label', { hasText: answer }).click();
  }

  /** Clicks the input directly, bypassing Playwright's enabled check, to prove the browser blocks it. */
  async tryToChooseDisabled(answer: Answer): Promise<void> {
    await this.radio(answer).click({ force: true });
  }
}
