import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SliderPage extends BasePage {
  protected readonly path = '/slider';

  readonly slider: Locator;
  readonly valueBox: Locator;

  constructor(page: Page) {
    super(page);
    this.slider = page.getByRole('slider');
    this.valueBox = page.locator('#sliderValue');
  }

  async currentValue(): Promise<number> {
    return Number(await this.slider.inputValue());
  }

  /** Drags the handle with the mouse from where it is now to `percent` of the track. */
  async dragTo(percent: number): Promise<void> {
    await this.slider.scrollIntoViewIfNeeded();
    const track = await this.slider.boundingBox();
    if (!track) throw new Error('Slider is not visible');

    const y = track.y + track.height / 2;
    const xAt = (p: number) => track.x + (track.width * p) / 100;

    await this.page.mouse.move(xAt(await this.currentValue()), y);
    await this.page.mouse.down();
    await this.page.mouse.move(xAt(percent), y, { steps: 10 });
    await this.page.mouse.up();
  }
}
