import Test from './TestLogger.js';
import PerformanceHtmlReporter from './PerformanceHtmlReporter.js';
import fs from 'fs';
import path from 'path';

class PerformanceReporter {

    static async LogMetrics(metrics, budgets, page = null) {
        try {
            Test.Log.Info('=== Performance Metrics Report ===');

            Test.Log.Info(`Performance Score: ${metrics.performanceScore}/100`);

            if (metrics.lcp !== null) {
                const lcpStatus = metrics.lcp <= budgets.LCP_MaxMs ? '✓' : '✗';
                const lcpMsg = `LCP: ${metrics.lcp}ms (Budget: ${budgets.LCP_MaxMs}ms) ${lcpStatus}`;
                if (metrics.lcp <= budgets.LCP_MaxMs) {
                    Test.Log.Info(lcpMsg);
                } else {
                    Test.Log.Warning(lcpMsg);
                }
            }

            if (metrics.speedIndex !== null) {
                const siStatus = metrics.speedIndex <= budgets.SpeedIndex_MaxMs ? '✓' : '✗';
                const siMsg = `Speed Index: ${metrics.speedIndex}ms (Budget: ${budgets.SpeedIndex_MaxMs}ms) ${siStatus}`;
                if (metrics.speedIndex <= budgets.SpeedIndex_MaxMs) {
                    Test.Log.Info(siMsg);
                } else {
                    Test.Log.Warning(siMsg);
                }
            }

            if (metrics.fcp !== null) {
                const fcpStatus = metrics.fcp <= budgets.FCP_MaxMs ? '✓' : '✗';
                const fcpMsg = `FCP: ${metrics.fcp}ms (Budget: ${budgets.FCP_MaxMs}ms) ${fcpStatus}`;
                if (metrics.fcp <= budgets.FCP_MaxMs) {
                    Test.Log.Info(fcpMsg);
                } else {
                    Test.Log.Warning(fcpMsg);
                }
            }

            if (metrics.cls !== null) {
                const clsStatus = metrics.cls <= budgets.CLS_Max ? '✓' : '✗';
                const clsMsg = `CLS: ${metrics.cls} (Budget: ${budgets.CLS_Max}) ${clsStatus}`;
                if (metrics.cls <= budgets.CLS_Max) {
                    Test.Log.Info(clsMsg);
                } else {
                    Test.Log.Warning(clsMsg);
                }
            }

            if (metrics.tbt !== null) {
                const tbtStatus = metrics.tbt <= budgets.TBT_MaxMs ? '✓' : '✗';
                const tbtMsg = `TBT: ${metrics.tbt}ms (Budget: ${budgets.TBT_MaxMs}ms) ${tbtStatus}`;
                if (metrics.tbt <= budgets.TBT_MaxMs) {
                    Test.Log.Info(tbtMsg);
                } else {
                    Test.Log.Warning(tbtMsg);
                }
            }

            if (metrics.ttfb !== null) {
                const ttfbStatus = metrics.ttfb <= budgets.TTFB_MaxMs ? '✓' : '✗';
                const ttfbMsg = `TTFB: ${metrics.ttfb}ms (Budget: ${budgets.TTFB_MaxMs}ms) ${ttfbStatus}`;
                if (metrics.ttfb <= budgets.TTFB_MaxMs) {
                    Test.Log.Info(ttfbMsg);
                } else {
                    Test.Log.Warning(ttfbMsg);
                }
            }

            Test.Log.Info('=================================');

            const metricsJson = JSON.stringify(metrics, null, 2);
            try {
                const { test } = await import('@playwright/test');
                const testInfo = test.info();
                await testInfo.attach('performance-metrics', {
                    body: metricsJson,
                    contentType: 'application/json'
                });
            } catch (error) {
                console.warn('[PerformanceReporter] Could not attach metrics to test');
            }

        } catch (error) {
            console.error("Error in logging metrics: " + error);
            throw error;
        }
    }

    static async SaveMetricsToFile(metrics, testName) {
        try {
            const reportsDir = path.join(process.cwd(), 'Reports', 'performance-metrics');

            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${testName}-${timestamp}.json`;
            const filepath = path.join(reportsDir, filename);

            const metricsData = {
                testName: testName,
                timestamp: metrics.timestamp,
                url: metrics.url,
                metrics: metrics
            };

            fs.writeFileSync(filepath, JSON.stringify(metricsData, null, 2));

            Test.Log.Info(`Performance metrics saved to: ${filepath}`);

            return filepath;

        } catch (error) {
            console.error("Error in saving metrics to file: " + error);
            throw error;
        }
    }

    static async CompareAgainstBudget(metrics, budgets) {
        try {
            const budgetResults = {
                lcp: metrics.lcp !== null && metrics.lcp <= budgets.LCP_MaxMs ? 'PASS' : 'FAIL',
                speedIndex: metrics.speedIndex !== null && metrics.speedIndex <= budgets.SpeedIndex_MaxMs ? 'PASS' : 'FAIL',
                fcp: metrics.fcp !== null && metrics.fcp <= budgets.FCP_MaxMs ? 'PASS' : 'FAIL',
                cls: metrics.cls !== null && metrics.cls <= budgets.CLS_Max ? 'PASS' : 'FAIL',
                tbt: metrics.tbt !== null && metrics.tbt <= budgets.TBT_MaxMs ? 'PASS' : 'FAIL',
                ttfb: metrics.ttfb !== null && metrics.ttfb <= budgets.TTFB_MaxMs ? 'PASS' : 'FAIL'
            };

            const overages = {};

            if (budgetResults.lcp === 'FAIL' && metrics.lcp !== null) {
                overages.lcp = {
                    actual: metrics.lcp,
                    budget: budgets.LCP_MaxMs,
                    percentOver: Math.round(((metrics.lcp - budgets.LCP_MaxMs) / budgets.LCP_MaxMs) * 100)
                };
            }

            if (budgetResults.speedIndex === 'FAIL' && metrics.speedIndex !== null) {
                overages.speedIndex = {
                    actual: metrics.speedIndex,
                    budget: budgets.SpeedIndex_MaxMs,
                    percentOver: Math.round(((metrics.speedIndex - budgets.SpeedIndex_MaxMs) / budgets.SpeedIndex_MaxMs) * 100)
                };
            }

            if (budgetResults.fcp === 'FAIL' && metrics.fcp !== null) {
                overages.fcp = {
                    actual: metrics.fcp,
                    budget: budgets.FCP_MaxMs,
                    percentOver: Math.round(((metrics.fcp - budgets.FCP_MaxMs) / budgets.FCP_MaxMs) * 100)
                };
            }

            if (budgetResults.cls === 'FAIL' && metrics.cls !== null) {
                overages.cls = {
                    actual: metrics.cls,
                    budget: budgets.CLS_Max,
                    percentOver: Math.round(((metrics.cls - budgets.CLS_Max) / budgets.CLS_Max) * 100)
                };
            }

            if (budgetResults.tbt === 'FAIL' && metrics.tbt !== null) {
                overages.tbt = {
                    actual: metrics.tbt,
                    budget: budgets.TBT_MaxMs,
                    percentOver: Math.round(((metrics.tbt - budgets.TBT_MaxMs) / budgets.TBT_MaxMs) * 100)
                };
            }

            if (budgetResults.ttfb === 'FAIL' && metrics.ttfb !== null) {
                overages.ttfb = {
                    actual: metrics.ttfb,
                    budget: budgets.TTFB_MaxMs,
                    percentOver: Math.round(((metrics.ttfb - budgets.TTFB_MaxMs) / budgets.TTFB_MaxMs) * 100)
                };
            }

            const allPassed = Object.values(budgetResults).every(result => result === 'PASS');

            return {
                budgetResults: budgetResults,
                overages: overages,
                allPassed: allPassed
            };

        } catch (error) {
            console.error("Error in comparing against budget: " + error);
            throw error;
        }
    }

    static FormatMetricsForDisplay(metrics) {
        try {
            const formatted = {
                'Performance Score': `${metrics.performanceScore}/100`,
                'LCP': metrics.lcp !== null ? `${metrics.lcp}ms` : 'N/A',
                'Speed Index': metrics.speedIndex !== null ? `${metrics.speedIndex}ms` : 'N/A',
                'FCP': metrics.fcp !== null ? `${metrics.fcp}ms` : 'N/A',
                'CLS': metrics.cls !== null ? `${metrics.cls}` : 'N/A',
                'TBT': metrics.tbt !== null ? `${metrics.tbt}ms` : 'N/A',
                'TTFB': metrics.ttfb !== null ? `${metrics.ttfb}ms` : 'N/A',
                'TTI': metrics.tti !== null ? `${metrics.tti}ms` : 'N/A',
                'URL': metrics.url || 'N/A',
                'Timestamp': metrics.timestamp || 'N/A'
            };

            return formatted;

        } catch (error) {
            console.error("Error in formatting metrics: " + error);
            throw error;
        }
    }

    static async GeneratePerformanceSummary(metrics, budgetComparison) {
        try {
            const summary = {
                overallStatus: budgetComparison.allPassed ? 'PASS' : 'FAIL',
                performanceScore: metrics.performanceScore,
                criticalMetrics: {
                    lcp: {
                        value: metrics.lcp,
                        status: budgetComparison.budgetResults.lcp
                    },
                    speedIndex: {
                        value: metrics.speedIndex,
                        status: budgetComparison.budgetResults.speedIndex
                    }
                },
                failedMetrics: Object.keys(budgetComparison.overages),
                failedMetricsCount: Object.keys(budgetComparison.overages).length
            };

            return summary;

        } catch (error) {
            console.error("Error in generating performance summary: " + error);
            throw error;
        }
    }

    static async GenerateHtmlReport(testResults, outputFileName = 'Performance_Report.html') {
        try {
            return await PerformanceHtmlReporter.generateSimpleReport(testResults, outputFileName);
        } catch (error) {
            console.error("Error in generating HTML report: " + error);
            throw error;
        }
    }
}

export default PerformanceReporter;
