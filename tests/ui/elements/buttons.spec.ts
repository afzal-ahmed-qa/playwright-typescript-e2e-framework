import { test, expect } from '../../../fixtures';

test.describe('Buttons', () => {
  test.beforeEach(async ({ buttonsPage }) => {
    await buttonsPage.open();
  });

  test('TC-BT-01 double click', { tag: '@smoke' }, async ({ buttonsPage }) => {
    await buttonsPage.doubleClickTheButton();

    await expect(buttonsPage.doubleClickMessage).toHaveText('You have done a double click');
    await expect(buttonsPage.rightClickMessage).toBeHidden();
    await expect(buttonsPage.dynamicClickMessage).toBeHidden();
  });

  test('TC-BT-02 right click', { tag: '@smoke' }, async ({ buttonsPage }) => {
    await buttonsPage.rightClickTheButton();

    await expect(buttonsPage.rightClickMessage).toHaveText('You have done a right click');
    await expect(buttonsPage.doubleClickMessage).toBeHidden();
  });

  test('TC-BT-03 single click on the dynamic button', { tag: '@smoke' }, async ({ buttonsPage }) => {
    await buttonsPage.clickTheDynamicButton();

    await expect(buttonsPage.dynamicClickMessage).toHaveText('You have done a dynamic click');
    await expect(buttonsPage.doubleClickMessage).toBeHidden();
  });

  test('TC-BT-04 a single click is not mistaken for a double click', async ({ buttonsPage }) => {
    await buttonsPage.singleClickTheDoubleClickButton();

    await expect(buttonsPage.doubleClickMessage).toBeHidden();
  });
});
