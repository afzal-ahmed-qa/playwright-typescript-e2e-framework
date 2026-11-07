import type { Locator, Page } from '@playwright/test';
import { BasePage, type DialogInfo } from '../BasePage';

export class AlertsPage extends BasePage {
  protected readonly path = '/alerts';

  readonly confirmResult: Locator;
  readonly promptResult: Locator;

  private readonly alertButton: Locator;
  private readonly timerAlertButton: Locator;
  private readonly confirmButton: Locator;
  private readonly promptButton: Locator;

  constructor(page: Page) {
    super(page);
    this.alertButton = page.locator('#alertButton');
    this.timerAlertButton = page.locator('#timerAlertButton');
    this.confirmButton = page.locator('#confirmButton');
    this.promptButton = page.locator('#promtButton'); // the id really is misspelled on the site
    this.confirmResult = page.locator('#confirmResult');
    this.promptResult = page.locator('#promptResult');
  }

  triggerAlert(): Promise<DialogInfo> {
    return this.handleDialog(() => this.alertButton.click());
  }

  triggerDelayedAlert(): Promise<DialogInfo> {
    return this.handleDialog(() => this.timerAlertButton.click(), { timeout: 10_000 });
  }

  answerConfirm(choice: 'Ok' | 'Cancel'): Promise<DialogInfo> {
    return this.handleDialog(() => this.confirmButton.click(), { accept: choice === 'Ok' });
  }

  answerPrompt(text: string): Promise<DialogInfo> {
    return this.handleDialog(() => this.promptButton.click(), { promptText: text });
  }
}
