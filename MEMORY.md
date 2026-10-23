# Project Memory

This file stores durable, project-specific decisions and context for future work.
Add or update entries when a verified decision, recurring issue, or important
project change should guide later sessions. Do not record routine task progress.
Review entries periodically and remove or revise stale information.

## Confirmed Project Context

- The project uses Playwright with TypeScript.
- The configured target is SauceDemo (`https://www.saucedemo.com`); tests should
  use `BASE_URL` rather than hard-coding the URL.
- Login interactions are implemented in `pages/login.page.ts`.
- Manual login cases are documented in `test-data/manual-test-cases.md`.
- The Playwright skill is `.github/skills/playwright/SKILL.md`, with the skill name
  matching its `playwright` folder.
- The workspace custom agent is
  `.github/agents/playwright-agent.agent.md`.

## Current Coverage Notes

- The five manual login test cases are represented in `tests/login.spec.ts` and
  also have dedicated specs: `tc-001-login-happy-path.spec.ts`,
  `tc-002-wrong-password.spec.ts`, `tc-003-locked-out-user.spec.ts`,
  `tc-004-empty-login-validation.spec.ts`, and
  `tc-005-password-masking.spec.ts`.
- TC-004's missing-username and missing-password validations are separate test
  cases within the specs.
- Login test coverage includes successful inventory navigation, incorrect
  credentials, locked-out users, required-field validation, and password
  masking.
- Mobile viewport coverage is not currently configured as an active project in
  `playwright.config.ts`.

## Legacy Notes to Verify Before Use

The entries below were in this file before it was reviewed on 2026-10-22. They
refer to features or files not found in the inspected project and have no dates,
so treat them as unverified historical notes rather than current guidance:

- A database-test convention to roll back test data.
- Checkout payment-iframe flakiness and a user-list filter/network-idle issue.
- A centralized `pages/LoginPage.ts` implementation.
- Profile-page and checkout-test review decisions.
- Password-reset and checkout coverage notes.
- Previous `SKILL.md` version-history entries.

## Customization Maintenance

- Record changes here when they establish durable guidance for future sessions.
- Do not add a memory entry for every edit or task.
- Confirm historical notes against the current project before following them.