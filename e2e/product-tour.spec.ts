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

  test('Test on smaller screen size', async ({ authenticatedPage, page }) => {
    await page.setViewportSize({ width: 480, height: 1024 }); // reduce to tablet screen

    await authenticatedPage.waitForTourToStart();

    // Verify tooltip is visible and in view port
    await verifyTooltipInViewport(page, authenticatedPage);
  });
});
