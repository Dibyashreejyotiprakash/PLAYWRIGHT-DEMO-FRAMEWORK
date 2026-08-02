# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Performance_Automation\LighthouseTest.spec.js >> Lighthouse Performance Tests >> Measure LCP and Speed Index for Homepage
- Location: tests\Performance_Automation\LighthouseTest.spec.js:31:5

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
  32  |         let metrics = null;
  33  |         try {
  34  |             Test.Log.Info(`Running Lighthouse audit for: ${testUrl}`);
  35  | 
  36  |             metrics = await performanceBase.runLighthouseAudit(testUrl);
  37  | 
  38  |             Test.Log.Info('Lighthouse audit completed successfully');
  39  | 
  40  |             await PerformanceReporter.LogMetrics(
  41  |                 metrics,
  42  |                 perfConfig.PerformanceBudget,
  43  |                 performanceBase.page
  44  |             );
  45  | 
  46  |             if (perfConfig.SaveMetricsToStorage) {
  47  |                 await PerformanceReporter.SaveMetricsToFile(metrics, 'Homepage');
  48  |             }
  49  | 
  50  |             const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
  51  |                 metrics,
  52  |                 perfConfig.PerformanceBudget
  53  |             );
  54  | 
  55  |             const summary = await PerformanceReporter.GeneratePerformanceSummary(
  56  |                 metrics,
  57  |                 budgetComparison
  58  |             );
  59  | 
  60  |             Test.Log.Info(`Overall Performance Status: ${summary.overallStatus}`);
  61  |             Test.Log.Info(`Performance Score: ${summary.performanceScore}/100`);
  62  | 
  63  |             if (summary.failedMetricsCount > 0) {
  64  |                 Test.Log.Warning(`${summary.failedMetricsCount} metric(s) exceeded budget: ${summary.failedMetrics.join(', ')}`);
  65  |             }
  66  | 
  67  |             if (metrics.lcp > perfConfig.PerformanceBudget.LCP_MaxMs) {
  68  |                 await Test.Log.Fail(
  69  |                     `LCP exceeded budget: ${metrics.lcp}ms > ${perfConfig.PerformanceBudget.LCP_MaxMs}ms`,
  70  |                     budgetComparison.overages.lcp,
  71  |                     performanceBase.page
  72  |                 );
> 73  |                 throw new Error('LCP budget exceeded');
      |                       ^ Error: LCP budget exceeded
  74  |             }
  75  | 
  76  |             if (metrics.speedIndex > perfConfig.PerformanceBudget.SpeedIndex_MaxMs) {
  77  |                 await Test.Log.Fail(
  78  |                     `Speed Index exceeded budget: ${metrics.speedIndex}ms > ${perfConfig.PerformanceBudget.SpeedIndex_MaxMs}ms`,
  79  |                     budgetComparison.overages.speedIndex,
  80  |                     performanceBase.page
  81  |                 );
  82  |                 throw new Error('Speed Index budget exceeded');
  83  |             }
  84  | 
  85  |             Test.Log.Pass(
  86  |                 'Performance metrics within acceptable budgets',
  87  |                 { lcp: `${metrics.lcp}ms`, speedIndex: `${metrics.speedIndex}ms` },
  88  |                 performanceBase.page
  89  |             );
  90  | 
  91  |             allTestResults.push({
  92  |                 pageName: 'Homepage',
  93  |                 lcp: metrics.lcp,
  94  |                 speedIndex: metrics.speedIndex
  95  |             });
  96  | 
  97  |         } catch (error) {
  98  |             await Test.Log.Error('Performance test failed', error.message, performanceBase.page);
  99  | 
  100 |             allTestResults.push({
  101 |                 pageName: 'Homepage',
  102 |                 lcp: metrics?.lcp || null,
  103 |                 speedIndex: metrics?.speedIndex || null
  104 |             });
  105 | 
  106 |             throw error;
  107 |         }
  108 |     });
  109 | 
  110 |     test('Measure Performance for Multiple Pages', async function() {
  111 |         try {
  112 |             const pagesToTest = [
  113 |                 { name: 'Homepage', url: testUrl }
  114 |             ];
  115 | 
  116 |             for (const pageInfo of pagesToTest) {
  117 |                 Test.Log.Info(`Testing ${pageInfo.name}: ${pageInfo.url}`);
  118 | 
  119 |                 const metrics = await performanceBase.runLighthouseAudit(pageInfo.url);
  120 | 
  121 |                 await PerformanceReporter.LogMetrics(
  122 |                     metrics,
  123 |                     perfConfig.PerformanceBudget,
  124 |                     performanceBase.page
  125 |                 );
  126 | 
  127 |                 if (perfConfig.SaveMetricsToStorage) {
  128 |                     await PerformanceReporter.SaveMetricsToFile(metrics, pageInfo.name);
  129 |                 }
  130 | 
  131 |                 const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
  132 |                     metrics,
  133 |                     perfConfig.PerformanceBudget
  134 |                 );
  135 | 
  136 |                 if (!budgetComparison.allPassed) {
  137 |                     Test.Log.Warning(
  138 |                         `${pageInfo.name} has performance issues`,
  139 |                         budgetComparison.overages
  140 |                     );
  141 |                 }
  142 | 
  143 |                 allTestResults.push({
  144 |                     pageName: pageInfo.name,
  145 |                     lcp: metrics.lcp,
  146 |                     speedIndex: metrics.speedIndex
  147 |                 });
  148 |             }
  149 | 
  150 |             Test.Log.Pass('Multi-page performance test completed', null, performanceBase.page);
  151 | 
  152 |         } catch (error) {
  153 |             await Test.Log.Error('Multi-page performance test failed', error.message, performanceBase.page);
  154 |             throw error;
  155 |         }
  156 |     });
  157 | 
  158 |     test.afterAll(async function() {
  159 |         try {
  160 |             Test.Log.Info('Cleaning up browser resources');
  161 |             if (performanceBase.context) {
  162 |                 await performanceBase.context.close();
  163 |             }
  164 |             if (performanceBase.browser) {
  165 |                 await performanceBase.browser.close();
  166 |             }
  167 |             Test.Log.Info('Cleanup completed successfully');
  168 | 
  169 |             if (allTestResults.length > 0) {
  170 |                 Test.Log.Info('Generating HTML Performance Report');
  171 |                 const reportPath = await PerformanceReporter.GenerateHtmlReport(allTestResults, 'Performance_Report.html');
  172 |                 Test.Log.Pass(`HTML Performance Report generated: ${reportPath}`);
  173 |             }
```