# Excel Driven Tests Management Plan

## Application Overview

Comprehensive test plan for Excel-driven Playwright tests targeting the Automation Practice e-commerce website. This plan covers search functionality, product selection, cart operations, and validation message assertions using CSV-driven test data.

## Test Scenarios

### 1. Search Functionality Tests

**Seed:** `tests/e2e/excel-driven-tests-new.spec.ts`

#### 1.1. Search for existing product

**File:** `tests/e2e/excel-driven-tests-new.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Enter 'dress' in search box
  3. Click search button
  4. Verify search results are displayed

**Expected Results:**
  - Search results page shows products containing 'dress'

#### 1.2. Search for non-existing product

**File:** `tests/e2e/excel-driven-tests-new.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Enter 'nonexistent123' in search box
  3. Click search button
  4. Verify no results message is displayed
  5. Verify error message text

**Expected Results:**
  - 'No results found' message is displayed

#### 1.3. Search with special characters

**File:** `tests/e2e/excel-driven-tests-new.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Enter '!@#$%' in search box
  3. Click search button
  4. Verify appropriate handling of special characters

**Expected Results:**
  - Search either shows no results or handles special characters gracefully

#### 1.4. Search with empty input

**File:** `tests/e2e/excel-driven-tests-new.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Leave search box empty
  3. Click search button
  4. Verify appropriate behavior for empty search

**Expected Results:**
  - Either shows all products or displays appropriate message

#### 1.5. Search and Add to Cart

**File:** `tests/e2e/excel-driven-tests-new.spec.ts`

**Steps:**
  1. Navigate to homepage
  2. Enter 't-shirt' in search box
  3. Click search button
  4. Count the number of search results
  5. Select any item from results
  6. Click on add to cart

**Expected Results:**
  - Product successfully added to cart with confirmation
