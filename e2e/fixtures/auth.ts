import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { TesterLoginPage } from '../pages/tester-login-page';

type AuthFixtures = {
  authenticatedPage: HomePage;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login using tester credentials
    const testerLoginPage = new TesterLoginPage(page);
    await testerLoginPage.goto();
    const testerUuid = process.env.TESTER_LOGIN_SECRET;
    if (!testerUuid) {
      throw new Error('TESTER_LOGIN_SECRET environment variable is not set');
    }

    // Add explicit wait for the login form to be ready
    await page.waitForSelector('form', { state: 'visible', timeout: 30000 });

    // Log the current URL before login
    console.log('Current URL before login:', await page.url());

    await testerLoginPage.login(testerUuid, true);

    // Log the URL after login attempt
    console.log('URL after login attempt:', await page.url());

    // Wait for navigation to complete after login with more specific conditions
    await page.waitForURL('/', { timeout: 30000 });
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect } from '@playwright/test';
