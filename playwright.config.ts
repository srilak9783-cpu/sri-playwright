import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // Global test timeout
  timeout: parseInt(process.env.TIMEOUT || '30000'),

  // Expect timeout
  expect: {
    timeout: 10000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : parseInt(process.env.RETRIES || '1'),

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : parseInt(process.env.WORKERS || '2'),

  // Reporter to use
  reporter: [
    ['html', { open: process.env.REPORT_HTML === 'true' ? 'always' : 'never' }],
    ['allure-playwright'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://www.automationpractice.pl',

    // Run tests in headed mode (visible browser)
    headless: false,

    // Browser launch arguments to maximize window
    args: ['--start-maximized'],

    // Collect trace when retrying the failed test
    trace: process.env.TRACE_ON_FAILURE || 'on-first-retry',

    // Take screenshot only when test fails
    screenshot: process.env.SCREENSHOT_ON_FAILURE || 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Browser context options - maximize window
    viewport: null,
    ignoreHTTPSErrors: true,

    // Action timeout
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        args: ['--start-maximized']
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
        args: ['--start-maximized']
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
        args: ['--start-fullscreen']
      },
    },

    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: { width: 1920, height: 1080 },
        args: ['--start-maximized', '--window-size=1920,1080']
      },
    },

    {
      name: 'Chrome HiDPI',
      use: {
        ...devices['Desktop Chrome HiDPI'],
        viewport: { width: 1920, height: 1080 },
        args: ['--start-maximized']
      },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },

    {
      name: 'Galaxy S9+',
      use: { ...devices['Galaxy S9+'] },
    },
  ],

  // Run your local dev server before starting the tests
  // webServer: [
  //   {
  //     command: 'npm run start',
  //     port: 3000,
  //   },
  // ],
});
