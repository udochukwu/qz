import { test, expect } from './fixtures/auth';
import { Page } from '@playwright/test';
import { ClassCreationModal } from './pages/class-creation-modal';
import { setupProductTourMocks, setupCompletedProductTourMock } from './mocks/product-tour-mocks';

// Helper function to verify tooltip is within viewport
async function verifyTooltipInViewport(page: Page, authenticatedPage: any) {
  const tooltip = await authenticatedPage.getTourTooltip();
  const tooltipBox = await authenticatedPage.getTooltipBoundingBox();
  const viewportSize = page.viewportSize();

  expect(tooltipBox).not.toBeNull();
  expect(viewportSize).not.toBeNull();
  await expect(tooltip).toBeVisible();

  if (tooltipBox && viewportSize) {
    expect(tooltipBox.width).toBeGreaterThanOrEqual(360);
    expect(tooltipBox.x).toBeGreaterThanOrEqual(0);
    expect(tooltipBox.y).toBeGreaterThanOrEqual(0);
    expect(tooltipBox.x + tooltipBox.width).toBeLessThanOrEqual(viewportSize.width);
    expect(tooltipBox.y + tooltipBox.height).toBeLessThanOrEqual(viewportSize.height);
  }
}

test.describe('Product Tour', () => {
  test.beforeEach(async ({ page }) => {
    await setupProductTourMocks(page);
  });

  test('should navigate through all tour steps', async ({ authenticatedPage, page }) => {
    await authenticatedPage.waitForTourToStart();

    // Step 1: Create Class
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 2: Name Class
    const classModal = new ClassCreationModal(page);
    await expect(await classModal.isVisible()).toBeTruthy();
    await classModal.enterClassName('Test Class');
    await authenticatedPage.clickNextButton();

    // Step 3: Quick Actions Overview
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 4: Chat Quick Action
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 5: Record Quick Action
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 6: Flashcards Quick Action
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 7: File Manager
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 8: Shared File
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 9: Chat
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);
    await authenticatedPage.clickNextButton();

    // Step 10: Suggested Messages
    await page.waitForSelector('.react-joyride__spotlight', { state: 'visible' });
    await page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
    await verifyTooltipInViewport(page, authenticatedPage);

    // Start waiting for tour completion API to be called before clicking finish button
    page.waitForRequest(request => request.url().includes('/user/product_tour') && request.method() === 'POST');

    await authenticatedPage.clickFinishButton();
  });

  test('Test on smaller screen size', async ({ authenticatedPage, page }) => {
    await page.setViewportSize({ width: 480, height: 1024 }); // reduce to tablet screen

    await authenticatedPage.waitForTourToStart();

    // Verify tooltip is visible and in view port
    await verifyTooltipInViewport(page, authenticatedPage);
  });
});

test.describe('Product Tour - Negative Test', () => {
  test.beforeEach(async ({ page }) => {
    await setupCompletedProductTourMock(page);
  });

  // Negative test to ensure that the tour does not start when product tour is already completed
  test('should not start the product tour when the product tour is already completed', async ({
    authenticatedPage,
  }) => {
    await expect(await authenticatedPage.getTourTooltip()).not.toBeVisible();
  });
});
