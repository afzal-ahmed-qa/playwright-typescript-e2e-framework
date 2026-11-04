import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckBoxPage extends BasePage {
  protected readonly path = '/checkbox';

  readonly result: Locator;
  readonly selectedItems: Locator;

  constructor(page: Page) {
    super(page);
    this.result = page.locator('#result');
    this.selectedItems = this.result.locator('.text-success');
  }

  /** Checkbox for a tree node, e.g. checkbox('Desktop'). */
  checkbox(name: string): Locator {
    return this.page.getByRole('checkbox', { name: `Select ${name}` });
  }

  node(name: string): Locator {
    return this.page.getByRole('treeitem').filter({ has: this.checkbox(name) });
  }

  async expand(name: string): Promise<void> {
    await this.node(name).locator('.rc-tree-switcher').click();
  }

  async toggle(name: string): Promise<void> {
    await this.checkbox(name).click();
  }
}
