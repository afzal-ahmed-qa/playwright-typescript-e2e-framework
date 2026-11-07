import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

/** Buttons on this page change state roughly 5 seconds after load. */
export class DynamicPropertiesPage extends BasePage {
  protected readonly path = '/dynamic-properties';

  readonly enableAfterButton: Locator;
  readonly visibleAfterButton: Locator;

  constructor(page: Page) {
    super(page);
    this.enableAfterButton = page.locator('#enableAfter');
    this.visibleAfterButton = page.locator('#visibleAfter');
  }
}
