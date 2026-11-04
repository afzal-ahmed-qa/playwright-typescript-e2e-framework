import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SelectMenuPage extends BasePage {
  protected readonly path = '/select-menu';

  readonly oldStyleSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.oldStyleSelect = page.locator('#oldSelectMenu');
  }
}
