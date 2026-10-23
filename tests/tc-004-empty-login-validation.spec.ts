/* AI-GENERATED | Reviewed by: | Date: 2026-10-23 | Status: PENDING */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
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
});
