import path from 'node:path';
import { test, expect } from '../../../fixtures';

const SAMPLE_FILE = path.join(__dirname, '../../../test-data/files/sample.txt');

test.describe('Elements › Upload and Download', () => {
  test.beforeEach(async ({ uploadDownloadPage }) => {
    await uploadDownloadPage.open();
  });

  test('TC-UD-01 upload a file', { tag: '@smoke' }, async ({ uploadDownloadPage }) => {
    await uploadDownloadPage.upload(SAMPLE_FILE);

    await expect(uploadDownloadPage.uploadedFilePath).toHaveText(/sample\.txt$/);
  });

  test('TC-UD-02 download a file', async ({ uploadDownloadPage }, testInfo) => {
    const download = await uploadDownloadPage.download();

    expect(download.suggestedFilename()).toBe('sampleFile.jpeg');
    const savedTo = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(savedTo);
    expect(await download.failure()).toBeNull();
  });
});
