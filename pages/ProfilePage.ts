import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  protected readonly path = '/profile';

  readonly userNameValue: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameValue = page.locator('#userName-value');
  }
}
