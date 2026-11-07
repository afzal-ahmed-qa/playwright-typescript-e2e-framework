import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class FramesPage extends BasePage {
  protected readonly path = '/frames';

  readonly largeFrameHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.largeFrameHeading = page.frameLocator('#frame1').locator('#sampleHeading');
  }
}
