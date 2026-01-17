import { test } from '../../src/fixtures/testFixtures';
import { loadTestCases, getTestDataById, logExecutionResult } from '../../src/utils/testManagement';
import { takeScreenshot } from '../../src/utils/helpers';

// Load test cases and generate tests dynamically at module level
const testCases = loadTestCases();
console.log('Loaded test cases:', testCases.length);

for (const testCase of testCases) {
  console.log('Processing test case:', testCase['Test Case ID'], testCase['Automation Status']);
  if (testCase['Automation Status'] === 'Automated') {
    const testDataId = testCase['Test Data'];
    console.log('Test data ID:', testDataId);
    const testDataResult = getTestDataById(testDataId);
    console.log('Test data result:', testDataResult);
    const { dataValues, expectedValidationMessage } = testDataResult;
    console.log('Data values:', dataValues, 'Type:', typeof dataValues, 'Is array:', Array.isArray(dataValues));

    for (const dataItem of dataValues) {
      const dataString = typeof dataItem === 'string' ? dataItem : JSON.stringify(dataItem);
      console.log('Creating test for data item:', dataString);
      test(`${testCase['Test Case Name']} - ${dataString}`, async ({ automationPracticePage, page, browserName }) => {
        const startTime = new Date();
        const executionId = `EXEC_${Date.now()}_${testCase['Test Case ID']}_${dataString.replace(/[^a-zA-Z0-9]/g, '_')}`;

        try {
          // Execute steps based on test case type
          await executeTestSteps(testCase, automationPracticePage, dataItem, expectedValidationMessage);

          // Log success with browser info
          const endTime = new Date();
          const executionTime = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

          logExecutionResult({
            'Execution ID': executionId,
            'Test Case ID': testCase['Test Case ID'],
            'Browser': browserName,
            'Environment': 'staging',
            'Executed By': 'Automated Test',
            'Execution Date': new Date().toLocaleDateString(),
            'Start Time': startTime.toLocaleTimeString(),
            'End Time': endTime.toLocaleTimeString(),
            'Status': 'PASS',
            'Execution Time (seconds)': executionTime.toString(),
            'Notes': `Successfully executed on ${browserName} with data: ${dataItem}`
          });

        } catch (error) {
          // Enhanced error logging with browser context
          await takeScreenshot(page, `failure-${executionId}-${browserName}`);
          const screenshotPath = `screenshots/failure-${executionId}-${browserName}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
          const endTime = new Date();
          const executionTime = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

          logExecutionResult({
            'Execution ID': executionId,
            'Test Case ID': testCase['Test Case ID'],
            'Browser': browserName,
            'Environment': 'staging',
            'Executed By': 'Automated Test',
            'Execution Date': new Date().toLocaleDateString(),
            'Start Time': startTime.toLocaleTimeString(),
            'End Time': endTime.toLocaleTimeString(),
            'Status': 'FAIL',
            'Error Message': error.message,
            'Screenshot Path': screenshotPath,
            'Execution Time (seconds)': executionTime.toString(),
            'Notes': `Failed on ${browserName} with data: ${dataItem}`
          });
          throw error;
        }
      });
    }
  }
}

// Dynamic step execution based on test case
async function executeTestSteps(testCase: any, pageObject: any, dataItem: string, expectedValidationMessage: string) {
  const steps = testCase['Test Steps'].split('|');

  for (const step of steps) {
    await test.step(step, async () => {
      // Parse and execute step with dataItem
      if (step.includes('Navigate to homepage')) {
        await pageObject.open();
      } else if (step.includes('Enter') && step.includes('search box')) {
        await pageObject.searchForProduct(dataItem);
      } else if (step.includes('Verify search results are displayed')) {
        const hasResults = await pageObject.isSearchResultsDisplayed();
        test.expect(hasResults).toBe(true);

        const resultsCount = await pageObject.getSearchResultsCount();
      } else if (step.includes('Count the number of search results')) {
        const resultsCount = await pageObject.getSearchResultsCount();
        console.log(`Found ${resultsCount} search results for '${dataItem}'`);
        test.expect(resultsCount).toBeGreaterThan(0);
      } else if (step.includes('Select any item from results')) {
        // This step is handled in the next step (add to cart)
        console.log('Selecting random product from search results');
      } else if (step.includes('Click on add to cart')) {
        await pageObject.selectRandomProductAndAddToCart();

        // Verify cart confirmation is displayed
        const isConfirmationDisplayed = await pageObject.isCartConfirmationDisplayed();
        test.expect(isConfirmationDisplayed).toBe(true);

        // Verify cart count increased
        const cartCount = await pageObject.getCartItemCount();
        test.expect(cartCount).toBeGreaterThan(0);
      } else if (step.includes('Verify appropriate handling of special characters')) {
        const noResultsDisplayed = await pageObject.isNoResultsMessageDisplayed();
        test.expect(noResultsDisplayed).toBe(true);

        // Assert on expected validation message if provided
        if (expectedValidationMessage) {
          const actualMessage = await pageObject.getValidationMessage();
          test.expect(actualMessage).toContain(expectedValidationMessage);
        }
      } else if (step.includes('Verify error message text')) {
        const errorMessage = await pageObject.getValidationMessage();
        if (expectedValidationMessage) {
          test.expect(errorMessage).toContain(expectedValidationMessage);
        } else {
          test.expect(errorMessage).toContain('No results were found for your search');
        }
        test.expect(errorMessage).toContain(dataItem);
      } else if (step.includes('Verify appropriate handling of special characters')) {
        // Either no results or graceful handling
        const hasResults = await pageObject.isSearchResultsDisplayed();
        const noResults = await pageObject.isNoResultsMessageDisplayed();

        // Test passes if either condition is met
        test.expect(hasResults || noResults).toBe(true);

        // Assert on expected validation message if no results and message expected
        if (noResults && expectedValidationMessage) {
          const actualMessage = await pageObject.getValidationMessage();
          test.expect(actualMessage).toContain(expectedValidationMessage);
        }
      }
      // Add more step types as needed
    });
  }
}