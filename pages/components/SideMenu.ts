import { expect, type Page } from '@playwright/test';

export type MenuGroup =
  | 'Elements'
  | 'Forms'
  | 'Alerts, Frame & Windows'
  | 'Widgets'
  | 'Interactions'
  | 'Book Store Application';

/** The collapsible menu on the left of every DemoQA page. */
export class SideMenu {
  constructor(private readonly page: Page) {}

  async goTo(group: MenuGroup, item: string): Promise<void> {
    const section = this.page
      .locator('.element-group')
      .filter({ has: this.page.locator('.header-text', { hasText: group }) });
    const header = section.locator('.group-header');
    const link = section.getByRole('link', { name: item, exact: true });

    // The site expands the current section with an animation. Checking visibility
    // mid-animation and clicking the header would close it again, so keep trying
    // until the link has actually settled into view.
    await expect(async () => {
      if (!(await link.isVisible())) await header.click();
      await expect(link).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 10_000 });

    await link.click();
  }
}
