import { type Locator, type Page } from '@playwright/test';

export class InventoryLocators {
  readonly productsLabel: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.productsLabel = page.getByText('Products', { exact: true });
    this.productItems = page.getByRole('button', { name: 'Add to cart' });
  }
}
