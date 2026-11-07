import path from 'node:path';
import { test, expect } from '../../../fixtures';

const SAMPLE_FILE = path.join(__dirname, '../../../test-data/files/sample.txt');

test.describe('Upload and Download', () => {
  test.beforeEach(async ({ uploadDownloadPage }) => {
    await uploadDownloadPage.open();
  });

  test('TC-UD-01 uploaded file name is shown', { tag: '@smoke' }, async ({ uploadDownloadPage }) => {
    await uploadDownloadPage.upload(SAMPLE_FILE);

    await expect(uploadDownloadPage.uploadedFilePath).toHaveText(/sample\.txt$/);
  });

  test('TC-UD-02 sample image downloads', async ({ uploadDownloadPage }, testInfo) => {
    const download = await uploadDownloadPage.download();

    expect(download.suggestedFilename()).toBe('sampleFile.jpeg');
    await download.saveAs(testInfo.outputPath(download.suggestedFilename()));
    expect(await download.failure()).toBeNull();
  });
});
