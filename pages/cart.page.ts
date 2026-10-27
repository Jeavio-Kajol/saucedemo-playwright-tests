import { type Page } from '@playwright/test';
import { CartLocators } from '../locators/cart.locators';

export class CartPage {
  readonly locators: CartLocators;

  constructor(page: Page) {
    this.locators = new CartLocators(page);
  }

  async removeFirstProduct(): Promise<void> {
    await this.locators.removeButtons.first().click();
  }

  async checkout(): Promise<void> {
    await this.locators.checkoutButton.click();
  }
}