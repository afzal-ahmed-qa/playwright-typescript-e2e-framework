import { test, expect } from '../../fixtures';
import { buildEmployee } from '../../test-data/factories';
import { tableRow } from '../../pages/elements/WebTablesPage';

test.describe('Employee records journey', { tag: '@e2e' }, () => {
  test('E2E-04 HR adds a new starter, updates their details, then removes them', async ({ webTablesPage }) => {
    const employee = buildEmployee();
    const promotion = { salary: String(Number(employee.salary) + 2500), department: 'Management' };

    await webTablesPage.open();
    const startingRows = await webTablesPage.rows.count();

    await test.step(`add ${employee.firstName} ${employee.lastName}`, async () => {
      await webTablesPage.addEmployee(employee);

      await expect(webTablesPage.form.root).toBeHidden();
      await expect(webTablesPage.rows).toHaveCount(startingRows + 1);
      await expect(webTablesPage.cellsFor(employee.email)).toHaveText(tableRow(employee));
    });

    await test.step('find them with the search box', async () => {
      await webTablesPage.search(employee.lastName);

      await expect(webTablesPage.rows).toHaveCount(1);
      await expect(webTablesPage.rowFor(employee.email)).toBeVisible();
    });

    await test.step('give them a raise and move department', async () => {
      await webTablesPage.editEmployee(employee.email, promotion);

      await expect(webTablesPage.cellsFor(employee.email)).toHaveText(tableRow({ ...employee, ...promotion }));
    });

    await test.step('remove them when they leave', async () => {
      await webTablesPage.deleteEmployee(employee.email);
      await expect(webTablesPage.rows).toHaveCount(0);

      await webTablesPage.clearSearch();
      await expect(webTablesPage.rows).toHaveCount(startingRows);
      await expect(webTablesPage.rowFor(employee.email)).toHaveCount(0);
    });
  });
});
