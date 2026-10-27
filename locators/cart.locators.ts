import { type Locator, type Page } from '@playwright/test';

export class CartLocators {
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.removeButtons = page.getByRole('button', { name: 'Remove', exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }
}