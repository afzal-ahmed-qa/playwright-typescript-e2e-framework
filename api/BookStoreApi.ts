import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Credentials } from '../test-data/factories';

export interface Session {
  userId: string;
  token: string;
  expires: string;
}

/**
 * Client for the DemoQA Book Store API (https://demoqa.com/swagger).
 * Most methods return the raw response so tests can assert on status codes.
 */
export class BookStoreApi {
  constructor(private readonly request: APIRequestContext) {}

  getBooks(): Promise<APIResponse> {
    return this.request.get('/BookStore/v1/Books');
  }

  createUser(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/User', { data: credentials });
  }

  generateToken(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/GenerateToken', { data: credentials });
  }

  getUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.get(`/Account/v1/User/${userId}`, { headers: auth(token) });
  }

  addBooks(userId: string, token: string, isbns: string[]): Promise<APIResponse> {
    return this.request.post('/BookStore/v1/Books', {
      headers: auth(token),
      data: { userId, collectionOfIsbns: isbns.map((isbn) => ({ isbn })) },
    });
  }

  deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${userId}`, { headers: auth(token) });
  }

  async login(credentials: Credentials, userId: string): Promise<Session> {
    const response = await this.generateToken(credentials);
    const { token, expires } = await response.json();
    if (!token) throw new Error(`Could not log in as ${credentials.userName}: HTTP ${response.status()}`);
    return { userId, token, expires };
  }

  async bookTitlesFor(session: Session): Promise<string[]> {
    const response = await this.getUser(session.userId, session.token);
    const { books } = await response.json();
    return books.map((book: { title: string }) => book.title);
  }

  /** Always asks for a new token first, because a UI login invalidates the old one. */
  async cleanUpUser(userId: string, credentials: Credentials): Promise<void> {
    const { token } = await this.login(credentials, userId);
    const response = await this.deleteUser(userId, token);
    if (response.status() !== 204) {
      console.warn(`Test user ${credentials.userName} was not deleted (HTTP ${response.status()})`);
    }
  }
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
