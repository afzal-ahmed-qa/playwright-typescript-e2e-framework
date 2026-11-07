import type { Locator, Page } from '@playwright/test';

/** The plain "This is a sample page" document opened in new tabs and iframes. */
export class SamplePage {
  readonly heading: Locator;

  constructor(readonly page: Page) {
    this.heading = page.locator('#sampleHeading');
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}
