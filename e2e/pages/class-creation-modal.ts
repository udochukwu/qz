import { Page } from '@playwright/test';

export class ClassCreationModal {
  constructor(private page: Page) {}

  async isVisible() {
    return this.page.locator('.class-name-input').isVisible();
  }

  async enterClassName(name: string) {
    await this.page.locator('.class-name-input').fill(name);
  }

  async clickCreate() {
    await this.page.locator('button:has-text("Create")').click();
  }

  async selectEmoji(emoji: string) {
    await this.page.locator(`[data-emoji="${emoji}"]`).click();
  }
}
