import { test } from '../../src/fixtures/testFixtures';
import { loadTestCases, getTestDataById, logExecutionResult } from '../../src/utils/testManagement';
import { takeScreenshot } from '../../src/utils/helpers';

test.describe('Dynamic Excel-Driven Test Suite', () => {
  const testCases = loadTestCases();

  // Execute ALL test cases from Excel dynamically
  for (const testCase of testCases) {
    if (testCase['Automation Status'] === 'Automated') {
      const testDataId = testCase['Test Data'];
      const testData = getTestDataById(testDataId) as string[];

      // Execute test for EACH data item across ALL browsers
      for (const dataItem of testData) {
        test(`${testCase['Test Case Name']} - ${dataItem}`, async ({ automationPracticePage, page, browserName }) => {
          const startTime = new Date();
          const executionId = `EXEC_${Date.now()}_${testCase['Test Case ID']}_${dataItem.replace(/[^a-zA-Z0-9]/g, '_')}`;

          try {
            // Execute steps based on test case type
            await executeTestSteps(testCase, automationPracticePage, dataItem);

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
});

// Dynamic step execution based on test case
async function executeTestSteps(testCase: any, pageObject: any, dataItem: string) {
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
        test.expect(resultsCount).toBeGreaterThan(0);
      } else if (step.includes('Verify no results message is displayed')) {
        const noResultsDisplayed = await pageObject.isNoResultsMessageDisplayed();
        test.expect(noResultsDisplayed).toBe(true);
      } else if (step.includes('Verify error message text')) {
        const errorMessage = await pageObject.getNoResultsMessage();
        test.expect(errorMessage).toContain('No results were found for your search');
        test.expect(errorMessage).toContain(dataItem);
      } else if (step.includes('Verify appropriate handling of special characters')) {
        // Either no results or graceful handling
        const hasResults = await pageObject.isSearchResultsDisplayed();
        const noResults = await pageObject.isNoResultsMessageDisplayed();

        // Test passes if either condition is met
        test.expect(hasResults || noResults).toBe(true);
      }
      // Add more step types as needed
    });
  }
}