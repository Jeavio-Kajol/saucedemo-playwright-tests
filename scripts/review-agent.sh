#!/usr/bin/env bash
set -euo pipefail

FILE="${1:-}"

if [[ -z "$FILE" ]]; then
  printf 'Usage: %s <playwright-test-file>\n' "$0" >&2
  exit 2
fi

if [[ ! -f "$FILE" ]]; then
  printf 'Test file not found: %s\n' "$FILE" >&2
  exit 2
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
SKILL_FILE="$REPO_ROOT/.github/skills/playwright/SKILL.md"

if [[ ! -f "$SKILL_FILE" ]]; then
  printf 'Playwright skill file not found: %s\n' "$SKILL_FILE" >&2
  exit 2
fi

if ! command -v copilot >/dev/null 2>&1; then
  printf 'GitHub Copilot CLI is not installed or not available on PATH.\n' >&2
  printf 'See https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli\n' >&2
  exit 127
fi

SKILL_CONTENT="$(<"$SKILL_FILE")"
TEST_CONTENT="$(<"$FILE")"
CONTEXT_CONTENT="$(
  for CONTEXT_FILE in \
    "$REPO_ROOT/.github/copilot-instructions.md" \
    "$REPO_ROOT/.github/agents/playwright-agent.agent.md" \
    "$REPO_ROOT/MEMORY.md" \
    "$REPO_ROOT/test-data/manual-test-cases.md" \
    "$REPO_ROOT/utils/excel-reader.ts" \
    "$REPO_ROOT"/pages/*.ts \
    "$REPO_ROOT"/locators/*.ts; do
    if [[ -f "$CONTEXT_FILE" ]]; then
      printf '\n--- Context file: %s ---\n' "${CONTEXT_FILE#"$REPO_ROOT"/}"
      cat -- "$CONTEXT_FILE"
    fi
  done
)"

AUDIT_FILE="$(mktemp "${TMPDIR:-/tmp}/playwright-audit.XXXXXX")"
trap 'rm -f -- "$AUDIT_FILE"' EXIT
AUDIT_PATH="$AUDIT_FILE"
if command -v cygpath >/dev/null 2>&1; then
  AUDIT_PATH="$(cygpath -m "$AUDIT_FILE")"
fi

printf '%s\n' "Audit the following Playwright test file against the rules in the Playwright skill.

Playwright skill rules:
---
$SKILL_CONTENT
---

Test file: $FILE
Test file contents:
---
$TEST_CONTENT
---

Supporting project context (reference only; do not audit these files):
---
$CONTEXT_CONTENT
---

Audit requirements:
- Review only the target test. Use supporting context to verify dependencies,
  manual-case variants, page-object layering, and loader guarantees.
- The skill is authoritative for test conventions; repository instructions add
  project-wide requirements. Agent generation permissions are not test violations.
- Report a VIOLATION only with an explicit applicable rule and concrete evidence
  in the supplied files. Include the rule's source and target file/line evidence.
- Distinguish multiple related assertions from multiple scenarios. Each loop
  iteration that registers test() is a separate test, not a single combined test.
- Apply the skill's consolidated-suite, public-username, and reviewed-header
  exceptions. Do not invent headings or roles that are not established by context.
- A data-supplied URL is not hard-coded. Check the loader's relative-path guard.
- An unnamed role locator is not automatically a violation. Apply selector
  priority only when a suitable higher-priority alternative is established.
- Runtime success, exact live-DOM matches, and live error text are outside this
  static audit's scope. Do not report their missing evidence as CANNOT VERIFY.
- If a static rule depends on unavailable context, report CANNOT VERIFY as a
  non-blocking advisory, not a confirmed violation or a different verdict.
- Defensive improvements beyond the rules are RECOMMENDATION, not violations.
- This is a static audit, not proof that tests pass or a commit is safe.
- Only use the view tool to read this audit bundle in full. Do not read other
  files, use shell commands, modify files, or run tests. Do not read .env.
- Use the audit format below, not the skill's TypeScript generation output format.

For each violation output:
VIOLATION: [rule and source] — [file:line evidence] — [how to fix]

For each rule correctly followed output:
OK: [rule]

For static-rule checks blocked by missing context, optionally output:
CANNOT VERIFY: [check] — [missing evidence]

For optional improvements output:
RECOMMENDATION: [improvement]

Before the verdict output:
CONFIRMED VIOLATIONS: [N]

End with exactly one of these two lines, with no suffix or text after it:
VERDICT: PASS
VERDICT: FAIL

If there are zero confirmed VIOLATION entries, the final line MUST be
VERDICT: PASS, even if recommendations or CANNOT VERIFY advisories exist.
If there is at least one confirmed VIOLATION entry, the final line MUST be
VERDICT: FAIL. Count only confirmed VIOLATION entries in CONFIRMED VIOLATIONS.
Never invent or suppress violations to obtain a particular verdict.
Do not treat executing the tests as a required check in this static audit." > "$AUDIT_FILE"

copilot --available-tools=view -p "Use the view tool to read the entire audit bundle at \"$AUDIT_PATH\". Read every line, using additional view calls on that same file if needed. Follow the bundle's audit requirements and exact verdict format. Do not read stdin or any other files, run commands, or modify files."