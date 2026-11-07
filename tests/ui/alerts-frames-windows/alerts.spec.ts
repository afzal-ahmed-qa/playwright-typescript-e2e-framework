import { test, expect } from '../../../fixtures';

test.describe('Alerts', () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.open();
  });

  test('TC-AL-01 simple alert', { tag: '@smoke' }, async ({ alertsPage }) => {
    const alert = await alertsPage.triggerAlert();

    expect(alert).toEqual({ type: 'alert', message: 'You clicked a button' });
  });

  test('TC-AL-02 alert that appears after five seconds', async ({ alertsPage }) => {
    const alert = await alertsPage.triggerDelayedAlert();

    expect(alert).toEqual({ type: 'alert', message: 'This alert appeared after 5 seconds' });
  });

  for (const choice of ['Ok', 'Cancel'] as const) {
    test(`TC-AL-03 confirm box answered with ${choice}`, async ({ alertsPage }) => {
      const dialog = await alertsPage.answerConfirm(choice);

      expect(dialog.type).toBe('confirm');
      await expect(alertsPage.confirmResult).toHaveText(`You selected ${choice}`);
    });
  }

  test('TC-AL-04 prompt box echoes the answer', async ({ alertsPage }) => {
    const dialog = await alertsPage.answerPrompt('Afzal');

    expect(dialog.type).toBe('prompt');
    await expect(alertsPage.promptResult).toHaveText('You entered Afzal');
  });
});
