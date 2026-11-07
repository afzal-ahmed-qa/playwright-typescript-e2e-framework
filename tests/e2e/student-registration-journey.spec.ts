import path from 'node:path';
import { test, expect } from '../../fixtures';
import { buildFullStudent } from '../../test-data/factories';
import { summaryDate } from '../../pages/forms/PracticeFormPage';

const PHOTO = path.join(__dirname, '../../test-data/files/sample.txt');

test.describe('Student registration journey', { tag: '@e2e' }, () => {
  test('E2E-03 a student finds the registration form from the home page and enrols', async ({
    homePage,
    practiceFormPage,
  }) => {
    const student = buildFullStudent({ picture: PHOTO });

    await test.step('navigate Home → Forms → Practice Form using the menus', async () => {
      await homePage.open();
      await homePage.openSection('Forms');
      await practiceFormPage.sideMenu.goTo('Forms', 'Practice Form');

      await practiceFormPage.shouldBeOpen();
    });

    await test.step(`fill in every field for ${student.firstName} ${student.lastName}`, async () => {
      await practiceFormPage.register(student);
    });

    await test.step('the confirmation shows exactly what was entered', async () => {
      const { summary } = practiceFormPage;
      await expect(summary.title).toHaveText('Thanks for submitting the form');

      const expected: Record<string, string> = {
        'Student Name': `${student.firstName} ${student.lastName}`,
        'Student Email': student.email!,
        Gender: student.gender,
        Mobile: student.mobile,
        'Date of Birth': summaryDate(student.dateOfBirth!),
        Subjects: student.subjects!.join(', '),
        Hobbies: student.hobbies!.join(', '),
        Picture: path.basename(PHOTO),
        Address: student.address!,
        'State and City': `${student.state} ${student.city}`,
      };
      for (const [label, value] of Object.entries(expected)) {
        await expect.soft(summary.valueFor(label), label).toHaveText(value);
      }
    });

    await test.step('dismiss the confirmation', async () => {
      // The Close button is broken on the site (DEF-002), so use Escape like a user would.
      await practiceFormPage.summary.closeWithEscape();
      await expect(practiceFormPage.summary.root).toBeHidden();
    });
  });
});
