import { test, expect } from '../../../fixtures';

test.describe('Book Store › Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  // The test user is created through the API (see the `testUser` fixture) and
  // deleted afterwards. That makes this both TC-BS-01 and the hybrid TC-HY-01.
  test('TC-BS-01 / TC-HY-01 log in with a user created via the API', { tag: '@smoke' }, async ({
    loginPage,
    profilePage,
    page,
    testUser,
  }) => {
    await loginPage.login(testUser.userName, testUser.password);

    await expect(page).toHaveURL(/\/profile$/);
    await expect(profilePage.userNameValue).toHaveText(testUser.userName);
  });

  test('TC-BS-02 log in with a wrong password', async ({ loginPage, page, testUser }) => {
    await loginPage.login(testUser.userName, 'Wrong@Password1');

    await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('Book Store › Books', () => {
  test('TC-BS-03 search the book list', async ({ booksPage }) => {
    await booksPage.open();
    await expect(booksPage.bookTitles.first()).toBeVisible();

    await booksPage.search('Git');

    await expect(booksPage.bookTitles).not.toHaveCount(0);
    for (const title of await booksPage.bookTitles.allInnerTexts()) {
      expect(title).toContain('Git');
    }
  });
});
