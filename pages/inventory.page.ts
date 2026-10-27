import { type Page } from '@playwright/test';
import { InventoryLocators } from '../locators/inventory.locators';

export class InventoryPage {
  readonly locators: InventoryLocators;

  constructor(page: Page) {
    this.locators = new InventoryLocators(page);
  }

  async addFirstProductToCart(): Promise<void> {
    await this.locators.productItems.first().click();
  }

  async openCart(): Promise<void> {
    await this.locators.cartButton.click();
  }

  async sortBy(value: string): Promise<void> {
    await this.locators.sortSelect.selectOption(value);
  }
}
