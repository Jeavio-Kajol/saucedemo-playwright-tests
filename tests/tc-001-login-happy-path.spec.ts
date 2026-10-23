/* HUMAN-WRITTEN | Author: Kajol Gupta | Reviewed by: Kajol Gupta | Date: 2026-10-22 | Status: REVIEWED */

import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should open the inventory page when login succeeds', async ({ page }) => {
    const username = process.env.SAUCEDEMO_USERNAME;
    const password = process.env.SAUCEDEMO_PASSWORD;

    if (!username || !password) {
      throw new Error('Set SAUCEDEMO_USERNAME and SAUCEDEMO_PASSWORD in your .env file.');
    }

    // Arrange
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.locators.productsLabel).toBeVisible();
    await expect(inventoryPage.locators.productItems).toHaveCount(6);
  });
});
