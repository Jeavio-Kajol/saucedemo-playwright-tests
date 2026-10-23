import { type Page } from '@playwright/test';
import { LoginLocators } from '../locators/login.locators';

export class LoginPage {
  readonly locators: LoginLocators;

  constructor(private readonly page: Page) {
    this.locators = new LoginLocators(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.locators.usernameInput.fill(username);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
  }
}
