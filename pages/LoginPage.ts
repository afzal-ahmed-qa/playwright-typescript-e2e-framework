import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/login';

  readonly userName: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('#output');
  }

  async login(userName: string, password: string): Promise<void> {
    await this.userName.fill(userName);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
