import type { Download, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class UploadDownloadPage extends BasePage {
  protected readonly path = '/upload-download';

  readonly downloadButton: Locator;
  readonly uploadInput: Locator;
  readonly uploadedFilePath: Locator;

  constructor(page: Page) {
    super(page);
    this.downloadButton = page.locator('#downloadButton');
    this.uploadInput = page.locator('#uploadFile');
    this.uploadedFilePath = page.locator('#uploadedFilePath');
  }

  async upload(filePath: string): Promise<void> {
    await this.uploadInput.setInputFiles(filePath);
  }

  async download(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadButton.click();
    return downloadPromise;
  }
}
