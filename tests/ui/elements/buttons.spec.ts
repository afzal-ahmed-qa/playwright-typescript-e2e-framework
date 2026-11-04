import { test, expect } from '../../../fixtures';

test.describe('Elements › Buttons', () => {
  test.beforeEach(async ({ buttonsPage }) => {
    await buttonsPage.open();
  });

  test('TC-BT-01 double click shows the double click message', { tag: '@smoke' }, async ({ buttonsPage }) => {
    await buttonsPage.doubleClickButton.dblclick();

    await expect(buttonsPage.doubleClickMessage).toHaveText('You have done a double click');
    await expect(buttonsPage.rightClickMessage).toBeHidden();
    await expect(buttonsPage.dynamicClickMessage).toBeHidden();
  });

  test('TC-BT-02 right click shows the right click message', { tag: '@smoke' }, async ({ buttonsPage }) => {
    await buttonsPage.rightClickButton.click({ button: 'right' });

    await expect(buttonsPage.rightClickMessage).toHaveText('You have done a right click');
    await expect(buttonsPage.doubleClickMessage).toBeHidden();
    await expect(buttonsPage.dynamicClickMessage).toBeHidden();
  });

  test('TC-BT-03 single click shows the dynamic click message', { tag: '@smoke' }, async ({ buttonsPage }) => {
    await buttonsPage.clickMeButton.click();

    await expect(buttonsPage.dynamicClickMessage).toHaveText('You have done a dynamic click');
    await expect(buttonsPage.doubleClickMessage).toBeHidden();
    await expect(buttonsPage.rightClickMessage).toBeHidden();
  });

  test('TC-BT-04 a single click on "Double Click Me" shows no message', async ({ buttonsPage }) => {
    await buttonsPage.doubleClickButton.click();

    await expect(buttonsPage.doubleClickMessage).toBeHidden();
  });
});
