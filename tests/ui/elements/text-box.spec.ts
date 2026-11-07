import { test, expect } from '../../../fixtures';

test.describe('Text Box', () => {
  test.beforeEach(async ({ textBoxPage }) => {
    await textBoxPage.open();
  });

  test('TC-TB-01 submitted details are echoed back', { tag: '@smoke' }, async ({ textBoxPage }) => {
    await textBoxPage.submitDetails({
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      currentAddress: '1 Main Street',
      permanentAddress: '2 High Street',
    });

    await expect(textBoxPage.outputName).toHaveText('Name:John Smith');
    await expect(textBoxPage.outputEmail).toHaveText('Email:john.smith@example.com');
    await expect(textBoxPage.outputCurrentAddress).toContainText('1 Main Street');
    // label is misspelt on the site ("Permananet", DEF-004), so only check the value
    await expect(textBoxPage.outputPermanentAddress).toContainText('2 High Street');
  });

  test('TC-TB-02 an email without a domain is rejected', async ({ textBoxPage }) => {
    await textBoxPage.submitDetails({ fullName: 'John Smith', email: 'john.smith' });

    await expect(textBoxPage.email).toHaveClass(/field-error/);
    await expect(textBoxPage.outputEmail).toBeHidden();
  });

  test('TC-TB-03 submitting an empty form shows nothing', async ({ textBoxPage }) => {
    await textBoxPage.submitDetails();

    await expect(textBoxPage.outputName).toBeHidden();
    await expect(textBoxPage.outputEmail).toBeHidden();
  });
});
