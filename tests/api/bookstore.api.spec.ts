import { test, expect } from '../../fixtures';
import { uniqueUser } from '../../test-data/users';

test.describe('Book Store API', () => {
  test('TC-API-01 get all books', { tag: ['@smoke', '@api'] }, async ({ bookStoreApi }) => {
    const response = await bookStoreApi.getBooks();

    expect(response.status()).toBe(200);
    const { books } = await response.json();
    expect(books.length).toBeGreaterThan(0);
    for (const book of books) {
      expect(book).toEqual(
        expect.objectContaining({
          isbn: expect.any(String),
          title: expect.any(String),
          author: expect.any(String),
        }),
      );
    }
  });

  test('TC-API-02 create user, generate token, reject duplicate', { tag: '@api' }, async ({ bookStoreApi }) => {
    const credentials = uniqueUser();
    let userId: string | undefined;

    try {
      await test.step('create user → 201', async () => {
        const response = await bookStoreApi.createUser(credentials);
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body).toMatchObject({ username: credentials.userName, books: [] });
        userId = body.userID;
        expect(userId).toBeTruthy();
      });

      await test.step('generate token → 200', async () => {
        const response = await bookStoreApi.generateToken(credentials);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('Success');
        expect(body.token).toEqual(expect.any(String));
      });

      await test.step('create the same user again → 406', async () => {
        const response = await bookStoreApi.createUser(credentials);
        expect(response.status()).toBe(406);
        expect(await response.json()).toMatchObject({ message: 'User exists!' });
      });
    } finally {
      if (userId) await bookStoreApi.cleanUpUser(userId, credentials);
    }
  });
});
