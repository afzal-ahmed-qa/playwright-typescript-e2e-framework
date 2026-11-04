import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface Credentials {
  userName: string;
  password: string;
}

/**
 * Thin client for the DemoQA Book Store API (https://demoqa.com/swagger).
 * Methods return the raw APIResponse so tests can assert on status codes too.
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
    return this.request.get(`/Account/v1/User/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  }

  deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  }

  /**
   * Deletes a test user. A fresh token is generated first because logging in
   * through the UI replaces the token issued earlier.
   */
  async cleanUpUser(userId: string, credentials: Credentials): Promise<void> {
    const tokenResponse = await this.generateToken(credentials);
    const { token } = await tokenResponse.json();
    const response = await this.deleteUser(userId, token);
    if (response.status() !== 204) {
      console.warn(`Could not delete test user ${credentials.userName}: HTTP ${response.status()}`);
    }
  }
}
