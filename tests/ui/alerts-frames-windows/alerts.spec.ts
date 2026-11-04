import { test, expect } from '../../../fixtures';

test.describe('Alerts, Frames & Windows › Alerts', () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.open();
  });

  test('TC-AL-01 simple alert', { tag: '@smoke' }, async ({ alertsPage }) => {
    const dialog = await alertsPage.handleDialog(alertsPage.alertButton, 'accept');

    expect(dialog.type).toBe('alert');
    expect(dialog.message).toBe('You clicked a button');
  });

  test('TC-AL-02 delayed alert appears after about 5 seconds', async ({ alertsPage }) => {
    const dialog = await alertsPage.handleDialog(alertsPage.timerAlertButton, 'accept', { timeout: 10_000 });

    expect(dialog.type).toBe('alert');
    expect(dialog.message).toBe('This alert appeared after 5 seconds');
  });

  const confirmChoices = [
    { action: 'accept', result: 'Ok' },
    { action: 'dismiss', result: 'Cancel' },
  ] as const;

  for (const { action, result } of confirmChoices) {
    test(`TC-AL-03 confirm box: ${result}`, async ({ alertsPage }) => {
      const dialog = await alertsPage.handleDialog(alertsPage.confirmButton, action);

      expect(dialog.type).toBe('confirm');
      await expect(alertsPage.confirmResult).toHaveText(`You selected ${result}`);
    });
  }

  test('TC-AL-04 prompt box', async ({ alertsPage }) => {
    const dialog = await alertsPage.handleDialog(alertsPage.promptButton, 'accept', { promptText: 'Afzal' });

    expect(dialog.type).toBe('prompt');
    await expect(alertsPage.promptResult).toHaveText('You entered Afzal');
  });
});
