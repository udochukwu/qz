import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display landing page for non-authenticated users', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Check for navigation login link
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Login' })).toBeVisible();

    // Check for footer login link
    await expect(page.locator('footer').getByRole('link', { name: 'Login' })).toBeVisible();

    // Check for get started link
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible();
  });
});
