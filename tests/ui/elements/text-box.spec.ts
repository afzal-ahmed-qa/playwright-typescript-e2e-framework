import { test, expect } from '../../../fixtures';

test.describe('Elements › Text Box', () => {
  test.beforeEach(async ({ textBoxPage }) => {
    await textBoxPage.open();
  });

  test('TC-TB-01 submit with all valid data', { tag: '@smoke' }, async ({ textBoxPage }) => {
    await textBoxPage.submit({
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      currentAddress: '1 Main Street',
      permanentAddress: '2 High Street',
    });

    await expect(textBoxPage.outputName).toHaveText('Name:John Smith');
    await expect(textBoxPage.outputEmail).toHaveText('Email:john.smith@example.com');
    await expect(textBoxPage.outputCurrentAddress).toContainText('1 Main Street');
    await expect(textBoxPage.outputPermanentAddress).toContainText('2 High Street');
  });

  test('TC-TB-02 invalid email is rejected', async ({ textBoxPage }) => {
    await textBoxPage.submit({ fullName: 'John Smith', email: 'john.smith' });

    await expect(textBoxPage.email).toHaveClass(/field-error/);
    await expect(textBoxPage.outputEmail).toBeHidden();
  });

  test('TC-TB-03 submit with all fields empty shows no output', async ({ textBoxPage }) => {
    await textBoxPage.submit();

    await expect(textBoxPage.outputName).toBeHidden();
    await expect(textBoxPage.outputEmail).toBeHidden();
  });
});
