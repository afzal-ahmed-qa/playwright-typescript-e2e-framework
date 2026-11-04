import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProgressBarPage extends BasePage {
  protected readonly path = '/progress-bar';

  readonly progressBar: Locator;
  readonly startStopButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    super(page);
    this.progressBar = page.getByRole('progressbar');
    this.startStopButton = page.locator('#startStopButton');
    this.resetButton = page.locator('#resetButton');
  }
}
