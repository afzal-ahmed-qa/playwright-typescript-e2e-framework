import type { Dialog, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${message} within ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export class AlertsPage extends BasePage {
  protected readonly path = '/alerts';

  readonly alertButton: Locator;
  readonly timerAlertButton: Locator;
  readonly confirmButton: Locator;
  readonly promptButton: Locator;
  readonly confirmResult: Locator;
  readonly promptResult: Locator;

  constructor(page: Page) {
    super(page);
    this.alertButton = page.locator('#alertButton');
    this.timerAlertButton = page.locator('#timerAlertButton');
    this.confirmButton = page.locator('#confirmButton');
    this.promptButton = page.locator('#promtButton'); // sic: the id is misspelled on the site
    this.confirmResult = page.locator('#confirmResult');
    this.promptResult = page.locator('#promptResult');
  }

  /**
   * Clicks `trigger`, waits for the browser dialog, accepts or dismisses it,
   * and returns its type and message so the test can assert on them.
   */
  async handleDialog(
    trigger: Locator,
    action: 'accept' | 'dismiss',
    options: { promptText?: string; timeout?: number } = {},
  ): Promise<{ type: string; message: string }> {
    // The handler must be registered before clicking: while a dialog is open the
    // click itself does not finish, so handling it afterwards would deadlock.
    const handled = new Promise<{ type: string; message: string }>((resolve) => {
      this.page.once('dialog', async (dialog: Dialog) => {
        const details = { type: dialog.type(), message: dialog.message() };
        if (action === 'accept') await dialog.accept(options.promptText);
        else await dialog.dismiss();
        resolve(details);
      });
    });
    await trigger.click();
    return withTimeout(handled, options.timeout ?? 5_000, 'No browser dialog appeared');
  }
}
