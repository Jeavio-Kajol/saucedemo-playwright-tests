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

## Data-Driven and API Testing (added 2026-10-26)

- `test-data/test-cases.xlsx` (sheet `TestCases`) holds 10 enabled SauceDemo
  cases covering login, inventory, cart, sorting, and checkout. Columns: ID,
  Feature, Scenario, URL, Action, Username, Expected, Enabled.
- `utils/excel-reader.ts` (`loadTestCases`) reads that sheet using the `xlsx`
  package and validates each row's `Action`. `tests/excel-test-cases.spec.ts`
  maps each action to Playwright steps. A new action must be added to both files.
- Passwords are never stored in the workbook; tests read standard credentials
  from `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD`. Public scenario usernames
  such as `locked_out_user` may be stored as test data.
- SauceDemo has no documented API. API tests use the free JSONPlaceholder mock
  API in `tests/api/jsonplaceholder.api.spec.ts`, via Playwright's `request`
  fixture (no extra dependency).
- `playwright.config.ts` has a separate `api` project matching
  `**/*.api.spec.ts`; browser projects ignore those files. Run with
  `npm run test:api`. The base URL comes from `API_BASE_URL`.

## CI and Tooling Notes (added 2026-10-26)

- GitHub Actions (`.github/workflows/playwright.yml`) needs the repository
  secrets `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD`, passed to the test
  step through `env`. Without them, tests throw "Set SAUCEDEMO_USERNAME...".
- `scripts/review-agent.sh <test-file>` audits a spec using Copilot CLI
  (`copilot -p`). It supplies the Playwright skill, repository and agent
  instructions, this decision log, manual cases, Excel reader, and page/locator
  sources as context. It does not supply `.env` or workbook contents.
- The review script writes a temporary audit bundle, passes its path in a short
  `-p` prompt, and exposes only `--available-tools=view`. It converts Git Bash
  paths for Windows and removes the bundle on exit, including CLI failures.
  A real Excel review verified this transport and returned `VERDICT: PASS`.
  Do not pass full context in argv (Windows length limit) or rely on piped stdin
  becoming model context; this CLI did not expose stdin content to the model.
- Copilot CLI is installed through npm. A "Model catalog failed to load: 403"
  error means the signed-in account is not authorized; sign in again with
  `/login` using the account that has the Copilot plan.

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

- The Playwright skill owns test conventions; repository instructions and the
  custom agent reference its exceptions instead of redefining them.
- New or substantively modified tests are PENDING with the reviewer cleared.
  Unchanged human-reviewed tests may remain REVIEWED with reviewer and date.
- `tests/login.spec.ts` and `tests/excel-test-cases.spec.ts` are documented
  consolidated-suite exceptions. Excel loops register one test per row, grouped
  by Feature; workbook IDs are independent of manual login case IDs.
- Related assertions do not imply multiple scenarios. Manual-case notes can
  define additional variants in the same file, including both TC-004 variants.
- Static reviews must distinguish confirmed violations, recommendations, and
  checks that cannot be verified. PASS is not a runtime or commit-safety guarantee.
  The final line is exactly `VERDICT: PASS` for zero confirmed static violations,
  or `VERDICT: FAIL` otherwise. Runtime/live-DOM verification is outside scope;
  recommendations and missing-context advisories do not block a static PASS.
- Excel navigation paths are validated as root-relative by the reader. Unsupported
  actions are rejected before tests are registered.
- SauceDemo's current cart control is a button named `Cart, N items` or
  `Cart, empty`; product details use buttons, and the sort combobox is named
  `Sort products`. Verify actual roles rather than assuming these are links.
- Record changes here when they establish durable guidance for future sessions.
- Do not add a memory entry for every edit or task.
- Confirm historical notes against the current project before following them.