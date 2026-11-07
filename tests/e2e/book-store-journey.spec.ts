import { test, expect } from '../../fixtures';

const GIT_POCKET_GUIDE = {
  isbn: '9781449325862',
  title: 'Git Pocket Guide',
  author: 'Richard E. Silverman',
};
const JS_DESIGN_PATTERNS = { isbn: '9781449331818', title: 'Learning JavaScript Design Patterns' };

test.describe('Book Store journeys', { tag: '@e2e' }, () => {
  test('E2E-01 a new reader logs in, builds a reading list and manages it', async ({
    page,
    testUser,
    loginPage,
    profilePage,
    bookStorePage,
    bookDetailPage,
    bookStoreApi,
  }) => {
    await test.step('log in with a freshly registered account', async () => {
      await loginPage.open();
      await loginPage.login(testUser.userName, testUser.password);

      await profilePage.shouldBeOpen();
      await expect(profilePage.userName).toHaveText(testUser.userName);
      await expect(profilePage.bookTitles).toHaveCount(0);
    });

    await test.step('find a book in the store', async () => {
      await profilePage.goToBookStore();
      await bookStorePage.search('Git');

      await expect(bookStorePage.bookTitles).toHaveText([GIT_POCKET_GUIDE.title]);
    });

    await test.step('open the book and check its details', async () => {
      await bookStorePage.openBook(GIT_POCKET_GUIDE.title);

      await expect(page).toHaveURL(new RegExp(`search=${GIT_POCKET_GUIDE.isbn}`));
      await expect(bookDetailPage.isbn).toHaveText(GIT_POCKET_GUIDE.isbn);
      await expect(bookDetailPage.title).toHaveText(GIT_POCKET_GUIDE.title);
      await expect(bookDetailPage.author).toHaveText(GIT_POCKET_GUIDE.author);
    });

    await test.step('add it to the collection', async () => {
      const alert = await bookDetailPage.addToCollection();
      expect(alert.message).toBe('Book added to your collection.');
    });

    await test.step('see it on the profile', async () => {
      await profilePage.open();
      await expect(profilePage.bookTitles).toHaveText([GIT_POCKET_GUIDE.title]);
    });

    await test.step('remove it again, confirming the prompt', async () => {
      await profilePage.requestBookDeletion(GIT_POCKET_GUIDE.title);
      await expect(profilePage.confirmDialog.message).toHaveText('Do you want to delete this book?');

      const alert = await profilePage.confirmBookDeletion();

      expect(alert.message).toBe('Book deleted.');
      await expect(profilePage.bookTitles).toHaveCount(0);
    });

    await test.step('the backend agrees the collection is empty', async () => {
      const session = await bookStoreApi.login(testUser, testUser.userId);
      expect(await bookStoreApi.bookTitlesFor(session)).toEqual([]);
    });

    await test.step('log out', async () => {
      await profilePage.logout();

      await loginPage.shouldBeOpen();
      await profilePage.open();
      await expect(profilePage.notLoggedInMessage).toBeVisible();
    });
  });

  test('E2E-02 a returning reader sees books added through the API', async ({
    loggedInUser,
    bookStoreApi,
    profilePage,
  }) => {
    await test.step('seed two books through the API', async () => {
      const response = await bookStoreApi.addBooks(loggedInUser.userId, loggedInUser.token, [
        GIT_POCKET_GUIDE.isbn,
        JS_DESIGN_PATTERNS.isbn,
      ]);
      expect(response.status()).toBe(201);
    });

    await test.step('open the profile without going through the login form', async () => {
      await profilePage.open();

      await expect(profilePage.userName).toHaveText(loggedInUser.userName);
      await expect(profilePage.bookTitles).toHaveText([GIT_POCKET_GUIDE.title, JS_DESIGN_PATTERNS.title]);
    });

    await test.step('cancelling a deletion keeps the book', async () => {
      await profilePage.requestBookDeletion(JS_DESIGN_PATTERNS.title);
      await profilePage.confirmDialog.cancel();

      await expect(profilePage.confirmDialog.root).toBeHidden();
      await expect(profilePage.bookTitles).toHaveCount(2);
    });
  });
});
