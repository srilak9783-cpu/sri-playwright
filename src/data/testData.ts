/**
 * Test data for Automation Practice website
 */
export const testData = {
  // URLs
  baseUrl: 'http://www.automationpractice.pl',
  homePage: '/index.php',

  // Search terms
  searchTerms: {
    valid: ['dress', 't-shirt', 'blouse', 'short sleeve', 'summer dress'],
    invalid: ['nonexistent product', 'xyz123', 'invalid search term'],
    specialCharacters: ['!@#$%', 'test<>', 'search/with/slashes'],
  },

  // Expected results
  expectedResults: {
    dress: {
      minResults: 3,
      containsText: 'dress',
    },
    't-shirt': {
      minResults: 1,
      containsText: 't-shirt',
    },
    'short sleeve': {
      minResults: 1,
      containsText: 'sleeve',
    },
  },

  // Page elements
  selectors: {
    logo: 'a[title="My Shop"]',
    searchInput: '#search_query_top',
    searchButton: 'button[name="submit_search"]',
    searchHeading: 'h1',
    productContainer: '.product-container',
    productName: '.product-name',
    noResultsMessage: '.alert-warning',
  },

  // Test timeouts
  timeouts: {
    pageLoad: 30000,
    elementWait: 10000,
    navigation: 15000,
  },

  // Browser configurations
  browsers: {
    chromium: 'Desktop Chrome',
    firefox: 'Desktop Firefox',
    webkit: 'Desktop Safari',
  },
};

/**
 * Get random search term from valid search terms
 */
export function getRandomValidSearchTerm(): string {
  const terms = testData.searchTerms.valid;
  return terms[Math.floor(Math.random() * terms.length)];
}

/**
 * Get random search term from invalid search terms
 */
export function getRandomInvalidSearchTerm(): string {
  const terms = testData.searchTerms.invalid;
  return terms[Math.floor(Math.random() * terms.length)];
}

/**
 * Get expected results for a search term
 */
export function getExpectedResults(searchTerm: string) {
  return testData.expectedResults[searchTerm as keyof typeof testData.expectedResults];
}
