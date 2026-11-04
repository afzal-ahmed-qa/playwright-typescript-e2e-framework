import { test, expect } from '../../../fixtures';
import records from '../../../test-data/web-table-records.json';
import type { WebTableRecord } from '../../../pages/WebTablesPage';

const toCells = (r: WebTableRecord) => [r.firstName, r.lastName, r.age, r.email, r.salary, r.department];

test.describe('Elements › Web Tables', () => {
  test.beforeEach(async ({ webTablesPage }) => {
    await webTablesPage.open();
  });

  test('TC-WT-01 default data is shown', async ({ webTablesPage }) => {
    await expect(webTablesPage.rows).toHaveCount(3);
    await expect(webTablesPage.rows.locator('td:first-child')).toHaveText(['Cierra', 'Alden', 'Kierra']);
  });

  // Data-driven: one test per record in test-data/web-table-records.json
  for (const record of records as WebTableRecord[]) {
    test(`TC-WT-02 add a new record: ${record.firstName} ${record.lastName}`, { tag: '@smoke' }, async ({ webTablesPage }) => {
      await webTablesPage.addRecord(record);

      await expect(webTablesPage.modal).toBeHidden();
      await expect(webTablesPage.rows).toHaveCount(4);
      await expect(webTablesPage.rowCells(record.email)).toHaveText(toCells(record));
    });
  }

  test('TC-WT-03 required fields are validated', async ({ webTablesPage }) => {
    await webTablesPage.openAddForm();
    await webTablesPage.submitButton.click();

    await expect(webTablesPage.modal).toBeVisible();
    for (const field of [
      webTablesPage.firstName,
      webTablesPage.lastName,
      webTablesPage.email,
      webTablesPage.age,
      webTablesPage.salary,
      webTablesPage.department,
    ]) {
      await expect(field).toBeInvalid();
    }
    await expect(webTablesPage.rows).toHaveCount(3);
  });

  test.describe('TC-WT-04 boundary: age', () => {
    const base = records[0] as WebTableRecord;

    test('non-numeric age is rejected', async ({ webTablesPage }) => {
      await webTablesPage.addRecord({ ...base, age: 'abc' });

      await expect(webTablesPage.modal).toBeVisible();
      await expect(webTablesPage.age).toBeInvalid();
    });

    test('two-digit age (99) is accepted', async ({ webTablesPage }) => {
      await webTablesPage.addRecord({ ...base, age: '99' });

      await expect(webTablesPage.modal).toBeHidden();
      await expect(webTablesPage.rowCells(base.email).nth(2)).toHaveText('99');
    });

    test('age is limited to two digits (typing 100 gives 10)', async ({ webTablesPage }) => {
      await webTablesPage.openAddForm();
      // pressSequentially types like a user, so the maxlength="2" limit applies.
      await webTablesPage.age.pressSequentially('100');

      await expect(webTablesPage.age).toHaveValue('10');
    });
  });

  test('TC-WT-05 edit a record', async ({ webTablesPage }) => {
    await webTablesPage.edit('cierra@example.com', { salary: '12345' });

    await expect(webTablesPage.modal).toBeHidden();
    await expect(webTablesPage.rowCells('cierra@example.com').nth(4)).toHaveText('12345');
  });

  test('TC-WT-06 delete a record', async ({ webTablesPage }) => {
    await webTablesPage.delete('alden@example.com');

    await expect(webTablesPage.row('alden@example.com')).toHaveCount(0);
    await expect(webTablesPage.rows).toHaveCount(2);
  });

  test('TC-WT-07 search filters the table', async ({ webTablesPage }) => {
    await webTablesPage.search('Kierra');
    await expect(webTablesPage.rows).toHaveCount(1);
    await expect(webTablesPage.rows.first()).toContainText('Kierra');

    await webTablesPage.search('zzz');
    await expect(webTablesPage.rows).toHaveCount(0);

    await webTablesPage.search('');
    await expect(webTablesPage.rows).toHaveCount(3);
  });
});
