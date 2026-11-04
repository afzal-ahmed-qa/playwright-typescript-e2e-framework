import type { Credentials } from '../api/BookStoreApi';

/** A unique Book Store user that meets DemoQA's password rules. */
export function uniqueUser(): Credentials {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return { userName: `pw_test_${id}`, password: `Test@${id.slice(-6)}aB` };
}
