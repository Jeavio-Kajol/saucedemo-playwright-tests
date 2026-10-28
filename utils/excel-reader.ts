import * as XLSX from 'xlsx';

export type TestAction =
  | 'valid-login'
  | 'invalid-password'
  | 'locked-out-login'
  | 'empty-login'
  | 'empty-password'
  | 'masked-password'
  | 'add-to-cart'
  | 'remove-from-cart'
  | 'sort-low-to-high'
  | 'checkout-required-field';

export interface TestCase {
  id: string;
  feature: string;
  scenario: string;
  url: string;
  action: TestAction;
  username: string;
  expectedText: string;
  enabled: boolean;
}

export function loadTestCases(filePath: string): TestCase[] {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets.TestCases;

  if (!worksheet) {
    throw new Error(`The Excel workbook "${filePath}" must contain a "TestCases" sheet.`);
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
  const supportedActions: TestAction[] = [
    'valid-login',
    'invalid-password',
    'locked-out-login',
    'empty-login',
    'empty-password',
    'masked-password',
    'add-to-cart',
    'remove-from-cart',
    'sort-low-to-high',
    'checkout-required-field',
  ];

  return rows
    .filter((row) => String(row.Enabled).toUpperCase() === 'TRUE')
    .map((row, index) => {
      const action = String(row.Action) as TestAction;
      const testCase: TestCase = {
        id: String(row.ID ?? ''),
        feature: String(row.Feature ?? ''),
        scenario: String(row.Scenario ?? ''),
        url: String(row.URL ?? '/'),
        action,
        username: String(row.Username ?? ''),
        expectedText: String(row.Expected ?? ''),
        enabled: true,
      };

      if (!testCase.id || !testCase.feature || !testCase.scenario || !supportedActions.includes(action)) {
        throw new Error(`Invalid test case data on Excel row ${index + 2} in "${filePath}".`);
      }

      const validationBase = new URL('https://relative-path.invalid');
      if (!testCase.url.startsWith('/') || testCase.url.startsWith('//') ||
          new URL(testCase.url, validationBase).origin !== validationBase.origin) {
        throw new Error(`URL must be a root-relative path on Excel row ${index + 2} in "${filePath}".`);
      }

      return testCase;
    });
}