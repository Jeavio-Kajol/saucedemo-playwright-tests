import { type Locator, type Page } from '@playwright/test';

export class CheckoutLocators {
  readonly continueButton: Locator;
  readonly firstNameRequiredError: Locator;

  constructor(page: Page) {
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.firstNameRequiredError = page.getByText('Error: First Name is required', { exact: true });
  }
}