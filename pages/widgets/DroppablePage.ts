import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DroppablePage extends BasePage {
  protected readonly path = '/droppable';

  readonly dropTarget: Locator;
  private readonly draggable: Locator;

  constructor(page: Page) {
    super(page);
    // Every tab on this page reuses the same ids, so stay inside the "Simple" tab.
    const simpleTab = page.locator('#simpleDropContainer');
    this.draggable = simpleTab.locator('#draggable');
    this.dropTarget = simpleTab.locator('#droppable');
  }

  async dragBoxOntoTarget(): Promise<void> {
    // jQuery UI wires up drag and drop a moment after the page renders.
    await expect(this.draggable).toHaveClass(/ui-draggable/);
    await expect(this.dropTarget).toHaveClass(/ui-droppable/);

    // locator.dragTo() jumps straight to the target, which jQuery UI ignores,
    // so move the mouse there in small steps instead.
    await this.dropTarget.scrollIntoViewIfNeeded();
    const from = await this.draggable.boundingBox();
    const to = await this.dropTarget.boundingBox();
    if (!from || !to) throw new Error('Drag source or drop target is not visible');

    await this.page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
    await this.page.mouse.up();
  }
}
