import { test, expect } from '../../fixtures';
import { buildBookStoreUser } from '../../test-data/factories';

test.describe('Book Store API', { tag: '@api' }, () => {
  test('TC-API-01 lists every book with the basic fields', { tag: '@smoke' }, async ({ bookStoreApi }) => {
    const response = await bookStoreApi.getBooks();

    expect(response.status()).toBe(200);
    const { books } = await response.json();
    expect(books.length).toBeGreaterThan(0);
    for (const book of books) {
      expect(book).toMatchObject({
        isbn: expect.any(String),
        title: expect.any(String),
        author: expect.any(String),
      });
    }
  });

  test('TC-API-02 account lifecycle: create, authorise, reject duplicate', async ({ bookStoreApi }) => {
    const credentials = buildBookStoreUser();
    let userId: string | undefined;

    try {
      await test.step('POST /Account/v1/User → 201', async () => {
        const response = await bookStoreApi.createUser(credentials);
        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body).toMatchObject({ username: credentials.userName, books: [] });
        userId = body.userID;
      });

      await test.step('POST /Account/v1/GenerateToken → 200 with a token', async () => {
        const response = await bookStoreApi.generateToken(credentials);
        expect(response.status()).toBe(200);
        expect(await response.json()).toMatchObject({ status: 'Success', token: expect.any(String) });
      });

      await test.step('same user again → 406 "User exists!"', async () => {
        const response = await bookStoreApi.createUser(credentials);
        expect(response.status()).toBe(406);
        expect(await response.json()).toMatchObject({ message: 'User exists!' });
      });
    } finally {
      if (userId) await bookStoreApi.cleanUpUser(userId, credentials);
    }
  });
});
