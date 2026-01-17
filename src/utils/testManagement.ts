import { parse } from 'csv-parse/sync';
import { readFileSync, appendFileSync } from 'fs';
import { join } from 'path';

export interface TestScenario {
  'Test Scenario ID': string;
  'Test Scenario Name': string;
  'Description': string;
  'Priority': string;
  'Status': string;
  'Tags': string;
}

export interface TestCase {
  'Test Case ID': string;
  'Test Scenario ID': string;
  'Test Case Name': string;
  'Description': string;
  'Preconditions': string;
  'Test Steps': string;
  'Expected Result': string;
  'Test Data': string;
  'Priority': string;
  'Severity': string;
  'Status': string;
  'Automation Status': string;
}

export interface TestData {
  'Data Set ID': string;
  'Data Set Name': string;
  'Description': string;
  'Test Case IDs': string;
  'Data Type': string;
  'Data Values': string;
  'Expected Validation Message': string;
}

export interface ExecutionResult {
  'Execution ID': string;
  'Test Case ID': string;
  'Browser': string;
  'Environment': string;
  'Executed By': string;
  'Execution Date': string;
  'Start Time': string;
  'End Time': string;
  'Status': string;
  'Error Message': string;
  'Screenshot Path': string;
  'Video Path': string;
  'Execution Time (seconds)': string;
  'Notes': string;
}

/**
 * Load test scenarios from CSV
 */
export function loadTestScenarios(): TestScenario[] {
  const filePath = join(__dirname, '..', '..', 'test-management', 'Test_Scenarios.csv');
  const csvContent = readFileSync(filePath, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as TestScenario[];
}

/**
 * Load test cases from CSV
 */
export function loadTestCases(): TestCase[] {
  const filePath = join(__dirname, '..', '..', 'test-management', 'Test_Cases.csv');
  const csvContent = readFileSync(filePath, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as TestCase[];
}

/**
 * Load test data from CSV
 */
export function loadTestData(): TestData[] {
  const filePath = join(__dirname, '..', '..', 'test-management', 'Test_Data.csv');
  const csvContent = readFileSync(filePath, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as TestData[];
}

/**
 * Get test data by data set ID
 */
export function getTestDataById(dataSetId: string): { dataValues: any[], expectedValidationMessage: string } {
  const allData = loadTestData();
  const dataSet = allData.find(data => data['Data Set ID'] === dataSetId);

  if (!dataSet) return { dataValues: [], expectedValidationMessage: '' };

  const dataValues = dataSet['Data Values'].split('|').map((value: string) => {
    if (value.includes(':')) {
      const [key, val] = value.split(':');
      return { [key.trim()]: val.trim() };
    }
    return value.trim();
  });

  return {
    dataValues,
    expectedValidationMessage: dataSet['Expected Validation Message'] || ''
  };
}

/**
 * Get test cases by scenario ID
 */
export function getTestCasesByScenario(scenarioId: string): TestCase[] {
  const allCases = loadTestCases();
  return allCases.filter(testCase => testCase['Test Scenario ID'] === scenarioId);
}

/**
 * Parse test steps from pipe-separated string
 */
export function parseTestSteps(testSteps: string): string[] {
  return testSteps.split('|').map(step => step.trim());
}

/**
 * Log test execution result to CSV
 */
export function logExecutionResult(result: Partial<ExecutionResult>): void {
  const filePath = join(__dirname, '..', '..', 'test-management', 'Test_Execution_Results.csv');

  const executionResult: ExecutionResult = {
    'Execution ID': result['Execution ID'] || `EXEC_${Date.now()}`,
    'Test Case ID': result['Test Case ID'] || '',
    'Browser': result['Browser'] || process.env.BROWSER || 'chromium',
    'Environment': result['Environment'] || process.env.ENV || 'staging',
    'Executed By': result['Executed By'] || 'Automated Test',
    'Execution Date': result['Execution Date'] || new Date().toISOString().split('T')[0],
    'Start Time': result['Start Time'] || new Date().toLocaleTimeString(),
    'End Time': result['End Time'] || '',
    'Status': result['Status'] || 'UNKNOWN',
    'Error Message': result['Error Message'] || '',
    'Screenshot Path': result['Screenshot Path'] || '',
    'Video Path': result['Video Path'] || '',
    'Execution Time (seconds)': result['Execution Time (seconds)'] || '0',
    'Notes': result['Notes'] || ''
  };

  const csvLine = Object.values(executionResult).map(value =>
    `"${value.replace(/"/g, '""')}"`
  ).join(',');

  appendFileSync(filePath, '\n' + csvLine);
}

/**
 * Generate test report from execution results
 */
export function generateTestReport(): any {
  const filePath = join(__dirname, '..', '..', 'test-management', 'Test_Execution_Results.csv');
  const csvContent = readFileSync(filePath, 'utf-8');
  const results = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as ExecutionResult[];

  const totalTests = results.length;
  const passedTests = results.filter(r => r.Status === 'PASS').length;
  const failedTests = results.filter(r => r.Status === 'FAIL').length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0';

  return {
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      passRate: `${passRate}%`
    },
    results,
    generatedAt: new Date().toISOString()
  };
}