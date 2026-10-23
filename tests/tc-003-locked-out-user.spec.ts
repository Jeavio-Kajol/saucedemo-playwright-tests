/* AI-GENERATED | Reviewed by: | Date: 2026-10-23 | Status: PENDING */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
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
});
