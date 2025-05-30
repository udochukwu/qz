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
    console.log('TESTER_LOGIN_SECRET>>>>', process.env.TESTER_LOGIN_SECRET);
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
    try {
      // First wait for the signin page if we're redirected there
      if (await page.url().includes('/api/auth/signin')) {
        console.log('Detected signin redirect, waiting for session...');
        await page.waitForResponse(
          response => response.url().includes('/api/auth/session') && response.status() === 200,
          { timeout: 30000 },
        );
      }

      // Then wait for the final navigation to home
      console.log('Waiting for final navigation to home...');
      await page.waitForURL('/', { timeout: 30000 });

      // Log the final URL
      console.log('Final URL after navigation:', await page.url());
    } catch (error: any) {
      console.error('Navigation timeout error:', error);
      console.error('Current URL at error:', await page.url());
      throw new Error(`Login navigation failed: ${error?.message || 'Unknown error'}`);
    }

    // Additional wait to ensure the page is fully loaded
    // await page.waitForLoadState('networkidle', { timeout: 30000 });

    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export { expect } from '@playwright/test';
