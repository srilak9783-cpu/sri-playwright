# Test Management Excel Structure

This directory contains CSV files that can be opened in Excel for comprehensive test management. These files provide a structured approach to maintain test scenarios, test cases, test data, and execution results.

## 📊 Excel Sheets Structure

### 1. Test_Scenarios.csv
Contains high-level test scenarios that group related test cases.

**Columns:**
- `Test Scenario ID`: Unique identifier (e.g., TS_001)
- `Test Scenario Name`: Descriptive name
- `Description`: Detailed description of the scenario
- `Priority`: High/Medium/Low
- `Status`: Active/Inactive/Completed
- `Created By`: Author name
- `Created Date`: Creation date
- `Tags`: Comma-separated tags for filtering

### 2. Test_Cases.csv
Detailed test cases with step-by-step instructions.

**Columns:**
- `Test Case ID`: Unique identifier (e.g., TC_001)
- `Test Scenario ID`: Links to parent scenario
- `Test Case Name`: Descriptive name
- `Description`: Detailed description
- `Preconditions`: Required setup before test
- `Test Steps`: Pipe-separated (|) step-by-step instructions
- `Expected Result`: Expected outcome
- `Test Data`: Reference to data sets
- `Priority`: High/Medium/Low
- `Severity`: Critical/High/Medium/Low
- `Status`: Active/Inactive/Draft
- `Automation Status`: Manual/Automated/To Be Automated
- `Created By`: Author name
- `Created Date`: Creation date

### 3. Test_Data.csv
Reusable test data sets for different scenarios.

**Columns:**
- `Data Set ID`: Unique identifier (e.g., DS_001)
- `Data Set Name`: Descriptive name
- `Description`: Purpose of the data set
- `Test Case IDs`: Which test cases use this data
- `Data Type`: Type of data (Search Terms, User Data, etc.)
- `Data Values`: Pipe-separated values or key:value pairs
- `Created By`: Author name
- `Created Date`: Creation date

### 4. Test_Execution_Results.csv
Tracks actual test execution results and outcomes.

**Columns:**
- `Execution ID`: Unique execution identifier
- `Test Case ID`: Links to test case
- `Browser`: Browser used (chromium, firefox, etc.)
- `Environment`: staging/production/dev
- `Executed By`: Tester name
- `Execution Date`: Date of execution
- `Start Time/End Time`: Execution timestamps
- `Status`: PASS/FAIL/SKIP/BLOCKED
- `Error Message`: Failure details
- `Screenshot Path`: Path to failure screenshot
- `Video Path`: Path to execution video
- `Execution Time`: Duration in seconds
- `Notes`: Additional observations

## 🚀 How to Use

### 1. Open in Excel
- Open Excel
- File → Open → Select CSV file
- Choose "Delimited" and select "Comma" as delimiter
- Format columns appropriately

### 2. Integration with Playwright Tests

#### Reading Test Data from CSV:
```typescript
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';

export function loadTestData(dataSetId: string) {
  const csvContent = readFileSync('./test-management/Test_Data.csv', 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  const dataSet = records.find((record: any) => record['Data Set ID'] === dataSetId);
  if (!dataSet) return null;

  // Parse pipe-separated values
  return dataSet['Data Values'].split('|').map((value: string) => {
    if (value.includes(':')) {
      const [key, val] = value.split(':');
      return { [key]: val };
    }
    return value;
  });
}
```

#### Test Case Mapping:
```typescript
// Map Excel test cases to Playwright tests
const testCaseMapping = {
  'TC_001': 'should search for existing product',
  'TC_002': 'should search for non-existing product',
  'TC_003': 'should handle special characters in search'
};
```

### 3. Automated Reporting
Create scripts to update execution results:

```typescript
export function logTestResult(testCaseId: string, status: string, details: any) {
  const executionRecord = {
    'Execution ID': `EXEC_${Date.now()}`,
    'Test Case ID': testCaseId,
    'Browser': process.env.BROWSER || 'chromium',
    'Environment': process.env.ENV || 'staging',
    'Executed By': 'Automated Test',
    'Execution Date': new Date().toISOString().split('T')[0],
    'Status': status,
    // ... other fields
  };

  // Append to Test_Execution_Results.csv
}
```

## 📈 Benefits

1. **Centralized Test Management**: All test artifacts in one place
2. **Traceability**: Link scenarios → test cases → test data → results
3. **Reporting**: Generate comprehensive test reports
4. **Collaboration**: Easy sharing and review process
5. **Maintenance**: Simple updates to test data and scenarios
6. **Integration**: Seamless connection with automated tests

## 🔄 Workflow

1. **Planning**: Create scenarios and test cases in Excel
2. **Data Preparation**: Define test data sets
3. **Automation**: Map Excel test cases to Playwright tests
4. **Execution**: Run automated tests
5. **Reporting**: Update execution results in Excel
6. **Analysis**: Generate reports and metrics

## 📋 Maintenance Guidelines

- Keep test case IDs consistent across all sheets
- Update status fields regularly
- Add new test cases with proper linking
- Archive completed test scenarios
- Review and update test data periodically
- Maintain execution history for trend analysis

## 🛠️ Tools Integration

- **Excel/Google Sheets**: For manual editing and reporting
- **CSV parsers**: For automated reading in tests
- **Reporting tools**: Generate dashboards from execution results
- **CI/CD**: Integrate with automated test pipelines