import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CheckBoxPage extends BasePage {
  protected readonly path = '/checkbox';

  readonly result: Locator;
  readonly selectedItems: Locator;

  constructor(page: Page) {
    super(page);
    this.result = page.locator('#result');
    this.selectedItems = this.result.locator('.text-success');
  }

  checkbox(node: string): Locator {
    return this.page.getByRole('checkbox', { name: `Select ${node}` });
  }

  node(name: string): Locator {
    return this.page.getByRole('treeitem').filter({ has: this.checkbox(name) });
  }

  async expand(node: string): Promise<void> {
    await this.node(node).locator('.rc-tree-switcher').click();
  }

  async toggle(node: string): Promise<void> {
    await this.checkbox(node).click();
  }
}
