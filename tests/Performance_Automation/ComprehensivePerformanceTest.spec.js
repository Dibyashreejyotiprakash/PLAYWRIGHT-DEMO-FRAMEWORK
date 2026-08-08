import { test } from '@playwright/test';
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import EnhancedPerformanceReporter from '../../Utility/ReportUtility/EnhancedPerformanceReporter.js';
import PerformanceHelper from '../../Utility/PerformanceUtility/PerformanceHelper.js';
import JsonReader from '../../Utility/FileReader/JsonReader.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';

/**
 * Comprehensive Multi-Page Performance Testing
 * Uses PerformanceHelper for efficient multi-run testing
 * Generates enhanced HTML report matching C# format
 */
test.describe('Comprehensive Multi-Page Performance Testing', function() {
    const performanceBase = new PageLoadTimeBase();
    let perfConfig;
    const allTestResults = [];
    const NUM_RUNS = 3; // Number of runs per page

    test.beforeAll(async function() {
        try {
            Test.Log.Info('╔════════════════════════════════════════════════════════╗');
            Test.Log.Info('║  Comprehensive Performance Testing - Setup            ║');
            Test.Log.Info('╚════════════════════════════════════════════════════════╝\n');

            Test.Log.Info('📋 Loading performance test configuration');
            const testData = await JsonReader.ReadJsonBody('./Testdata/performancetestdata.json');
            perfConfig = testData.PerformanceTestConfig;

            Test.Log.Info('🚀 Launching browser with CDP enabled for Lighthouse');
            await performanceBase.launchBrowserForPerformance();

            Test.Log.Info('✓ Setup completed successfully\n');

        } catch (error) {
            await Test.Log.Error('❌ Setup failed in beforeAll', error.message);
            throw error;
        }
    });

    test('Comprehensive Performance Test with Statistics', async function() {
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
                // Add more pages as needed:
                // {
                //     name: 'Your Page Name',
                //     url: 'https://your-url-here.com'
                // }
            ];

            Test.Log.Info(`\n📊 Testing ${pagesToTest.length} pages with ${NUM_RUNS} runs each\n`);

            // Test each page with multiple runs
            for (const pageInfo of pagesToTest) {
                Test.Log.Info(`\n${'═'.repeat(70)}`);
                Test.Log.Info(`🔍 Testing: ${pageInfo.name}`);
                Test.Log.Info(`🌐 URL: ${pageInfo.url}`);
                Test.Log.Info(`🔄 Runs: ${NUM_RUNS}`);
                Test.Log.Info(`${'═'.repeat(70)}\n`);

                // Use PerformanceHelper to get multiple runs efficiently
                const { lcpRuns, speedIndexRuns } = await PerformanceHelper.getPerformanceRuns(
                    performanceBase,
                    pageInfo.url,
                    NUM_RUNS
                );

                // Calculate statistics
                const avgLcp = PerformanceHelper.calculateAverage(lcpRuns);
                const avgSpeedIndex = PerformanceHelper.calculateAverage(speedIndexRuns);

                // Log detailed statistics
                PerformanceHelper.logMetricsSummary(lcpRuns, speedIndexRuns, pageInfo.name);

                // Store results for report generation
                allTestResults.push({
                    pageName: pageInfo.name,
                    lcpRuns: lcpRuns,
                    speedIndexRuns: speedIndexRuns,
                    avgLcp: avgLcp,
                    avgSpeedIndex: avgSpeedIndex
                });

                // Check against performance budget
                if (avgLcp !== null && avgSpeedIndex !== null) {
                    const budgetCheck = PerformanceHelper.checkPerformanceBudget(
                        avgLcp,
                        avgSpeedIndex,
                        perfConfig.PerformanceBudget
                    );

                    if (budgetCheck.allPassed) {
                        Test.Log.Pass(`✓ ${pageInfo.name} - All metrics within budget`);
                    } else {
                        const failedMetrics = [];
                        if (!budgetCheck.lcpPass) {
                            const overagePercent = Math.round(
                                ((avgLcp - budgetCheck.lcpBudget) / budgetCheck.lcpBudget) * 100
                            );
                            failedMetrics.push(`LCP: ${avgLcp}ms (Budget: ${budgetCheck.lcpBudget}ms, +${overagePercent}%)`);
                        }
                        if (!budgetCheck.speedIndexPass) {
                            const overagePercent = Math.round(
                                ((avgSpeedIndex - budgetCheck.speedIndexBudget) / budgetCheck.speedIndexBudget) * 100
                            );
                            failedMetrics.push(`Speed Index: ${avgSpeedIndex}ms (Budget: ${budgetCheck.speedIndexBudget}ms, +${overagePercent}%)`);
                        }

                        Test.Log.Warning(
                            `⚠ ${pageInfo.name} - ${failedMetrics.length} metric(s) exceeding budget:\n   ${failedMetrics.join('\n   ')}`
                        );
                    }
                }

                // Small delay between pages
                if (pagesToTest.indexOf(pageInfo) < pagesToTest.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            Test.Log.Pass(`\n✓ All ${pagesToTest.length} page(s) tested successfully with ${NUM_RUNS} runs each\n`);

        } catch (error) {
            await Test.Log.Error('❌ Comprehensive performance test failed', error.message);
            throw error;
        }
    });

    test.afterAll(async function() {
        try {
            Test.Log.Info('\n╔════════════════════════════════════════════════════════╗');
            Test.Log.Info('║  Cleanup & Report Generation                          ║');
            Test.Log.Info('╚════════════════════════════════════════════════════════╝\n');

            Test.Log.Info('🧹 Cleaning up browser resources');
            if (performanceBase.context) {
                await performanceBase.context.close();
            }
            if (performanceBase.browser) {
                await performanceBase.browser.close();
            }
            Test.Log.Info('✓ Cleanup completed successfully\n');

            // Generate enhanced HTML report
            if (allTestResults.length > 0) {
                Test.Log.Info('📊 Generating Enhanced HTML Performance Report...\n');

                // Get environment from config
                let environment = 'PROD';
                try {
                    environment = await performanceBase.getEnvVariable();
                    environment = environment.toUpperCase();
                } catch (e) {
                    Test.Log.Warning('Could not determine environment, using default: PROD');
                }

                // You can customize the business unit name here
                const businessUnit = 'Business Unit: AnsiraCreateBB';

                const reportPath = await EnhancedPerformanceReporter.generateEnhancedReport(
                    allTestResults,
                    'Comprehensive_Performance_Report.html',
                    businessUnit,
                    environment
                );

                Test.Log.Pass(`✓ Enhanced HTML Performance Report: ${reportPath}\n`);

                // Print console summary
                printBeautifulConsoleSummary(allTestResults);
            } else {
                Test.Log.Warning('⚠ No test results to generate report');
            }

        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    });
});

/**
 * Print beautiful console summary table
 */
function printBeautifulConsoleSummary(results) {
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                  Comprehensive Performance Test Summary                   ║');
    console.log('╠════════════════════════════════════════════════════════════════════════════╣');

    results.forEach((result, index) => {
        const num = String(index + 1).padStart(2, '0');
        console.log(`║ ${num}. ${result.pageName.padEnd(68, ' ')} ║`);

        // LCP Runs
        const lcpValues = result.lcpRuns.map(v => v !== null ? `${v}ms`.padStart(8) : 'N/A'.padStart(8));
        console.log(`║     LCP Runs:       ${lcpValues[0]} │ ${lcpValues[1]} │ ${lcpValues[2]}              ║`);

        // Speed Index Runs
        const siValues = result.speedIndexRuns.map(v => v !== null ? `${v}ms`.padStart(8) : 'N/A'.padStart(8));
        console.log(`║     SI Runs:        ${siValues[0]} │ ${siValues[1]} │ ${siValues[2]}              ║`);

        // Averages & Stats
        const avgLcp = result.avgLcp !== null ? `${result.avgLcp}ms` : 'N/A';
        const avgSI = result.avgSpeedIndex !== null ? `${result.avgSpeedIndex}ms` : 'N/A';
        const lcpStats = PerformanceHelper.getStatistics(result.lcpRuns);
        const siStats = PerformanceHelper.getStatistics(result.speedIndexRuns);

        console.log(`║     Avg LCP:        ${avgLcp.padEnd(30)} ║`);
        console.log(`║     Avg SI:         ${avgSI.padEnd(30)} ║`);

        if (lcpStats.stdDev !== null) {
            console.log(`║     LCP Std Dev:    ${lcpStats.stdDev}ms`.padEnd(76) + '║');
        }
        if (siStats.stdDev !== null) {
            console.log(`║     SI Std Dev:     ${siStats.stdDev}ms`.padEnd(76) + '║');
        }

        // Performance Rating
        const lcpRating = getPerformanceRating(result.avgLcp, true);
        const siRating = getPerformanceRating(result.avgSpeedIndex, false);
        console.log(`║     LCP Rating:     ${lcpRating.padEnd(30)} ║`);
        console.log(`║     SI Rating:      ${siRating.padEnd(30)} ║`);

        console.log('╠════════════════════════════════════════════════════════════════════════════╣');
    });

    console.log('║ 📊 HTML Report: Reports/Comprehensive_Performance_Report.html             ║');
    console.log('║ 📁 Location: ./Reports/                                                    ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
}

/**
 * Get performance rating string for console
 */
function getPerformanceRating(value, isLcp) {
    if (value === null || value === undefined) return 'N/A';

    const valueInSeconds = value / 1000;

    if (isLcp) {
        if (valueInSeconds < 1.0) return '⭐ Excellent';
        else if (valueInSeconds < 2.5) return '✅ Good';
        else if (valueInSeconds < 4.0) return '⚠️  Average';
        else return '❌ Needs Improvement';
    } else {
        if (valueInSeconds < 1.0) return '⭐ Excellent';
        else if (valueInSeconds < 2.0) return '✅ Good';
        else if (valueInSeconds < 3.5) return '⚠️  Average';
        else return '❌ Needs Improvement';
    }
}
