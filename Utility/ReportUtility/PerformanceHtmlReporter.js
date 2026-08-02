import fs from 'fs';
import path from 'path';

class PerformanceHtmlReporter {

    constructor() {
        this.testResults = [];
    }

    addTestResult(pageName, lcp, speedIndex) {
        this.testResults.push({
            pageName: pageName,
            lcp: lcp,
            speedIndex: speedIndex,
            timestamp: new Date().toISOString()
        });
    }

    async generateHtmlReport(outputFileName = 'Performance_Report.html') {
        try {
            const reportsDir = path.join(process.cwd(), 'Reports');

            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            const outputPath = path.join(reportsDir, outputFileName);

            const htmlContent = this.buildHtmlContent();

            fs.writeFileSync(outputPath, htmlContent, 'utf8');

            console.log(`\n✓ Performance HTML report generated: ${outputPath}\n`);

            return outputPath;

        } catch (error) {
            console.error("Error in generating HTML report: " + error);
            throw error;
        }
    }

    buildHtmlContent() {
        const timestamp = new Date().toLocaleString();
        const totalTests = this.testResults.length;

        let tableRows = '';
        this.testResults.forEach((result, index) => {
            const rowClass = index % 2 === 0 ? 'even-row' : 'odd-row';
            tableRows += `
                <tr class="${rowClass}">
                    <td>${result.pageName}</td>
                    <td>${result.lcp !== null ? result.lcp + ' ms' : 'N/A'}</td>
                    <td>${result.speedIndex !== null ? result.speedIndex + ' ms' : 'N/A'}</td>
                </tr>
            `;
        });

        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Test Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .summary {
            padding: 20px 30px;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .summary-item {
            text-align: center;
        }

        .summary-item h3 {
            color: #6c757d;
            font-size: 0.9em;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .summary-item p {
            font-size: 1.8em;
            font-weight: bold;
            color: #495057;
        }

        .table-container {
            padding: 30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 1.1em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
            font-size: 1em;
            color: #495057;
        }

        .even-row {
            background-color: #f8f9fa;
        }

        .odd-row {
            background-color: white;
        }

        tr:hover {
            background-color: #e7f3ff;
            transition: background-color 0.3s ease;
        }

        .footer {
            padding: 20px 30px;
            background: #f8f9fa;
            text-align: center;
            color: #6c757d;
            font-size: 0.9em;
            border-top: 2px solid #e9ecef;
        }

        .metric-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.9em;
        }

        .no-data {
            text-align: center;
            padding: 40px;
            color: #6c757d;
            font-size: 1.2em;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Performance Test Report</h1>
            <p>Lighthouse Performance Metrics</p>
        </div>

        <div class="summary">
            <div class="summary-item">
                <h3>Total Pages Tested</h3>
                <p>${totalTests}</p>
            </div>
            <div class="summary-item">
                <h3>Report Generated</h3>
                <p style="font-size: 1.2em;">${timestamp}</p>
            </div>
        </div>

        <div class="table-container">
            ${totalTests > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Page Name</th>
                            <th>LCP (Largest Contentful Paint)</th>
                            <th>Speed Index</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            ` : `
                <div class="no-data">
                    No performance test results available
                </div>
            `}
        </div>

        <div class="footer">
            <p>Generated by Playwright Performance Testing Framework</p>
            <p>Powered by Google Lighthouse</p>
        </div>
    </div>
</body>
</html>
        `;

        return htmlTemplate;
    }

    static async generateSimpleReport(testResults, outputFileName = 'Performance_Report.html') {
        const reporter = new PerformanceHtmlReporter();

        testResults.forEach(result => {
            reporter.addTestResult(
                result.pageName || result.testName || 'Unknown Page',
                result.lcp !== undefined ? result.lcp : null,
                result.speedIndex !== undefined ? result.speedIndex : null
            );
        });

        return await reporter.generateHtmlReport(outputFileName);
    }
}

export default PerformanceHtmlReporter;
