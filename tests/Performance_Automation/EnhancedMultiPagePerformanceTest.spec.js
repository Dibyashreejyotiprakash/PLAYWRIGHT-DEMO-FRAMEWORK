import { test } from '@playwright/test';
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import EnhancedPerformanceReporter from '../../Utility/ReportUtility/EnhancedPerformanceReporter.js';
import JsonReader from '../../Utility/FileReader/JsonReader.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';

/**
 * Enhanced Multi-Page Performance Testing
 * Runs 3 iterations per page and generates comprehensive HTML report
 * Matches the C# ReportGenerator format
 */
test.describe('Enhanced Multi-Page Performance Testing', function() {
    const performanceBase = new PageLoadTimeBase();
    let perfConfig;
    const allTestResults = [];
    const NUM_RUNS = 3; // Number of runs per page

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

    test('Test Multiple Pages Performance with Multiple Runs', async function() {
        try {
            // Configure pages to test
            const pagesToTest = [
                {
                    name: 'Login Page',
                    url: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
                },
                {
                    name: 'Dashboard Page',
                    url: 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
                }
                // Add more pages as needed
            ];

            // Test each page with multiple runs
            for (const pageInfo of pagesToTest) {
                Test.Log.Info(`\n${'='.repeat(60)}`);
                Test.Log.Info(`Testing: ${pageInfo.name}`);
                Test.Log.Info(`URL: ${pageInfo.url}`);
                Test.Log.Info(`Runs: ${NUM_RUNS}`);
                Test.Log.Info(`${'='.repeat(60)}\n`);

                const lcpRuns = [];
                const speedIndexRuns = [];

                // Run multiple iterations for this page
                for (let run = 1; run <= NUM_RUNS; run++) {
                    Test.Log.Info(`\n--- Run ${run}/${NUM_RUNS} for ${pageInfo.name} ---`);

                    try {
                        // Run Lighthouse audit
                        const metrics = await performanceBase.runLighthouseAudit(pageInfo.url);

                        // Collect metrics
                        lcpRuns.push(metrics.lcp);
                        speedIndexRuns.push(metrics.speedIndex);

                        Test.Log.Info(`Run ${run} - LCP: ${metrics.lcp}ms, Speed Index: ${metrics.speedIndex}ms`);

                        // Small delay between runs
                        if (run < NUM_RUNS) {
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }

                    } catch (error) {
                        Test.Log.Warning(`Run ${run} failed for ${pageInfo.name}: ${error.message}`);
                        lcpRuns.push(null);
                        speedIndexRuns.push(null);
                    }
                }

                // Calculate averages
                const validLcp = lcpRuns.filter(v => v !== null);
                const validSpeed = speedIndexRuns.filter(v => v !== null);

                const avgLcp = validLcp.length > 0
                    ? Math.round(validLcp.reduce((a, b) => a + b, 0) / validLcp.length)
                    : null;

                const avgSpeed = validSpeed.length > 0
                    ? Math.round(validSpeed.reduce((a, b) => a + b, 0) / validSpeed.length)
                    : null;

                // Log summary for this page
                Test.Log.Info(`\n--- Summary for ${pageInfo.name} ---`);
                Test.Log.Info(`LCP Runs (ms): ${lcpRuns.map(v => v || 'N/A').join(', ')}`);
                Test.Log.Info(`Speed Index Runs (ms): ${speedIndexRuns.map(v => v || 'N/A').join(', ')}`);
                Test.Log.Info(`Average LCP: ${avgLcp ? avgLcp + 'ms' : 'N/A'}`);
                Test.Log.Info(`Average Speed Index: ${avgSpeed ? avgSpeed + 'ms' : 'N/A'}`);

                // Store results for report generation
                allTestResults.push({
                    pageName: pageInfo.name,
                    lcpRuns: lcpRuns,
                    speedIndexRuns: speedIndexRuns,
                    avgLcp: avgLcp,
                    avgSpeedIndex: avgSpeed
                });

                // Compare against budget (using averages)
                if (avgLcp !== null && avgSpeed !== null) {
                    const metricsForBudget = {
                        lcp: avgLcp,
                        speedIndex: avgSpeed,
                        fcp: null,
                        cls: null,
                        tbt: null,
                        ttfb: null
                    };

                    const budgetResults = this.compareAgainstBudget(metricsForBudget, perfConfig.PerformanceBudget);

                    if (!budgetResults.allPassed) {
                        Test.Log.Warning(
                            `${pageInfo.name} has ${budgetResults.failedCount} metric(s) exceeding budget`
                        );
                    } else {
                        Test.Log.Pass(`${pageInfo.name} - All metrics within budget`);
                    }
                }
            }

            Test.Log.Pass(`All ${pagesToTest.length} page(s) tested successfully with ${NUM_RUNS} runs each`);

        } catch (error) {
            await Test.Log.Error('Enhanced multi-page performance test failed', error.message);
            throw error;
        }
    });

    /**
     * Helper method to compare metrics against budget
     */
    compareAgainstBudget(metrics, budgets) {
        const results = {
            lcp: metrics.lcp !== null && metrics.lcp <= budgets.LCP_MaxMs,
            speedIndex: metrics.speedIndex !== null && metrics.speedIndex <= budgets.SpeedIndex_MaxMs
        };

        const allPassed = results.lcp && results.speedIndex;
        const failedCount = Object.values(results).filter(v => !v).length;

        return { allPassed, failedCount, results };
    }

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

            // Generate enhanced HTML report
            if (allTestResults.length > 0) {
                Test.Log.Info('\n' + '='.repeat(60));
                Test.Log.Info('Generating Enhanced HTML Performance Report');
                Test.Log.Info('='.repeat(60) + '\n');

                // Get environment from config
                const environment = performanceBase.getEnvVariable ?
                    await performanceBase.getEnvVariable() : 'PROD';

                const reportPath = await EnhancedPerformanceReporter.generateEnhancedReport(
                    allTestResults,
                    'Enhanced_Performance_Report.html',
                    'Business Unit Name', // You can customize this
                    environment.toUpperCase()
                );

                Test.Log.Pass(`\n✓ Enhanced HTML Performance Report: ${reportPath}\n`);

                // Print console summary
                this.printConsoleSummary(allTestResults);
            }

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });

    /**
     * Print beautiful console summary
     */
    printConsoleSummary(results) {
        console.log('\n╔════════════════════════════════════════════════════════════╗');
        console.log('║          Enhanced Performance Test Summary               ║');
        console.log('╠════════════════════════════════════════════════════════════╣');

        results.forEach((result, index) => {
            const pageNum = String(index + 1).padEnd(2);
            const pageName = result.pageName.padEnd(30);

            console.log(`║ ${pageNum}. ${pageName}                        ║`);

            // LCP Runs
            const lcpRun1 = result.lcpRuns[0] !== null ? result.lcpRuns[0] + 'ms' : 'N/A';
            const lcpRun2 = result.lcpRuns[1] !== null ? result.lcpRuns[1] + 'ms' : 'N/A';
            const lcpRun3 = result.lcpRuns[2] !== null ? result.lcpRuns[2] + 'ms' : 'N/A';
            console.log(`║    LCP:    R1: ${lcpRun1.padEnd(8)} R2: ${lcpRun2.padEnd(8)} R3: ${lcpRun3.padEnd(8)} ║`);

            // Speed Index Runs
            const siRun1 = result.speedIndexRuns[0] !== null ? result.speedIndexRuns[0] + 'ms' : 'N/A';
            const siRun2 = result.speedIndexRuns[1] !== null ? result.speedIndexRuns[1] + 'ms' : 'N/A';
            const siRun3 = result.speedIndexRuns[2] !== null ? result.speedIndexRuns[2] + 'ms' : 'N/A';
            console.log(`║    SI:     R1: ${siRun1.padEnd(8)} R2: ${siRun2.padEnd(8)} R3: ${siRun3.padEnd(8)} ║`);

            // Averages
            const avgLcp = result.avgLcp !== null ? result.avgLcp + 'ms' : 'N/A';
            const avgSI = result.avgSpeedIndex !== null ? result.avgSpeedIndex + 'ms' : 'N/A';
            console.log(`║    Avg:    LCP: ${avgLcp.padEnd(10)} SI: ${avgSI.padEnd(10)}          ║`);

            console.log('╠════════════════════════════════════════════════════════════╣');
        });

        console.log('║ HTML Report: Reports/Enhanced_Performance_Report.html    ║');
        console.log('╚════════════════════════════════════════════════════════════╝\n');
    }
});
