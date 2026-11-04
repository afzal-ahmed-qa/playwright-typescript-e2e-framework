import path from 'node:path';
import { test, expect } from '../../../fixtures';
import type { StudentData } from '../../../pages/PracticeFormPage';

const PICTURE = path.join(__dirname, '../../../test-data/files/sample.txt');

const requiredOnly: StudentData = {
  firstName: 'John',
  lastName: 'Smith',
  gender: 'Male',
  mobile: '0123456789',
};

test.describe('Forms › Practice Form', () => {
  test.beforeEach(async ({ practiceFormPage }) => {
    await practiceFormPage.open();
  });

  test('TC-PF-01 submit with only required fields', { tag: '@smoke' }, async ({ practiceFormPage: form }) => {
    await form.fillForm(requiredOnly);
    await form.submit();

    await expect(form.modalTitle).toHaveText('Thanks for submitting the form');
    await expect(form.summaryValue('Student Name')).toHaveText('John Smith');
    await expect(form.summaryValue('Gender')).toHaveText('Male');
    await expect(form.summaryValue('Mobile')).toHaveText('0123456789');
  });

  test('TC-PF-01 close button closes the confirmation modal', async ({ practiceFormPage: form }) => {
    test.fail(true, 'Known defect DEF-002: Close throws "findDOMNode is not a function" (docs/defects.md)');

    await form.fillForm(requiredOnly);
    await form.submit();
    await expect(form.modal).toBeVisible();

    await form.closeModalButton.click();

    await expect(form.modal).toBeHidden({ timeout: 3_000 });
  });

  test('TC-PF-01 Escape closes the confirmation modal', async ({ practiceFormPage: form, page }) => {
    await form.fillForm(requiredOnly);
    await form.submit();
    await expect(form.modal).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(form.modal).toBeHidden();
  });

  test('TC-PF-02 submit with all fields', async ({ practiceFormPage: form }) => {
    const student: StudentData = {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      gender: 'Female',
      mobile: '9876543210',
      dateOfBirth: { day: 15, month: 'May', year: 1990 },
      subjects: ['Maths', 'English'],
      hobbies: ['Sports', 'Reading'],
      picturePath: PICTURE,
      currentAddress: '1 Main Street, Springfield',
      state: 'NCR',
      city: 'Delhi',
    };

    await form.fillForm(student);
    await form.submit();

    await expect(form.modalTitle).toHaveText('Thanks for submitting the form');
    const expected: Record<string, string | RegExp> = {
      'Student Name': 'Maria Garcia',
      'Student Email': 'maria.garcia@example.com',
      Gender: 'Female',
      Mobile: '9876543210',
      'Date of Birth': '15 May,1990',
      Subjects: 'Maths, English',
      Hobbies: 'Sports, Reading',
      Picture: 'sample.txt',
      Address: '1 Main Street, Springfield',
      'State and City': 'NCR Delhi',
    };
    for (const [label, value] of Object.entries(expected)) {
      await expect.soft(form.summaryValue(label), label).toHaveText(value);
    }
  });

  test('TC-PF-03 required fields are validated', async ({ practiceFormPage: form }) => {
    await form.submit();

    await expect(form.modal).toBeHidden();
    await expect(form.firstName).toBeInvalid();
    await expect(form.lastName).toBeInvalid();
    await expect(form.genderRadio('Male')).toBeInvalid();
    await expect(form.mobile).toBeInvalid();
    // Optional field stays valid
    await expect(form.email).not.toBeInvalid();
  });

  test.describe('TC-PF-04 boundary: mobile number', () => {
    const rejected = [
      { case: '9 digits', mobile: '012345678' },
      { case: 'letters', mobile: 'abcdefghij' },
    ];

    for (const { case: name, mobile } of rejected) {
      test(`rejects ${name} (${mobile})`, async ({ practiceFormPage: form }) => {
        await form.fillForm({ ...requiredOnly, mobile });
        await form.submit();

        await expect(form.mobile).toBeInvalid();
        await expect(form.modal).toBeHidden();
      });
    }

    test('accepts exactly 10 digits', async ({ practiceFormPage: form }) => {
      await form.fillForm({ ...requiredOnly, mobile: '0123456789' });
      await form.submit();

      await expect(form.modal).toBeVisible();
    });

    test('stops typing after 10 digits', async ({ practiceFormPage: form }) => {
      // pressSequentially types like a user, so the maxlength="10" limit applies.
      await form.mobile.pressSequentially('01234567890');

      await expect(form.mobile).toHaveValue('0123456789');
    });
  });

  test('TC-PF-05 city depends on state', async ({ practiceFormPage: form, page }) => {
    await expect(form.cityInput).toBeDisabled();

    await form.chooseFromSelect(form.stateInput, 'NCR');
    await expect(form.cityInput).toBeEnabled();

    await form.cityInput.click();
    await expect(page.getByRole('option')).toHaveText(['Delhi', 'Gurgaon', 'Noida']);
  });
});
