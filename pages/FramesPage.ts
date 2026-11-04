import type { FrameLocator, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FramesPage extends BasePage {
  protected readonly path = '/frames';

  readonly bigFrame: FrameLocator;
  readonly bigFrameHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.bigFrame = page.frameLocator('#frame1');
    this.bigFrameHeading = this.bigFrame.locator('#sampleHeading');
  }
}
