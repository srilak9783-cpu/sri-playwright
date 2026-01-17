import { Page } from '@playwright/test';

/**
 * Utility functions for Playwright tests
 */

/**
 * Generate random string
 * @param length - Length of the string
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  return `${generateRandomString(8)}@test.com`;
}

/**
 * Generate random number within range
 * @param min - Minimum value
 * @param max - Maximum value
 */
export function generateRandomNumber(min: number = 1, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Wait for specified milliseconds
 * @param ms - Milliseconds to wait
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format date for screenshots/filenames
 */
export function getFormattedDateTime(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Take screenshot with timestamp
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = getFormattedDateTime();
  await page.screenshot({
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * Generate test data for forms
 */
export function generateFormData() {
  return {
    firstName: `Test${generateRandomString(5)}`,
    lastName: `User${generateRandomString(5)}`,
    email: generateRandomEmail(),
    password: generateRandomString(12),
    address: `${generateRandomNumber(100, 999)} Test Street`,
    city: `TestCity${generateRandomNumber(1, 100)}`,
    zipCode: generateRandomNumber(10000, 99999).toString(),
    phone: generateRandomNumber(1000000000, 9999999999).toString(),
  };
}

/**
 * Validate email format
 * @param email - Email to validate
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Clean string by removing extra spaces and trimming
 * @param text - Text to clean
 */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extract numbers from string
 * @param text - Text containing numbers
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Convert string to title case
 * @param text - Text to convert
 */
export function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Check if array contains all elements from another array
 * @param array - Main array
 * @param elements - Elements to check
 */
export function containsAll(array: any[], elements: any[]): boolean {
  return elements.every((element) => array.includes(element));
}

/**
 * Remove duplicates from array
 * @param array - Array with potential duplicates
 */
export function removeDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}
