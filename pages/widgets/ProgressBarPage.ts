import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ProgressBarPage extends BasePage {
  protected readonly path = '/progress-bar';

  readonly progressBar: Locator;
  readonly resetButton: Locator;
  private readonly startButton: Locator;

  constructor(page: Page) {
    super(page);
    this.progressBar = page.getByRole('progressbar');
    this.startButton = page.locator('#startStopButton');
    this.resetButton = page.locator('#resetButton');
  }

  async start(): Promise<void> {
    await this.startButton.click();
  }
}
