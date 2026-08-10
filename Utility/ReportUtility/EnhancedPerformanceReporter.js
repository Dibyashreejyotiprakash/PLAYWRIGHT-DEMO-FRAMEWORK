import fs from 'fs';
import path from 'path';

/**
 * Enhanced Performance HTML Reporter
 * Generates comprehensive performance reports with multiple runs per page
 * Matches the C# ReportGenerator format
 */
class EnhancedPerformanceReporter {

    constructor() {
        this.rows = [];
    }

    /**
     * Add performance result with multiple runs
     * @param {Array<number>} lcpRuns - Array of LCP values in milliseconds (3 runs)
     * @param {Array<number>} speedIndexRuns - Array of Speed Index values in milliseconds (3 runs)
     * @param {string} pageName - Name of the page
     */
    addResult(lcpRuns, speedIndexRuns, pageName) {
        this.rows.push({
            lcpRuns: lcpRuns || [null, null, null],
            speedIndexRuns: speedIndexRuns || [null, null, null],
            pageName: pageName
        });
    }

    /**
     * Generate comprehensive HTML report
     * @param {string} filePath - Output file path
     * @param {string} buName - Business unit name
     * @param {string} environment - Environment name (PROD, STAGE, QA)
     * @returns {string} - Path to generated report
     */
    generateReport(filePath, buName = null, environment = 'PROD') {
        const htmlContent = this.buildHtmlContent(buName, environment);

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, htmlContent, 'utf8');
        console.log(`\n✓ Enhanced Performance Report generated: ${filePath}\n`);

        return filePath;
    }

    /**
     * Build complete HTML content
     */
    buildHtmlContent(buName, environment) {
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const totalPages = this.rows.length;
        const header = buName || "AnsiraCreateBB Pageload Time Report";

        let html = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>AnsiraCreateBB Pageload Time Report</title>
    ${this.getModernStyles()}
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>AnsiraCreateBB Pageload Time Report</h1>
            <div class='subtitle'>${header}</div>
            <div class='report-info'>
                <div class='report-info-item'><span>📊</span><span>${totalPages} Pages Tested</span></div>
                <div class='report-info-item'><span>🔄</span><span>3 Test Runs</span></div>
                <div class='report-info-item'><span>📅</span><span>Generated: ${timestamp}</span></div>
                <div class='report-info-item'><span>🌐</span><span>Environment: ${environment}</span></div>
            </div>
        </div>
        <div class='content'>
            ${this.buildPerformanceSummarySection()}
            ${this.buildDetailedMetricsSection()}
        </div>
        <div class='footer'>
            <p>AnsiraCreateBB Automation Framework | Pageload Time Report</p>
            <p>LCP: Largest Contentful Paint | SI: Speed Index</p>
        </div>
    </div>
</body>
</html>`;

        return html;
    }

    /**
     * Build Performance Summary Section
     */
    buildPerformanceSummarySection() {
        let summaryRows = '';

        this.rows.forEach(row => {
            const avgLcp = this.calculateAverage(row.lcpRuns);
            const avgSpeed = this.calculateAverage(row.speedIndexRuns);

            const avgLcpStr = avgLcp !== null ? (avgLcp / 1000).toFixed(2) : 'N/A';
            const avgSpeedStr = avgSpeed !== null ? (avgSpeed / 1000).toFixed(2) : 'N/A';

            const lcpRating = this.getPerformanceRating(avgLcp, true);
            const speedRating = this.getPerformanceRating(avgSpeed, false);

            summaryRows += `
                            <tr>
                                <td><strong>${row.pageName}</strong></td>
                                <td>${avgLcpStr}</td>
                                <td>${avgSpeedStr}</td>
                                <td>${lcpRating}</td>
                                <td>${speedRating}</td>
                            </tr>`;
        });

        return `
            <div class='section'>
                <h2 class='section-title'>Performance Summary</h2>
                <div class='table-wrapper'>
                    <table class='summary-table'>
                        <thead>
                            <tr>
                                <th>Page Name</th>
                                <th>Avg LCP (sec)</th>
                                <th>Avg Speed Index (sec)</th>
                                <th>LCP Rating</th>
                                <th>Speed Index Rating</th>
                            </tr>
                        </thead>
                        <tbody>${summaryRows}
                        </tbody>
                    </table>
                </div>
                ${this.buildLegend()}
            </div>`;
    }

    /**
     * Build Detailed Metrics Section
     */
    buildDetailedMetricsSection() {
        let detailedRows = '';

        this.rows.forEach(row => {
            const lcpValues = row.lcpRuns.map(v => v !== null ? (v / 1000).toFixed(2) : 'N/A');
            const speedValues = row.speedIndexRuns.map(v => v !== null ? (v / 1000).toFixed(2) : 'N/A');

            const avgLcp = this.calculateAverage(row.lcpRuns);
            const avgSpeed = this.calculateAverage(row.speedIndexRuns);

            const avgLcpStr = avgLcp !== null ? (avgLcp / 1000).toFixed(2) : 'N/A';
            const avgSpeedStr = avgSpeed !== null ? (avgSpeed / 1000).toFixed(2) : 'N/A';

            const rowClass = this.getRowClass(avgLcp);

            detailedRows += `
                            <tr class='${rowClass}'>
                                <td><strong>${row.pageName}</strong></td>
                                <td>${lcpValues[0]}</td>
                                <td>${lcpValues[1]}</td>
                                <td>${lcpValues[2]}</td>
                                <td>${avgLcpStr}</td>
                                <td>${speedValues[0]}</td>
                                <td>${speedValues[1]}</td>
                                <td>${speedValues[2]}</td>
                                <td>${avgSpeedStr}</td>
                            </tr>`;
        });

        return `
            <div class='section'>
                <h2 class='section-title'>Detailed Performance Metrics</h2>
                <div class='table-wrapper'>
                    <table>
                        <thead>
                            <tr>
                                <th>Page Name</th>
                                <th>LCP Run 1</th>
                                <th>LCP Run 2</th>
                                <th>LCP Run 3</th>
                                <th>Avg LCP</th>
                                <th>SI Run 1</th>
                                <th>SI Run 2</th>
                                <th>SI Run 3</th>
                                <th>Avg SI</th>
                            </tr>
                        </thead>
                        <tbody>${detailedRows}
                        </tbody>
                    </table>
                </div>
            </div>`;
    }

    /**
     * Build legend section
     */
    buildLegend() {
        return `
                <div class='legend'>
                    <div class='legend-item'>
                        <div class='legend-color' style='background-color: #28a745;'></div>
                        <span><strong>Excellent:</strong> LCP &lt; 1.0s, SI &lt; 1.0s</span>
                    </div>
                    <div class='legend-item'>
                        <div class='legend-color' style='background-color: #20c997;'></div>
                        <span><strong>Good:</strong> LCP 1.0-2.5s, SI 1.0-2.0s</span>
                    </div>
                    <div class='legend-item'>
                        <div class='legend-color' style='background-color: #ffc107;'></div>
                        <span><strong>Average:</strong> LCP 2.5-4.0s, SI 2.0-3.5s</span>
                    </div>
                    <div class='legend-item'>
                        <div class='legend-color' style='background-color: #dc3545;'></div>
                        <span><strong>Needs Improvement:</strong> LCP &gt; 4.0s, SI &gt; 3.5s</span>
                    </div>
                </div>`;
    }

    /**
     * Calculate average of an array (handles null values)
     */
    calculateAverage(values) {
        const validValues = values.filter(v => v !== null && v !== undefined);
        if (validValues.length === 0) return null;
        return validValues.reduce((a, b) => a + b, 0) / validValues.length;
    }

    /**
     * Get performance rating badge HTML
     */
    getPerformanceRating(value, isLcp) {
        if (value === null || value === undefined) {
            return "<span class='metric-badge badge-average'>N/A</span>";
        }

        const valueInSeconds = value / 1000;

        if (isLcp) {
            // LCP thresholds
            if (valueInSeconds < 1.0) {
                return "<span class='metric-badge badge-excellent'>Excellent</span>";
            } else if (valueInSeconds < 2.5) {
                return "<span class='metric-badge badge-good'>Good</span>";
            } else if (valueInSeconds < 4.0) {
                return "<span class='metric-badge badge-average'>Average</span>";
            } else {
                return "<span class='metric-badge badge-poor'>Needs Improvement</span>";
            }
        } else {
            // Speed Index thresholds
            if (valueInSeconds < 1.0) {
                return "<span class='metric-badge badge-excellent'>Excellent</span>";
            } else if (valueInSeconds < 2.0) {
                return "<span class='metric-badge badge-good'>Good</span>";
            } else if (valueInSeconds < 3.5) {
                return "<span class='metric-badge badge-average'>Average</span>";
            } else {
                return "<span class='metric-badge badge-poor'>Needs Improvement</span>";
            }
        }
    }

    /**
     * Get row class for detailed table based on LCP average
     */
    getRowClass(avgLcp) {
        if (avgLcp === null || avgLcp === undefined) return '';

        const valueInSeconds = avgLcp / 1000;

        if (valueInSeconds > 5.0) {
            return 'performance-poor';
        } else if (valueInSeconds < 3.0) {
            return 'performance-good';
        } else {
            return 'performance-warning';
        }
    }

    /**
     * Get modern CSS styles
     */
    getModernStyles() {
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

    /**
     * Static method to generate report from test results
     * @param {Array} testResults - Array of test results with multiple runs
     * @param {string} outputFileName - Output file name
     * @param {string} buName - Business unit name
     * @param {string} environment - Environment name
     * @returns {string} - Path to generated report
     */
    static async generateEnhancedReport(testResults, outputFileName = 'Performance_Report.html', buName = null, environment = 'PROD') {
        const reporter = new EnhancedPerformanceReporter();

        testResults.forEach(result => {
            reporter.addResult(
                result.lcpRuns || [result.lcp, result.lcp, result.lcp],
                result.speedIndexRuns || [result.speedIndex, result.speedIndex, result.speedIndex],
                result.pageName || result.testName || 'Unknown Page'
            );
        });

        const reportsDir = path.join(process.cwd(), 'Reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const outputPath = path.join(reportsDir, outputFileName);
        return reporter.generateReport(outputPath, buName, environment);
    }
}

export default EnhancedPerformanceReporter;
