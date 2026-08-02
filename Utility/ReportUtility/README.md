# Custom HTML Reporting System - Usage Guide

## Overview

This custom HTML reporting system provides:
- **Summary Statistics**: Total tests, Pass/Fail/Skip counts, Pass percentage
- **Detailed Logs**: Step-by-step execution logs with color coding
- **Screenshot Capture**: Automatic screenshots on failures
- **Bootstrap Styled**: Modern, responsive HTML reports

---

## Features

### ✅ Test.Log Utility Functions

Use these logging functions throughout your tests:

```javascript
Test.Log.Info(message, details)           // Blue - Informational
Test.Log.Pass(message, details, page)     // Green - Success
Test.Log.Fail(message, details, page)     // Red - Failure (auto-screenshot)
Test.Log.Error(message, error, page)      // Red - Error (auto-screenshot)
Test.Log.Warning(message, details)        // Orange - Warning
Test.Log.Skip(message, details)           // Yellow - Skipped
```

### 📊 Summary Dashboard

The report includes:
- **Total Tests** - Count of all executed tests
- **Passed** - Tests that passed (green)
- **Failed** - Tests that failed (red)
- **Skipped** - Tests that were skipped (yellow)
- **Pass Rate** - Percentage bar showing pass rate

### 📝 Test Details

Each test shows:
- Test name and file path
- Status badge (Passed/Failed/Skipped)
- Execution duration
- **Expandable logs** - Click to view detailed execution logs
- **Screenshots** - Click thumbnails to expand (for failures)
- Error messages (if failed)

---

## Quick Start

### 1. Import Test Logger

Add this import to your test file:

```javascript
import Test from '../../../Utility/ReportUtility/TestLogger.js';
```

### 2. Add Logging Statements

Example usage in a test:

```javascript
test('Validate Login', async function() {
  try {
    Test.Log.Info('Starting login test');

    let username = process.env.UN;
    let password = process.env.PWD;

    Test.Log.Info(`Logging in with username: ${username}`);

    await loginPage.login(username, password);

    Test.Log.Pass('Login successful', null, base.page);
  }
  catch (error) {
    Test.Log.Fail('Login failed', error.message, base.page);  // Auto-captures screenshot
    throw error;
  }
});
```

### 3. Run Tests

```bash
npx playwright test
```

### 4. View Report

The custom report is generated at:
```
Reports/custom-report.html
```

Open it in any browser to view the results.

---

## API Reference

### Test.Log.Info()

Log informational messages (displayed in blue).

**Parameters:**
- `message` (string) - The log message
- `details` (any, optional) - Additional details (will be JSON stringified)

**Example:**
```javascript
Test.Log.Info('Starting test execution');
Test.Log.Info('User count', { count: 5 });
```

---

### Test.Log.Pass()

Log success/pass messages (displayed in green).

**Parameters:**
- `message` (string) - The success message
- `details` (any, optional) - Additional details
- `page` (Page, optional) - Playwright page object for context

**Example:**
```javascript
Test.Log.Pass('Login successful', null, base.page);
Test.Log.Pass('Validation passed', { field: 'email', value: 'test@example.com' });
```

---

### Test.Log.Fail()

Log failure messages with automatic screenshot capture (displayed in red).

**Parameters:**
- `message` (string) - The failure message
- `details` (any, optional) - Additional details
- `page` (Page, **required for screenshot**) - Playwright page object

**Example:**
```javascript
await Test.Log.Fail('Login failed', 'Invalid credentials', base.page);
```

**Note:** Use `await` when passing `page` parameter for screenshot capture.

---

### Test.Log.Error()

Log error messages with automatic screenshot capture (displayed in red).

**Parameters:**
- `message` (string) - The error message
- `error` (Error|string, optional) - Error object or message
- `page` (Page, **required for screenshot**) - Playwright page object

**Example:**
```javascript
try {
  // some code
} catch (error) {
  await Test.Log.Error('Exception occurred', error, base.page);
  throw error;
}
```

---

### Test.Log.Warning()

Log warning messages (displayed in orange/yellow).

**Parameters:**
- `message` (string) - The warning message
- `details` (any, optional) - Additional details

**Example:**
```javascript
Test.Log.Warning('Element not visible, retrying...');
```

---

### Test.Log.Skip()

Log skipped test information (displayed in yellow).

**Parameters:**
- `message` (string) - The skip reason
- `details` (any, optional) - Additional details

**Example:**
```javascript
Test.Log.Skip('Test skipped due to missing test data');
```

---

## Configuration

The custom reporter is configured in `playwright.config.js`:

```javascript
reporter: [
  // ... other reporters ...
  ['./Utility/ReportUtility/CustomHtmlReporter.js', {
    outputFile: 'custom-report.html',  // Report filename
    outputDir: 'Reports'                // Output directory
  }]
]
```

### Options:
- `outputFile` - Name of the HTML report file (default: `custom-report.html`)
- `outputDir` - Directory to save the report (default: `Reports`)

---

## File Structure

```
Utility/ReportUtility/
├── TestLogger.js           # Test.Log utility class
├── CustomHtmlReporter.js   # Playwright reporter
├── ReportBuilder.js        # HTML generation
└── README.md              # This file

Reports/
└── custom-report.html     # Generated report
```

---

## Console Output

Logs also appear in the console during test execution with color coding:

```
[INFO] Starting login test
[INFO] Logging in with username: Admin
[PASS] Login successful
```

Colors:
- **Cyan** - Info
- **Green** - Pass
- **Red** - Fail/Error
- **Yellow** - Warning/Skip

---

## Best Practices

### 1. Log at Key Points
```javascript
Test.Log.Info('Test phase: Setup');
// setup code
Test.Log.Info('Test phase: Execution');
// execution code
Test.Log.Pass('Test phase: Verification passed');
```

### 2. Always Pass Page for Failures
```javascript
// ✅ Good - includes page for screenshot
await Test.Log.Fail('Assertion failed', details, base.page);

// ❌ Bad - missing page, no screenshot
Test.Log.Fail('Assertion failed', details);
```

### 3. Use Details Parameter
```javascript
// ✅ Good - provides context
Test.Log.Info('API Response', { status: 200, data: response });

// ⚠️ Acceptable - but less informative
Test.Log.Info('API Response received');
```

### 4. Wrap in Try-Catch
```javascript
test('My Test', async function() {
  try {
    Test.Log.Info('Starting test');
    // test code
    Test.Log.Pass('Test passed', null, base.page);
  }
  catch (error) {
    await Test.Log.Fail('Test failed', error.message, base.page);
    throw error;
  }
});
```

---

## Troubleshooting

### Report not generated?
- Check console output for reporter errors
- Ensure `Reports/` directory has write permissions
- Verify reporter is configured in `playwright.config.js`

### Logs not appearing in report?
- Ensure `Test.Log` methods are called during test execution
- Check test is actually running (not skipped)

### Screenshots not captured?
- Ensure `page` parameter is passed to `Fail()` or `Error()`
- Use `await` when calling these methods: `await Test.Log.Fail(..., page)`
- Verify page object is valid and browser is open

### Report looks broken?
- Check internet connection (Bootstrap CDN required)
- Open browser console for JavaScript errors
- Verify HTML file is not corrupted

---

## Examples

### Example 1: Basic Test with Logging

```javascript
import Test from '../../../Utility/ReportUtility/TestLogger.js';

test('User Registration', async function() {
  try {
    Test.Log.Info('Starting user registration test');

    Test.Log.Info('Navigating to registration page');
    await page.goto('/register');

    Test.Log.Info('Filling registration form');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');

    Test.Log.Info('Submitting form');
    await page.click('button[type="submit"]');

    Test.Log.Pass('User registered successfully', null, page);
  }
  catch (error) {
    await Test.Log.Fail('Registration failed', error.message, page);
    throw error;
  }
});
```

### Example 2: API Test with Logging

```javascript
test('API - Get Users', async function() {
  Test.Log.Info('Making GET request to /api/users');

  const response = await request.get('/api/users');

  Test.Log.Info('Response received', { status: response.status() });

  if (response.status() === 200) {
    Test.Log.Pass('API request successful');
  } else {
    await Test.Log.Fail('API request failed', `Status: ${response.status()}`);
  }
});
```

### Example 3: Multiple Assertions

```javascript
test('Form Validation', async function() {
  try {
    Test.Log.Info('Testing form validation');

    await page.fill('#email', 'invalid-email');
    await page.click('button[type="submit"]');

    const errorVisible = await page.isVisible('.error-message');

    if (errorVisible) {
      Test.Log.Pass('Error message displayed correctly', null, page);
    } else {
      await Test.Log.Fail('Error message not displayed', null, page);
      throw new Error('Validation failed');
    }
  }
  catch (error) {
    await Test.Log.Error('Test exception', error, page);
    throw error;
  }
});
```

---

## License

This custom reporting system is part of the Playwright test framework.

---

## Support

For issues or questions:
1. Check this README
2. Review generated report in browser console for errors
3. Check Playwright console output during test execution

---

**Happy Testing! 🚀**
