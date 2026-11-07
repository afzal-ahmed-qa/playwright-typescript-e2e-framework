import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../BasePage';
import { RegistrationForm } from '../components/RegistrationForm';
import type { Employee } from '../../test-data/factories';

export class WebTablesPage extends BasePage {
  protected readonly path = '/webtables';

  readonly form: RegistrationForm;
  readonly rows: Locator;
  readonly firstNames: Locator;
  private readonly addButton: Locator;
  private readonly searchBox: Locator;

  constructor(page: Page) {
    super(page);
    this.form = new RegistrationForm(page);
    this.rows = page.locator('table tbody tr');
    this.firstNames = this.rows.locator('td:first-child');
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchBox = page.getByPlaceholder('Type to search');
  }

  /** A row is identified by email because it's the only unique column. */
  rowFor(email: string): Locator {
    return this.rows.filter({ hasText: email });
  }

  /** First name, last name, age, email, salary, department (the action column is left out). */
  cellsFor(email: string): Locator {
    return this.rowFor(email).locator('td:not(:last-child)');
  }

  async openAddForm(): Promise<void> {
    await this.addButton.click();
  }

  async addEmployee(employee: Partial<Employee>): Promise<void> {
    await this.openAddForm();
    await this.form.fill(employee);
    await this.form.submit();
  }

  async editEmployee(email: string, changes: Partial<Employee>): Promise<void> {
    await this.rowFor(email).getByTitle('Edit').click();
    await this.form.fill(changes);
    await this.form.submit();
  }

  async deleteEmployee(email: string): Promise<void> {
    await this.rowFor(email).getByTitle('Delete').click();
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.clear();
  }
}

export const tableRow = (e: Employee) => [e.firstName, e.lastName, e.age, e.email, e.salary, e.department];
