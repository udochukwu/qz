import { Page } from '@playwright/test';

export class TesterLoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/api/auth/signin');
  }

  async login(loginSecret: string, subscriptionStatus: boolean = true) {
    await this.page.locator('#input-login_secret-for-tester-provider').fill(loginSecret);
    if (subscriptionStatus) {
      await this.page.locator('#input-subscription_status-for-tester-provider').check();
    }
    await this.page.getByRole('button', { name: 'Sign in with Tester Login' }).click();
  }
}
