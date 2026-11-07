import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SelectMenuPage extends BasePage {
  protected readonly path = '/select-menu';

  readonly selectedColour: Locator;
  private readonly oldStyleSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.oldStyleSelect = page.locator('#oldSelectMenu');
    this.selectedColour = this.oldStyleSelect.locator('option:checked');
  }

  async chooseColour(colour: string): Promise<void> {
    await this.oldStyleSelect.selectOption({ label: colour });
  }
}
