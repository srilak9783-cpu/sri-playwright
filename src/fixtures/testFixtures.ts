import { test as baseTest } from '@playwright/test';
import { AutomationPracticePage } from '../pages/AutomationPracticePage';

/**
 * Test fixtures for Playwright tests
 */
export const test = baseTest.extend<{
  automationPracticePage: AutomationPracticePage;
  browserName: string;
}>({
  automationPracticePage: async ({ page }, use) => {
    const automationPracticePage = new AutomationPracticePage(page);
    await use(automationPracticePage);
  },

  browserName: async ({ browserName }, use) => {
    await use(browserName);
  },
});

export { expect } from '@playwright/test';
