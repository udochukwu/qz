import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async gotoRoute(route: string) {
    await this.page.goto(route);
  }

  async waitForTourToStart() {
    await this.page.waitForSelector('.react-joyride__tooltip', { state: 'visible' });
  }

  async getCreateClassButton() {
    return this.page.locator('.create-new-class-button');
  }

  async getFileManager() {
    return this.page.locator('.file-manager');
  }

  async getQuickAction(action: string) {
    return this.page.locator(`[data-quick-action="${action}"]`);
  }

  async getTourTooltip() {
    return this.page.locator('.react-joyride__tooltip');
  }

  async clickNextButton() {
    await this.page.locator('button:has-text("Next")').click();
  }

  async clickFinishButton() {
    await this.page.locator('button:has-text("Finish")').click();
  }

  async getSuggestionButton(text: string) {
    return this.page.locator(`[data-suggestion="${text}"]`);
  }

  async isTourTooltipVisible() {
    const tooltip = await this.getTourTooltip();
    return tooltip.isVisible();
  }

  async getTooltipBoundingBox() {
    const tooltip = await this.getTourTooltip();
    return tooltip.boundingBox();
  }
}
