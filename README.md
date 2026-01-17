# Playwright POM Framework

A comprehensive Playwright framework with Page Object Model (POM) design pattern for e-commerce testing, featuring Automation Practice search functionality.

## 🚀 Features

- **Page Object Model (POM)**: Clean separation of test logic and page interactions
- **TypeScript Support**: Full TypeScript implementation with type safety
- **Multiple Browsers**: Support for Chromium, Firefox, and WebKit
- **Parallel Execution**: Run tests in parallel for faster execution
- **Comprehensive Reporting**: HTML, Allure, JSON, and JUnit reports
- **Screenshots & Traces**: Automatic capture on failures
- **Environment Configuration**: Flexible environment setup
- **Test Data Management**: Centralized test data handling
- **Utility Functions**: Reusable helper functions
- **CI/CD Ready**: Pre-configured for continuous integration
- **Linting & Formatting**: ESLint and Prettier configuration

## 📁 Project Structure

```
playwright-pom-project/
├── src/
│   ├── pages/                 # Page Object classes
│   │   ├── BasePage.ts       # Base page with common functionality
│   │   └── AutomationPracticePage.ts  # Specific page implementation
│   ├── components/            # Reusable UI components
│   ├── utils/                 # Utility functions
│   │   └── helpers.ts         # Helper functions
│   ├── data/                  # Test data management
│   │   └── testData.ts        # Test data definitions
│   ├── fixtures/              # Test fixtures
│   │   └── testFixtures.ts    # Custom test fixtures
│   └── types/                 # TypeScript type definitions
│       └── index.ts           # Type definitions
├── tests/
│   ├── e2e/                   # End-to-end tests
│   │   └── autopractice-search.spec.ts  # Search functionality tests
│   └── api/                   # API tests (future)
├── playwright.config.ts       # Playwright configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .eslintrc.json            # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── .gitignore                # Git ignore rules
└── .env.example              # Environment variables template
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd playwright-pom-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Environment Configuration
ENV=staging
BASE_URL=http://www.automationpractice.pl

# Browser Configuration
BROWSER=chromium
HEADLESS=false

# Test Configuration
TIMEOUT=30000
RETRIES=1

# Reporting
REPORT_HTML=true
REPORT_ALLURE=true

# Parallel Execution
WORKERS=2

# Screenshots and Traces
SCREENSHOT_ON_FAILURE=only-on-failure
TRACE_ON_FAILURE=on-first-retry
```

### Playwright Configuration

The `playwright.config.ts` file contains all Playwright-specific configurations including:

- Test directory and output settings
- Browser configurations
- Parallel execution settings
- Reporter configurations
- Global timeouts

## 🏃‍♂️ Running Tests

### Run all tests

```bash
npm test
```

### Run tests in headed mode

```bash
npm run test:headed
```

### Run tests with debugging

```bash
npm run test:debug
```

### Run tests in UI mode

```bash
npm run test:ui
```

### Run specific test file

```bash
npx playwright test tests/e2e/autopractice-search.spec.ts
```

### Run smoke tests

```bash
npm run test:smoke
```

### Run regression tests

```bash
npm run test:regression
```

### Run API tests

```bash
npm run test:api
```

## 📊 Reporting

### HTML Report

```bash
npm run report
```

Opens the HTML test report in your default browser.

### Allure Report

```bash
npm run allure:generate
npm run allure:open
```

## 🧪 Test Structure

### Page Object Model

The framework uses POM to separate page logic from test logic:

```typescript
// pages/AutomationPracticePage.ts
export class AutomationPracticePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  async searchForProduct(productName: string): Promise<void> {
    await this.fillSafely(this.searchInput, productName);
    await this.clickSafely(this.searchButton);
  }
}
```

### Test Fixtures

Custom fixtures provide page objects to tests:

```typescript
// fixtures/testFixtures.ts
export const test = baseTest.extend<{
  automationPracticePage: AutomationPracticePage;
}>({
  automationPracticePage: async ({ page }, use) => {
    const automationPracticePage = new AutomationPracticePage(page);
    await use(automationPracticePage);
  },
});
```

### Writing Tests

```typescript
// tests/e2e/autopractice-search.spec.ts
test('should search for products', async ({ automationPracticePage }) => {
  await automationPracticePage.open();
  await automationPracticePage.searchForProduct('dress');

  // Assertions
  expect(await automationPracticePage.isSearchResultsDisplayed()).toBe(true);
});
```

## 🛠️ Development

### Code Quality

- **Linting**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`
- **Formatting**: `npm run format`
- **Pre-commit checks**: `npm run pre-commit`

### Adding New Page Objects

1. Create a new page class extending `BasePage`
2. Define page elements as `Locator` properties
3. Implement page-specific methods
4. Add the page to test fixtures if needed

### Adding New Tests

1. Create test files in `tests/e2e/` or `tests/api/`
2. Use appropriate fixtures
3. Follow the naming convention: `*.spec.ts`
4. Add proper test descriptions and tags

## 🔧 Utilities

### Helper Functions

Located in `src/utils/helpers.ts`:

- `generateRandomString()` - Generate random strings
- `generateRandomEmail()` - Generate random emails
- `takeScreenshot()` - Take timestamped screenshots
- `waitFor()` - Wait for specified time
- `cleanText()` - Clean and format text

### Test Data

Located in `src/data/testData.ts`:

- Predefined test data
- Search terms and expected results
- Configuration constants
- Helper functions for data generation

## 🌐 Browser Support

- **Chromium**: Latest version
- **Firefox**: Latest version
- **WebKit**: Latest version
- **Mobile**: iPhone 12, Pixel 5 viewports

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 Best Practices

### Test Writing

- Use descriptive test names
- Keep tests independent
- Use page objects for all interactions
- Add proper assertions
- Include screenshots for debugging

### Code Quality

- Follow TypeScript best practices
- Use meaningful variable names
- Add JSDoc comments for public methods
- Keep methods small and focused
- Use async/await consistently

### Page Objects

- Extend `BasePage` for common functionality
- Define all locators as class properties
- Implement methods for user actions
- Return meaningful data from methods
- Handle waits and retries appropriately

## 📞 Support

For questions or issues:

- Check the [Issues](../../issues) page
- Review the [Documentation](./docs/)
- Join our [Discussions](../../discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
