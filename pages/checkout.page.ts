import { type Page } from '@playwright/test';
import { CheckoutLocators } from '../locators/checkout.locators';

export class CheckoutPage {
  readonly locators: CheckoutLocators;

  constructor(page: Page) {
    this.locators = new CheckoutLocators(page);
  }

  async continue(): Promise<void> {
    await this.locators.continueButton.click();
  }
}