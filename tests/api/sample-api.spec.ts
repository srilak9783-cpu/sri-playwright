import { test, expect } from '@playwright/test';
import { ApiResponse } from '../../src/types';

test.describe('Automation Practice API Tests', () => {
  const baseURL = 'http://www.automationpractice.pl';

  test('should get product information via API', async ({ request }) => {
    // This is a placeholder for API testing structure
    // Automation Practice may not have a public API, but this shows the pattern

    const response = await request.get(`${baseURL}/api/products`);

    expect(response.status()).toBe(200);

    const responseBody: ApiResponse = await response.json();
    expect(responseBody).toBeDefined();
  });

  test('should handle API error responses', async ({ request }) => {
    // Test error handling
    const response = await request.get(`${baseURL}/api/nonexistent`);

    // Expecting a 404 or similar error
    expect([404, 500]).toContain(response.status());
  });
});
