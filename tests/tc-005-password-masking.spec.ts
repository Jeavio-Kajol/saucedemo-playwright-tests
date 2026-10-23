/* AI-GENERATED | Reviewed by: | Date: 2026-10-23 | Status: PENDING */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should mask password characters while they are entered', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const password = process.env.SAUCEDEMO_PASSWORD;

    if (!password) {
      throw new Error('Set SAUCEDEMO_PASSWORD in your .env file.');
    }

    await loginPage.locators.passwordInput.fill(password);

    await expect(loginPage.locators.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.locators.passwordInput).toHaveValue(password);
  });
});
