import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Automation Practice website
 */
export class AutomationPracticePage extends BasePage {
  // Page elements
  readonly logoLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchHeading: Locator;
  readonly productContainers: Locator;
  readonly breadcrumb: Locator;
  readonly addToCartButtons: Locator;
  readonly cartConfirmation: Locator;
  readonly cartCount: Locator;

  constructor(page: any) {
    super(page);

    // Initialize page elements
    this.logoLink = page.locator('a[title="My Shop"]');
    this.searchInput = page.locator('#search_query_top');
    this.searchButton = page.locator('button[name="submit_search"]');
    this.searchHeading = page.locator('h1').first();
    this.productContainers = page.locator('.product-container');
    this.breadcrumb = page.locator('.breadcrumb');
    this.addToCartButtons = page.locator('.ajax_add_to_cart_button');
    this.cartConfirmation = page.locator('.layer_cart_overlay');
    this.cartCount = page.locator('.ajax_cart_quantity');
  }

  /**
   * Open the Automation Practice homepage
   */
  async open(): Promise<void> {
    await this.navigateTo('/index.php');
    await this.waitForPageLoad();
  }

  /**
   * Search for a product
   * @param productName - Name of the product to search for
   */
  async searchForProduct(productName: string): Promise<void> {
    await this.waitForElement(this.searchInput);
    await this.fillSafely(this.searchInput, productName);
    await this.clickSafely(this.searchButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if search results are displayed
   */
  async isSearchResultsDisplayed(): Promise<boolean> {
    return await this.isVisible(this.searchHeading);
  }

  /**
   * Get search results heading text
   */
  async getSearchHeadingText(): Promise<string> {
    return await this.getText(this.searchHeading);
  }

  /**
   * Get number of search results
   */
  async getSearchResultsCount(): Promise<number> {
    return await this.productContainers.count();
  }

  /**
   * Get product names from search results
   */
  async getProductNames(): Promise<string[]> {
    const products = await this.productContainers.all();
    const names: string[] = [];

    for (const product of products) {
      const name = await product.locator('.product-name').textContent();
      if (name) names.push(name.trim());
    }

    return names;
  }

  /**
   * Click on a product by index
   * @param index - Product index (0-based)
   */
  async clickProductByIndex(index: number): Promise<void> {
    const product = this.productContainers.nth(index);
    await this.clickSafely(product.locator('.product-name'));
  }

  /**
   * Select a random product from search results and add to cart
   */
  async selectRandomProductAndAddToCart(): Promise<void> {
    const productCount = await this.productContainers.count();

    if (productCount === 0) {
      throw new Error('No products found to add to cart');
    }

    // Select a random product (or first one if only one)
    const randomIndex = productCount > 1 ? Math.floor(Math.random() * productCount) : 0;

    // Hover over the product to reveal the add to cart button
    const product = this.productContainers.nth(randomIndex);
    await product.hover();

    // Wait for add to cart button to be visible and click it
    const addToCartButton = product.locator('.ajax_add_to_cart_button');
    await this.waitForElement(addToCartButton);
    await this.clickSafely(addToCartButton);

    // Wait for cart confirmation overlay
    await this.waitForElement(this.cartConfirmation);
  }

  /**
   * Check if cart confirmation is displayed after adding product
   */
  async isCartConfirmationDisplayed(): Promise<boolean> {
    return await this.isVisible(this.cartConfirmation);
  }

  /**
   * Get current cart item count
   */
  async getCartItemCount(): Promise<number> {
    try {
      const countText = await this.cartCount.textContent();
      return countText ? parseInt(countText.trim()) : 0;
    } catch (error) {
      return 0; // Cart is empty
    }
  }

  /**
   * Check if "no results" message is displayed
   */
  async isNoResultsMessageDisplayed(): Promise<boolean> {
    const noResultsMsg = this.page.locator('.alert-warning');
    return await this.isVisible(noResultsMsg);
  }

  /**
   * Get no results message text
   */
  async getNoResultsMessage(): Promise<string> {
    const noResultsMsg = this.page.locator('.alert-warning');
    return await this.getText(noResultsMsg);
  }

  /**
   * Get validation message from screen (general method)
   * Captures any validation/error messages displayed on the page
   */
  async getValidationMessage(): Promise<string> {
    // Try different common selectors for validation messages
    const selectors = [
      '.alert-warning',
      '.alert-danger',
      '.alert.alert-warning',
      '.alert.alert-danger',
      '.error-message',
      '.validation-message',
      '[class*="alert"]',
      '[class*="error"]',
      '[class*="message"]'
    ];

    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          return await element.textContent() || '';
        }
      } catch (error) {
        // Continue to next selector
        continue;
      }
    }

    // If no specific validation message found, try to get any text that might be a message
    try {
      const pageText = await this.page.textContent('body');
      // Look for common error patterns
      const errorPatterns = [
        /no results/i,
        /not found/i,
        /error/i,
        /warning/i,
        /invalid/i
      ];

      for (const pattern of errorPatterns) {
        if (pattern.test(pageText || '')) {
          return pageText || '';
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return '';
  }

  /**
   * Verify search URL contains query
   * @param query - Search query to verify
   */
  async verifySearchUrl(query: string): Promise<boolean> {
    const currentUrl = this.getCurrentUrl();
    return currentUrl.includes(`search_query=${query.replace(' ', '+')}`);
  }
}
