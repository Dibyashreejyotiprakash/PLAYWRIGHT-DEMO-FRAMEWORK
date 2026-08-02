import { test } from '@playwright/test';
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import PerformanceReporter from '../../Utility/ReportUtility/PerformanceReporter.js';
import JsonReader from '../../Utility/FileReader/JsonReader.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';

test.describe('Lighthouse Performance Tests', function() {
    const performanceBase = new PageLoadTimeBase();
    let perfConfig;
    let testUrl;
    const allTestResults = [];

    test.beforeAll(async function() {
        try {
            Test.Log.Info('Loading performance test configuration');
            const testData = await JsonReader.ReadJsonBody('./Testdata/performancetestdata.json');
            perfConfig = testData.PerformanceTestConfig;

            Test.Log.Info('Launching browser with CDP enabled for Lighthouse');
            await performanceBase.launchBrowserForPerformance();

            testUrl = await performanceBase.getUrlForEnvironment();
            Test.Log.Info(`Target URL for testing: ${testUrl}`);

        } catch (error) {
            await Test.Log.Error('Setup failed in beforeAll', error.message);
            throw error;
        }
    });

    test('Measure LCP and Speed Index for Homepage', async function() {
        let metrics = null;
        try {
            Test.Log.Info(`Running Lighthouse audit for: ${testUrl}`);

            metrics = await performanceBase.runLighthouseAudit(testUrl);

            Test.Log.Info('Lighthouse audit completed successfully');

            await PerformanceReporter.LogMetrics(
                metrics,
                perfConfig.PerformanceBudget,
                performanceBase.page
            );

            if (perfConfig.SaveMetricsToStorage) {
                await PerformanceReporter.SaveMetricsToFile(metrics, 'Homepage');
            }

            const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
                metrics,
                perfConfig.PerformanceBudget
            );

            const summary = await PerformanceReporter.GeneratePerformanceSummary(
                metrics,
                budgetComparison
            );

            Test.Log.Info(`Overall Performance Status: ${summary.overallStatus}`);
            Test.Log.Info(`Performance Score: ${summary.performanceScore}/100`);

            if (summary.failedMetricsCount > 0) {
                Test.Log.Warning(`${summary.failedMetricsCount} metric(s) exceeded budget: ${summary.failedMetrics.join(', ')}`);
            }

            if (metrics.lcp > perfConfig.PerformanceBudget.LCP_MaxMs) {
                await Test.Log.Fail(
                    `LCP exceeded budget: ${metrics.lcp}ms > ${perfConfig.PerformanceBudget.LCP_MaxMs}ms`,
                    budgetComparison.overages.lcp,
                    performanceBase.page
                );
                throw new Error('LCP budget exceeded');
            }

            if (metrics.speedIndex > perfConfig.PerformanceBudget.SpeedIndex_MaxMs) {
                await Test.Log.Fail(
                    `Speed Index exceeded budget: ${metrics.speedIndex}ms > ${perfConfig.PerformanceBudget.SpeedIndex_MaxMs}ms`,
                    budgetComparison.overages.speedIndex,
                    performanceBase.page
                );
                throw new Error('Speed Index budget exceeded');
            }

            Test.Log.Pass(
                'Performance metrics within acceptable budgets',
                { lcp: `${metrics.lcp}ms`, speedIndex: `${metrics.speedIndex}ms` },
                performanceBase.page
            );

            allTestResults.push({
                pageName: 'Homepage',
                lcp: metrics.lcp,
                speedIndex: metrics.speedIndex
            });

        } catch (error) {
            await Test.Log.Error('Performance test failed', error.message, performanceBase.page);

            allTestResults.push({
                pageName: 'Homepage',
                lcp: metrics?.lcp || null,
                speedIndex: metrics?.speedIndex || null
            });

            throw error;
        }
    });

    test('Measure Performance for Multiple Pages', async function() {
        try {
            const pagesToTest = [
                { name: 'Homepage', url: testUrl }
            ];

            for (const pageInfo of pagesToTest) {
                Test.Log.Info(`Testing ${pageInfo.name}: ${pageInfo.url}`);

                const metrics = await performanceBase.runLighthouseAudit(pageInfo.url);

                await PerformanceReporter.LogMetrics(
                    metrics,
                    perfConfig.PerformanceBudget,
                    performanceBase.page
                );

                if (perfConfig.SaveMetricsToStorage) {
                    await PerformanceReporter.SaveMetricsToFile(metrics, pageInfo.name);
                }

                const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
                    metrics,
                    perfConfig.PerformanceBudget
                );

                if (!budgetComparison.allPassed) {
                    Test.Log.Warning(
                        `${pageInfo.name} has performance issues`,
                        budgetComparison.overages
                    );
                }

                allTestResults.push({
                    pageName: pageInfo.name,
                    lcp: metrics.lcp,
                    speedIndex: metrics.speedIndex
                });
            }

            Test.Log.Pass('Multi-page performance test completed', null, performanceBase.page);

        } catch (error) {
            await Test.Log.Error('Multi-page performance test failed', error.message, performanceBase.page);
            throw error;
        }
    });

    test.afterAll(async function() {
        try {
            Test.Log.Info('Cleaning up browser resources');
            if (performanceBase.context) {
                await performanceBase.context.close();
            }
            if (performanceBase.browser) {
                await performanceBase.browser.close();
            }
            Test.Log.Info('Cleanup completed successfully');

            if (allTestResults.length > 0) {
                Test.Log.Info('Generating HTML Performance Report');
                const reportPath = await PerformanceReporter.GenerateHtmlReport(allTestResults, 'Performance_Report.html');
                Test.Log.Pass(`HTML Performance Report generated: ${reportPath}`);
            }

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });
});
