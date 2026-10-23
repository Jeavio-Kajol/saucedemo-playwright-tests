/* HUMAN-WRITTEN | Author: Kajol Gupta | AI-GENERATED TC-002 added: 2026-10-22 | Reviewed by: Kajol Gupta | Date: 2026-10-22 | Status: REVIEWED */

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

  test('should show a login error when the password is incorrect', async ({ page }) => {
    const username = process.env.SAUCEDEMO_USERNAME;
    const password = process.env.SAUCEDEMO_PASSWORD;

    if (!username || !password) {
      throw new Error('Set SAUCEDEMO_USERNAME and SAUCEDEMO_PASSWORD in your .env file.');
    }

    const loginPage = new LoginPage(page);
    const incorrectPassword = `${password}-incorrect`;

    await loginPage.locators.passwordInput.fill(incorrectPassword);
    await expect(loginPage.locators.passwordInput).toHaveAttribute('type', 'password');
    await loginPage.login(username, incorrectPassword);

    await expect(loginPage.locators.loginError).toBeVisible();
    await expect(loginPage.locators.loginError).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Products', { exact: true })).not.toBeVisible();
  });

  test('should show a locked-out error when a locked-out user attempts login', async ({ page }) => {
    const password = process.env.SAUCEDEMO_PASSWORD;

    if (!password) {
      throw new Error('Set SAUCEDEMO_PASSWORD in your .env file.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.login('locked_out_user', password);

    await expect(loginPage.locators.loginError).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).toHaveURL(/\/$/);
  });

  test('should show a username-required error when both login fields are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.locators.loginButton.click();
    await expect(loginPage.locators.loginError).toHaveText('Epic sadface: Username is required');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Products', { exact: true })).not.toBeVisible();
  });

  test('should show a password-required error when the password field is empty', async ({ page }) => {
    const username = process.env.SAUCEDEMO_USERNAME;

    if (!username) {
      throw new Error('Set SAUCEDEMO_USERNAME in your .env file.');
    }

    const loginPage = new LoginPage(page);

    await loginPage.login(username, '');
    await expect(loginPage.locators.loginError).toHaveText('Epic sadface: Password is required');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Products', { exact: true })).not.toBeVisible();
  });

  test('should mask password characters while they are entered', async ({ page }) => {
    const password = process.env.SAUCEDEMO_PASSWORD;

    if (!password) {
      throw new Error('Set SAUCEDEMO_PASSWORD in your .env file.');
    }

    const loginPage = new LoginPage(page);
    await loginPage.locators.passwordInput.fill(password);

    await expect(loginPage.locators.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.locators.passwordInput).toHaveValue(password);
  });
});
