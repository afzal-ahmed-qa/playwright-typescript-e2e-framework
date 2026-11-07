import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { MenuGroup } from './components/SideMenu';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly sectionCards: Locator;

  constructor(page: Page) {
    super(page);
    this.sectionCards = page.locator('.card h5');
  }

  async openSection(name: MenuGroup): Promise<void> {
    await this.sectionCards.getByText(name, { exact: true }).click();
    await this.page.waitForURL((url) => url.pathname !== '/');
  }
}
