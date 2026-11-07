import { test, expect } from '../../../fixtures';

test.describe('Check Box', () => {
  test.beforeEach(async ({ checkBoxPage }) => {
    await checkBoxPage.open();
  });

  test('TC-CB-01 nothing is ticked when the page loads', async ({ checkBoxPage }) => {
    await expect(checkBoxPage.checkbox('Home')).not.toBeChecked();
    await expect(checkBoxPage.node('Home')).toHaveAttribute('aria-expanded', 'false');
    await expect(checkBoxPage.result).toBeHidden();
  });

  test('TC-CB-02 ticking a folder ticks everything inside it', { tag: '@smoke' }, async ({ checkBoxPage }) => {
    await checkBoxPage.expand('Home');
    await checkBoxPage.toggle('Desktop');

    await expect(checkBoxPage.checkbox('Desktop')).toBeChecked();
    await expect(checkBoxPage.checkbox('Home')).toHaveAttribute('aria-checked', 'mixed');
    await expect(checkBoxPage.checkbox('Documents')).not.toBeChecked();
    await expect(checkBoxPage.checkbox('Downloads')).not.toBeChecked();
    await expect(checkBoxPage.selectedItems).toHaveText(['desktop', 'notes', 'commands']);
  });

  test('TC-CB-03 unticking clears the selection', async ({ checkBoxPage }) => {
    await checkBoxPage.expand('Home');
    await checkBoxPage.toggle('Desktop');
    await checkBoxPage.toggle('Desktop');

    await expect(checkBoxPage.checkbox('Desktop')).not.toBeChecked();
    await expect(checkBoxPage.checkbox('Home')).not.toBeChecked();
    await expect(checkBoxPage.result).toBeHidden();
  });

  test('TC-CB-04 ticking Home selects the whole tree', async ({ checkBoxPage }) => {
    await checkBoxPage.toggle('Home');
    await checkBoxPage.expand('Home');

    for (const folder of ['Home', 'Desktop', 'Documents', 'Downloads']) {
      await expect(checkBoxPage.checkbox(folder)).toBeChecked();
    }
    expect(await checkBoxPage.selectedItems.allInnerTexts()).toEqual(
      expect.arrayContaining(['home', 'desktop', 'documents', 'downloads']),
    );
  });
});
