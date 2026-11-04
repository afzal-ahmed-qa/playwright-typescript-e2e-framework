import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DroppablePage extends BasePage {
  protected readonly path = '/droppable';

  readonly dragMe: Locator;
  readonly dropHere: Locator;

  constructor(page: Page) {
    super(page);
    // The page has several tabs that reuse the same ids, so scope to the "Simple" tab.
    const simpleTab = page.locator('#simpleDropContainer');
    this.dragMe = simpleTab.locator('#draggable');
    this.dropHere = simpleTab.locator('#droppable');
  }

  /**
   * jQuery UI listens to real mouse movement, so drag step by step
   * instead of a single jump (locator.dragTo).
   */
  async dragAndDrop(): Promise<void> {
    // jQuery UI adds these classes once it has initialised; dragging earlier does nothing.
    await expect(this.dragMe).toHaveClass(/ui-draggable/);
    await expect(this.dropHere).toHaveClass(/ui-droppable/);
    await this.dropHere.scrollIntoViewIfNeeded();
    const from = await this.dragMe.boundingBox();
    const to = await this.dropHere.boundingBox();
    if (!from || !to) throw new Error('Drag or drop element is not visible');

    await this.page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
    await this.page.mouse.up();
  }
}
