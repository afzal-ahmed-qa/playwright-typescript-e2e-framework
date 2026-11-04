import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface WebTableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class WebTablesPage extends BasePage {
  protected readonly path = '/webtables';

  readonly addButton: Locator;
  readonly searchBox: Locator;
  readonly rows: Locator;

  readonly modal: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly age: Locator;
  readonly salary: Locator;
  readonly department: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchBox = page.getByPlaceholder('Type to search');
    this.rows = page.locator('table tbody tr');

    this.modal = page.getByRole('dialog');
    this.firstName = this.modal.locator('#firstName');
    this.lastName = this.modal.locator('#lastName');
    this.email = this.modal.locator('#userEmail');
    this.age = this.modal.locator('#age');
    this.salary = this.modal.locator('#salary');
    this.department = this.modal.locator('#department');
    this.submitButton = this.modal.getByRole('button', { name: 'Submit' });
  }

  row(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }

  async fillForm(record: Partial<WebTableRecord>): Promise<void> {
    if (record.firstName !== undefined) await this.firstName.fill(record.firstName);
    if (record.lastName !== undefined) await this.lastName.fill(record.lastName);
    if (record.email !== undefined) await this.email.fill(record.email);
    if (record.age !== undefined) await this.age.fill(record.age);
    if (record.salary !== undefined) await this.salary.fill(record.salary);
    if (record.department !== undefined) await this.department.fill(record.department);
  }

  async openAddForm(): Promise<void> {
    await this.addButton.click();
  }

  async addRecord(record: Partial<WebTableRecord>): Promise<void> {
    await this.openAddForm();
    await this.fillForm(record);
    await this.submitButton.click();
  }

  async edit(rowText: string, changes: Partial<WebTableRecord>): Promise<void> {
    await this.row(rowText).getByTitle('Edit').click();
    await this.fillForm(changes);
    await this.submitButton.click();
  }

  async delete(rowText: string): Promise<void> {
    await this.row(rowText).getByTitle('Delete').click();
  }

  async search(text: string): Promise<void> {
    await this.searchBox.fill(text);
  }

  /** Data cells of a row, in column order (the Action column is excluded). */
  rowCells(rowText: string): Locator {
    return this.row(rowText).locator('td:not(:last-child)');
  }
}
