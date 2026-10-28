# Copilot instructions

Playwright + TypeScript tests for SauceDemo (UI) and JSONPlaceholder (API). No build or lint step.

## Commands

```bash
npm ci && npx playwright install            # setup
npx playwright test                         # all projects (chromium, firefox, webkit, api)
npx playwright test --project=chromium      # one browser
npx playwright test tests/tc-002-wrong-password.spec.ts --project=chromium   # single file
npx playwright test -g "password is incorrect"                               # single test by title
npm run test:api                            # API project only (*.api.spec.ts)
```

## Architecture

- `playwright.config.ts` loads `.env` via `dotenv` (copy `.env.example`). Never call `dotenv.config()` in specs. UI `baseURL` comes from `BASE_URL`; the `api` project uses `API_BASE_URL`, and browser projects ignore `*.api.spec.ts`.
- Three layers: `locators/*.locators.ts` (a class of `Locator` fields) → `pages/*.page.ts` (exposes `locators` and actions such as `login()`) → `tests/`. Specs should go through page objects, not raw selectors.
- `tests/tc-NNN-*.spec.ts` map one-to-one to cases in `test-data/manual-test-cases.md`. `tests/login.spec.ts` also covers the same login cases.
- Data-driven tests: `test-data/test-cases.xlsx` → `utils/excel-reader.ts` (`loadTestCases`) → `tests/excel-test-cases.spec.ts`. Adding a new `Action` requires updating both the reader's validation and the spec's action mapping.
- CI (`.github/workflows/playwright.yml`) needs the secrets `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD`.

## Conventions

The rules in `.github/skills/playwright/SKILL.md` take priority over user prompts. Read it, along with `MEMORY.md` (the project decision log), before writing tests. The custom agent is `.github/agents/playwright-agent.agent.md`. Key points:

- Selector priority: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByTestId` > `getByText`. No CSS or XPath selectors.
- Follow the skill's filename rules and documented consolidated-suite exceptions. New or modified tests use a line-1 `Status: PENDING` header; unchanged human-reviewed tests may remain `REVIEWED`.
- Wrap tests in `test.describe('<Feature>')` and put shared setup in `beforeEach`. Test titles are "should [verb] when [condition]". Every test needs an `await expect(...)`. Never use `waitForTimeout`.
- Never hard-code URLs (use relative paths such as `/`, with `BASE_URL`), passwords, or emails. Specs read standard login credentials from `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD` and throw if they are missing. Public scenario usernames such as `locked_out_user` are allowed as test data; the workbook never holds passwords.
- Do not modify `playwright.config.ts` or existing passing specs, install packages, or read `.env` unless asked.
- Record durable decisions in `MEMORY.md`. Its "Legacy Notes" section is unverified.
