# DemoQA Test Automation Framework

[![Playwright Tests](https://github.com/afzal-ahmed-qa/playwright-typescript-e2e-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/afzal-ahmed-qa/playwright-typescript-e2e-framework/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.48-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
[![Test Report](https://img.shields.io/badge/Test%20Report-live-blue?logo=githubpages&logoColor=white)](https://afzal-ahmed-qa.github.io/playwright-typescript-e2e-framework/)

UI, API and end-to-end tests for [demoqa.com](https://demoqa.com), written in TypeScript with
Playwright and the Page Object Model.

**[Latest test report →](https://afzal-ahmed-qa.github.io/playwright-typescript-e2e-framework/)** (video and screenshot for every test, published from CI)

I wrote the [test plan](docs/manual-test-plan.md) first and ran every case by hand before
automating it. That's how the [defects](docs/defects.md) listed below were found, and why each
automated test starts with the ID of the manual case it covers.

## What's covered

| Area | Examples |
|---|---|
| **End-to-end journeys** | Reader logs in, finds a book, adds it to their collection, deletes it, logs out · Student enrols through the full registration form · HR adds, edits and removes an employee |
| Elements | Form validation, checkbox tree, radio buttons, table CRUD and search, mouse clicks, new tabs, HTTP status links, upload and download, delayed elements |
| Forms | Required fields, mobile number boundaries, dependent State/City dropdowns |
| Alerts, Frames & Windows | Alert, timed alert, confirm and prompt dialogs, new tab, iframe |
| Widgets & Interactions | Slider, progress bar, select menu, drag and drop |
| Book Store API | Book listing schema, account creation, token, duplicate user (406) |
| Non-functional | Visual regression, keyboard-only use, axe WCAG scan |

68 tests in total: 66 browser tests on Chromium and 2 API tests. 13 are tagged `@smoke`
and 4 are `@e2e` journeys.

## How the framework is put together

```
pages/                 one class per page, grouped like the site's menu
  BasePage.ts          open(), URL check, native dialog handling
  components/          parts reused across pages: SideMenu, RegistrationForm, SubmissionModal, ConfirmDialog
  elements/ forms/ alerts/ widgets/ bookstore/
api/BookStoreApi.ts    typed client for the Book Store and Account endpoints
fixtures/              page objects, API client and test users injected into each test; custom matcher
test-data/             data factories (Faker), JSON data set, upload file
tests/
  e2e/                 multi-page user journeys
  ui/                  feature tests per page
  api/                 API tests, no browser
  non-functional/      visual and accessibility
docs/                  test plan and defect log
```

A few decisions worth calling out:

- **Page objects own the "how", tests own the "what".** Tests only call intent-level
  methods (`addEmployee`, `requestBookDeletion`, `answerPrompt`) and assert on exposed
  locators. There are no selectors in spec files, so a markup change is fixed in one place.
- **Components for anything shared.** The side menu, modals and dialogs are their own classes
  and are composed into pages, not copied between them.
- **Setup through the API, verification through the UI.** `testUser` creates a fresh Book Store
  account per test and deletes it afterwards. `loggedInUser` goes one step further and injects
  the session cookies, so a test can start on the Profile page without using the login form.
- **Fresh data every run.** Factories in `test-data/factories.ts` generate students, employees
  and users with Faker, so tests don't collide with each other or with leftovers on the shared site.
- **No fixed waits.** Delayed elements, timed alerts and the progress bar rely on Playwright's
  retrying assertions. There isn't a `waitForTimeout` anywhere in the suite.
- **Known bugs are visible, not skipped.** Site defects are logged and handled explicitly. For
  example, the broken Close button is a `test.fail()`, which turns into an alert once the site fixes it.

Here's what one of the journeys looks like:

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

Each `test.step` shows up as a named step in the HTML report, so a failed journey shows
exactly which part broke.

## Running it

Requires Node.js 20 or 22 LTS.

```bash
git clone https://github.com/afzal-ahmed-qa/playwright-typescript-e2e-framework.git
cd playwright-typescript-e2e-framework
npm ci
npx playwright install --with-deps chromium
```

| Command | Runs |
|---|---|
| `npm test` | Everything |
| `npm run test:e2e` | The end-to-end journeys |
| `npm run test:smoke` | Quick health check (`@smoke`) |
| `npm run test:api` | API tests only |
| `npm run test:a11y` / `test:visual` | Accessibility / visual tests |
| `npm run test:visual:update` | Re-create the visual baseline |
| `npm run test:headed` | Visible browser, one test at a time |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open the last HTML report |
| `npm run typecheck` | TypeScript check |

To watch a run, slow it down with `SLOW_MO` (milliseconds per action):

```powershell
$env:SLOW_MO = "400"; npm run test:headed -- tests/e2e
```

```bash
SLOW_MO=400 npm run test:headed -- tests/e2e
```

A single case can be run by its ID: `npx playwright test -g "E2E-01"`.
`BASE_URL` points the suite at another environment (default `https://demoqa.com`).

## Reports and CI

Every test records a video and a final screenshot, passed or failed. Failures also keep a
trace with DOM snapshots, network calls and console output for each step.

GitHub Actions ([workflow](.github/workflows/playwright.yml)) runs on every push and pull request:

```
test (api) ──────┐
                 ├──► merge into one HTML report ──► publish to GitHub Pages (main only)
test (chromium) ─┘
```

- API and browser jobs run in parallel. The API job also runs the type check.
- The merged report is published to [GitHub Pages](https://afzal-ahmed-qa.github.io/playwright-typescript-e2e-framework/)
  and kept as a build artifact for 30 days.
- CI retries a failed test up to twice, since the public site is occasionally slow.
- Visual tests run locally only, because screenshot baselines differ between operating systems.
  The committed baseline is for Windows. Run `npm run test:visual:update` once on other systems.

## Defects found

Running the plan turned up real issues on DemoQA. Details and reproduction steps are in
[docs/defects.md](docs/defects.md).

| ID | Defect | Handling in the suite |
|---|---|---|
| DEF-001 | "Permanent Address" field has no accessible label | Allow-listed so the axe scan still catches new issues |
| DEF-002 | Practice Form "Close" button throws a JS error | `test.fail()`, which flags it once fixed |
| DEF-003 | Links page says "staus" instead of "status" | Assertion accepts both |
| DEF-004 | Text Box output says "Permananet Address" | Assertion checks the value only |

---

Afzal Ahmed · [GitHub](https://github.com/afzal-ahmed-qa)
