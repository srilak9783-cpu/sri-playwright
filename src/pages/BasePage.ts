import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class that provides common functionality for all page objects
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://www.automationpractice.pl';
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async navigateTo(url: string = ''): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    await this.page.goto(fullUrl);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot with timestamp
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click element safely with retry
   * @param locator - Element locator
   * @param retries - Number of retries
   */
  async clickSafely(locator: Locator, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await locator.click();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Fill input field safely
   * @param locator - Input locator
   * @param text - Text to fill
   */
  async fillSafely(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
    // Verify the text was entered
    await this.page.waitForTimeout(100);
    const value = await locator.inputValue();
    if (value !== text) {
      throw new Error(`Failed to fill input. Expected: ${text}, Got: ${value}`);
    }
  }

  /**
   * Scroll element into view
   * @param locator - Element locator
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get element text content
   * @param locator - Element locator
   */
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for URL to contain specific text
   * @param text - Text to wait for in URL
   * @param timeout - Timeout in milliseconds
   */
  async waitForUrlToContain(text: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForURL((url) => url.toString().includes(text), { timeout });
  }
}
