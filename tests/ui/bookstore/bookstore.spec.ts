import { test, expect } from '../../../fixtures';

test.describe('Book Store login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC-BS-01 / TC-HY-01 user created via the API can log in', { tag: '@smoke' }, async ({
    loginPage,
    profilePage,
    testUser,
  }) => {
    await loginPage.login(testUser.userName, testUser.password);

    await profilePage.shouldBeOpen();
    await expect(profilePage.userName).toHaveText(testUser.userName);
  });

  test('TC-BS-02 wrong password is refused', async ({ loginPage, testUser }) => {
    await loginPage.login(testUser.userName, 'Wrong@Password1');

    await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    await loginPage.shouldBeOpen();
  });
});

test('TC-BS-03 searching the store filters by title', async ({ bookStorePage }) => {
  await bookStorePage.open();
  await expect(bookStorePage.bookTitles.first()).toBeVisible();

  await bookStorePage.search('Git');

  await expect(bookStorePage.bookTitles).not.toHaveCount(0);
  for (const title of await bookStorePage.bookTitles.allInnerTexts()) {
    expect(title).toContain('Git');
  }
});
