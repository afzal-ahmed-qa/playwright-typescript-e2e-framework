import { test, expect } from '../../../fixtures';
import { buildStudent } from '../../../test-data/factories';

test.describe('Practice Form', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.open();
  });

  test('TC-PF-01 registering with just the required fields', { tag: '@smoke' }, async ({ practiceFormPage }) => {
    const student = buildStudent();

    await practiceFormPage.register(student);

    const { summary } = practiceFormPage;
    await expect(summary.title).toHaveText('Thanks for submitting the form');
    await expect(summary.valueFor('Student Name')).toHaveText(`${student.firstName} ${student.lastName}`);
    await expect(summary.valueFor('Gender')).toHaveText(student.gender);
    await expect(summary.valueFor('Mobile')).toHaveText(student.mobile);
  });

  test('TC-PF-01 the Close button dismisses the confirmation', async ({ practiceFormPage }) => {
    test.fail(true, 'DEF-002: Close throws "findDOMNode is not a function" and the modal stays open');

    await practiceFormPage.register(buildStudent());
    await practiceFormPage.summary.close();

    await expect(practiceFormPage.summary.root).toBeHidden({ timeout: 3_000 });
  });

  test('TC-PF-01 Escape dismisses the confirmation', async ({ practiceFormPage }) => {
    await practiceFormPage.register(buildStudent());
    await practiceFormPage.summary.closeWithEscape();

    await expect(practiceFormPage.summary.root).toBeHidden();
  });

  // TC-PF-02 (every field filled in) is covered by the E2E-03 student registration journey.

  test('TC-PF-03 required fields are enforced', async ({ practiceFormPage }) => {
    await practiceFormPage.submit();

    await expect(practiceFormPage.summary.root).toBeHidden();
    await expect(practiceFormPage.firstName).toBeInvalid();
    await expect(practiceFormPage.lastName).toBeInvalid();
    await expect(practiceFormPage.genderRadio('Male')).toBeInvalid();
    await expect(practiceFormPage.mobile).toBeInvalid();
    await expect(practiceFormPage.email).not.toBeInvalid();
  });

  test.describe('TC-PF-04 mobile number boundaries', () => {
    for (const [description, mobile] of [
      ['9 digits', '012345678'],
      ['letters', 'abcdefghij'],
    ]) {
      test(`rejects ${description}`, async ({ practiceFormPage }) => {
        await practiceFormPage.register(buildStudent({ mobile }));

        await expect(practiceFormPage.mobile).toBeInvalid();
        await expect(practiceFormPage.summary.root).toBeHidden();
      });
    }

    test('accepts exactly 10 digits', async ({ practiceFormPage }) => {
      await practiceFormPage.register(buildStudent({ mobile: '0123456789' }));

      await expect(practiceFormPage.summary.root).toBeVisible();
    });

    test('ignores an 11th digit', async ({ practiceFormPage }) => {
      await practiceFormPage.typeMobile('01234567890');

      await expect(practiceFormPage.mobile).toHaveValue('0123456789');
    });
  });

  test('TC-PF-05 city list depends on the chosen state', async ({ practiceFormPage }) => {
    await expect(practiceFormPage.cityInput).toBeDisabled();

    await practiceFormPage.selectState('NCR');
    await practiceFormPage.openCityDropdown();

    await expect(practiceFormPage.cityInput).toBeEnabled();
    await expect(practiceFormPage.dropdownOptions).toHaveText(['Delhi', 'Gurgaon', 'Noida']);
  });
});
