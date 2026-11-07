# Manual Test Plan – DemoQA

| | |
|---|---|
| **Application under test** | https://demoqa.com (public QA practice site) |
| **Author** | Afzal Ahmed |
| **Version** | 1.1 – 2026-11-07 |
| **Status** | Executed manually; all cases automated. See the [README](../README.md) |

---

## 1. Purpose

This plan defines what is tested on DemoQA, why, and how. Each case was written and executed
manually before being automated with Playwright, so the automated suite reflects behaviour that
was observed on the real site rather than assumed.

Test case IDs (for example `TC-TB-01`) are used as the prefix of the matching automated test,
which keeps every result traceable back to this document. End-to-end scenarios use `E2E-NN`.

## 2. Scope

### In scope

| Module | Page(s) | Why it is worth testing |
|---|---|---|
| Elements | Text Box, Check Box, Radio Button, Web Tables, Buttons, Links, Upload/Download, Dynamic Properties | Core form controls, tables, waits |
| Forms | Practice Form | Long form, validation, date picker, file upload, modal |
| Alerts, Frames & Windows | Browser Windows, Alerts, Frames | New tabs, JS dialogs, iframes |
| Widgets | Select Menu, Slider, Progress Bar | Custom (non-native) controls |
| Interactions | Droppable | Drag and drop |
| Book Store | Login, Books, Book Store API | Authentication, API testing |

### Out of scope

- Performance and load testing (DemoQA is a shared public site, and load testing it would be abusive)
- Security testing
- Pages with known bugs or that are unstable on DemoQA (for example *Broken Links*). They are listed but not prioritised.

## 3. Test approach

| Type | Description | Example |
|---|---|---|
| **Functional: positive** | Valid input → feature works | Submit Text Box with valid data |
| **Functional: negative** | Invalid input → app handles it gracefully | Invalid email is highlighted |
| **Boundary value** | Test at the edges of allowed values | Mobile number with 9 / 10 / 11 digits |
| **Data-driven** | Same steps, many data sets | Add several users to Web Tables |
| **UI state / waits** | Elements that change over time | Button enabled after 5 seconds |
| **API** | Test the backend directly, without a browser | Create user, get token, list books |
| **Hybrid (API + UI)** | Set up data via API, verify in UI | Create user via API → log in via UI |
| **Visual regression** | Compare screenshots to a baseline | Practice Form layout |
| **Accessibility** | Check for a11y issues (WCAG) | Automated axe scan of key pages |
| **End-to-end** | A complete user goal across several pages | Log in → add a book → manage the collection → log out |

## 4. Test environment

| Item | Value |
|---|---|
| Browser | Chrome (Chromium) only |
| Screen size | Desktop 1280×720 (mobile viewport as a later extension) |
| Test data | Fake names/emails only, never real personal data |
| Tools (manual) | Browser + DevTools (for checking elements and network calls) |
| Tools (automation) | Playwright Test, TypeScript, GitHub Actions |

**Note:** DemoQA serves third-party ads that can overlap controls during manual runs. The
automated suite blocks ad domains at the network level.

## 5. Test case format

- **ID**: `TC-<module>-<number>`, matching the automated test name.
- **Priority**: **High** = core feature, run on every change. **Medium** = important. **Low** = nice to have.
- **Steps / Expected result**: expected result is checked after each step.
- **Actual result / Status**: recorded during manual execution. Deviations are logged in
  [defects.md](defects.md).

---

## 6. Test cases

### 6.1 Elements – Text Box (`/text-box`)

#### TC-TB-01 · Submit with all valid data
**Priority:** High · **Type:** Functional (positive)
**Preconditions:** Open https://demoqa.com/text-box

| # | Step | Expected result |
|---|---|---|
| 1 | Enter Full Name `John Smith` | Text appears in the field |
| 2 | Enter Email `john.smith@example.com` | Text appears in the field |
| 3 | Enter Current Address `1 Main Street` | Text appears in the field |
| 4 | Enter Permanent Address `2 High Street` | Text appears in the field |
| 5 | Click **Submit** | An output box appears below showing Name, Email, Current Address and Permanent Address with the values entered |

**Actual result:** ______ **Status:** ☐ Pass ☐ Fail

#### TC-TB-02 · Invalid email is rejected
**Priority:** High · **Type:** Functional (negative)
**Preconditions:** Open `/text-box`

| # | Step | Expected result |
|---|---|---|
| 1 | Enter Full Name `John Smith` | – |
| 2 | Enter Email `john.smith` (no @ or domain) | – |
| 3 | Click **Submit** | Email field gets a **red border**. Output box does **not** show the email |

**Actual result:** ______ **Status:** ☐ Pass ☐ Fail

#### TC-TB-03 · Submit with all fields empty
**Priority:** Low · **Type:** Functional (negative)

| # | Step | Expected result |
|---|---|---|
| 1 | Leave all fields empty and click **Submit** | No output box appears and no error is shown on the page |

**Actual result:** ______ **Status:** ☐ Pass ☐ Fail

---

### 6.2 Elements – Check Box (`/checkbox`)

#### TC-CB-01 · Nothing selected by default
**Priority:** Medium · **Type:** UI state

| # | Step | Expected result |
|---|---|---|
| 1 | Open `/checkbox` | Tree shows **Home** collapsed and unticked. No "You have selected" text |

#### TC-CB-02 · Selecting a folder selects all its children
**Priority:** High · **Type:** Functional (positive)

| # | Step | Expected result |
|---|---|---|
| 1 | Expand **Home** (click the arrow) | Desktop, Documents, Downloads are shown |
| 2 | Tick **Desktop** | Desktop is ticked. Home shows a *partial* (half) tick. Documents and Downloads stay unticked |
| 3 | Read the result text | "You have selected : desktop notes commands" |

#### TC-CB-03 · Unselecting clears the result
**Priority:** Medium · **Type:** Functional

| # | Step | Expected result |
|---|---|---|
| 1 | Do TC-CB-02 steps 1–2 | Desktop is ticked |
| 2 | Untick **Desktop** | Nothing ticked. Result text disappears |

#### TC-CB-04 · Selecting Home selects everything
**Priority:** Medium · **Type:** Functional

| # | Step | Expected result |
|---|---|---|
| 1 | Tick **Home** | All child folders are ticked. Result lists every item in the tree (home, desktop, notes, commands, documents, …) |

**Automated in:** `tests/ui/elements/check-box.spec.ts`

---

### 6.3 Elements – Radio Button (`/radio-button`)

#### TC-RB-01 · Select each enabled option
**Priority:** High · **Type:** Functional (positive), data-driven

| # | Step | Expected result |
|---|---|---|
| 1 | Click **Yes** | "You have selected **Yes**" |
| 2 | Click **Impressive** | "You have selected **Impressive**". Yes is no longer selected |

#### TC-RB-02 · Disabled option cannot be selected
**Priority:** Medium · **Type:** Functional (negative)

| # | Step | Expected result |
|---|---|---|
| 1 | Try to click **No** | Option is greyed out and cannot be selected. Result text does not change |

---

### 6.4 Elements – Web Tables (`/webtables`)

#### TC-WT-01 · Default data is shown
**Priority:** Medium · **Type:** UI state

| # | Step | Expected result |
|---|---|---|
| 1 | Open `/webtables` | Table shows 3 rows with first names Cierra, Alden and Kierra |

#### TC-WT-02 · Add a new record
**Priority:** High · **Type:** Functional (positive), data-driven

| # | Step | Expected result |
|---|---|---|
| 1 | Click **Add** | "Registration Form" modal opens |
| 2 | Fill First Name `Jane`, Last Name `Doe`, Email `jane@example.com`, Age `30`, Salary `5000`, Department `QA` | – |
| 3 | Click **Submit** | Modal closes. New row with all entered values appears in the table |

**Data-driven:** repeated for each record in `test-data/web-table-records.json`.

#### TC-WT-03 · Required fields are validated
**Priority:** High · **Type:** Functional (negative)

| # | Step | Expected result |
|---|---|---|
| 1 | Click **Add**, leave all fields empty, click **Submit** | Modal stays open. Empty required fields are highlighted red |

#### TC-WT-04 · Boundary: Age accepts numbers only
**Priority:** Medium · **Type:** Boundary / negative

| # | Step | Expected result |
|---|---|---|
| 1 | In Add form, enter Age `abc` with all other fields valid and submit | Age is highlighted red. Record is not added |
| 2 | Enter Age `99` | Accepted |
| 3 | Type Age `100` (3 digits) | Field only accepts 2 characters, so it shows `10` (maxlength = 2) |

#### TC-WT-05 · Edit a record
**Priority:** High · **Type:** Functional

| # | Step | Expected result |
|---|---|---|
| 1 | Click the ✏️ edit icon on row **Cierra** | Modal opens with Cierra's data filled in |
| 2 | Change Salary to `12345` and submit | Cierra's row shows salary 12345 |

#### TC-WT-06 · Delete a record
**Priority:** High · **Type:** Functional

| # | Step | Expected result |
|---|---|---|
| 1 | Click the 🗑️ delete icon on row **Alden** | Alden's row is removed. Other rows remain |

#### TC-WT-07 · Search filters the table
**Priority:** Medium · **Type:** Functional

| # | Step | Expected result |
|---|---|---|
| 1 | Type `Kierra` in the search box | Only Kierra's row is shown |
| 2 | Type `zzz` | Table shows no rows ("No rows found" or empty) |
| 3 | Clear the search | All rows are shown again |

---

### 6.5 Elements – Buttons (`/buttons`)

#### TC-BT-01 · Double click
**Priority:** High · **Type:** Functional
| # | Step | Expected result |
|---|---|---|
| 1 | Double-click **Double Click Me** | "You have done a double click" |

#### TC-BT-02 · Right click
**Priority:** High · **Type:** Functional
| # | Step | Expected result |
|---|---|---|
| 1 | Right-click **Right Click Me** | "You have done a right click" |

#### TC-BT-03 · Single click
**Priority:** High · **Type:** Functional
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Click Me** | "You have done a dynamic click" |

#### TC-BT-04 · Wrong interaction gives no message
**Priority:** Medium · **Type:** Functional (negative)
| # | Step | Expected result |
|---|---|---|
| 1 | Single-click **Double Click Me** | No message appears |

**Automated in:** `tests/ui/elements/buttons.spec.ts`

---

### 6.6 Elements – Links (`/links`)

#### TC-LK-01 · "Home" link opens a new tab
**Priority:** High · **Type:** Functional (multi-tab)
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Home** | A new browser tab opens on https://demoqa.com |

#### TC-LK-02 · API links show the HTTP status
**Priority:** Medium · **Type:** Functional + network, data-driven
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Created** | Message shows status **201** and "Created" |
| 2 | Click **Not Found** | Message shows status **404** and "Not Found" |
| 3 | (Optional) Open DevTools → Network while clicking | You can see the matching API call and status code |

---

### 6.7 Elements – Upload and Download (`/upload-download`)

#### TC-UD-01 · Upload a file
**Priority:** High · **Type:** Functional
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Choose File** and pick a small file, e.g. `sample.txt` | Path shown below, ending in `sample.txt` (e.g. `C:\fakepath\sample.txt`) |

#### TC-UD-02 · Download a file
**Priority:** Medium · **Type:** Functional
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Download** | A file (sampleFile.jpeg) is downloaded |

---

### 6.8 Elements – Dynamic Properties (`/dynamic-properties`)

#### TC-DP-01 · Button becomes enabled after a delay
**Priority:** High · **Type:** UI state / waits
| # | Step | Expected result |
|---|---|---|
| 1 | Open the page and look at **Will enable 5 seconds** straight away | Button is disabled |
| 2 | Wait ~5 seconds | Button is enabled |

#### TC-DP-02 · Button appears after a delay
**Priority:** High · **Type:** UI state / waits
| # | Step | Expected result |
|---|---|---|
| 1 | Open the page | **Visible After 5 Seconds** is not shown |
| 2 | Wait ~5 seconds | Button appears |

**Automation note:** no fixed sleeps. Assertions retry until the state changes (10 s timeout).

---

### 6.9 Forms – Practice Form (`/automation-practice-form`)

#### TC-PF-01 · Submit with only required fields
**Priority:** High · **Type:** Functional (positive)
| # | Step | Expected result |
|---|---|---|
| 1 | Enter First Name `John`, Last Name `Smith` | – |
| 2 | Select Gender **Male** | – |
| 3 | Enter Mobile `0123456789` (10 digits) | – |
| 4 | Click **Submit** | Modal "Thanks for submitting the form" shows the entered name, gender and mobile |
| 5 | Click **Close** | Modal closes. **Actual: fails, see DEF-002.** Escape closes it |

#### TC-PF-02 · Submit with all fields (automated as part of E2E-03)
**Priority:** High · **Type:** Functional (positive), end-to-end
| # | Step | Expected result |
|---|---|---|
| 1 | Fill every field: name, email, gender, mobile, date of birth (via date picker), subjects (e.g. Maths), hobbies, picture upload, address, state and city | Each control accepts input |
| 2 | Click **Submit** | Modal summary table shows **every** value entered, in the right row |

#### TC-PF-03 · Required fields are validated
**Priority:** High · **Type:** Functional (negative)
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Submit** with the form empty | No modal. First Name, Last Name, Gender and Mobile are highlighted red |

#### TC-PF-04 · Boundary: mobile number length
**Priority:** High · **Type:** Boundary
| # | Mobile entered | Expected result |
|---|---|---|
| 1 | `012345678` (9 digits) | Rejected, mobile field red, no modal |
| 2 | `0123456789` (10 digits) | Accepted |
| 3 | `01234567890` (11 digits) | Field only accepts 10 characters (11th is not typed) |
| 4 | `abcdefghij` | Rejected |

#### TC-PF-05 · City depends on State
**Priority:** Medium · **Type:** Functional (dependent fields)
| # | Step | Expected result |
|---|---|---|
| 1 | Before choosing a State, try to open **City** | City is disabled |
| 2 | Select State **NCR** | City becomes enabled and lists cities for NCR (e.g. Delhi) |

---

### 6.10 Alerts, Frames & Windows

#### TC-AL-01 · Simple alert
**Priority:** High · **Type:** Functional (JS dialog) · **Page:** `/alerts`
| # | Step | Expected result |
|---|---|---|
| 1 | Click the first **Click me** button | Browser alert "You clicked a button" |
| 2 | Click **OK** | Alert closes |

#### TC-AL-02 · Delayed alert
**Priority:** Medium · **Type:** Waits
| # | Step | Expected result |
|---|---|---|
| 1 | Click the "alert will appear after 5 seconds" button | Alert appears after ~5 s |

#### TC-AL-03 · Confirm box: OK and Cancel
**Priority:** High · **Type:** Functional, data-driven
| # | Step | Expected result |
|---|---|---|
| 1 | Click the confirm button, choose **OK** | "You selected **Ok**" |
| 2 | Click again, choose **Cancel** | "You selected **Cancel**" |

#### TC-AL-04 · Prompt box
**Priority:** High · **Type:** Functional
| # | Step | Expected result |
|---|---|---|
| 1 | Click the prompt button, type `Afzal`, click **OK** | "You entered **Afzal**" |

#### TC-WN-01 · New tab
**Priority:** High · **Type:** Multi-tab · **Page:** `/browser-windows`
| # | Step | Expected result |
|---|---|---|
| 1 | Click **New Tab** | New tab opens showing "This is a sample page" |

#### TC-FR-01 · Read text inside an iframe
**Priority:** Medium · **Type:** Iframes · **Page:** `/frames`
| # | Step | Expected result |
|---|---|---|
| 1 | Look at the first frame | It shows "This is a sample page" |

---

### 6.11 Widgets and Interactions

#### TC-WG-01 · Slider changes value
**Priority:** Low · **Page:** `/slider`
| # | Step | Expected result |
|---|---|---|
| 1 | Drag the slider to the right | The number box next to it shows the new value |

#### TC-WG-02 · Progress bar reaches 100%
**Priority:** Medium · **Type:** Waits · **Page:** `/progress-bar`
| # | Step | Expected result |
|---|---|---|
| 1 | Click **Start** and wait | Bar fills to **100%** and the button changes to **Reset** |

#### TC-WG-03 · Select menu (old-style native select)
**Priority:** Medium · **Page:** `/select-menu`
| # | Step | Expected result |
|---|---|---|
| 1 | In **Old Style Select Menu** choose `Green` | `Green` is shown as selected |

#### TC-IN-01 · Drag and drop
**Priority:** Medium · **Page:** `/droppable`
| # | Step | Expected result |
|---|---|---|
| 1 | Drag **Drag me** onto **Drop here** | Drop box text changes to **Dropped!** |

---

### 6.12 Book Store (UI + API)

> Create your own test user for these. Don't reuse a real password.

#### TC-BS-01 · Log in with valid credentials
**Priority:** High · **Type:** Functional (auth) · **Page:** `/login`
| # | Step | Expected result |
|---|---|---|
| 1 | Enter a valid username and password, click **Login** | Redirected to `/profile`. Username is displayed |

#### TC-BS-02 · Log in with a wrong password
**Priority:** High · **Type:** Functional (negative)
| # | Step | Expected result |
|---|---|---|
| 1 | Enter a valid username and wrong password | "Invalid username or password!" shown. Stays on login page |

#### TC-BS-03 · Search the book list
**Priority:** Medium · **Page:** `/books`
| # | Step | Expected result |
|---|---|---|
| 1 | Type `Git` in search | Only books whose title contains "Git" are listed |

#### TC-API-01 · Get all books (API)
**Priority:** High · **Type:** API
**Tool for manual run:** browser address bar, or Postman
| # | Step | Expected result |
|---|---|---|
| 1 | `GET https://demoqa.com/BookStore/v1/Books` | Status **200**. JSON with a non-empty `books` array. Each book has `isbn`, `title`, `author` |

#### TC-API-02 · Create user → generate token (API)
**Priority:** High · **Type:** API (chained requests)
| # | Step | Expected result |
|---|---|---|
| 1 | `POST /Account/v1/User` with a new `userName` and a strong `password` | Status **201**. Response contains `userID` |
| 2 | `POST /Account/v1/GenerateToken` with the same credentials | Status **200**. `status: "Success"` and a `token` |
| 3 | Repeat step 1 with the same username | Status **406**: "User exists!" |

#### TC-HY-01 · Create user via API, log in via UI (hybrid)
**Priority:** Medium · **Type:** Hybrid API + UI
| # | Step | Expected result |
|---|---|---|
| 1 | Create a user with TC-API-02 | User created |
| 2 | Log in with that user in the UI (TC-BS-01) | Profile shows that username |

**Automation note:** test users are created through the API and deleted after each test, so
UI tests never depend on pre-existing accounts.

---

### 6.13 Non-functional

#### TC-NF-01 · Visual check of Practice Form
**Priority:** Low · **Type:** Visual regression
| # | Step | Expected result |
|---|---|---|
| 1 | Open `/automation-practice-form` and take a screenshot | Layout looks correct. This screenshot becomes the "baseline" that later runs are compared against |

#### TC-NF-02 · Accessibility basics on Text Box
**Priority:** Low · **Type:** Accessibility
| # | Step | Expected result |
|---|---|---|
| 1 | Use only **Tab** to move through the form and **Enter** to submit | Every field can be reached and the form can be submitted without a mouse |
| 2 | (Optional) Run Lighthouse → Accessibility in Chrome DevTools | Note the score and any issues reported |

---

### 6.14 End-to-end scenarios

These cover complete user goals across several pages, the way a real user moves through the site.

#### E2E-01 · New reader builds and manages a reading list
**Priority:** High · **Type:** End-to-end, hybrid (user created via API)
| # | Step | Expected result |
|---|---|---|
| 1 | Log in with a newly registered account | Profile page shows the username and an empty collection |
| 2 | Click **Go To Book Store**, search `Git` | Only *Git Pocket Guide* is listed |
| 3 | Open *Git Pocket Guide* | Detail page shows ISBN 9781449325862, title and author |
| 4 | Click **Add To Your Collection** | Alert "Book added to your collection." |
| 5 | Open the Profile | *Git Pocket Guide* is in the collection |
| 6 | Click the delete icon, then **OK** in the confirmation | Alert "Book deleted.", collection is empty |
| 7 | Check the account through the API | API also reports no books |
| 8 | Click **Logout**, then open `/profile` | Redirected to Login; Profile says the user is not logged in |

#### E2E-02 · Returning reader sees books added elsewhere
**Priority:** Medium · **Type:** End-to-end, session created via API
| # | Step | Expected result |
|---|---|---|
| 1 | Add two books to the account through the API | HTTP 201 |
| 2 | Open `/profile` with an API-created session (no login form) | Username and both books are shown |
| 3 | Click delete on one book, then **Cancel** | Dialog closes, both books remain |

#### E2E-03 · Student finds the registration form and enrols
**Priority:** High · **Type:** End-to-end
| # | Step | Expected result |
|---|---|---|
| 1 | From the home page click **Forms**, then **Practice Form** in the side menu | Practice Form opens |
| 2 | Fill in every field (generated student data, photo upload, date picker, state/city) and submit | Confirmation modal opens |
| 3 | Check the summary table | Every value matches what was entered |
| 4 | Press Escape | Modal closes |

#### E2E-04 · HR manages an employee record from start to finish
**Priority:** High · **Type:** End-to-end, CRUD
| # | Step | Expected result |
|---|---|---|
| 1 | Add a new employee | New row appears with every value |
| 2 | Search by last name | Only that employee is listed |
| 3 | Edit salary and department | Row shows the new values |
| 4 | Delete the employee, clear the search | Row is gone, original rows remain |

---

## 7. Summary of test cases

| Module | Cases | High | Medium | Low |
|---|---|---|---|---|
| Text Box | 3 | 2 | 0 | 1 |
| Check Box | 4 | 1 | 3 | 0 |
| Radio Button | 2 | 1 | 1 | 0 |
| Web Tables | 7 | 4 | 3 | 0 |
| Buttons | 4 | 3 | 1 | 0 |
| Links | 2 | 1 | 1 | 0 |
| Upload/Download | 2 | 1 | 1 | 0 |
| Dynamic Properties | 2 | 2 | 0 | 0 |
| Practice Form | 5 | 4 | 1 | 0 |
| Alerts/Frames/Windows | 6 | 4 | 2 | 0 |
| Widgets/Interactions | 4 | 0 | 3 | 1 |
| Book Store UI/API | 6 | 4 | 2 | 0 |
| Non-functional | 2 | 0 | 0 | 2 |
| End-to-end | 4 | 3 | 1 | 0 |
| **Total** | **53** | **30** | **19** | **4** |

## 8. Defect reporting

If a test fails during the manual run, write a short bug report:

```
Title:        [Page] Short description of the problem
Test case:    TC-XX-NN
Steps:        1. … 2. … 3. …
Expected:     What should happen
Actual:       What happened (add a screenshot)
Browser/OS:   Chrome 1xx / Windows 11
Severity:     Critical / Major / Minor
```

Defects found so far are logged in [defects.md](defects.md).

## 9. Entry and exit criteria

- **Entry:** DemoQA is reachable. Test data is prepared.
- **Exit (manual phase):** every High-priority case has been executed and has a Pass/Fail status.
- **Exit (automation phase):** every High-priority case is automated, passes in CI on
  Chromium, and runs in under ~5 minutes.

---

## 10. Automation coverage

Every case above is automated. The test name starts with the case ID.

| Area | Spec file |
|---|---|
| End-to-end journeys (E2E-01 – 04) | `tests/e2e/*.spec.ts` |
| Elements (TC-TB, CB, RB, WT, BT, LK, UD, DP) | `tests/ui/elements/*.spec.ts` |
| Practice Form (TC-PF) | `tests/ui/forms/practice-form.spec.ts` |
| Alerts, Frames & Windows (TC-AL, WN, FR) | `tests/ui/alerts-frames-windows/*.spec.ts` |
| Widgets & Interactions (TC-WG, IN) | `tests/ui/widgets/widgets.spec.ts` |
| Book Store UI (TC-BS, HY) | `tests/ui/bookstore/bookstore.spec.ts` |
| Book Store API (TC-API) | `tests/api/bookstore.api.spec.ts` |
| Visual and accessibility (TC-NF) | `tests/non-functional/*.spec.ts` |

Framework design (Page Object Model, fixtures, test data) is described in the [README](../README.md).
