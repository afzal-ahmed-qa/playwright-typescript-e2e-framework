import { test, expect } from '../../../fixtures';
import { tableRow } from '../../../pages/elements/WebTablesPage';
import { buildEmployee, type Employee } from '../../../test-data/factories';
import employees from '../../../test-data/web-table-records.json';

test.describe('Web Tables', () => {
  test.beforeEach(async ({ webTablesPage }) => {
    await webTablesPage.open();
  });

  test('TC-WT-01 the table starts with three employees', async ({ webTablesPage }) => {
    await expect(webTablesPage.firstNames).toHaveText(['Cierra', 'Alden', 'Kierra']);
  });

  // Data-driven: one test per row in test-data/web-table-records.json
  for (const employee of employees as Employee[]) {
    test(`TC-WT-02 add ${employee.firstName} ${employee.lastName} (${employee.department})`, async ({
      webTablesPage,
    }) => {
      await webTablesPage.addEmployee(employee);

      await expect(webTablesPage.form.root).toBeHidden();
      await expect(webTablesPage.rows).toHaveCount(4);
      await expect(webTablesPage.cellsFor(employee.email)).toHaveText(tableRow(employee));
    });
  }

  test('TC-WT-03 every field is required', async ({ webTablesPage }) => {
    await webTablesPage.openAddForm();
    await webTablesPage.form.submit();

    await expect(webTablesPage.form.root).toBeVisible();
    for (const field of webTablesPage.form.allFields) {
      await expect(field).toBeInvalid();
    }
  });

  test.describe('TC-WT-04 age field boundaries', () => {
    test('letters are rejected', async ({ webTablesPage }) => {
      await webTablesPage.addEmployee(buildEmployee({ age: 'abc' }));

      await expect(webTablesPage.form.root).toBeVisible();
      await expect(webTablesPage.form.age).toBeInvalid();
    });

    test('99 is accepted', async ({ webTablesPage }) => {
      const employee = buildEmployee({ age: '99' });
      await webTablesPage.addEmployee(employee);

      await expect(webTablesPage.cellsFor(employee.email).nth(2)).toHaveText('99');
    });

    test('a third digit cannot be typed', async ({ webTablesPage }) => {
      await webTablesPage.openAddForm();
      await webTablesPage.form.typeAge('100');

      await expect(webTablesPage.form.age).toHaveValue('10');
    });
  });

  test('TC-WT-05 editing a row updates it in place', async ({ webTablesPage }) => {
    await webTablesPage.editEmployee('cierra@example.com', { salary: '12345' });

    await expect(webTablesPage.cellsFor('cierra@example.com').nth(4)).toHaveText('12345');
  });

  test('TC-WT-06 deleting a row removes only that row', async ({ webTablesPage }) => {
    await webTablesPage.deleteEmployee('alden@example.com');

    await expect(webTablesPage.rowFor('alden@example.com')).toHaveCount(0);
    await expect(webTablesPage.firstNames).toHaveText(['Cierra', 'Kierra']);
  });

  test('TC-WT-07 search filters as you type', async ({ webTablesPage }) => {
    await webTablesPage.search('Kierra');
    await expect(webTablesPage.firstNames).toHaveText(['Kierra']);

    await webTablesPage.search('nobody-matches-this');
    await expect(webTablesPage.rows).toHaveCount(0);

    await webTablesPage.clearSearch();
    await expect(webTablesPage.rows).toHaveCount(3);
  });
});
