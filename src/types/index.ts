/**
 * Type definitions for the Playwright POM framework
 */

// Test data types
export interface SearchTerm {
  term: string;
  expectedResults: number;
  category?: string;
}

export interface Product {
  name: string;
  price: string;
  imageUrl: string;
  link: string;
}

export interface SearchResult {
  query: string;
  resultsCount: number;
  products: Product[];
  hasResults: boolean;
}

// Browser configuration types
export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface BrowserConfig {
  name: BrowserType;
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

// Test configuration types
export interface TestConfig {
  environment: 'development' | 'staging' | 'production';
  baseUrl: string;
  timeout: number;
  retries: number;
  workers: number;
  screenshotOnFailure: boolean;
  traceOnFailure: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  responseTime: number;
}

// Form data types
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AddressFormData {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  mobile?: string;
  alias?: string;
}

// Test result types
export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshot?: string;
  trace?: string;
}

// Page object method return types
export interface PageActionResult {
  success: boolean;
  message?: string;
  data?: any;
}

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
