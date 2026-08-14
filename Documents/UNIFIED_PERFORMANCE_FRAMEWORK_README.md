# Unified Performance Testing Framework - JavaScript/Playwright

## Overview

The **Unified Performance Testing Framework** is a comprehensive JavaScript/Playwright testing framework that integrates:

- ✅ **Page Performance Metrics** (LCP, Speed Index via Playwright Performance API)
- ✅ **API Performance Metrics** (via JMeter integration)
- ✅ **API Health Checks** (with server masking validation)
- ✅ **Functional Flow Validation** (with step-level error tracking)
- ✅ **Console Error Tracking** (JS errors, network errors, page errors)
- ✅ **Unified HTML Reporting** (with Chart.js visualizations)

This framework matches the C# .NET unified performance framework capabilities while maintaining full backward compatibility with existing tests.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│         UnifiedPerformanceReport.spec.js (Test Class)           │
│         - Orchestrates UI + API + Health + Flow tests           │
└────────────────────────────┬────────────────────────────────────┘
                             │ extends
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         UnifiedPerformanceBase.js (Base Class)                  │
│         - Extends PageLoadTimeBase                              │
│         - Console error handlers                                │
│         - JMeter orchestration                                  │
│         - Health check runner                                   │
│         - Unified report generation                             │
└────────────────────────────┬────────────────────────────────────┘
                             │ uses
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ UnifiedMetrics   │  │ JMeter       │  │ HealthCheck      │
│ Collector        │  │ Orchestrator │  │ Runner           │
│ - Page metrics   │  │ - Execute    │  │ - HTTP checks    │
│ - API metrics    │  │   JMeter CLI │  │ - Server mask    │
│ - Health checks  │  │ - Parse JTL  │  │ - Validation     │
│ - Flows          │  │ - Results    │  │                  │
│ - Errors         │  │              │  │                  │
└──────────────────┘  └──────────────┘  └──────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │ Unified Report   │
                   │ Generator        │
                   │ - Chart.js       │
                   │ - HTML/CSS       │
                   │ - Collapsible    │
                   └──────────────────┘
```

---

## File Structure

### New Files Created

```
Utility/
├── PerformanceUtility/
│   ├── UnifiedPerformanceDataModels.js       [145 lines]
│   ├── UnifiedMetricsCollector.js            [316 lines]
│   ├── ConsoleErrorHandler.js                [88 lines]
│   ├── HealthCheckRunner.js                  [189 lines]
│   └── UnifiedReportGenerator.js             [1,089 lines]
└── LoadTestUtility/                          [NEW FOLDER]
    └── JMeterOrchestrator.js                 [310 lines]

Initiate/
└── UnifiedPerformanceBase.js                 [235 lines]

tests/Performance_Automation/
└── UnifiedPerformanceReport.spec.js          [229 lines]
```

**Total: 8 new files, ~2,600 lines of code**

### Existing Files (Unchanged - Backward Compatible)

```
Utility/PerformanceUtility/
├── MetricsCollector.js                       [UNCHANGED]
├── ReportGenerator.js                        [UNCHANGED]
├── PageUrl.js                                [UNCHANGED]
└── PerformanceHelper.js                      [UNCHANGED]

tests/Performance_Automation/
└── PageLoadTime.js                           [WORKS AS-IS]
```

---

## Installation & Setup

### Step 1: Dependencies

The framework has been installed with:

```bash
npm install chart.js@4.4.0 --save
```

**Existing dependencies:**
- `@playwright/test: ^1.62.1`
- `lighthouse: ^13.4.1`
- `dotenv: ^17.4.2`

### Step 2: JMeter Configuration

Ensure JMeter is installed and configured in `Testdata/LoadTestConfiguration.json`:

```json
{
  "JMeterConfiguration": {
    "JMeterPath": "JmeterFiles\\apache-jmeter-5.6.3\\apache-jmeter-5.6.3\\bin\\jmeter.bat",
    "ResultsFolder": "JMeterResults",
    "HtmlReportsFolder": "JMeterReports",
    "MaxConcurrentTests": 5,
    "DefaultThreadCount": 10,
    "DefaultRampUpTime": 5,
    "DefaultDuration": 60,
    "TimeoutMinutes": 30
  },
  "TestMappings": [
    {
      "TestNamePattern": "QA_UnifiedTest",
      "JmxFile": "CONSOLIDATEDAPI_VALIDATION.jmx",
      "ThreadCount": 10,
      "Duration": 60,
      "RampUpTime": 5
    }
  ]
}
```

### Step 3: Health Check Configuration

Health check JSON files already exist in `Testdata/`:
- `apihealth_qa.json`
- `apihealth_stage.json`
- `apihealth_prod.json`

---

## Usage Guide

### Basic Usage - Example Test

See `tests/Performance_Automation/UnifiedPerformanceReport.spec.js` for a complete example.

### Running Tests

```bash
# Run unified performance test
npx playwright test tests/Performance_Automation/UnifiedPerformanceReport.spec.js

# Run with specific environment
ENVIRONMENT=stage npx playwright test tests/Performance_Automation/UnifiedPerformanceReport.spec.js

# Run existing PageLoadTime test (still works!)
npx playwright test tests/Performance_Automation/PageLoadTime.js
```

---

## Key Features

### 1. Page Performance Metrics

```javascript
import UnifiedPerformanceBase from '../../Initiate/UnifiedPerformanceBase.js';

const performanceBase = new UnifiedPerformanceBase();
await performanceBase.launchBrowserForPerformance();

// Attach error handlers
performanceBase.attachConsoleErrorHandlers(page);

// Collect page metrics (3 runs by default)
await performanceBase.metricsCollector.addPageMetric(page, 'Search Page', 'Search Page', 3);
performanceBase.metricsCollector.associateErrorsWithPage('Search Page', page.url());
```

### 2. Console Error Tracking

Automatically tracks:
- JavaScript console errors (`console.error`)
- Page errors (uncaught exceptions)
- Network errors (4xx, 5xx status codes)

```javascript
// Get error counts
const errorCounts = performanceBase.getErrorCounts();
console.log(`JS Errors: ${errorCounts.jsErrors}`);
console.log(`4xx Errors: ${errorCounts.error400s}`);
console.log(`5xx Errors: ${errorCounts.error500s}`);
```

### 3. JMeter API Performance

```javascript
// Execute JMeter test and collect API metrics
await performanceBase.addJMeterApiMetrics(
    'CONSOLIDATEDAPI_VALIDATION.jmx',
    'QA_UnifiedTest',
    {
        threadCount: 10,
        duration: 60,
        rampUpTime: 5
    }
);
```

### 4. Health Checks

```javascript
// Run health checks from JSON config
const healthCheckJsonPath = performanceBase.getHealthCheckJsonPath(env);
await performanceBase.runApiHealthChecks(healthCheckJsonPath);
```

### 5. Functional Flow Tracking

```javascript
import { FunctionalFlowMetric } from '../../Utility/PerformanceUtility/UnifiedPerformanceDataModels.js';

const flowMetric = new FunctionalFlowMetric();
flowMetric.flowName = 'Checkout Flow';
flowMetric.category = 'E2E';
flowMetric.passed = false;

const stepDurations = {};

try {
    // Step 1
    const startTime1 = Date.now();
    await page.goto(url);
    stepDurations['Login'] = (Date.now() - startTime1) / 1000;
    performanceBase.metricsCollector.associateErrorsWithPage('Login', page.url());

    // Step 2
    // ... more steps ...

    flowMetric.passed = true;
} catch (error) {
    flowMetric.errorMessage = error.message;
} finally {
    // Collect step logs
    const stepNames = ['Login', 'Add to Cart', 'Checkout'];
    stepNames.forEach(stepName => {
        const stepLog = performanceBase.metricsCollector.getStepLogForPage(
            stepName,
            stepDurations[stepName] || 0
        );
        flowMetric.stepLogs.push(stepLog);
    });

    // Count errors
    const allErrors = performanceBase.metricsCollector.getAllMetrics().consoleErrors;
    flowMetric.jsErrorCount = allErrors.filter(e => e.type === 'error').length;
    flowMetric.error400Count = allErrors.filter(e => e.type === 'network-error' && e.statusCode >= 400 && e.statusCode < 500).length;
    flowMetric.error500Count = allErrors.filter(e => e.type === 'network-error' && e.statusCode >= 500).length;

    // Add to collector
    performanceBase.metricsCollector.addFunctionalFlow(flowMetric);
}
```

### 6. Unified Report Generation

```javascript
// Generate comprehensive HTML report
performanceBase.generateUnifiedReport(
    './Reports/Unified_Performance_Report.html',
    'QA Business Unit',
    'STAGE'
);

// Reset for next run
performanceBase.resetMetricsCollector();
```

---

## Generated Report Features

The unified report includes:

### Summary Cards
- Total API Services
- API Health Status %
- Functional Tests Pass %
- Total Endpoints

### Interactive Charts (Chart.js)
1. **LCP Bar Chart** - Page load performance
2. **Health Doughnut Chart** - API health distribution
3. **API Response Bar Chart** - Response times (top 10)
4. **Flow Pie Chart** - Functional flow pass/fail status

### Detailed Sections
- **Page Load Metrics** - Summary and detailed (3 runs per page)
- **Functional Flows** - Collapsible sections with step logs and error counts
- **API Health Checks** - Status, response times, server masking validation
- **API Service Performance** - Grouped by thread group, collapsible

---

## Data Models

### PageMetric
```javascript
{
    pageName: 'Search Page',
    label: 'Search Page',
    lcpRuns: [2340, 2450, 2390],
    speedIndexRuns: [1980, 2050, 2010],
    avgLcp: 2393,
    avgSpeedIndex: 2013,
    performanceRating: 'Good'
}
```

### ApiMetric
```javascript
{
    serviceName: '/api/checkout/v3/orders',
    endpoint: '/api/checkout/v3/orders',
    threadGroup: 'checkout',
    avgResponseTime: 245,
    minResponseTime: 180,
    maxResponseTime: 450,
    throughput: 42.5,
    totalSamples: 150,
    successCount: 148,
    failureCount: 2,
    errorRate: 1.33
}
```

### HealthCheckMetric
```javascript
{
    id: 1,
    name: 'Checkout API',
    version: 'v3',
    namespace: 'Default',
    healthUrl: 'https://api.example.com/health',
    status: 'Healthy',
    responseTime: 120,
    statusCode: 200,
    serverMasked: true,
    errorMessage: '',
    timestamp: '2026-08-11T...'
}
```

### FunctionalFlowMetric
```javascript
{
    flowName: 'Checkout Flow',
    category: 'E2E',
    executionTime: '2026-08-11T...',
    passed: true,
    stepLogs: [
        {
            stepName: 'Login',
            pageUrl: 'https://...',
            duration: 2.5,
            consoleErrors: [],
            timestamp: '...'
        }
    ],
    jsErrorCount: 0,
    otherConsoleErrorCount: 0,
    error400Count: 0,
    error500Count: 0,
    errorMessage: ''
}
```

### ConsoleErrorMetric
```javascript
{
    type: 'network-error',
    message: 'HTTP 404 - Not Found',
    timestamp: '2026-08-11T...',
    pageUrl: 'https://...',
    pageName: 'Search Page',
    statusCode: 404,
    url: 'https://api.example.com/missing'
}
```

---

## Backward Compatibility

✅ **Existing tests continue to work unchanged:**

```javascript
// PageLoadTime.js - Still works with existing ReportGenerator
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import MetricsCollector from '../../Utility/PerformanceUtility/MetricsCollector.js';
import ReportGenerator from '../../Utility/PerformanceUtility/ReportGenerator.js';

// ... test code unchanged ...
```

**No breaking changes!**

---

## Best Practices

### 1. Test Execution Order
```javascript
test('Test1_PageLoadPerformance_WithJMeter', async () => {
    // Collect page metrics
    // Execute JMeter API tests in finally block
});

test('Test2_FunctionalFlow_Validation', async () => {
    // Track functional flows with error association
});

test('Test3_GenerateFinalReport', async () => {
    // Run health checks
    // Generate unified report
});
```

### 2. Error Association
Always associate errors with pages/steps:
```javascript
await page.goto(url);
performanceBase.metricsCollector.associateErrorsWithPage('Page Name', page.url());
```

### 3. JMeter Error Handling
JMeter failures don't fail the test:
```javascript
try {
    await performanceBase.addJMeterApiMetrics(...);
} catch (jmeterError) {
    Test.Log.Warning(`JMeter skipped: ${jmeterError.message}`);
    // Continue with other metrics
}
```

### 4. Cleanup
```javascript
test.afterAll(async () => {
    await performanceBase.context.close();
    await performanceBase.browser.close();
    performanceBase.resetMetricsCollector(); // Important!
});
```

---

## Troubleshooting

### Issue 1: JMeter Not Found
**Error:** `JMeter executable not found`

**Solution:** Update `Testdata/LoadTestConfiguration.json` with correct JMeter path.

### Issue 2: Health Check JSON Missing
**Warning:** `Health check JSON not found`

**Solution:** Ensure `apihealth_{env}.json` exists in `Testdata/` folder.

### Issue 3: Chart.js Not Loading
**Error:** Charts not rendering in report

**Solution:** Verify Chart.js is installed:
```bash
npm install chart.js@4.4.0 --save
```

### Issue 4: Console Errors Not Captured
**Solution:** Ensure error handlers are attached:
```javascript
performanceBase.attachConsoleErrorHandlers(page);
```

---

## Performance Metrics Reference

### LCP (Largest Contentful Paint) Thresholds
- **Excellent:** < 1.0s
- **Good:** 1.0s - 2.5s
- **Average:** 2.5s - 4.0s
- **Needs Improvement:** > 4.0s

### Speed Index Thresholds
- **Excellent:** < 1.0s
- **Good:** 1.0s - 2.0s
- **Average:** 2.0s - 3.5s
- **Needs Improvement:** > 3.5s

### Health Check Status
- **Healthy:** 200 status, health check returns "Healthy"
- **Unhealthy:** Non-200 status or health check returns "Unhealthy"
- **Error:** Request failed (timeout, network error, etc.)

---

## Advanced Usage

### Execute Complete Workflow (Convenience Method)

```javascript
await performanceBase.executeUnifiedPerformanceTest({
    businessUnit: 'QA Business Unit',
    environment: 'STAGE',
    pages: [
        { page, name: 'Search Page', numRuns: 3 },
        { page, name: 'PDP', numRuns: 3 }
    ],
    jmxFileName: 'CONSOLIDATEDAPI_VALIDATION.jmx',
    jmeterOptions: { threadCount: 10, duration: 60 },
    healthCheckJson: healthCheckJsonPath,
    reportPath: './Reports/Unified_Performance_Report.html'
});
```

---

## Report Output Location

```
Reports/
└── Unified_Performance_Report.html
```

Open in browser to view:
- Interactive charts
- Collapsible sections
- Color-coded performance ratings
- Detailed metrics tables

---

## Future Enhancements (Roadmap)

- [ ] Trend analysis across multiple test runs
- [ ] Performance regression detection
- [ ] CI/CD integration with GitHub Actions
- [ ] Slack/Email notifications
- [ ] Real-time monitoring dashboard
- [ ] Cloud storage for historical reports

---

## Support

For issues or questions:
1. Check this README and troubleshooting section
2. Review example test: `UnifiedPerformanceReport.spec.js`
3. Examine generated reports for error details
4. Check JMeter logs in `JMeterResults/` folder

---

**Framework Version:** 1.0.0  
**Last Updated:** August 11, 2026  
**Maintained By:** AnsiraCreateBB Team
