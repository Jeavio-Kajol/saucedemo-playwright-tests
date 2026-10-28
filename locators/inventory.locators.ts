import { type Locator, type Page } from '@playwright/test';

export class InventoryLocators {
  readonly productsLabel: Locator;
  readonly productItems: Locator;
  readonly cartButton: Locator;
  readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.productsLabel = page.getByText('Products', { exact: true });
    this.productItems = page.getByRole('button', { name: 'Add to cart' });
    this.cartButton = page.getByRole('button', { name: /^Cart, (?:\d+ items|empty)$/ });
    this.sortSelect = page.getByRole('combobox', { name: 'Sort products', exact: true });
  }

  productButton(name: string): Locator {
    return this.page.getByRole('button', { name: `View details for ${name}`, exact: true })
      .filter({ hasText: name });
  }
}
