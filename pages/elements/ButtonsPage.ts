import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ButtonsPage extends BasePage {
  protected readonly path = '/buttons';

  readonly doubleClickMessage: Locator;
  readonly rightClickMessage: Locator;
  readonly dynamicClickMessage: Locator;

  private readonly doubleClickButton: Locator;
  private readonly rightClickButton: Locator;
  private readonly clickMeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.doubleClickButton = page.getByRole('button', { name: 'Double Click Me' });
    this.rightClickButton = page.getByRole('button', { name: 'Right Click Me' });
    this.clickMeButton = page.getByRole('button', { name: 'Click Me', exact: true });

    this.doubleClickMessage = page.locator('#doubleClickMessage');
    this.rightClickMessage = page.locator('#rightClickMessage');
    this.dynamicClickMessage = page.locator('#dynamicClickMessage');
  }

  async doubleClickTheButton(): Promise<void> {
    await this.doubleClickButton.dblclick();
  }

  async singleClickTheDoubleClickButton(): Promise<void> {
    await this.doubleClickButton.click();
  }

  async rightClickTheButton(): Promise<void> {
    await this.rightClickButton.click({ button: 'right' });
  }

  async clickTheDynamicButton(): Promise<void> {
    await this.clickMeButton.click();
  }
}
