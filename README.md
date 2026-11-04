# DemoQA Test Automation Framework

[![Playwright Tests](https://github.com/afzal-ahmed-qa/playwrightE2eTests/actions/workflows/playwright.yml/badge.svg)](https://github.com/afzal-ahmed-qa/playwrightE2eTests/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.48-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
[![Test Report](https://img.shields.io/badge/Test%20Report-live-blue?logo=githubpages&logoColor=white)](https://afzal-ahmed-qa.github.io/playwrightE2eTests/)

📊 **[View the latest test report](https://afzal-ahmed-qa.github.io/playwrightE2eTests/)**, with a video, a screenshot and full steps for every test.

An end-to-end test automation framework for [demoqa.com](https://demoqa.com), built with
**Playwright** and **TypeScript** using the **Page Object Model**. It covers UI, API,
hybrid API + UI, visual regression and accessibility testing. It runs on Chrome (Chromium)
locally and on every push in GitHub Actions.

Every automated test traces back to a written manual test case. The approach is
*plan → run manually → automate*.

---

## Highlights

- **Page Object Model.** One class per page in [`pages/`](pages). Tests describe *what* to check and page objects know *how* to interact with the page.
- **Custom fixtures.** Page objects, an API client and a disposable test user are injected into tests through [`fixtures/index.ts`](fixtures/index.ts). There's no setup boilerplate in specs.
- **API and hybrid testing.** A typed [Book Store API client](api/BookStoreApi.ts). Test users are created through the API, used in the UI, then deleted.
- **Data-driven tests.** Web Tables records come from [`test-data/`](test-data). Links, alerts and boundary cases are parameterised.
- **Custom matcher.** `expect(field).toBeInvalid()` asserts HTML5 form validation and retries like built-in assertions.
- **No hard waits.** Delayed UI such as dynamic buttons, timed alerts and the progress bar is handled with Playwright's auto-retrying assertions, never `waitForTimeout`.
- **Resilient by design.** Third-party ads are blocked at the network layer, and locators prefer roles and labels over brittle CSS.
- **Defects tracked, not hidden.** Real site bugs are documented in [`docs/defects.md`](docs/defects.md) and handled explicitly (`test.fail`, allow-lists), so the suite stays green but honest.
- **CI/CD.** A GitHub Actions matrix runs the API and Chromium projects in parallel and uploads an HTML report for each.

## Test coverage

| Area | Pages | Test types |
|---|---|---|
| Elements | Text Box, Check Box, Radio Button, Web Tables, Buttons, Links, Upload/Download, Dynamic Properties | Functional (positive/negative), boundary, data-driven, multi-tab, network, file I/O, waits |
| Forms | Practice Form | End-to-end form, validation, boundary, dependent fields, date picker, file upload |
| Alerts, Frames & Windows | Alerts, Browser Windows, Frames | JS dialogs, new tabs, iframes |
| Widgets & Interactions | Slider, Progress Bar, Select Menu, Droppable | Custom controls, mouse interactions |
| Book Store | Login, Profile, Books | Authentication, search, hybrid API → UI |
| API | `/BookStore/v1/Books`, `/Account/v1/*` | Status codes, response schema, chained requests, negative cases |
| Non-functional | Practice Form, Text Box | Visual regression, keyboard accessibility, axe WCAG scan |

All **49 manual test cases** in the [test plan](docs/manual-test-plan.md) are automated
(65 tests once data-driven cases are expanded).

## Tech stack

| | |
|---|---|
| Test runner | [Playwright Test](https://playwright.dev) 1.48 |
| Language | TypeScript (strict mode) |
| Accessibility | [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) |
| CI | GitHub Actions |
| Reporting | Playwright HTML report with traces, screenshots and video on failure |

## Project structure

```
├── api/                      # API client (Book Store)
├── docs/
│   ├── manual-test-plan.md   # Test strategy and 49 manual test cases
│   └── defects.md            # Bugs found on DemoQA
├── fixtures/
│   └── index.ts              # Custom test fixtures and the toBeInvalid() matcher
├── pages/                    # Page Objects, one per page, all extend BasePage
├── test-data/                # JSON data sets, user generator, upload files
├── tests/
│   ├── api/                  # API tests (no browser)
│   ├── non-functional/       # Visual and accessibility tests
│   └── ui/                   # UI tests grouped by DemoQA section
│       ├── alerts-frames-windows/
│       ├── bookstore/
│       ├── elements/
│       ├── forms/
│       └── widgets/
├── playwright.config.ts
└── .github/workflows/playwright.yml
```

### How a test reads

```ts
test('TC-BT-01 double click shows the double click message', { tag: '@smoke' }, async ({ buttonsPage }) => {
  await buttonsPage.open();
  await buttonsPage.doubleClickButton.dblclick();

  await expect(buttonsPage.doubleClickMessage).toHaveText('You have done a double click');
});
```

Test names start with their test-case ID, so any result can be traced back to the
[manual test plan](docs/manual-test-plan.md).

## Getting started

**Prerequisites:** Node.js 20 or 22 LTS, and Git.

```bash
git clone https://github.com/afzal-ahmed-qa/playwrightE2eTests.git
cd playwrightE2eTests
npm ci
npx playwright install --with-deps
```

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | Everything: UI tests on Chromium plus API tests |
| `npm run test:chromium` | All UI tests on Chromium only |
| `npm run test:api` | API tests only (no browser) |
| `npm run test:smoke` | Tests tagged `@smoke`, a quick health check |
| `npm run test:a11y` | Accessibility tests |
| `npm run test:visual` | Visual regression tests |
| `npm run test:visual:update` | Re-create the visual baseline after an intended UI change |
| `npm run test:headed` | Chromium with a visible browser window |
| `npm run test:ui` | Playwright UI mode for debugging |
| `npm run report` | Open the last HTML report |
| `npm run typecheck` | TypeScript type check |

Run a single test case by its ID:

```bash
npx playwright test -g "TC-WT-02"
```

Point the suite at another environment:

```bash
BASE_URL=https://staging.example.com npm test
```

## Reports and debugging

- Every test, **passed or failed**, records a **video** and a final **screenshot**, both
  embedded in the HTML report.
- Failed tests also keep a **trace** (DOM snapshots, network and console for each step).
  Open it from the report or with `npx playwright show-trace <trace.zip>`.
- Locally, the report is written to `playwright-report/`. Open it with `npm run report`.
- On CI, the report is published to **[GitHub Pages](https://afzal-ahmed-qa.github.io/playwrightE2eTests/)**
  after every push to `main`, and is saved as the `playwright-report` artifact on each run for 30 days.

## Continuous integration

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on every push and
pull request to `main`, and can be started manually:

```
test (api) ──────┐
                 ├──► merge HTML report ──► publish to GitHub Pages (main only)
test (chromium) ─┘         │
                           └──► playwright-report artifact (30 days)
```

- The **api** and **chromium** jobs run in parallel and independently. Each one saves a blob report.
- The `api` job also runs the TypeScript type check.
- A **merge** job combines both into one HTML report and saves it as an artifact.
- A **deploy** job publishes it to GitHub Pages. This runs even when tests fail, so failures can be inspected online.
- Up to 2 retries on CI absorb network hiccups from the shared public site.
- Visual tests are excluded on CI, because screenshot baselines depend on the OS and are kept for local runs.

## Known defects

The suite found real bugs on DemoQA. They're documented in [`docs/defects.md`](docs/defects.md)
and handled explicitly in the tests:

| ID | Defect | How the suite handles it |
|---|---|---|
| DEF-001 | "Permanent Address" field has no accessible label | Allow-listed, so the axe scan still fails on any *new* critical issue |
| DEF-002 | Practice Form modal "Close" button throws a JS error | `test.fail()`, which flags it automatically once fixed |
| DEF-003/004 | Typos in on-page messages | Assertions target the meaningful value |

## Author

**Afzal Ahmed**, QA Automation Engineer · [GitHub](https://github.com/afzal-ahmed-qa)
