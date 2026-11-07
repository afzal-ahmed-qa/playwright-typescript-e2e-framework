import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export interface ContactDetails {
  fullName?: string;
  email?: string;
  currentAddress?: string;
  permanentAddress?: string;
}

export class TextBoxPage extends BasePage {
  protected readonly path = '/text-box';

  readonly fullName: Locator;
  readonly email: Locator;
  readonly currentAddress: Locator;
  readonly permanentAddress: Locator;
  readonly submitButton: Locator;

  readonly output: Locator;
  readonly outputName: Locator;
  readonly outputEmail: Locator;
  readonly outputCurrentAddress: Locator;
  readonly outputPermanentAddress: Locator;

  constructor(page: Page) {
    super(page);
    this.fullName = page.locator('#userName');
    this.email = page.locator('#userEmail');
    this.currentAddress = page.locator('#currentAddress');
    this.permanentAddress = page.locator('#permanentAddress');
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    this.output = page.locator('#output');
    this.outputName = this.output.locator('#name');
    this.outputEmail = this.output.locator('#email');
    this.outputCurrentAddress = this.output.locator('#currentAddress');
    this.outputPermanentAddress = this.output.locator('#permanentAddress');
  }

  async submitDetails(details: ContactDetails = {}): Promise<void> {
    if (details.fullName !== undefined) await this.fullName.fill(details.fullName);
    if (details.email !== undefined) await this.email.fill(details.email);
    if (details.currentAddress !== undefined) await this.currentAddress.fill(details.currentAddress);
    if (details.permanentAddress !== undefined) await this.permanentAddress.fill(details.permanentAddress);
    await this.submitButton.click();
  }

  /** Fills the form using only the keyboard: type, Tab to the next field, Enter to submit. */
  async submitDetailsWithKeyboard(details: Required<Pick<ContactDetails, 'fullName' | 'email'>>): Promise<void> {
    const keyboard = this.page.keyboard;
    await this.fullName.focus();
    await keyboard.type(details.fullName);
    await keyboard.press('Tab');
    await keyboard.type(details.email);
    await keyboard.press('Tab'); // current address
    await keyboard.press('Tab'); // permanent address
    await keyboard.press('Tab'); // submit
    await keyboard.press('Enter');
  }
}
