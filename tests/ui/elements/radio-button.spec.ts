import { test, expect } from '../../../fixtures';
import type { RadioOption } from '../../../pages/RadioButtonPage';

test.describe('Elements › Radio Button', () => {
  test.beforeEach(async ({ radioButtonPage }) => {
    await radioButtonPage.open();
  });

  test('TC-RB-01 select each enabled option', { tag: '@smoke' }, async ({ radioButtonPage }) => {
    const options: RadioOption[] = ['Yes', 'Impressive'];

    for (const option of options) {
      await test.step(`select "${option}"`, async () => {
        await radioButtonPage.select(option);

        await expect(radioButtonPage.radio(option)).toBeChecked();
        await expect(radioButtonPage.selectedValue).toHaveText(option);
      });
    }
    await expect(radioButtonPage.radio('Yes')).not.toBeChecked();
  });

  test('TC-RB-02 disabled option cannot be selected', async ({ radioButtonPage }) => {
    await expect(radioButtonPage.radio('No')).toBeDisabled();

    await radioButtonPage.radio('No').click({ force: true });

    await expect(radioButtonPage.radio('No')).not.toBeChecked();
    await expect(radioButtonPage.selectedValue).toBeHidden();
  });
});
