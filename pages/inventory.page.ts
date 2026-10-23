import { type Page } from '@playwright/test';
import { InventoryLocators } from '../locators/inventory.locators';

export class InventoryPage {
  readonly locators: InventoryLocators;

  constructor(page: Page) {
    this.locators = new InventoryLocators(page);
  }
}
