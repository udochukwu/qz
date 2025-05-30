# E2E Testing for Unstuck Web App

This directory contains end-to-end tests for the Unstuck web app using Playwright.

## Running Tests Locally

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Install Playwright browsers:

   ```bash
   pnpm exec playwright install
   ```

3. Run the tests:

   ```bash
   pnpm test:e2e
   ```

4. Run tests with UI:

   ```bash
   pnpm test:e2e:ui
   ```

5. Debug tests:
   ```bash
   pnpm test:e2e:debug
   ```

## Product Tour Test

Required environment variables:

- `TESTER_LOGIN_SECRET`: Secret key required for tester login functionality

## Test Structure

- `fixtures/`: Common test fixtures and setup
- `pages/`: Page object models for interacting with the app
- `*.spec.ts`: Test files

## Adding New Tests

1. Create page object models for the pages/components you want to test
2. Create a new test file or add tests to an existing file
3. Use the authentication fixture if your test requires a logged-in user

## Debugging Failing Tests

1. Run tests with the `--debug` flag:

   ```bash
   pnpm test:e2e:debug
   ```

2. Check the test report:

   ```bash
   pnpm exec playwright show-report
   ```

3. Review screenshots and videos of failed tests in the `playwright-report/` directory
