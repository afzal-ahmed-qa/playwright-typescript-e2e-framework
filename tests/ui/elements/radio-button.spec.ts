import { test, expect } from '../../../fixtures';

test.describe('Radio Button', () => {
  test.beforeEach(async ({ radioButtonPage }) => {
    await radioButtonPage.open();
  });

  test('TC-RB-01 only one answer can be selected at a time', { tag: '@smoke' }, async ({ radioButtonPage }) => {
    await radioButtonPage.choose('Yes');
    await expect(radioButtonPage.selectedAnswer).toHaveText('Yes');

    await radioButtonPage.choose('Impressive');
    await expect(radioButtonPage.selectedAnswer).toHaveText('Impressive');
    await expect(radioButtonPage.radio('Impressive')).toBeChecked();
    await expect(radioButtonPage.radio('Yes')).not.toBeChecked();
  });

  test('TC-RB-02 the disabled "No" option cannot be chosen', async ({ radioButtonPage }) => {
    await expect(radioButtonPage.radio('No')).toBeDisabled();

    await radioButtonPage.tryToChooseDisabled('No');

    await expect(radioButtonPage.radio('No')).not.toBeChecked();
    await expect(radioButtonPage.selectedAnswer).toBeHidden();
  });
});
