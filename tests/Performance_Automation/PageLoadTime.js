import { test } from '@playwright/test';
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import EnhancedPerformanceReporter from '../../Utility/ReportUtility/EnhancedPerformanceReporter.js';
import JsonReader from '../../Utility/FileReader/JsonReader.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';
import PageUrl from '../../Utility/PerformanceUtility/PageUrl.js';
import MetricsCollector from '../../Utility/PerformanceUtility/MetricsCollector.js';
import path from 'path';
import fs from 'fs';


test.describe('Performance Report - QA BU', function() {
    const performanceBase = new PageLoadTimeBase();
    let env;
    let page;
    let htmlReport;
    const pageUrlInstance = new PageUrl();

    test.beforeAll(async function() {
        try {
            Test.Log.Info('Launching browser for performance testing with Playwright');
            await performanceBase.launchBrowserForPerformance();

            // Get environment
            env = await performanceBase.getEnvVariable();
            Test.Log.Info(`Testing environment: ${env}`);

            // Get page instance
            page = performanceBase.page;

            if (!page) {
                throw new Error('Playwright page instance not available. Ensure browser is launched.');
            }

            // Initialize HTML report generator
            htmlReport = new ReportGenerator();

        } catch (error) {
            await Test.Log.Error('Setup failed in beforeAll', error.message);
            throw error;
        }
    });

    test('GetLCP_SpeedIndexFor_QA', async function() {
        const buName = 'QA Business Unit';

        try {
            Test.Log.Info(`\n${'='.repeat(80)}`);
            Test.Log.Info(`Starting Performance Test for ${buName}`);
            Test.Log.Info(`Environment: ${env}`);
            Test.Log.Info(`${'='.repeat(80)}\n`);

            // Login Page (if applicable)
            // await page.goto('login-url');
            // await page.waitForLoadState('load');
            // await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Login Page', 'Login Page');

            // Search Page
            const searchPageUrl = await pageUrlInstance.QA_SearchPageUrl(env);
            await page.goto(searchPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Search Page', 'Search Page');

            // Work Center Page
            const workCenterPageUrl = await pageUrlInstance.QA_WorkCenterPageUrl(env);
            await page.goto(workCenterPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Workcenter', 'Workcenter Page');

            // Keyword Search Page
            const keywordSearchPageUrl = await pageUrlInstance.QA_KeyWordSearchPageUrl(env);
            await page.goto(keywordSearchPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Keyword Search', 'Keyword Search Page');

            // PDP Page
            const pdpPageUrl = await pageUrlInstance.QA_PDPPageUrl(env);
            await page.goto(pdpPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'PDP', 'PDP Page');

            // Cart Page
            const cartPageUrl = await pageUrlInstance.QA_CartPageUrl(env);
            await page.goto(cartPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Cart Page', 'Cart Page');

            Test.Log.Pass('All pages tested successfully');

        } catch (error) {
            Test.Log.Error(`Test failed with exception: ${error.message}`);
            throw error;
        } finally {
            try {
                // Generate performance report
                const projectDir = path.resolve('./');
                const reportDir = path.join(projectDir, 'PerformanceReport');

                // Create report directory if it doesn't exist
                if (!fs.existsSync(reportDir)) {
                    fs.mkdirSync(reportDir, { recursive: true });
                }

                const reportFilePath = path.join(reportDir, 'Performance_Report.html');

                htmlReport.generateReport(reportFilePath, buName, env);
                Test.Log.Pass(`✓ Performance Report generated: ${reportFilePath}`);

            } catch (reportError) {
                Test.Log.Error(`Report generation failed: ${reportError.message}`);
            }
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

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });
});

/**
 * ReportGenerator class - Matches C# ReportGenerator pattern
 * Collects test results and generates HTML report
 */
class ReportGenerator {
    constructor() {
        this._rows = [];
    }

    /**
     * Add result to the report (called by MetricsCollector)
     * @param {Array} lcpRuns - Array of LCP values
     * @param {Array} speedIndexRuns - Array of Speed Index values
     * @param {string} pageName - Page name
     */
    addResult(lcpRuns, speedIndexRuns, pageName) {
        this._rows.push({
            lcpRuns,
            speedIndexRuns,
            pageName
        });
    }

    /**
     * Generate HTML performance report
     * @param {string} filePath - Output file path
     * @param {string} buName - Business unit name
     * @param {string} env - Environment name
     */
    generateReport(filePath, buName = 'Business Unit', env = 'PROD') {
        const html = this._buildReportHtml(buName, env);
        fs.writeFileSync(filePath, html, 'utf-8');
        console.log(`Performance report generated: ${filePath}`);
    }

    /**
     * Build complete HTML report
     * @param {string} buName - Business unit name
     * @param {string} env - Environment name
     * @returns {string} - HTML content
     */
    _buildReportHtml(buName, env) {
        const sb = [];

        // HTML Header
        sb.push('<!DOCTYPE html>');
        sb.push('<html lang="en">');
        sb.push('<head>');
        sb.push('    <meta charset="UTF-8">');
        sb.push('    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
        sb.push('    <title>AnsiraCreateBB Pageload Time Report</title>');
        sb.push(this._getModernStyles());
        sb.push('</head>');
        sb.push('<body>');
        sb.push('    <div class="container">');

        // Header Section
        const header = buName ? `Business Unit: ${buName}` : 'AnsiraCreateBB Pageload Time Report';
        sb.push('        <div class="header">');
        sb.push('            <h1>AnsiraCreateBB Pageload Time Report</h1>');
        sb.push(`            <div class="subtitle">${header}</div>`);
        sb.push('            <div class="report-info">');
        sb.push(`                <div class="report-info-item"><span>📊</span><span>${this._rows.length} Pages Tested</span></div>`);
        sb.push('                <div class="report-info-item"><span>🔄</span><span>3 Test Runs</span></div>');
        sb.push(`                <div class="report-info-item"><span>📅</span><span>Generated: ${new Date().toLocaleString()}</span></div>`);
        sb.push(`                <div class="report-info-item"><span>🌐</span><span>Environment: ${env.toUpperCase()}</span></div>`);
        sb.push('            </div>');
        sb.push('        </div>');

        sb.push('        <div class="content">');

        // Performance Summary Section
        sb.push(this._buildSummarySection());

        // Performance Legend
        sb.push(this._buildLegend());

        // Detailed Metrics Section
        sb.push(this._buildDetailedMetricsSection());

        sb.push('        </div>');

        // Footer
        sb.push('        <div class="footer">');
        sb.push('            <p>AnsiraCreateBB Automation Framework | Pageload Time Report</p>');
        sb.push('            <p>LCP: Largest Contentful Paint | SI: Speed Index</p>');
        sb.push('        </div>');

        sb.push('    </div>');
        sb.push('</body>');
        sb.push('</html>');

        return sb.join('\n');
    }

    /**
     * Build performance summary section
     */
    _buildSummarySection() {
        const sb = [];

        sb.push('            <div class="section">');
        sb.push('                <h2 class="section-title">Performance Summary</h2>');
        sb.push('                <div class="table-wrapper">');
        sb.push('                    <table class="summary-table">');
        sb.push('                        <thead>');
        sb.push('                            <tr>');
        sb.push('                                <th>Page Name</th>');
        sb.push('                                <th>Avg LCP (sec)</th>');
        sb.push('                                <th>Avg Speed Index (sec)</th>');
        sb.push('                                <th>LCP Rating</th>');
        sb.push('                                <th>Speed Index Rating</th>');
        sb.push('                            </tr>');
        sb.push('                        </thead>');
        sb.push('                        <tbody>');

        this._rows.forEach(row => {
            const avgLcp = this._calculateAverage(row.lcpRuns);
            const avgSpeed = this._calculateAverage(row.speedIndexRuns);
            const avgLcpSec = avgLcp !== null ? (avgLcp / 1000).toFixed(2) : 'N/A';
            const avgSpeedSec = avgSpeed !== null ? (avgSpeed / 1000).toFixed(2) : 'N/A';

            const lcpRating = this._getPerformanceRating(avgLcp ? avgLcp / 1000 : null, true);
            const speedRating = this._getPerformanceRating(avgSpeed ? avgSpeed / 1000 : null, false);

            sb.push('                            <tr>');
            sb.push(`                                <td><strong>${row.pageName}</strong></td>`);
            sb.push(`                                <td>${avgLcpSec}</td>`);
            sb.push(`                                <td>${avgSpeedSec}</td>`);
            sb.push(`                                <td>${lcpRating}</td>`);
            sb.push(`                                <td>${speedRating}</td>`);
            sb.push('                            </tr>');
        });

        sb.push('                        </tbody>');
        sb.push('                    </table>');
        sb.push('                </div>');

        return sb.join('\n');
    }

    /**
     * Build performance legend
     */
    _buildLegend() {
        const sb = [];

        sb.push('                <div class="legend">');
        sb.push('                    <div class="legend-item">');
        sb.push('                        <div class="legend-color" style="background-color: #28a745;"></div>');
        sb.push('                        <span><strong>Excellent:</strong> LCP &lt; 1.0s, SI &lt; 1.0s</span>');
        sb.push('                    </div>');
        sb.push('                    <div class="legend-item">');
        sb.push('                        <div class="legend-color" style="background-color: #20c997;"></div>');
        sb.push('                        <span><strong>Good:</strong> LCP 1.0-2.5s, SI 1.0-2.0s</span>');
        sb.push('                    </div>');
        sb.push('                    <div class="legend-item">');
        sb.push('                        <div class="legend-color" style="background-color: #ffc107;"></div>');
        sb.push('                        <span><strong>Average:</strong> LCP 2.5-4.0s, SI 2.0-3.5s</span>');
        sb.push('                    </div>');
        sb.push('                    <div class="legend-item">');
        sb.push('                        <div class="legend-color" style="background-color: #dc3545;"></div>');
        sb.push('                        <span><strong>Needs Improvement:</strong> LCP &gt; 4.0s, SI &gt; 3.5s</span>');
        sb.push('                    </div>');
        sb.push('                </div>');
        sb.push('            </div>');

        return sb.join('\n');
    }

    /**
     * Build detailed metrics section
     */
    _buildDetailedMetricsSection() {
        const sb = [];

        sb.push('            <div class="section">');
        sb.push('                <h2 class="section-title">Detailed Performance Metrics</h2>');
        sb.push('                <div class="table-wrapper">');
        sb.push('                    <table>');
        sb.push('                        <thead>');
        sb.push('                            <tr>');
        sb.push('                                <th>Page Name</th>');
        sb.push('                                <th>LCP Run 1</th>');
        sb.push('                                <th>LCP Run 2</th>');
        sb.push('                                <th>LCP Run 3</th>');
        sb.push('                                <th>Avg LCP</th>');
        sb.push('                                <th>SI Run 1</th>');
        sb.push('                                <th>SI Run 2</th>');
        sb.push('                                <th>SI Run 3</th>');
        sb.push('                                <th>Avg SI</th>');
        sb.push('                            </tr>');
        sb.push('                        </thead>');
        sb.push('                        <tbody>');

        this._rows.forEach(row => {
            const lcpStrs = row.lcpRuns.map(x => x !== null ? (x / 1000).toFixed(2) : 'N/A');
            const speedIndexStrs = row.speedIndexRuns.map(x => x !== null ? (x / 1000).toFixed(2) : 'N/A');
            const avg = this._calculateAverage(row.lcpRuns);
            const avgSpeedIndex = this._calculateAverage(row.speedIndexRuns);
            const avgStr = avg !== null ? (avg / 1000).toFixed(2) : 'N/A';
            const avgSpeedIndexStr = avgSpeedIndex !== null ? (avgSpeedIndex / 1000).toFixed(2) : 'N/A';

            const rowClass = this._getRowClass(avg ? avg / 1000 : null);

            sb.push(`                            <tr class="${rowClass}">`);
            sb.push(`                                <td><strong>${row.pageName}</strong></td>`);
            sb.push(`                                <td>${lcpStrs[0] || 'N/A'}</td>`);
            sb.push(`                                <td>${lcpStrs[1] || 'N/A'}</td>`);
            sb.push(`                                <td>${lcpStrs[2] || 'N/A'}</td>`);
            sb.push(`                                <td>${avgStr}</td>`);
            sb.push(`                                <td>${speedIndexStrs[0] || 'N/A'}</td>`);
            sb.push(`                                <td>${speedIndexStrs[1] || 'N/A'}</td>`);
            sb.push(`                                <td>${speedIndexStrs[2] || 'N/A'}</td>`);
            sb.push(`                                <td>${avgSpeedIndexStr}</td>`);
            sb.push('                            </tr>');
        });

        sb.push('                        </tbody>');
        sb.push('                    </table>');
        sb.push('                </div>');
        sb.push('            </div>');

        return sb.join('\n');
    }

    /**
     * Calculate average from array
     */
    _calculateAverage(arr) {
        const valid = arr.filter(v => v !== null && v !== undefined);
        if (valid.length === 0) return null;
        return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
    }

    /**
     * Get performance rating badge HTML
     */
    _getPerformanceRating(value, isLcp) {
        if (value === null) {
            return '<span class="metric-badge badge-average">N/A</span>';
        }

        if (isLcp) {
            if (value < 1.0) return '<span class="metric-badge badge-excellent">Excellent</span>';
            if (value < 2.5) return '<span class="metric-badge badge-good">Good</span>';
            if (value < 4.0) return '<span class="metric-badge badge-average">Average</span>';
            return '<span class="metric-badge badge-poor">Needs Improvement</span>';
        } else {
            if (value < 1.0) return '<span class="metric-badge badge-excellent">Excellent</span>';
            if (value < 2.0) return '<span class="metric-badge badge-good">Good</span>';
            if (value < 3.5) return '<span class="metric-badge badge-average">Average</span>';
            return '<span class="metric-badge badge-poor">Needs Improvement</span>';
        }
    }

    /**
     * Get row class based on performance
     */
    _getRowClass(avgLcp) {
        if (avgLcp === null) return '';
        if (avgLcp > 5) return 'performance-poor';
        if (avgLcp < 3) return 'performance-good';
        return 'performance-warning';
    }

    /**
     * Get modern CSS styles (same as C# version)
     */
    _getModernStyles() {
        return `    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 40px 20px;
            color: #2c3e50;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            font-weight: 300;
            margin-bottom: 10px;
        }

        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            font-weight: 300;
        }

        .report-info {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 20px;
            font-size: 0.95em;
            flex-wrap: wrap;
        }

        .report-info-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .content {
            padding: 40px;
        }

        .section {
            margin-bottom: 50px;
        }

        .section-title {
            font-size: 1.8em;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            font-weight: 400;
        }

        .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 12px;
            text-align: left;
            font-weight: 500;
            font-size: 0.95em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 14px 12px;
            border-bottom: 1px solid #ecf0f1;
            font-size: 0.95em;
        }

        tr:hover {
            background-color: #f8f9fa;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .summary-table th {
            background: linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%);
        }

        .summary-table tbody tr:nth-child(odd) {
            background-color: #f8f9fa;
        }

        .performance-good {
            background-color: #d4edda !important;
            color: #155724;
            font-weight: 500;
        }

        .performance-warning {
            background-color: #fff3cd !important;
            color: #856404;
            font-weight: 500;
        }

        .performance-poor {
            background-color: #f8d7da !important;
            color: #721c24;
            font-weight: 500;
        }

        .metric-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.9em;
            font-weight: 600;
        }

        .badge-excellent {
            background-color: #28a745;
            color: white;
        }

        .badge-good {
            background-color: #20c997;
            color: white;
        }

        .badge-average {
            background-color: #ffc107;
            color: #212529;
        }

        .badge-poor {
            background-color: #dc3545;
            color: white;
        }

        .legend {
            display: flex;
            gap: 20px;
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            flex-wrap: wrap;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }

        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            color: #6c757d;
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }

            .content {
                padding: 20px;
            }

            table {
                font-size: 0.85em;
            }

            th, td {
                padding: 10px 8px;
            }
        }
    </style>`;
    }
}
