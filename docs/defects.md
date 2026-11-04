# Defect Log – DemoQA

Defects found while executing the [manual test plan](manual-test-plan.md) and the automated suite.
DemoQA is a public practice site, so these are recorded for reference rather than raised with a vendor.

| ID | Title | Severity | Found by | Status in suite |
|---|---|---|---|---|
| DEF-001 | Text Box: "Permanent Address" field has no accessible label | Major (a11y) | TC-NF-02 (axe scan) | Allow-listed in `accessibility.spec.ts` |
| DEF-002 | Practice Form: "Close" button on confirmation modal does not close it | Major | TC-PF-01 | Expected failure (`test.fail`) |
| DEF-003 | Links: API response message misspells "status" as "staus" | Minor | TC-LK-02 | Assertion accepts both spellings |
| DEF-004 | Text Box: output label misspells "Permanent" as "Permananet" | Minor | TC-TB-01 | Assertion checks the value only |

---

### DEF-001 · Text Box: "Permanent Address" field has no accessible label

| | |
|---|---|
| **Page** | https://demoqa.com/text-box |
| **Test case** | TC-NF-02 |
| **Severity** | Major (accessibility, WCAG 2.1 – 1.3.1 / 4.1.2) |
| **Browser/OS** | Chromium 130 / Windows 11 |

**Steps**
1. Open the Text Box page.
2. Run an axe accessibility scan on the form (`#userForm`) with WCAG 2 A/AA rules.

**Expected:** every form field has an accessible name, so screen readers can announce it.
**Actual:** axe reports a *critical* `label` violation on `#permanentAddress`. The visible
"Permanent Address" `<label>` has no `for` attribute, and unlike the other fields the textarea
has no placeholder, so it has no accessible name.

---

### DEF-002 · Practice Form: "Close" button does not close the confirmation modal

| | |
|---|---|
| **Page** | https://demoqa.com/automation-practice-form |
| **Test case** | TC-PF-01 |
| **Severity** | Major |
| **Browser/OS** | Chromium 130 / Windows 11 |

**Steps**
1. Fill First Name `John`, Last Name `Smith`, Gender `Male`, Mobile `0123456789`.
2. Click **Submit**. The "Thanks for submitting the form" modal opens.
3. Click **Close**.

**Expected:** the modal closes.
**Actual:** the modal stays open. The browser console shows
`Uncaught TypeError: findDOMNode is not a function`. That API was removed in newer
React versions. Pressing **Escape** closes the modal as a workaround.

**Automation:** the test `TC-PF-01 close button closes the confirmation modal` is marked
`test.fail()`. It passes while the bug exists and will be reported as an *unexpected pass* once
the site is fixed, which is the signal to remove the annotation.

---

### DEF-003 · Links: response message misspells "status"

| | |
|---|---|
| **Page** | https://demoqa.com/links |
| **Test case** | TC-LK-02 |
| **Severity** | Minor (cosmetic) |

**Steps:** click **Created**.
**Expected:** "Link has responded with **status** 201 and status text Created"
**Actual:** "Link has responded with **staus** 201 and status text Created"

---

### DEF-004 · Text Box: output label misspells "Permanent"

| | |
|---|---|
| **Page** | https://demoqa.com/text-box |
| **Test case** | TC-TB-01 |
| **Severity** | Minor (cosmetic) |

**Steps:** fill all fields and click **Submit**.
**Expected:** output line "Permanent Address :…"
**Actual:** output line "**Permananet** Address :…"
