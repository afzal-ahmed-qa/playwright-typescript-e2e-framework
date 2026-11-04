import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type RadioOption = 'Yes' | 'Impressive' | 'No';

export class RadioButtonPage extends BasePage {
  protected readonly path = '/radio-button';

  readonly selectedValue: Locator;

  constructor(page: Page) {
    super(page);
    this.selectedValue = page.locator('p', { hasText: 'You have selected' }).locator('.text-success');
  }

  radio(option: RadioOption): Locator {
    return this.page.getByRole('radio', { name: option });
  }

  async select(option: RadioOption): Promise<void> {
    // The native input is covered by its styled label, so click the label like a user would.
    await this.page.locator('label', { hasText: option }).click();
  }
}
