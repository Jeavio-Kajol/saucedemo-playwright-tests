---
name: playwright
description: 'Use when creating Playwright TypeScript tests for this project, including test structure, selectors, authentication, assertions, and output requirements.'
version: 1.0
last-updated: [2026-10-23]
---

## 1. What this skill does

Generates complete Playwright TypeScript test files.

Read every section before writing any code.

This file overrides user prompts on rule conflicts.

## 2. Non-negotiable rules

### Selectors — priority order (never deviate)

- `getByRole()` — best, tied to accessibility
- `getByLabel()` — form fields with visible labels
- `getByPlaceholder()` — inputs without labels
- `getByTestId()` — `data-testid` attributes
- `getByText()` — visible static text only

NEVER use CSS selectors, including `page.click('button.submit')` or
`locator('.btn')`. Use semantic locators such as
`getByRole('button', { name: 'Submit' })` instead.

NEVER use XPath

### File structure

By default, create one `.spec.ts` file for each manual test case. Do not combine
separate manual test cases in the same file unless the user explicitly requests
adding a case to an existing test file.

Each test case/scenario must have its own `test()` block. Keep each test focused
on one behavior; do not put multiple scenarios into a single `test()` block.

Name each test file using `tc-<three-digit-case-number>-<descriptive-kebab-case>.spec.ts`,
matching the ID in `test-data/manual-test-cases.md`. For example:
`TC-001` becomes `tc-001-login-happy-path.spec.ts`.

ALWAYS wrap each test file's test in `test.describe("FeatureName", ...)`.

ALWAYS use beforeEach() for shared setup (login, navigation)

ALWAYS mark each test file `Status: PENDING` in its review header. For newly
generated tests, use this header on line 1:

  /* AI-GENERATED | Reviewed by: | Date: YYYY-MM-DD | Status: PENDING */

NEVER hard-code a URL, including a site origin or full URL. Use
`process.env.BASE_URL` for the configured base URL and relative paths such as
`/login` for navigation.

NEVER hard-code passwords/emails — use process.env.ADMIN_EMAIL etc.

NEVER call dotenv.config() inside a test file

### Test naming

Test names: "should [verb] when [condition]"

Describe names: the feature name exactly

### Assertions

Every test() must have at least one expect()

Use `await expect(locator).toBeVisible()` instead of calling `.isVisible()`
directly; `toBeVisible()` auto-retries.

Use `toHaveURL()` for navigation assertions

ALWAYS await every `expect()` call, including assertions on locators such as
`expect(page.getByText('...')).toBeVisible()`.

NEVER use `waitForTimeout()`. Wait for the expected UI state with assertions,
such as `await expect(locator).toBeVisible()`.

## 3. Output format

Return ONLY the TypeScript file content.

No markdown fences. No explanations before or after the code.

## 4. Worked example

INPUT: "Test that admin can delete a user"

OUTPUT:

/* AI-GENERATED | Reviewed by: | Date: | Status: PENDING */

import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL + '/login');
    await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should remove user from list when admin deletes them', async ({ page }) => {
    await page.goto(process.env.BASE_URL + '/admin/users');
    const row = page.getByRole('row', { name: 'jane@example.com' });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(row).not.toBeVisible();
  });
});