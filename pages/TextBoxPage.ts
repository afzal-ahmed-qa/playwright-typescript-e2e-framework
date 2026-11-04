import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TextBoxData {
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

  async fill(data: TextBoxData): Promise<void> {
    if (data.fullName !== undefined) await this.fullName.fill(data.fullName);
    if (data.email !== undefined) await this.email.fill(data.email);
    if (data.currentAddress !== undefined) await this.currentAddress.fill(data.currentAddress);
    if (data.permanentAddress !== undefined) await this.permanentAddress.fill(data.permanentAddress);
  }

  async submit(data: TextBoxData = {}): Promise<void> {
    await this.fill(data);
    await this.submitButton.click();
  }
}
