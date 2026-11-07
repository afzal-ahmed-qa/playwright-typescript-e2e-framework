# Playwright + TypeScript E2E framework for DemoQA

[![Playwright Tests](https://github.com/afzal-ahmed-qa/playwright-typescript-e2e-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/afzal-ahmed-qa/playwright-typescript-e2e-framework/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.48-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)

Test automation for [demoqa.com](https://demoqa.com) using Playwright, TypeScript and the Page
Object Model. It covers the UI, the Book Store API, a few end-to-end user journeys and some
accessibility and visual checks. GitHub Actions runs it on every push and publishes the HTML
report here: https://afzal-ahmed-qa.github.io/playwright-typescript-e2e-framework/. Every test in
the report has a video and a screenshot attached.

I started by writing a [manual test plan](docs/manual-test-plan.md) and going through the cases
by hand before automating anything. Each test name starts with the ID of its case in that plan
(`TC-BT-01`, `E2E-03` and so on), so any result in the report can be traced back to the written
case. A few real bugs turned up along the way; they're listed at the bottom.

I've also written a separate set of manual test plans for an e-commerce site and its API, if
that side of testing is more relevant to you:
[manual-test-plans-ecommerce](https://github.com/afzal-ahmed-qa/manual-test-plans-ecommerce).

## What's tested

- End-to-end journeys: a Book Store reader logs in, finds a book, adds it to their collection,
  deletes it and logs out; a student finds the registration form from the home page and enrols;
  an HR user adds, edits and removes an employee record.
- Elements pages: text box validation, the checkbox tree, radio buttons, web table add/edit/delete
  and search, double and right click, links that open new tabs or return HTTP status codes, file
  upload and download, and buttons that only become usable after a delay.
- Practice form: required fields, mobile number boundaries and the State/City dropdowns that
  depend on each other.
- Alerts, frames and new windows, plus the slider, progress bar, select menu and drag and drop.
- Book Store API: the book list and its schema, creating a user, generating a token, and the 406
  you get for a duplicate user.
- A visual comparison of the practice form, keyboard-only use of the text box form and an axe
  accessibility scan.

That's 68 tests: 66 run in Chromium and 2 are API-only. 13 are tagged `@smoke` and 4 are `@e2e`.

## Project layout

```
pages/              page objects, grouped the same way as the site's menu
  BasePage.ts       open(), URL check and handling of native browser dialogs
  components/       pieces used on several pages (side menu, modals, confirm dialog)
api/                small typed client for the Book Store and Account endpoints
fixtures/           injects page objects, the API client and test users into each test
test-data/          Faker factories, a JSON data set and a file for the upload test
tests/
  e2e/              the multi-page journeys
  ui/               tests for individual pages
  api/              API tests (no browser)
  non-functional/   visual and accessibility
docs/               manual test plan and the bugs I found
```

## How it's put together

Spec files don't contain selectors. Page objects expose actions like `addEmployee()` or
`requestBookDeletion()`, and the locators the tests need for assertions. That paid off early:
DemoQA rebuilt its Check Box page while I was working on this, and the fix only touched
`CheckBoxPage.ts`. Anything that appears on more than one page, like the side menu and the
modals, is its own component class.

Test data is set up through the API wherever I could. The `testUser` fixture creates a new Book
Store account for each test and deletes it afterwards. `loggedInUser` goes a step further and sets
the session cookies directly, so a test can start on the Profile page without going through the
login form. Names, emails and so on come from Faker, which stops parallel runs from clashing.

There are no hard-coded waits. The delayed buttons, the timed alert and the progress bar all rely
on Playwright's auto-retrying assertions.

Where the site itself is broken I've kept the test and marked it instead of deleting it. The
Practice Form's Close button throws a JavaScript error, so that test is wrapped in `test.fail()`.
If DemoQA ever fixes it, the test will be reported as an unexpected pass and I'll know to update it.

The journeys are split into `test.step` blocks so the report shows which part of a flow failed.
E2E-04, for example:

```ts
test('E2E-04 HR adds a new starter, updates their details, then removes them', async ({ webTablesPage }) => {
  const employee = buildEmployee();
  ...
  await test.step(`add ${employee.firstName} ${employee.lastName}`, async () => {
    await webTablesPage.addEmployee(employee);
    await expect(webTablesPage.cellsFor(employee.email)).toHaveText(tableRow(employee));
  });

  await test.step('give them a raise and move department', async () => {
    await webTablesPage.editEmployee(employee.email, promotion);
    ...
```

## Running it locally

You'll need Node.js 20 or 22. I tried Node 26 first and Playwright 1.48's browser download hung
on it, so CI is pinned to Node 22 as well.

```bash
git clone https://github.com/afzal-ahmed-qa/playwright-typescript-e2e-framework.git
cd playwright-typescript-e2e-framework
npm ci
npx playwright install --with-deps chromium
```

```bash
npm test                    # everything
npm run test:e2e            # just the journeys
npm run test:smoke          # quick check, @smoke only
npm run test:api            # API tests only
npm run test:headed         # visible browser, one test at a time
npm run test:ui             # Playwright UI mode
npm run report              # open the last HTML report
npm run typecheck
```

To run a single case, filter by its ID: `npx playwright test -g "E2E-01"`. If you want to watch
a run, `SLOW_MO` adds a delay (in ms) to every action:

```powershell
$env:SLOW_MO = "400"; npm run test:headed -- tests/e2e      # PowerShell
```
```bash
SLOW_MO=400 npm run test:headed -- tests/e2e                # bash
```

`BASE_URL` points the suite at a different environment. It defaults to `https://demoqa.com`.

## CI

The [workflow](.github/workflows/playwright.yml) runs the API tests and the Chromium tests as two
parallel jobs (the API job also runs the TypeScript check). A third job merges their results into
one HTML report, keeps it as a build artifact for 30 days and publishes it to GitHub Pages.

Failed tests are retried up to twice on CI, because DemoQA is a shared public site and is
sometimes slow. The visual test only runs locally, since screenshots render slightly differently
on each OS. The committed baseline is from Windows; on another OS run `npm run test:visual:update`
once to create your own.

## Bugs found on DemoQA

Full steps are in [docs/defects.md](docs/defects.md).

- DEF-001: the "Permanent Address" field on the Text Box page has no accessible label (axe rates
  it critical). The accessibility test allow-lists this one issue, so it still fails on anything new.
- DEF-002: the Close button on the Practice Form confirmation throws `findDOMNode is not a
  function` and the modal stays open. Covered by a `test.fail()` test; Escape closes it.
- DEF-003: the Links page says "staus" instead of "status".
- DEF-004: the Text Box output says "Permananet Address".

## Next on my list

- Add Firefox and WebKit projects back once the suite is stable enough to justify the extra CI time.
- Run the visual test in a Docker image so the baseline is the same on every machine.
- Contract tests for the Book Store API using its Swagger definition.

---

Afzal Ahmed, [github.com/afzal-ahmed-qa](https://github.com/afzal-ahmed-qa)
