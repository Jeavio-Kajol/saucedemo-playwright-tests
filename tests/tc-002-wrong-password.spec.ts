/* AI-GENERATED | Reviewed by: Kajol Gupta | Date: 2026-10-22 | Status: REVIEWED */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
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
});
