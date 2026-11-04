import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SliderPage extends BasePage {
  protected readonly path = '/slider';

  readonly slider: Locator;
  readonly value: Locator;

  constructor(page: Page) {
    super(page);
    this.slider = page.getByRole('slider');
    this.value = page.locator('#sliderValue');
  }

  /** Drags the slider from its current position to `percent` (0-100) of its width. */
  async dragTo(percent: number): Promise<void> {
    await this.slider.scrollIntoViewIfNeeded();
    const box = await this.slider.boundingBox();
    if (!box) throw new Error('Slider is not visible');
    const current = Number(await this.slider.inputValue());
    const y = box.y + box.height / 2;
    await this.page.mouse.move(box.x + (box.width * current) / 100, y);
    await this.page.mouse.down();
    await this.page.mouse.move(box.x + (box.width * percent) / 100, y, { steps: 10 });
    await this.page.mouse.up();
  }
}
