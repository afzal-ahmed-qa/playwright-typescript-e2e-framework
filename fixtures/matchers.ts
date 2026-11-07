import { expect as baseExpect, type Locator } from '@playwright/test';

export const expect = baseExpect.extend({
  /**
   * Passes when a form field fails native HTML5 validation (required, pattern,
   * minlength...). Retries until the expect timeout, like the built-in matchers.
   */
  async toBeInvalid(field: Locator, options?: { timeout?: number }) {
    let valid: boolean | undefined;
    const pass = await baseExpect
      .poll(async () => (valid = await field.evaluate((el) => (el as HTMLInputElement).validity.valid)), options)
      .toBe(this.isNot)
      .then(
        () => !this.isNot,
        () => this.isNot,
      );

    return {
      name: 'toBeInvalid',
      pass,
      message: () => `expected ${field} ${this.isNot ? 'not ' : ''}to be invalid, but validity.valid was ${valid}`,
    };
  },
});
