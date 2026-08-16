import fs from 'fs';
import path from 'path';
import Test from '../ReportUtility/TestLogger.js';

/**
 * Unified Performance Report Generator
 * Generates comprehensive HTML reports with Chart.js visualizations
 * Includes: Page metrics, API metrics, Health checks, Functional flows, Console errors
 */
class UnifiedReportGenerator {
    constructor() {
        this._data = null;
    }

    /**
     * Generate unified performance report
     * @param {string} filePath - Output HTML file path
     * @param {UnifiedPerformanceData} data - All metrics data
     * @param {string} businessUnit - Business unit name
     * @param {string} environment - Environment (QA/Stage/Prod)
     */
    generateReport(filePath, data, businessUnit, environment) {
        this._data = data;
        this._data.metadata.businessUnit = businessUnit;
        this._data.metadata.environment = environment;
        this._data.metadata.generatedAt = new Date();

        Test.Log.Info('Generating unified performance report...');

        const html = this._buildReportHtml();
        fs.writeFileSync(filePath, html, 'utf-8');

        Test.Log.Pass(`✓ Unified Performance Report generated: ${filePath}`);
    }

    /**
     * Build complete HTML report
     * @returns {string} - HTML content
     * @private
     */
    _buildReportHtml() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AnsiraCreateBB Unified Performance Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    ${this._getStyles()}
</head>
<body>
    <div class="container">
        ${this._buildHeader()}
        ${this._buildSummaryCards()}
        ${this._buildChartsSection()}
        ${this._buildPageMetricsSection()}
        ${this._buildFunctionalFlowsSection()}
        ${this._buildHealthChecksSection()}
        ${this._buildApiMetricsSection()}
        ${this._buildFooter()}
    </div>
    ${this._getChartScripts()}
</body>
</html>`;
    }

    /**
     * Build header section
     * @private
     */
    _buildHeader() {
        const timestamp = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return `
        <div class="header">
            <h1>🚀 AnsiraCreateBB Performance Report</h1>
            <div class="subtitle">Unified Performance Analysis - ${this._data.metadata.environment.toUpperCase()} Environment</div>
            <div class="report-info">
                <div class="report-info-item"><span>🏢</span><span>Business Unit: ${this._data.metadata.businessUnit}</span></div>
                <div class="report-info-item"><span>📅</span><span>Generated: ${timestamp}</span></div>
                ${this._data.metadata.jmxFileName ? `<div class="report-info-item"><span>🔧</span><span>JMX: ${this._data.metadata.jmxFileName}</span></div>` : ''}
            </div>
        </div>`;
    }

    /**
     * Build summary cards section
     * @private
     */
    _buildSummaryCards() {
        const healthyCount = this._data.healthCheckMetrics.filter(h => h.status === 'Healthy').length;
        const healthPercentage = this._data.healthCheckMetrics.length > 0
            ? Math.round((healthyCount / this._data.healthCheckMetrics.length) * 100)
            : 0;

        const passedFlows = this._data.functionalFlows.filter(f => f.passed).length;
        const flowPercentage = this._data.functionalFlows.length > 0
            ? Math.round((passedFlows / this._data.functionalFlows.length) * 100)
            : 0;

        return `
        <div class="summary-cards">
            <div class="summary-card">
                <div class="card-icon">🔧</div>
                <div class="card-content">
                    <div class="card-value">${this._data.apiMetrics.length}</div>
                    <div class="card-label">Total API Services</div>
                </div>
            </div>
            <div class="summary-card">
                <div class="card-icon">❤️</div>
                <div class="card-content">
                    <div class="card-value">${healthPercentage}%</div>
                    <div class="card-label">API Health Status</div>
                </div>
            </div>
            <div class="summary-card">
                <div class="card-icon">✅</div>
                <div class="card-content">
                    <div class="card-value">${flowPercentage}%</div>
                    <div class="card-label">Functional Tests</div>
                </div>
            </div>
            <div class="summary-card">
                <div class="card-icon">📡</div>
                <div class="card-content">
                    <div class="card-value">${this._data.healthCheckMetrics.length}</div>
                    <div class="card-label">Total Endpoints</div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Build charts section
     * @private
     */
    _buildChartsSection() {
        return `
        <div class="section">
            <h2 class="section-title">📊 Performance Analytics</h2>
            <div class="charts-grid">
                <div class="chart-container">
                    <canvas id="lcpChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="healthChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="apiResponseChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="flowChart"></canvas>
                </div>
            </div>
        </div>`;
    }

    /**
     * Build page metrics section
     * @private
     */
    _buildPageMetricsSection() {
        if (this._data.pageMetrics.length === 0) {
            return '';
        }

        return `
        <div class="section">
            <h2 class="section-title">⚡ Page Load Time Metrics</h2>
            <div class="table-wrapper">
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>Page Name</th>
                            <th>Avg LCP (sec)</th>
                            <th>Avg Speed Index (sec)</th>
                            <th>LCP Rating</th>
                            <th>Speed Index Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._buildPageMetricsRows()}
                    </tbody>
                </table>
            </div>

            <h3 class="subsection-title">Detailed Performance Metrics</h3>
            <div class="table-wrapper">
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
                    <tbody>
                        ${this._buildDetailedPageMetricsRows()}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    /**
     * Build page metrics summary rows
     * @private
     */
    _buildPageMetricsRows() {
        return this._data.pageMetrics.map(metric => {
            const avgLcpSec = metric.avgLcp !== null ? (metric.avgLcp / 1000).toFixed(2) : 'N/A';
            const avgSpeedSec = metric.avgSpeedIndex !== null ? (metric.avgSpeedIndex / 1000).toFixed(2) : 'N/A';
            const lcpRating = this._getPerformanceRatingBadge(metric.avgLcp ? metric.avgLcp / 1000 : null, true);
            const speedRating = this._getPerformanceRatingBadge(metric.avgSpeedIndex ? metric.avgSpeedIndex / 1000 : null, false);

            return `
                        <tr>
                            <td><strong>${metric.pageName}</strong></td>
                            <td>${avgLcpSec}</td>
                            <td>${avgSpeedSec}</td>
                            <td>${lcpRating}</td>
                            <td>${speedRating}</td>
                        </tr>`;
        }).join('');
    }

    /**
     * Build detailed page metrics rows
     * @private
     */
    _buildDetailedPageMetricsRows() {
        return this._data.pageMetrics.map(metric => {
            const lcpStrs = metric.lcpRuns.map(x => x !== null ? (x / 1000).toFixed(2) : 'N/A');
            const speedStrs = metric.speedIndexRuns.map(x => x !== null ? (x / 1000).toFixed(2) : 'N/A');
            const avgLcp = metric.avgLcp !== null ? (metric.avgLcp / 1000).toFixed(2) : 'N/A';
            const avgSpeed = metric.avgSpeedIndex !== null ? (metric.avgSpeedIndex / 1000).toFixed(2) : 'N/A';
            const rowClass = this._getRowClass(metric.avgLcp ? metric.avgLcp / 1000 : null);

            return `
                        <tr class="${rowClass}">
                            <td><strong>${metric.pageName}</strong></td>
                            <td>${lcpStrs[0] || 'N/A'}</td>
                            <td>${lcpStrs[1] || 'N/A'}</td>
                            <td>${lcpStrs[2] || 'N/A'}</td>
                            <td>${avgLcp}</td>
                            <td>${speedStrs[0] || 'N/A'}</td>
                            <td>${speedStrs[1] || 'N/A'}</td>
                            <td>${speedStrs[2] || 'N/A'}</td>
                            <td>${avgSpeed}</td>
                        </tr>`;
        }).join('');
    }

    /**
     * Build functional flows section
     * @private
     */
    _buildFunctionalFlowsSection() {
        if (this._data.functionalFlows.length === 0) {
            return '';
        }

        return `
        <div class="section">
            <h2 class="section-title">🔄 Functional Flow Validation</h2>
            ${this._data.functionalFlows.map((flow, index) => this._buildFlowCard(flow, index)).join('')}
        </div>`;
    }

    /**
     * Build individual flow card
     * @private
     */
    _buildFlowCard(flow, index) {
        const statusIcon = flow.passed ? '✅' : '❌';
        const statusClass = flow.passed ? 'flow-passed' : 'flow-failed';
        const totalErrors = flow.jsErrorCount + flow.otherConsoleErrorCount + flow.error400Count + flow.error500Count;

        return `
            <div class="collapsible-section">
                <div class="collapsible-header ${statusClass}" onclick="toggleCollapse('flow-${index}')">
                    <span class="collapse-icon" id="icon-flow-${index}">▼</span>
                    <span>${statusIcon} ${flow.flowName}</span>
                    <span class="flow-info">
                        Category: ${flow.category} |
                        Steps: ${flow.stepLogs.length} |
                        Errors: ${totalErrors}
                    </span>
                </div>
                <div class="collapsible-content" id="flow-${index}">
                    <div class="flow-details">
                        <div class="flow-meta">
                            <p><strong>Execution Time:</strong> ${flow.executionTime.toLocaleString()}</p>
                            <p><strong>Status:</strong> ${flow.passed ? 'Passed ✅' : 'Failed ❌'}</p>
                            ${flow.errorMessage ? `<p class="error-message"><strong>Error:</strong> ${flow.errorMessage}</p>` : ''}
                        </div>
                        <div class="error-summary">
                            <h4>Error Summary</h4>
                            <ul>
                                <li>JS Errors: <span class="${flow.jsErrorCount > 0 ? 'error-count' : ''}">${flow.jsErrorCount}</span></li>
                                <li>Console Errors: <span class="${flow.otherConsoleErrorCount > 0 ? 'error-count' : ''}">${flow.otherConsoleErrorCount}</span></li>
                                <li>4xx Errors: <span class="${flow.error400Count > 0 ? 'error-count' : ''}">${flow.error400Count}</span></li>
                                <li>5xx Errors: <span class="${flow.error500Count > 0 ? 'error-count' : ''}">${flow.error500Count}</span></li>
                            </ul>
                        </div>
                        <div class="step-logs">
                            <h4>Step Logs</h4>
                            <table class="step-table">
                                <thead>
                                    <tr>
                                        <th>Step</th>
                                        <th>Duration (s)</th>
                                        <th>Console Errors</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${flow.stepLogs.map(step => `
                                    <tr>
                                        <td><strong>${step.stepName}</strong></td>
                                        <td>${step.duration.toFixed(2)}</td>
                                        <td>${step.consoleErrors.length}</td>
                                    </tr>
                                    ${step.consoleErrors.length > 0 ? `
                                    <tr class="step-errors">
                                        <td colspan="3">
                                            <ul class="error-list">
                                                ${step.consoleErrors.map(err => `
                                                <li><span class="error-type">${err.type}:</span> ${err.message}</li>
                                                `).join('')}
                                            </ul>
                                        </td>
                                    </tr>` : ''}
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    /**
     * Build health checks section
     * @private
     */
    _buildHealthChecksSection() {
        if (this._data.healthCheckMetrics.length === 0) {
            return '';
        }

        return `
        <div class="section">
            <h2 class="section-title">❤️ API Health Checks</h2>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Version</th>
                            <th>Namespace</th>
                            <th>Status</th>
                            <th>Response Time (ms)</th>
                            <th>Status Code</th>
                            <th>Server Masked</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._buildHealthCheckRows()}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    /**
     * Build health check rows
     * @private
     */
    _buildHealthCheckRows() {
        return this._data.healthCheckMetrics.map(health => {
            const statusBadge = this._getHealthStatusBadge(health.status);
            const serverMaskBadge = this._getServerMaskBadge(health.serverMasked);
            const rowClass = health.status === 'Healthy' ? 'health-good' : 'health-poor';

            return `
                        <tr class="${rowClass}">
                            <td><strong>${health.name}</strong></td>
                            <td>${health.version}</td>
                            <td>${health.namespace}</td>
                            <td>${statusBadge}</td>
                            <td>${health.responseTime}</td>
                            <td>${health.statusCode || 'N/A'}</td>
                            <td>${serverMaskBadge}</td>
                        </tr>`;
        }).join('');
    }

    /**
     * Build API metrics section
     * @private
     */
    _buildApiMetricsSection() {
        if (this._data.apiMetrics.length === 0) {
            return '';
        }

        // Group by thread group
        const grouped = this._groupApiMetricsByThreadGroup();

        return `
        <div class="section">
            <h2 class="section-title">🔧 API Service Performance</h2>
            ${Object.entries(grouped).map(([threadGroup, metrics], index) =>
                this._buildApiThreadGroupCard(threadGroup, metrics, index)
            ).join('')}
        </div>`;
    }

    /**
     * Build API thread group card
     * @private
     */
    _buildApiThreadGroupCard(threadGroup, metrics, index) {
        const avgResponseTime = Math.round(metrics.reduce((sum, m) => sum + m.avgResponseTime, 0) / metrics.length);
        const totalSamples = metrics.reduce((sum, m) => sum + m.totalSamples, 0);
        const totalErrors = metrics.reduce((sum, m) => sum + m.failureCount, 0);

        return `
            <div class="collapsible-section">
                <div class="collapsible-header" onclick="toggleCollapse('api-${index}')">
                    <span class="collapse-icon" id="icon-api-${index}">▼</span>
                    <span>📁 ${threadGroup}</span>
                    <span class="api-info">
                        Services: ${metrics.length} |
                        Avg Response: ${avgResponseTime}ms |
                        Samples: ${totalSamples} |
                        Errors: ${totalErrors}
                    </span>
                </div>
                <div class="collapsible-content" id="api-${index}">
                    <div class="table-wrapper">
                        <table class="api-table">
                            <thead>
                                <tr>
                                    <th>Service / Endpoint</th>
                                    <th>Avg (ms)</th>
                                    <th>Min (ms)</th>
                                    <th>Max (ms)</th>
                                    <th>Throughput</th>
                                    <th>Samples</th>
                                    <th>Success</th>
                                    <th>Failures</th>
                                    <th>Error %</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${metrics.map(metric => {
                                    const rowClass = metric.errorRate > 5 ? 'api-error' : metric.errorRate > 0 ? 'api-warning' : 'api-success';
                                    return `
                                <tr class="${rowClass}">
                                    <td><strong>${metric.serviceName}</strong></td>
                                    <td>${metric.avgResponseTime}</td>
                                    <td>${metric.minResponseTime}</td>
                                    <td>${metric.maxResponseTime}</td>
                                    <td>${metric.throughput}</td>
                                    <td>${metric.totalSamples}</td>
                                    <td>${metric.successCount}</td>
                                    <td>${metric.failureCount}</td>
                                    <td>${metric.errorRate}%</td>
                                </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
    }

    /**
     * Build footer
     * @private
     */
    _buildFooter() {
        return `
        <div class="footer">
            <p>AnsiraCreateBB Automation Framework | Unified Performance Report</p>
            <p>LCP: Largest Contentful Paint | SI: Speed Index | Generated with Playwright & Chart.js</p>
        </div>`;
    }

    /**
     * Get Chart.js initialization scripts
     * @private
     */
    _getChartScripts() {
        const pageLabels = this._data.pageMetrics.map(p => p.pageName);
        const lcpData = this._data.pageMetrics.map(p => p.avgLcp ? (p.avgLcp / 1000).toFixed(2) : 0);

        const healthyCount = this._data.healthCheckMetrics.filter(h => h.status === 'Healthy').length;
        const unhealthyCount = this._data.healthCheckMetrics.length - healthyCount;

        const apiLabels = this._data.apiMetrics.slice(0, 10).map(a => a.serviceName.substring(0, 30));
        const apiResponseTimes = this._data.apiMetrics.slice(0, 10).map(a => a.avgResponseTime);

        const passedFlows = this._data.functionalFlows.filter(f => f.passed).length;
        const failedFlows = this._data.functionalFlows.length - passedFlows;

        return `
        <script>
            // LCP Bar Chart
            if (document.getElementById('lcpChart')) {
                const lcpCtx = document.getElementById('lcpChart').getContext('2d');
                new Chart(lcpCtx, {
                    type: 'bar',
                    data: {
                        labels: ${JSON.stringify(pageLabels)},
                        datasets: [{
                            label: 'LCP (seconds)',
                            data: ${JSON.stringify(lcpData)},
                            backgroundColor: 'rgba(102, 126, 234, 0.8)',
                            borderColor: 'rgba(102, 126, 234, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Page Load Performance (LCP)',
                                font: { size: 16, weight: 'bold' }
                            },
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: 'Seconds' }
                            }
                        }
                    }
                });
            }

            // Health Doughnut Chart
            if (document.getElementById('healthChart')) {
                const healthCtx = document.getElementById('healthChart').getContext('2d');
                new Chart(healthCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Healthy', 'Unhealthy'],
                        datasets: [{
                            data: [${healthyCount}, ${unhealthyCount}],
                            backgroundColor: ['#28a745', '#dc3545'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'API Health Distribution',
                                font: { size: 16, weight: 'bold' }
                            }
                        }
                    }
                });
            }

            // API Response Time Horizontal Bar Chart
            if (document.getElementById('apiResponseChart')) {
                const apiCtx = document.getElementById('apiResponseChart').getContext('2d');
                new Chart(apiCtx, {
                    type: 'bar',
                    data: {
                        labels: ${JSON.stringify(apiLabels)},
                        datasets: [{
                            label: 'Avg Response Time (ms)',
                            data: ${JSON.stringify(apiResponseTimes)},
                            backgroundColor: 'rgba(32, 201, 151, 0.8)',
                            borderColor: 'rgba(32, 201, 151, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'API Response Times (Top 10)',
                                font: { size: 16, weight: 'bold' }
                            },
                            legend: { display: false }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                title: { display: true, text: 'Milliseconds' }
                            }
                        }
                    }
                });
            }

            // Functional Flow Pie Chart
            if (document.getElementById('flowChart')) {
                const flowCtx = document.getElementById('flowChart').getContext('2d');
                new Chart(flowCtx, {
                    type: 'pie',
                    data: {
                        labels: ['Passed', 'Failed'],
                        datasets: [{
                            data: [${passedFlows}, ${failedFlows}],
                            backgroundColor: ['#28a745', '#dc3545'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Functional Flow Status',
                                font: { size: 16, weight: 'bold' }
                            }
                        }
                    }
                });
            }

            // Collapsible section toggle
            function toggleCollapse(id) {
                const content = document.getElementById(id);
                const icon = document.getElementById('icon-' + id);
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    icon.textContent = '▼';
                } else {
                    content.style.display = 'none';
                    icon.textContent = '▶';
                }
            }
        </script>`;
    }

    /**
     * Get CSS styles
     * @private
     */
    _getStyles() {
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
            max-width: 1600px;
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

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }

        .summary-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }

        .summary-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .card-icon {
            font-size: 2.5em;
        }

        .card-content {
            flex: 1;
        }

        .card-value {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }

        .card-label {
            font-size: 0.9em;
            color: #6c757d;
            margin-top: 5px;
        }

        .section {
            padding: 40px;
            border-bottom: 1px solid #ecf0f1;
        }

        .section:last-child {
            border-bottom: none;
        }

        .section-title {
            font-size: 1.8em;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            font-weight: 400;
        }

        .subsection-title {
            font-size: 1.3em;
            color: #764ba2;
            margin: 30px 0 15px 0;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-top: 20px;
        }

        .chart-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            margin-top: 20px;
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

        .health-good {
            background-color: #d4edda !important;
        }

        .health-poor {
            background-color: #f8d7da !important;
        }

        .api-success {
            background-color: #d4edda !important;
        }

        .api-warning {
            background-color: #fff3cd !important;
        }

        .api-error {
            background-color: #f8d7da !important;
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

        .badge-healthy {
            background-color: #28a745;
            color: white;
        }

        .badge-unhealthy {
            background-color: #dc3545;
            color: white;
        }

        .badge-masked {
            background-color: #28a745;
            color: white;
        }

        .badge-exposed {
            background-color: #ffc107;
            color: #212529;
        }

        .collapsible-section {
            margin: 20px 0;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
        }

        .collapsible-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transition: opacity 0.2s;
        }

        .collapsible-header:hover {
            opacity: 0.9;
        }

        .collapsible-header.flow-passed {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }

        .collapsible-header.flow-failed {
            background: linear-gradient(135deg, #dc3545 0%, #e83e8c 100%);
        }

        .collapse-icon {
            font-size: 0.8em;
            transition: transform 0.3s;
        }

        .flow-info, .api-info {
            margin-left: auto;
            font-size: 0.9em;
            opacity: 0.9;
        }

        .collapsible-content {
            padding: 20px;
            display: none;
        }

        .flow-details {
            display: grid;
            gap: 20px;
        }

        .flow-meta, .error-summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
        }

        .flow-meta p {
            margin: 5px 0;
        }

        .error-message {
            color: #dc3545;
            font-style: italic;
        }

        .error-summary h4 {
            margin-bottom: 10px;
            color: #667eea;
        }

        .error-summary ul {
            list-style: none;
        }

        .error-summary li {
            padding: 5px 0;
        }

        .error-count {
            color: #dc3545;
            font-weight: bold;
        }

        .step-logs h4 {
            margin: 20px 0 10px 0;
            color: #667eea;
        }

        .step-table {
            font-size: 0.9em;
        }

        .step-errors {
            background: #fff3cd !important;
        }

        .error-list {
            list-style: none;
            padding: 10px;
            margin: 0;
        }

        .error-list li {
            padding: 5px 0;
            border-bottom: 1px solid #dee2e6;
        }

        .error-list li:last-child {
            border-bottom: none;
        }

        .error-type {
            color: #dc3545;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.85em;
        }

        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            color: #6c757d;
            font-size: 0.9em;
        }

        .footer p {
            margin: 5px 0;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }

            .summary-cards {
                grid-template-columns: 1fr;
            }

            .charts-grid {
                grid-template-columns: 1fr;
            }

            .section {
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
     * Helper methods
     */

    _getPerformanceRatingBadge(value, isLcp) {
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

    _getRowClass(avgLcp) {
        if (avgLcp === null) return '';
        if (avgLcp > 5) return 'performance-poor';
        if (avgLcp < 3) return 'performance-good';
        return 'performance-warning';
    }

    _getHealthStatusBadge(status) {
        if (status === 'Healthy') {
            return '<span class="metric-badge badge-healthy">Healthy</span>';
        } else {
            return '<span class="metric-badge badge-unhealthy">' + status + '</span>';
        }
    }

    _getServerMaskBadge(serverMasked) {
        if (serverMasked === true) {
            return '<span class="metric-badge badge-masked">✓ Masked</span>';
        } else if (serverMasked === false) {
            return '<span class="metric-badge badge-exposed">⚠ Exposed</span>';
        }
        return '<span class="metric-badge badge-average">N/A</span>';
    }

    _groupApiMetricsByThreadGroup() {
        const grouped = {};
        this._data.apiMetrics.forEach(metric => {
            const group = metric.threadGroup || 'Default';
            if (!grouped[group]) {
                grouped[group] = [];
            }
            grouped[group].push(metric);
        });
        return grouped;
    }
}

export default UnifiedReportGenerator;
