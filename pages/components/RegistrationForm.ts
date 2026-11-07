import type { Locator, Page } from '@playwright/test';
import type { Employee } from '../../test-data/factories';

/** "Registration Form" modal used to add and edit rows on the Web Tables page. */
export class RegistrationForm {
  readonly root: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly age: Locator;
  readonly salary: Locator;
  readonly department: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('dialog');
    this.firstName = this.root.locator('#firstName');
    this.lastName = this.root.locator('#lastName');
    this.email = this.root.locator('#userEmail');
    this.age = this.root.locator('#age');
    this.salary = this.root.locator('#salary');
    this.department = this.root.locator('#department');
    this.submitButton = this.root.getByRole('button', { name: 'Submit' });
  }

  get allFields(): Locator[] {
    return [this.firstName, this.lastName, this.email, this.age, this.salary, this.department];
  }

  async fill(employee: Partial<Employee>): Promise<void> {
    const fields: [Locator, string | undefined][] = [
      [this.firstName, employee.firstName],
      [this.lastName, employee.lastName],
      [this.email, employee.email],
      [this.age, employee.age],
      [this.salary, employee.salary],
      [this.department, employee.department],
    ];
    for (const [field, value] of fields) {
      if (value !== undefined) await field.fill(value);
    }
  }

  /** Types character by character, so the field's maxlength is respected. */
  async typeAge(age: string): Promise<void> {
    await this.age.clear();
    await this.age.pressSequentially(age);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
