# Contributing Guide

Thank you for your interest in contributing to the Playwright POM Framework! This document provides guidelines and best practices for contributing to the project.

## 🛠️ Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/playwright-pom-framework.git
   cd playwright-pom-framework
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright Browsers**

   ```bash
   npx playwright install
   ```

4. **Set up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 📝 Code Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Enable strict type checking
- Use interfaces for complex objects
- Avoid `any` type; use proper typing
- Add JSDoc comments for public methods

### Naming Conventions

- **Files**: PascalCase for classes, camelCase for utilities
- **Classes**: PascalCase (e.g., `AutomationPracticePage`)
- **Methods**: camelCase (e.g., `searchForProduct()`)
- **Constants**: UPPER_SNAKE_CASE
- **Variables**: camelCase

### Code Structure

```typescript
// Good: Clear structure with proper typing
export class ExamplePage extends BasePage {
  readonly exampleElement: Locator;

  constructor(page: Page) {
    super(page);
    this.exampleElement = page.locator('.example');
  }

  /**
   * Performs an example action
   * @param input - Input parameter
   * @returns Promise<void>
   */
  async performExampleAction(input: string): Promise<void> {
    await this.fillSafely(this.exampleElement, input);
  }
}
```

## 🧪 Writing Tests

### Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should perform specific action', async ({ pageObject }) => {
    // Arrange
    await pageObject.setup();

    // Act
    await pageObject.performAction();

    // Assert
    expect(await pageObject.getResult()).toBe(expectedValue);
  });
});
```

### Test Best Practices

- Use descriptive test names
- Keep tests independent and isolated
- Use page objects for all interactions
- Add proper assertions with meaningful messages
- Include screenshots for debugging
- Use test fixtures appropriately

### Test Tags

```typescript
test('should login successfully @smoke @regression', async () => {
  // Test implementation
});
```

## 🚀 Adding New Features

### 1. Page Objects

1. Create a new page class extending `BasePage`
2. Define page elements as `Locator` properties
3. Implement page-specific methods
4. Add proper error handling and waits

### 2. Test Data

1. Add new data to `src/data/testData.ts`
2. Create type definitions in `src/types/index.ts`
3. Use helper functions for dynamic data generation

### 3. Utilities

1. Add utility functions to `src/utils/helpers.ts`
2. Export functions for use in tests
3. Add proper TypeScript typing

### 4. Test Fixtures

1. Extend the base test in `src/fixtures/testFixtures.ts`
2. Add new page objects or utilities
3. Update test files to use new fixtures

## 🔍 Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/e2e/example.spec.ts

# Run tests with specific tag
npx playwright test --grep "@smoke"

# Run tests in debug mode
npm run test:debug
```

### Test Coverage

- Aim for high test coverage
- Test both positive and negative scenarios
- Include edge cases and error conditions
- Test across different browsers when applicable

## 📋 Pull Request Process

1. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code standards
   - Add tests for new features
   - Update documentation if needed

3. **Run Quality Checks**

   ```bash
   npm run lint
   npm run format
   npm test
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

```
type(scope): description

Types:
- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting
- refactor: code restructuring
- test: adding tests
- chore: maintenance
```

## 🐛 Reporting Issues

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots/Logs**: If applicable

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new public methods
- Update this contributing guide if needed
- Keep examples up to date

## 🤝 Code Review Guidelines

### For Reviewers

- Check code quality and standards
- Verify tests are included and passing
- Ensure proper error handling
- Review for security implications
- Check performance considerations

### For Contributors

- Address all review comments
- Test changes thoroughly
- Keep commits focused and atomic
- Update documentation as needed

## 🎯 Performance Considerations

- Use efficient selectors (prefer data-testid, then semantic selectors)
- Implement proper waits (avoid sleep, use waitFor)
- Minimize screenshot/video capture in CI
- Optimize parallel execution
- Cache expensive operations when possible

## 🔒 Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate user inputs in tests
- Follow secure coding practices
- Report security issues privately

Thank you for contributing to make this framework better! 🚀
