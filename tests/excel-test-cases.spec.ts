/* AI-GENERATED | Reviewed by: | Date: 2026-10-26 | Status: PENDING */

import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { loadTestCases, type TestAction } from '../utils/excel-reader';

const testCases = loadTestCases(join(__dirname, '..', 'test-data', 'test-cases.xlsx'));

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Set ${name} in your .env file or CI environment.`);
  }
  return value;
}

const titles: Record<TestAction, string> = {
  'valid-login': 'should open inventory when valid credentials are submitted',
  'invalid-password': 'should show a login error when the password is incorrect',
  'locked-out-login': 'should reject login when the demo user is locked out',
  'empty-login': 'should require a username when both fields are empty',
  'empty-password': 'should require a password when only the username is filled',
  'masked-password': 'should mask password characters when they are entered',
  'add-to-cart': 'should update the cart count when a product is added',
  'remove-from-cart': 'should empty the cart when its only product is removed',
  'sort-low-to-high': 'should select ascending price order when low-to-high sorting is chosen',
  'checkout-required-field': 'should require a first name when checkout information is empty',
};

const authenticatedActions = new Set<TestAction>([
  'add-to-cart', 'remove-from-cart', 'sort-low-to-high', 'checkout-required-field',
]);

for (const feature of new Set(testCases.map((testCase) => testCase.feature))) {
  test.describe(feature, () => {
    for (const testCase of testCases.filter((testCase) => testCase.feature === feature)) {
      test.describe(testCase.id, () => {
        let loginPage: LoginPage;
        let inventoryPage: InventoryPage;
        let cartPage: CartPage;
        let checkoutPage: CheckoutPage;

        test.beforeEach(async ({ page }) => {
          loginPage = new LoginPage(page);
          inventoryPage = new InventoryPage(page);
          cartPage = new CartPage(page);
          checkoutPage = new CheckoutPage(page);
          await loginPage.goto(testCase.url);

          if (authenticatedActions.has(testCase.action)) {
            await loginPage.login(
              requiredEnvironmentVariable('SAUCEDEMO_USERNAME'),
              requiredEnvironmentVariable('SAUCEDEMO_PASSWORD'),
            );
          }
        });

        test(titles[testCase.action], async ({ page }) => {
          switch (testCase.action) {
            case 'valid-login':
              await loginPage.login(
                requiredEnvironmentVariable('SAUCEDEMO_USERNAME'),
                requiredEnvironmentVariable('SAUCEDEMO_PASSWORD'),
              );
              await expect(page).toHaveURL(/\/inventory\.html$/);
              await expect(inventoryPage.locators.productsLabel).toHaveText(testCase.expectedText);
              break;

            case 'invalid-password': {
              const password = requiredEnvironmentVariable('SAUCEDEMO_PASSWORD');
              await loginPage.login(
                requiredEnvironmentVariable('SAUCEDEMO_USERNAME'),
                `${password}-invalid`,
              );
              await expect(loginPage.locators.loginError).toContainText(testCase.expectedText);
              await expect(page).not.toHaveURL(/\/inventory\.html$/);
              break;
            }

            case 'locked-out-login':
              if (!testCase.username) {
                throw new Error(`Set a public locked-out demo username for ${testCase.id}.`);
              }
              await loginPage.login(testCase.username, requiredEnvironmentVariable('SAUCEDEMO_PASSWORD'));
              await expect(loginPage.locators.loginError).toContainText(testCase.expectedText);
              await expect(page).not.toHaveURL(/\/inventory\.html$/);
              break;

            case 'empty-login':
              await loginPage.locators.loginButton.click();
              await expect(loginPage.locators.loginError).toContainText(testCase.expectedText);
              break;

            case 'empty-password':
              await loginPage.locators.usernameInput.fill(requiredEnvironmentVariable('SAUCEDEMO_USERNAME'));
              await loginPage.locators.loginButton.click();
              await expect(loginPage.locators.loginError).toContainText(testCase.expectedText);
              break;

            case 'masked-password':
              await loginPage.locators.passwordInput.fill(requiredEnvironmentVariable('SAUCEDEMO_PASSWORD'));
              await expect(loginPage.locators.passwordInput).toHaveAttribute('type', 'password');
              break;

            case 'add-to-cart':
              await inventoryPage.addFirstProductToCart();
              await expect(inventoryPage.locators.cartButton).toHaveText(testCase.expectedText);
              break;

            case 'remove-from-cart':
              await inventoryPage.addFirstProductToCart();
              await inventoryPage.openCart();
              await cartPage.removeFirstProduct();
              await expect(cartPage.locators.removeButtons).toHaveCount(Number(testCase.expectedText));
              await expect(inventoryPage.locators.cartButton).toHaveAccessibleName('Cart, empty');
              break;

            case 'sort-low-to-high':
              await inventoryPage.sortBy('lohi');
              await expect(inventoryPage.locators.sortSelect).toHaveValue('lohi');
              await expect(inventoryPage.locators.productButton(testCase.expectedText)).toBeVisible();
              break;

            case 'checkout-required-field':
              await inventoryPage.addFirstProductToCart();
              await inventoryPage.openCart();
              await cartPage.checkout();
              await checkoutPage.continue();
              await expect(checkoutPage.locators.firstNameRequiredError).toHaveText(testCase.expectedText);
              break;
          }
        });
      });
    }
  });
}
