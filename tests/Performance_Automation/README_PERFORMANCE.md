# Enhanced Performance Testing Framework

## Overview
This framework provides comprehensive performance testing capabilities using Playwright and Google Lighthouse, generating detailed HTML reports similar to the C# ReportGenerator format.

## New Files Created

### 1. **EnhancedPerformanceReporter.js**
Location: `Utility/ReportUtility/EnhancedPerformanceReporter.js`

**Purpose:** Generates comprehensive HTML performance reports with:
- Performance Summary table with ratings (Excellent, Good, Average, Needs Improvement)
- Detailed metrics table showing all runs (Run 1, Run 2, Run 3)
- Color-coded rows based on performance thresholds
- Modern, responsive design matching the C# report format

**Key Features:**
- Multiple runs per page (default: 3)
- LCP (Largest Contentful Paint) and Speed Index metrics
- Performance ratings with color badges
- Legend explaining performance thresholds
- Beautiful gradient UI with professional styling

### 2. **PerformanceHelper.js**
Location: `Utility/PerformanceUtility/PerformanceHelper.js`

**Purpose:** Utility class for running and analyzing performance tests

**Key Methods:**
- `getLcpRuns()` - Run LCP measurements multiple times
- `getSpeedIndexRuns()` - Run Speed Index measurements multiple times
- `getPerformanceRuns()` - Run both LCP and SI together (more efficient)
- `calculateAverage()` - Calculate average from runs
- `calculateStdDev()` - Calculate standard deviation
- `getStatistics()` - Get comprehensive statistics (min, max, avg, stdDev)
- `logMetricsSummary()` - Log formatted metrics summary
- `checkPerformanceBudget()` - Check if metrics meet budget thresholds

### 3. **ComprehensivePerformanceTest.spec.js**
Location: `tests/Performance_Automation/ComprehensivePerformanceTest.spec.js`

**Purpose:** Main test file demonstrating full capabilities

**Features:**
- Tests multiple pages with 3 runs each
- Uses PerformanceHelper for efficient testing
- Generates beautiful console output with statistics
- Creates enhanced HTML report
- Compares results against performance budgets
- Includes detailed logging

### 4. **EnhancedMultiPagePerformanceTest.spec.js**
Location: `tests/Performance_Automation/EnhancedMultiPagePerformanceTest.spec.js`

**Purpose:** Alternative test file with inline implementation

**Features:**
- Direct implementation without helper class
- Good for understanding the flow
- Generates same enhanced HTML report

## Performance Thresholds

### LCP (Largest Contentful Paint)
- **Excellent:** < 1.0s (Green badge)
- **Good:** 1.0s - 2.5s (Teal badge)
- **Average:** 2.5s - 4.0s (Yellow badge)
- **Needs Improvement:** > 4.0s (Red badge)

### Speed Index
- **Excellent:** < 1.0s (Green badge)
- **Good:** 1.0s - 2.0s (Teal badge)
- **Average:** 2.0s - 3.5s (Yellow badge)
- **Needs Improvement:** > 3.5s (Red badge)

## How to Use

### 1. Run Comprehensive Performance Test

```bash
# Run the comprehensive test
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js

# Run with headed browser
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js --headed

# Run with specific project
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js --project=chromium
```

### 2. Configure Pages to Test

Edit the test file and modify the `pagesToTest` array:

```javascript
const pagesToTest = [
    {
        name: 'Login Page',
        url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
    },
    {
        name: 'Dashboard Page',
        url: 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
    },
    {
        name: 'Your Custom Page',
        url: 'https://your-url-here.com'
    }
];
```

### 3. Configure Number of Runs

Change the `NUM_RUNS` constant:

```javascript
const NUM_RUNS = 3; // Default: 3 runs per page
```

### 4. Customize Report Settings

In the `test.afterAll` section:

```javascript
// Customize business unit name
const businessUnit = 'Business Unit: YourCompanyName';

// Report filename
const reportPath = await EnhancedPerformanceReporter.generateEnhancedReport(
    allTestResults,
    'Your_Custom_Report_Name.html',  // Custom filename
    businessUnit,
    environment
);
```

## Using PerformanceHelper Utility

### Example 1: Get Performance Runs for a URL

```javascript
import PerformanceHelper from '../../Utility/PerformanceUtility/PerformanceHelper.js';

// Get 3 runs of both LCP and Speed Index
const { lcpRuns, speedIndexRuns } = await PerformanceHelper.getPerformanceRuns(
    performanceBase,
    'https://your-url.com',
    3  // number of runs
);

console.log('LCP Runs:', lcpRuns);  // [450, 480, 465]
console.log('Speed Index Runs:', speedIndexRuns);  // [1200, 1150, 1180]
```

### Example 2: Calculate Statistics

```javascript
const lcpRuns = [450, 480, 465];

const stats = PerformanceHelper.getStatistics(lcpRuns);
console.log(stats);
// {
//   min: 450,
//   max: 480,
//   avg: 465,
//   stdDev: 15,
//   validCount: 3,
//   totalCount: 3
// }
```

### Example 3: Check Performance Budget

```javascript
const avgLcp = 465;
const avgSpeedIndex = 1180;
const budgets = {
    LCP_MaxMs: 2500,
    SpeedIndex_MaxMs: 3000
};

const budgetCheck = PerformanceHelper.checkPerformanceBudget(
    avgLcp,
    avgSpeedIndex,
    budgets
);

console.log(budgetCheck);
// {
//   lcpPass: true,
//   speedIndexPass: true,
//   allPassed: true,
//   lcpValue: 465,
//   speedIndexValue: 1180,
//   lcpBudget: 2500,
//   speedIndexBudget: 3000
// }
```

### Example 4: Log Metrics Summary

```javascript
const lcpRuns = [450, 480, 465];
const speedIndexRuns = [1200, 1150, 1180];

PerformanceHelper.logMetricsSummary(lcpRuns, speedIndexRuns, 'Home Page');
// Outputs formatted summary with statistics
```

## Using EnhancedPerformanceReporter

### Example 1: Generate Report Manually

```javascript
import EnhancedPerformanceReporter from '../../Utility/ReportUtility/EnhancedPerformanceReporter.js';

const testResults = [
    {
        pageName: 'Login Page',
        lcpRuns: [390, 400, 430],
        speedIndexRuns: [1890, 1870, 1970]
    },
    {
        pageName: 'Dashboard',
        lcpRuns: [480, 540, 560],
        speedIndexRuns: [1190, 1270, 1300]
    }
];

const reportPath = await EnhancedPerformanceReporter.generateEnhancedReport(
    testResults,
    'My_Performance_Report.html',
    'Business Unit: MyCompany',
    'PROD'
);

console.log('Report generated:', reportPath);
```

### Example 2: Using Reporter Instance

```javascript
const reporter = new EnhancedPerformanceReporter();

// Add results one by one
reporter.addResult([390, 400, 430], [1890, 1870, 1970], 'Login Page');
reporter.addResult([480, 540, 560], [1190, 1270, 1300], 'Dashboard');

// Generate report
const reportPath = reporter.generateReport(
    './Reports/Custom_Report.html',
    'My Business Unit',
    'STAGE'
);
```

## Report Output

### Console Output Example
```
╔════════════════════════════════════════════════════════════════════════════╗
║                  Comprehensive Performance Test Summary                   ║
╠════════════════════════════════════════════════════════════════════════════╣
║ 01. Login Page                                                             ║
║     LCP Runs:           390ms │     400ms │     430ms                      ║
║     SI Runs:           1890ms │    1870ms │    1970ms                      ║
║     Avg LCP:        407ms                                                  ║
║     Avg SI:         1910ms                                                 ║
║     LCP Std Dev:    21ms                                                   ║
║     SI Std Dev:     52ms                                                   ║
║     LCP Rating:     ⭐ Excellent                                           ║
║     SI Rating:      ✅ Good                                                ║
╠════════════════════════════════════════════════════════════════════════════╣
║ 📊 HTML Report: Reports/Comprehensive_Performance_Report.html             ║
║ 📁 Location: ./Reports/                                                    ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### HTML Report Features
- **Performance Summary Table:** Shows average metrics with color-coded badges
- **Detailed Metrics Table:** Shows all individual runs with row coloring
- **Legend:** Explains performance thresholds
- **Responsive Design:** Works on all screen sizes
- **Print-friendly:** Can be printed for reports
- **Modern UI:** Professional gradient styling

## File Structure

```
PLAYWRIGHT-DEMO-FRAMEWORK/
├── tests/
│   └── Performance_Automation/
│       ├── MultiPagePerformanceTest.spec.js (Original)
│       ├── EnhancedMultiPagePerformanceTest.spec.js (New)
│       ├── ComprehensivePerformanceTest.spec.js (New - Recommended)
│       └── README_PERFORMANCE.md (This file)
├── Utility/
│   ├── ReportUtility/
│   │   ├── PerformanceReporter.js (Original)
│   │   ├── PerformanceHtmlReporter.js (Original)
│   │   └── EnhancedPerformanceReporter.js (New)
│   └── PerformanceUtility/
│       └── PerformanceHelper.js (New)
├── Initiate/
│   └── PageLoadTimeBase.js
└── Reports/
    └── Comprehensive_Performance_Report.html (Generated)
```

## Comparison with C# Implementation

| Feature | C# (ReportGenerator.cs) | JavaScript (Enhanced) |
|---------|------------------------|----------------------|
| Multiple Runs | ✅ 3 runs | ✅ 3 runs (configurable) |
| LCP Tracking | ✅ | ✅ |
| Speed Index | ✅ | ✅ |
| Summary Table | ✅ | ✅ |
| Detailed Metrics | ✅ | ✅ |
| Color Coding | ✅ | ✅ |
| Performance Badges | ✅ | ✅ |
| Legend | ✅ | ✅ |
| Statistics | ❌ | ✅ (Enhanced with StdDev) |
| Console Output | ✅ Basic | ✅ Enhanced with boxes |

## Tips and Best Practices

1. **Run during off-peak hours:** Performance tests can be time-consuming
2. **Stable network:** Ensure stable internet connection for consistent results
3. **Close unnecessary apps:** Free up system resources
4. **Use headless mode:** For CI/CD pipelines
5. **Increase runs for accuracy:** For production benchmarks, consider 5-10 runs
6. **Clear cache between tests:** Use incognito/private mode settings
7. **Set realistic budgets:** Based on your application's requirements

## Troubleshooting

### Issue: Lighthouse fails to run
**Solution:** Ensure `browsername=chromium` in your `.env` file. Lighthouse only works with Chromium.

### Issue: Results vary widely
**Solution:** Increase the number of runs (NUM_RUNS) to get more stable averages.

### Issue: Report not generating
**Solution:** Check that the `Reports` directory has write permissions.

### Issue: "CDP port already in use"
**Solution:** Close any running Chrome instances or change the `cdpPort` in PageLoadTimeBase.js.

## Environment Variables

Required in `.env` file:
```env
browsername=chromium
environment=prod
prod_url=https://your-production-url.com
stage_url=https://your-staging-url.com
qa_url=https://your-qa-url.com
```

## Future Enhancements

Potential improvements:
- [ ] Add more metrics (FCP, TTI, TBT, CLS)
- [ ] Historical trend analysis
- [ ] Compare reports across time periods
- [ ] JSON export for CI/CD integration
- [ ] Lighthouse CI integration
- [ ] Performance regression detection
- [ ] Slack/email notifications
- [ ] Screenshot capture on failures

## Support

For issues or questions:
1. Check this README first
2. Review the example test files
3. Check Playwright documentation: https://playwright.dev
4. Check Lighthouse documentation: https://developers.google.com/web/tools/lighthouse

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-08  
**Author:** Performance Testing Team
