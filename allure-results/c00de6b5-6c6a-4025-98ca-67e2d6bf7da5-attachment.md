# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Performance_Automation\LighthouseTest.spec.js >> Lighthouse Performance Tests >> Measure LCP and Speed Index for Homepage
- Location: tests\Performance_Automation\LighthouseTest.spec.js:30:5

# Error details

```
Error: LCP budget exceeded
```

# Test source

```ts
  1   | import { test } from '@playwright/test';
  2   | import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
  3   | import PerformanceReporter from '../../Utility/ReportUtility/PerformanceReporter.js';
  4   | import JsonReader from '../../Utility/FileReader/JsonReader.js';
  5   | import Test from '../../Utility/ReportUtility/TestLogger.js';
  6   | 
  7   | test.describe('Lighthouse Performance Tests', function() {
  8   |     const performanceBase = new PageLoadTimeBase();
  9   |     let perfConfig;
  10  |     let testUrl;
  11  | 
  12  |     test.beforeAll(async function() {
  13  |         try {
  14  |             Test.Log.Info('Loading performance test configuration');
  15  |             const testData = await JsonReader.ReadJsonBody('./Testdata/performancetestdata.json');
  16  |             perfConfig = testData.PerformanceTestConfig;
  17  | 
  18  |             Test.Log.Info('Launching browser with CDP enabled for Lighthouse');
  19  |             await performanceBase.launchBrowserForPerformance();
  20  | 
  21  |             testUrl = await performanceBase.getUrlForEnvironment();
  22  |             Test.Log.Info(`Target URL for testing: ${testUrl}`);
  23  | 
  24  |         } catch (error) {
  25  |             await Test.Log.Error('Setup failed in beforeAll', error.message);
  26  |             throw error;
  27  |         }
  28  |     });
  29  | 
  30  |     test('Measure LCP and Speed Index for Homepage', async function() {
  31  |         try {
  32  |             Test.Log.Info(`Running Lighthouse audit for: ${testUrl}`);
  33  | 
  34  |             const metrics = await performanceBase.runLighthouseAudit(testUrl);
  35  | 
  36  |             Test.Log.Info('Lighthouse audit completed successfully');
  37  | 
  38  |             await PerformanceReporter.LogMetrics(
  39  |                 metrics,
  40  |                 perfConfig.PerformanceBudget,
  41  |                 performanceBase.page
  42  |             );
  43  | 
  44  |             if (perfConfig.SaveMetricsToStorage) {
  45  |                 await PerformanceReporter.SaveMetricsToFile(metrics, 'Homepage');
  46  |             }
  47  | 
  48  |             const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
  49  |                 metrics,
  50  |                 perfConfig.PerformanceBudget
  51  |             );
  52  | 
  53  |             const summary = await PerformanceReporter.GeneratePerformanceSummary(
  54  |                 metrics,
  55  |                 budgetComparison
  56  |             );
  57  | 
  58  |             Test.Log.Info(`Overall Performance Status: ${summary.overallStatus}`);
  59  |             Test.Log.Info(`Performance Score: ${summary.performanceScore}/100`);
  60  | 
  61  |             if (summary.failedMetricsCount > 0) {
  62  |                 Test.Log.Warning(`${summary.failedMetricsCount} metric(s) exceeded budget: ${summary.failedMetrics.join(', ')}`);
  63  |             }
  64  | 
  65  |             if (metrics.lcp > perfConfig.PerformanceBudget.LCP_MaxMs) {
  66  |                 await Test.Log.Fail(
  67  |                     `LCP exceeded budget: ${metrics.lcp}ms > ${perfConfig.PerformanceBudget.LCP_MaxMs}ms`,
  68  |                     budgetComparison.overages.lcp,
  69  |                     performanceBase.page
  70  |                 );
> 71  |                 throw new Error('LCP budget exceeded');
      |                       ^ Error: LCP budget exceeded
  72  |             }
  73  | 
  74  |             if (metrics.speedIndex > perfConfig.PerformanceBudget.SpeedIndex_MaxMs) {
  75  |                 await Test.Log.Fail(
  76  |                     `Speed Index exceeded budget: ${metrics.speedIndex}ms > ${perfConfig.PerformanceBudget.SpeedIndex_MaxMs}ms`,
  77  |                     budgetComparison.overages.speedIndex,
  78  |                     performanceBase.page
  79  |                 );
  80  |                 throw new Error('Speed Index budget exceeded');
  81  |             }
  82  | 
  83  |             Test.Log.Pass(
  84  |                 'Performance metrics within acceptable budgets',
  85  |                 { lcp: `${metrics.lcp}ms`, speedIndex: `${metrics.speedIndex}ms` },
  86  |                 performanceBase.page
  87  |             );
  88  | 
  89  |         } catch (error) {
  90  |             await Test.Log.Error('Performance test failed', error.message, performanceBase.page);
  91  |             throw error;
  92  |         }
  93  |     });
  94  | 
  95  |     test('Measure Performance for Multiple Pages', async function() {
  96  |         try {
  97  |             const pagesToTest = [
  98  |                 { name: 'Homepage', url: testUrl }
  99  |             ];
  100 | 
  101 |             for (const pageInfo of pagesToTest) {
  102 |                 Test.Log.Info(`Testing ${pageInfo.name}: ${pageInfo.url}`);
  103 | 
  104 |                 const metrics = await performanceBase.runLighthouseAudit(pageInfo.url);
  105 | 
  106 |                 await PerformanceReporter.LogMetrics(
  107 |                     metrics,
  108 |                     perfConfig.PerformanceBudget,
  109 |                     performanceBase.page
  110 |                 );
  111 | 
  112 |                 if (perfConfig.SaveMetricsToStorage) {
  113 |                     await PerformanceReporter.SaveMetricsToFile(metrics, pageInfo.name);
  114 |                 }
  115 | 
  116 |                 const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
  117 |                     metrics,
  118 |                     perfConfig.PerformanceBudget
  119 |                 );
  120 | 
  121 |                 if (!budgetComparison.allPassed) {
  122 |                     Test.Log.Warning(
  123 |                         `${pageInfo.name} has performance issues`,
  124 |                         budgetComparison.overages
  125 |                     );
  126 |                 }
  127 |             }
  128 | 
  129 |             Test.Log.Pass('Multi-page performance test completed', null, performanceBase.page);
  130 | 
  131 |         } catch (error) {
  132 |             await Test.Log.Error('Multi-page performance test failed', error.message, performanceBase.page);
  133 |             throw error;
  134 |         }
  135 |     });
  136 | 
  137 |     test.afterAll(async function() {
  138 |         try {
  139 |             Test.Log.Info('Cleaning up browser resources');
  140 |             if (performanceBase.context) {
  141 |                 await performanceBase.context.close();
  142 |             }
  143 |             if (performanceBase.browser) {
  144 |                 await performanceBase.browser.close();
  145 |             }
  146 |             Test.Log.Info('Cleanup completed successfully');
  147 |         } catch (error) {
  148 |             console.error('Error during cleanup:', error);
  149 |         }
  150 |     });
  151 | });
  152 | 
```