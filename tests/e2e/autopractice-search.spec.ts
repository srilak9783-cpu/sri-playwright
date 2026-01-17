import { test } from '../../src/fixtures/testFixtures';
import { testData, getRandomValidSearchTerm } from '../../src/data/testData';
import { takeScreenshot } from '../../src/utils/helpers';

test.describe('Automation Practice - Search Functionality', () => {
  test.beforeEach(async ({ automationPracticePage, page }, testInfo) => {
    // Start tracing for debugging
    await page.context().tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });

    // Navigate to homepage
    await automationPracticePage.open();

    // Take initial screenshot
    await takeScreenshot(page, `${testInfo.title}-initial`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take final screenshot
    await takeScreenshot(page, `${testInfo.title}-final`);

    // Stop tracing
    await page.context().tracing.stop({
      path: `traces/${testInfo.title}-trace.zip`,
    });
  });

  test('should display homepage correctly', async ({ automationPracticePage, page }) => {
    // Verify page title
    await test.expect(page).toHaveTitle(/My Shop/);

    // Verify logo is visible
    await test.expect(automationPracticePage.logoLink).toBeVisible();

    // Verify search input is visible
    await test.expect(automationPracticePage.searchInput).toBeVisible();

    // Verify search button is visible
    await test.expect(automationPracticePage.searchButton).toBeVisible();
  });

  test('should search for valid product - short sleeve', async ({
    automationPracticePage,
    page,
  }) => {
    const searchTerm = 'short sleeve';

    // Perform search
    await automationPracticePage.searchForProduct(searchTerm);

    // Take screenshot after search
    await takeScreenshot(page, 'search-results-short-sleeve');

    // Verify search results are displayed
    test.expect(await automationPracticePage.isSearchResultsDisplayed()).toBe(true);

    // Verify search heading contains expected text
    const headingText = await automationPracticePage.getSearchHeadingText();
    test.expect(headingText.toLowerCase()).toContain('search');

    // Verify URL contains search query
    test.expect(await automationPracticePage.verifySearchUrl(searchTerm)).toBe(true);

    // Verify products are displayed
    const resultsCount = await automationPracticePage.getSearchResultsCount();
    test.expect(resultsCount).toBeGreaterThan(0);

    // Verify product names contain search term
    const productNames = await automationPracticePage.getProductNames();
    const hasMatchingProducts = productNames.some(
      (name) => name.toLowerCase().includes('sleeve') || name.toLowerCase().includes('short')
    );
    test.expect(hasMatchingProducts).toBe(true);
  });

  test('should search for valid product - dress', async ({ automationPracticePage, page }) => {
    const searchTerm = 'dress';

    // Perform search
    await automationPracticePage.searchForProduct(searchTerm);

    // Take screenshot after search
    await takeScreenshot(page, 'search-results-dress');

    // Verify search results are displayed
    test.expect(await automationPracticePage.isSearchResultsDisplayed()).toBe(true);

    // Verify URL contains search query
    test.expect(await automationPracticePage.verifySearchUrl(searchTerm)).toBe(true);

    // Verify products are displayed
    const resultsCount = await automationPracticePage.getSearchResultsCount();
    test.expect(resultsCount).toBeGreaterThan(0);
  });

  test('should handle search with no results', async ({ automationPracticePage, page }) => {
    const searchTerm = 'nonexistentproductxyz123';

    // Perform search
    await automationPracticePage.searchForProduct(searchTerm);

    // Take screenshot after search
    await takeScreenshot(page, 'search-no-results');

    // Verify no results message is displayed
    test.expect(await automationPracticePage.isNoResultsMessageDisplayed()).toBe(true);

    // Verify no products are displayed
    const resultsCount = await automationPracticePage.getSearchResultsCount();
    test.expect(resultsCount).toBe(0);
  });

  test('should search with random valid terms', async ({ automationPracticePage, page }) => {
    const searchTerm = getRandomValidSearchTerm();

    // Perform search
    await automationPracticePage.searchForProduct(searchTerm);

    // Take screenshot after search
    await takeScreenshot(page, `search-results-${searchTerm.replace(' ', '-')}`);

    // Verify search results are displayed
    test.expect(await automationPracticePage.isSearchResultsDisplayed()).toBe(true);

    // Verify URL contains search query
    test.expect(await automationPracticePage.verifySearchUrl(searchTerm)).toBe(true);
  });

  test('should handle empty search', async ({ automationPracticePage, page }) => {
    // Try to search with empty string
    await automationPracticePage.searchInput.clear();
    await automationPracticePage.searchButton.click();

    // Take screenshot after search
    await takeScreenshot(page, 'search-empty');

    // Should stay on same page or show appropriate message
    const currentUrl = page.url();
    test.expect(currentUrl).toContain('automationpractice.pl');
  });

  test('should search with special characters', async ({ automationPracticePage, page }) => {
    const searchTerm = '!@#$%';

    // Perform search
    await automationPracticePage.searchForProduct(searchTerm);

    // Take screenshot after search
    await takeScreenshot(page, 'search-special-chars');

    // Verify search was executed (may show no results)
    const currentUrl = page.url();
    test.expect(currentUrl).toContain('controller=search');
  });
});
