import { expect, type Dialog, type Page } from '@playwright/test';
import { SideMenu } from './components/SideMenu';

export interface DialogInfo {
  type: string;
  message: string;
}

export abstract class BasePage {
  protected abstract readonly path: string;
  readonly sideMenu: SideMenu;

  constructor(protected readonly page: Page) {
    this.sideMenu = new SideMenu(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.shouldBeOpen();
  }

  async shouldBeOpen(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.path}(\\?.*)?$`));
  }

  /**
   * Runs `action`, then accepts or dismisses the browser dialog it triggers.
   * The listener has to be in place before the click: while a native dialog is
   * open, Playwright's click() doesn't resolve, so waiting afterwards would hang.
   */
  protected async handleDialog(
    action: () => Promise<void>,
    { accept = true, promptText, timeout = 5_000 }: { accept?: boolean; promptText?: string; timeout?: number } = {},
  ): Promise<DialogInfo> {
    const dialogHandled = new Promise<DialogInfo>((resolve) => {
      this.page.once('dialog', async (dialog: Dialog) => {
        const info = { type: dialog.type(), message: dialog.message() };
        accept ? await dialog.accept(promptText) : await dialog.dismiss();
        resolve(info);
      });
    });

    await action();

    let timer: NodeJS.Timeout | undefined;
    const timedOut = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`No browser dialog appeared within ${timeout}ms`)), timeout);
    });
    return Promise.race([dialogHandled, timedOut]).finally(() => clearTimeout(timer));
  }
}
