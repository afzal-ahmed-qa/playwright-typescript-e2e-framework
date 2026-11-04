import { expect, type Page } from '@playwright/test';

/**
 * Shared behaviour for every DemoQA page object.
 * Each subclass only declares its own `path` and the locators/actions it needs.
 */
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(new RegExp(`${this.path}$`));
  }
}
