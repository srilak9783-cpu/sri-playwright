# AI Coding Assistant Instructions

## Project Overview

This is a Playwright Page Object Model (POM) framework for e-commerce testing, specifically targeting the Automation Practice website (http://www.automationpractice.pl). The framework uses TypeScript with strict configuration and focuses on maintainable, reusable test automation.

## Architecture & Key Components

### Page Object Model Structure

- **BasePage** (`src/pages/BasePage.ts`): Abstract base class providing common functionality
  - Safe element interactions: `clickSafely()`, `fillSafely()` with retry logic
  - Waiting utilities: `waitForElement()`, `waitForPageLoad()`
  - Screenshot helpers: `takeScreenshot()` with timestamped filenames
- **Page Objects**: Extend BasePage, define locators as `readonly` properties, implement page-specific methods
- **Test Fixtures** (`src/fixtures/testFixtures.ts`): Extend Playwright's test with page object injection

### Example Page Object Pattern

```typescript
export class AutomationPracticePage extends BasePage {
  readonly searchInput: Locator = this.page.locator('#search_query_top');
  readonly searchButton: Locator = this.page.locator('button[name="submit_search"]');

  async searchForProduct(productName: string): Promise<void> {
    await this.fillSafely(this.searchInput, productName);
    await this.clickSafely(this.searchButton);
  }
}
```

## Critical Developer Workflows

### Testing Commands

- `npm test` - Run all tests in headless mode
- `npm run test:headed` - Run tests with browser visible
- `npm run test:debug` - Debug mode with breakpoints
- `npm run test:ui` - Playwright UI mode for test exploration
- `npm run report` - Open HTML test report

### Code Quality

- `npm run lint` - ESLint checking
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Prettier formatting
- `npm run pre-commit` - Combined lint + format check

### Test Organization

- Tests in `tests/e2e/` use `.spec.ts` naming
- Custom fixtures inject page objects: `test('name', async ({ automationPracticePage }) => {...})`
- BeforeEach/AfterEach hooks handle tracing and screenshots
- Tags: `@smoke`, `@regression` for selective test runs

## Project-Specific Conventions

### Page Object Creation

1. Extend `BasePage` for all page objects
2. Define locators as `readonly` class properties in constructor
3. Implement async methods for user actions
4. Return meaningful data from methods
5. Use `this.page.locator()` for dynamic elements

### Test Data Management

- Centralized in `src/data/testData.ts`
- Structured objects for URLs, search terms, expected results
- Helper functions: `getRandomValidSearchTerm()`

### Utility Functions

- Located in `src/utils/helpers.ts`
- `generateRandomString()`, `generateRandomEmail()`
- `takeScreenshot()` with timestamp formatting
- `waitFor()` for explicit waits

### Configuration

- Environment variables via `.env` file
- Playwright config uses `process.env.*` for dynamic settings
- TypeScript path mapping: `@pages/*`, `@utils/*`, etc.

### Error Handling & Reliability

- `clickSafely()` and `fillSafely()` include retry logic (3 attempts)
- `fillSafely()` verifies input value after filling
- Automatic screenshots/traces on test failures
- `waitForPageLoad()` uses `networkidle` state

## Integration Points

### External Dependencies

- **Automation Practice**: Target website (http://www.automationpractice.pl)
- **Allure**: Test reporting (`npm run allure:generate && npm run allure:open`)
- **dotenv**: Environment configuration

### CI/CD Integration

- GitHub Actions workflow runs on push/PR to main/develop
- Installs Playwright browsers with `--with-deps`
- Uploads artifacts: reports, screenshots, traces (30-day retention)

## Key Files Reference

- `src/pages/BasePage.ts` - Core page object functionality
- `src/fixtures/testFixtures.ts` - Test fixture definitions
- `src/data/testData.ts` - Test data constants
- `playwright.config.ts` - Browser, timeout, and reporter configuration
- `tests/e2e/autopractice-search.spec.ts` - Example test implementation</content>
  <parameter name="filePath">c:\Users\srila\OneDrive\Desktop\playwright-pom-project\.github\copilot-instructions.md
