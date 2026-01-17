import { Locator, Page } from '@playwright/test';

/**
 * Base Component class for reusable UI components
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly rootLocator: Locator;

  constructor(page: Page, rootLocator: Locator) {
    this.page = page;
    this.rootLocator = rootLocator;
  }

  /**
   * Check if component is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.rootLocator.isVisible();
  }

  /**
   * Wait for component to be visible
   */
  async waitForVisible(timeout: number = 10000): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get component text content
   */
  async getText(): Promise<string> {
    return (await this.rootLocator.textContent()) || '';
  }

  /**
   * Click on component
   */
  async click(): Promise<void> {
    await this.rootLocator.click();
  }
}

/**
 * Search Component for handling search functionality
 */
export class SearchComponent extends BaseComponent {
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly clearButton: Locator;

  constructor(page: Page, rootLocator: Locator) {
    super(page, rootLocator);
    this.searchInput = rootLocator.locator('input[type="text"], input[name*="search"]');
    this.searchButton = rootLocator.locator('button[type="submit"], button[name*="search"]');
    this.clearButton = rootLocator.locator('button[title*="clear"], .clear-search');
  }

  /**
   * Enter search query
   */
  async enterSearchQuery(query: string): Promise<void> {
    await this.searchInput.clear();
    await this.searchInput.fill(query);
  }

  /**
   * Click search button
   */
  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  /**
   * Perform complete search
   */
  async search(query: string): Promise<void> {
    await this.enterSearchQuery(query);
    await this.clickSearch();
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    if (await this.clearButton.isVisible()) {
      await this.clearButton.click();
    } else {
      await this.searchInput.clear();
    }
  }

  /**
   * Get current search value
   */
  async getSearchValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  /**
   * Check if search input is empty
   */
  async isSearchEmpty(): Promise<boolean> {
    const value = await this.getSearchValue();
    return value.trim() === '';
  }
}

/**
 * Product Card Component for product listings
 */
export class ProductCardComponent extends BaseComponent {
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productImage: Locator;
  private readonly addToCartButton: Locator;
  private readonly productLink: Locator;

  constructor(page: Page, rootLocator: Locator) {
    super(page, rootLocator);
    this.productName = rootLocator.locator('.product-name, .product-title');
    this.productPrice = rootLocator.locator('.price, .product-price');
    this.productImage = rootLocator.locator('img');
    this.addToCartButton = rootLocator.locator('button[title*="cart"], .add-to-cart');
    this.productLink = rootLocator.locator('a').first();
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return (await this.productPrice.textContent()) || '';
  }

  /**
   * Get product image source
   */
  async getProductImageSrc(): Promise<string> {
    return (await this.productImage.getAttribute('src')) || '';
  }

  /**
   * Click add to cart button
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Click on product to view details
   */
  async viewProductDetails(): Promise<void> {
    await this.productLink.click();
  }

  /**
   * Check if product is in stock
   */
  async isInStock(): Promise<boolean> {
    const outOfStock = this.rootLocator.locator('.out-of-stock, .unavailable');
    return !(await outOfStock.isVisible());
  }

  /**
   * Get product data as object
   */
  async getProductData(): Promise<{
    name: string;
    price: string;
    imageSrc: string;
    inStock: boolean;
  }> {
    return {
      name: await this.getProductName(),
      price: await this.getProductPrice(),
      imageSrc: await this.getProductImageSrc(),
      inStock: await this.isInStock(),
    };
  }
}

/**
 * Navigation Component for handling site navigation
 */
export class NavigationComponent extends BaseComponent {
  private readonly homeLink: Locator;
  private readonly categories: Locator;
  private readonly cartLink: Locator;
  private readonly signInLink: Locator;

  constructor(page: Page, rootLocator: Locator) {
    super(page, rootLocator);
    this.homeLink = rootLocator.locator('a[title*="home"], .home-link');
    this.categories = rootLocator.locator('.categories a, .menu a');
    this.cartLink = rootLocator.locator('a[title*="cart"], .cart-link');
    this.signInLink = rootLocator.locator('a[title*="sign"], .signin-link');
  }

  /**
   * Navigate to home page
   */
  async goToHome(): Promise<void> {
    await this.homeLink.click();
  }

  /**
   * Navigate to category
   */
  async goToCategory(categoryName: string): Promise<void> {
    await this.categories.filter({ hasText: categoryName }).click();
  }

  /**
   * Go to shopping cart
   */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Go to sign in page
   */
  async goToSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const categoryElements = await this.categories.all();
    const categories: string[] = [];

    for (const category of categoryElements) {
      const text = await category.textContent();
      if (text) categories.push(text.trim());
    }

    return categories;
  }
}
