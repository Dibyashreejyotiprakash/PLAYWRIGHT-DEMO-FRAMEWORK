import { test } from '@playwright/test';
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import PerformanceReporter from '../../Utility/ReportUtility/PerformanceReporter.js';
import JsonReader from '../../Utility/FileReader/JsonReader.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';

test.describe('Multi-Page Performance Testing', function() {
    const performanceBase = new PageLoadTimeBase();
    let perfConfig;
    const allTestResults = [];

    test.beforeAll(async function() {
        try {
            Test.Log.Info('Loading performance test configuration');
            const testData = await JsonReader.ReadJsonBody('./Testdata/performancetestdata.json');
            perfConfig = testData.PerformanceTestConfig;

            Test.Log.Info('Launching browser with CDP enabled for Lighthouse');
            await performanceBase.launchBrowserForPerformance();

        } catch (error) {
            await Test.Log.Error('Setup failed in beforeAll', error.message);
            throw error;
        }
    });

    test('Test Multiple Pages Performance', async function() {
        try {
            const pagesToTest = [
                {
                    name: 'Login Page',
                    url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
                }
            ];

            for (const pageInfo of pagesToTest) {
                Test.Log.Info(`\n========================================`);
                Test.Log.Info(`Testing: ${pageInfo.name}`);
                Test.Log.Info(`URL: ${pageInfo.url}`);
                Test.Log.Info(`========================================\n`);

                const metrics = await performanceBase.runLighthouseAudit(pageInfo.url);

                await PerformanceReporter.LogMetrics(
                    metrics,
                    perfConfig.PerformanceBudget,
                    performanceBase.page
                );

                if (perfConfig.SaveMetricsToStorage) {
                    await PerformanceReporter.SaveMetricsToFile(metrics, pageInfo.name);
                }

                allTestResults.push({
                    pageName: pageInfo.name,
                    lcp: metrics.lcp,
                    speedIndex: metrics.speedIndex
                });

                const budgetComparison = await PerformanceReporter.CompareAgainstBudget(
                    metrics,
                    perfConfig.PerformanceBudget
                );

                if (!budgetComparison.allPassed) {
                    Test.Log.Warning(
                        `${pageInfo.name} has ${Object.keys(budgetComparison.overages).length} metric(s) exceeding budget`,
                        budgetComparison.overages
                    );
                } else {
                    Test.Log.Pass(`${pageInfo.name} - All metrics within budget`);
                }
            }

            Test.Log.Pass(`All ${pagesToTest.length} page(s) tested successfully`, null, performanceBase.page);

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
                Test.Log.Info('\n========================================');
                Test.Log.Info('Generating HTML Performance Report');
                Test.Log.Info('========================================\n');

                const reportPath = await PerformanceReporter.GenerateHtmlReport(
                    allTestResults,
                    'Performance_Report.html'
                );

                Test.Log.Pass(`\n✓ HTML Performance Report: ${reportPath}\n`);

                console.log('\n╔════════════════════════════════════════════════════════════╗');
                console.log('║          Performance Test Summary                         ║');
                console.log('╠════════════════════════════════════════════════════════════╣');
                allTestResults.forEach((result, index) => {
                    console.log(`║ ${index + 1}. ${result.pageName.padEnd(50)} ║`);
                    console.log(`║    LCP: ${String(result.lcp + ' ms').padEnd(48)} ║`);
                    console.log(`║    Speed Index: ${String(result.speedIndex + ' ms').padEnd(42)} ║`);
                    console.log('╠════════════════════════════════════════════════════════════╣');
                });
                console.log('║ HTML Report: Reports/Performance_Report.html              ║');
                console.log('╚════════════════════════════════════════════════════════════╝\n');
            }

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });
});
