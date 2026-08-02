# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Performance_Automation\LighthouseTest.spec.js >> Lighthouse Performance Tests >> Measure LCP and Speed Index for Homepage
- Location: tests\Performance_Automation\LighthouseTest.spec.js:31:5

# Error details

```
ReferenceError: metrics is not defined
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
  11  |     const allTestResults = [];
  12  | 
  13  |     test.beforeAll(async function() {
  14  |         try {
  15  |             Test.Log.Info('Loading performance test configuration');
  16  |             const testData = await JsonReader.ReadJsonBody('./Testdata/performancetestdata.json');
  17  |             perfConfig = testData.PerformanceTestConfig;
  18  | 
  19  |             Test.Log.Info('Launching browser with CDP enabled for Lighthouse');
  20  |             await performanceBase.launchBrowserForPerformance();
  21  | 
  22  |             testUrl = await performanceBase.getUrlForEnvironment();
  23  |             Test.Log.Info(`Target URL for testing: ${testUrl}`);
  24  | 
  25  |         } catch (error) {
  26  |             await Test.Log.Error('Setup failed in beforeAll', error.message);
  27  |             throw error;
  28  |         }
  29  |     });
  30  | 
  31  |     test('Measure LCP and Speed Index for Homepage', async function() {
  32  |         try {
  33  |             Test.Log.Info(`Running Lighthouse audit for: ${testUrl}`);
  34  | 
  35  |             const metrics = await performanceBase.runLighthouseAudit(testUrl);
  36  | 
  37  |             Test.Log.Info('Lighthouse audit completed successfully');
  38  | 
  39  |             await PerformanceReporter.LogMetrics(
  40  |                 metrics,
  41  |                 perfConfig.PerformanceBudget,
  42  |                 performanceBase.page
  43  |             );
  44  | 
  45  |             if (perfConfig.SaveMetricsToStorage) {
  46  |                 await PerformanceReporter.SaveMetricsToFile(metrics, 'Homepage');
  47  |             }
  48  | 
  49  |             const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
  50  |                 metrics,
  51  |                 perfConfig.PerformanceBudget
  52  |             );
  53  | 
  54  |             const summary = await PerformanceReporter.GeneratePerformanceSummary(
  55  |                 metrics,
  56  |                 budgetComparison
  57  |             );
  58  | 
  59  |             Test.Log.Info(`Overall Performance Status: ${summary.overallStatus}`);
  60  |             Test.Log.Info(`Performance Score: ${summary.performanceScore}/100`);
  61  | 
  62  |             if (summary.failedMetricsCount > 0) {
  63  |                 Test.Log.Warning(`${summary.failedMetricsCount} metric(s) exceeded budget: ${summary.failedMetrics.join(', ')}`);
  64  |             }
  65  | 
  66  |             if (metrics.lcp > perfConfig.PerformanceBudget.LCP_MaxMs) {
  67  |                 await Test.Log.Fail(
  68  |                     `LCP exceeded budget: ${metrics.lcp}ms > ${perfConfig.PerformanceBudget.LCP_MaxMs}ms`,
  69  |                     budgetComparison.overages.lcp,
  70  |                     performanceBase.page
  71  |                 );
  72  |                 throw new Error('LCP budget exceeded');
  73  |             }
  74  | 
  75  |             if (metrics.speedIndex > perfConfig.PerformanceBudget.SpeedIndex_MaxMs) {
  76  |                 await Test.Log.Fail(
  77  |                     `Speed Index exceeded budget: ${metrics.speedIndex}ms > ${perfConfig.PerformanceBudget.SpeedIndex_MaxMs}ms`,
  78  |                     budgetComparison.overages.speedIndex,
  79  |                     performanceBase.page
  80  |                 );
  81  |                 throw new Error('Speed Index budget exceeded');
  82  |             }
  83  | 
  84  |             Test.Log.Pass(
  85  |                 'Performance metrics within acceptable budgets',
  86  |                 { lcp: `${metrics.lcp}ms`, speedIndex: `${metrics.speedIndex}ms` },
  87  |                 performanceBase.page
  88  |             );
  89  | 
  90  |             allTestResults.push({
  91  |                 pageName: 'Homepage',
  92  |                 lcp: metrics.lcp,
  93  |                 speedIndex: metrics.speedIndex
  94  |             });
  95  | 
  96  |         } catch (error) {
  97  |             await Test.Log.Error('Performance test failed', error.message, performanceBase.page);
  98  | 
  99  |             allTestResults.push({
  100 |                 pageName: 'Homepage',
> 101 |                 lcp: metrics?.lcp || null,
      |                      ^ ReferenceError: metrics is not defined
  102 |                 speedIndex: metrics?.speedIndex || null
  103 |             });
  104 | 
  105 |             throw error;
  106 |         }
  107 |     });
  108 | 
  109 |     test('Measure Performance for Multiple Pages', async function() {
  110 |         try {
  111 |             const pagesToTest = [
  112 |                 { name: 'Homepage', url: testUrl }
  113 |             ];
  114 | 
  115 |             for (const pageInfo of pagesToTest) {
  116 |                 Test.Log.Info(`Testing ${pageInfo.name}: ${pageInfo.url}`);
  117 | 
  118 |                 const metrics = await performanceBase.runLighthouseAudit(pageInfo.url);
  119 | 
  120 |                 await PerformanceReporter.LogMetrics(
  121 |                     metrics,
  122 |                     perfConfig.PerformanceBudget,
  123 |                     performanceBase.page
  124 |                 );
  125 | 
  126 |                 if (perfConfig.SaveMetricsToStorage) {
  127 |                     await PerformanceReporter.SaveMetricsToFile(metrics, pageInfo.name);
  128 |                 }
  129 | 
  130 |                 const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
  131 |                     metrics,
  132 |                     perfConfig.PerformanceBudget
  133 |                 );
  134 | 
  135 |                 if (!budgetComparison.allPassed) {
  136 |                     Test.Log.Warning(
  137 |                         `${pageInfo.name} has performance issues`,
  138 |                         budgetComparison.overages
  139 |                     );
  140 |                 }
  141 | 
  142 |                 allTestResults.push({
  143 |                     pageName: pageInfo.name,
  144 |                     lcp: metrics.lcp,
  145 |                     speedIndex: metrics.speedIndex
  146 |                 });
  147 |             }
  148 | 
  149 |             Test.Log.Pass('Multi-page performance test completed', null, performanceBase.page);
  150 | 
  151 |         } catch (error) {
  152 |             await Test.Log.Error('Multi-page performance test failed', error.message, performanceBase.page);
  153 |             throw error;
  154 |         }
  155 |     });
  156 | 
  157 |     test.afterAll(async function() {
  158 |         try {
  159 |             Test.Log.Info('Cleaning up browser resources');
  160 |             if (performanceBase.context) {
  161 |                 await performanceBase.context.close();
  162 |             }
  163 |             if (performanceBase.browser) {
  164 |                 await performanceBase.browser.close();
  165 |             }
  166 |             Test.Log.Info('Cleanup completed successfully');
  167 | 
  168 |             if (allTestResults.length > 0) {
  169 |                 Test.Log.Info('Generating HTML Performance Report');
  170 |                 const reportPath = await PerformanceReporter.GenerateHtmlReport(allTestResults, 'Performance_Report.html');
  171 |                 Test.Log.Pass(`HTML Performance Report generated: ${reportPath}`);
  172 |             }
  173 | 
  174 |         } catch (error) {
  175 |             console.error('Error during cleanup:', error);
  176 |         }
  177 |     });
  178 | });
  179 | 
```