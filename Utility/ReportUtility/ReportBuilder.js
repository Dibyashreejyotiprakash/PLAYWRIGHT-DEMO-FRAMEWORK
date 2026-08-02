/**
 * ReportBuilder - Generates HTML report with Bootstrap styling
 * Creates a comprehensive test execution report with summary statistics and detailed logs
 */

export default class ReportBuilder {

    /**
     * Generate complete HTML report
     * @param {Object} reportData - Report data including tests, summary, timestamps
     * @returns {string} - Complete HTML content
     */
    static generateHTML(reportData) {
        const { summary, tests, startTime, endTime } = reportData;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Test Report</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --pass-color: #198754;
            --fail-color: #dc3545;
            --skip-color: #ffc107;
            --info-color: #0dcaf0;
            --warning-color: #fd7e14;
        }
        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }
        .summary-card {
            border: none;
            box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
            transition: transform 0.2s;
        }
        .summary-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
        }
        .stat-label {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .test-row {
            background: white;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
        }
        .test-header {
            padding: 1rem;
            cursor: pointer;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
        }
        .test-header:hover {
            background-color: #f8f9fa;
        }
        .test-body {
            padding: 1rem;
            border-top: 1px solid #dee2e6;
        }
        .log-entry {
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border-left: 3px solid;
            background-color: #f8f9fa;
            border-radius: 0.25rem;
        }
        .log-entry.info { border-left-color: var(--info-color); }
        .log-entry.pass { border-left-color: var(--pass-color); }
        .log-entry.fail { border-left-color: var(--fail-color); }
        .log-entry.error { border-left-color: var(--fail-color); }
        .log-entry.warning { border-left-color: var(--warning-color); }
        .log-entry.skip { border-left-color: var(--skip-color); }
        .screenshot-thumb {
            max-width: 200px;
            cursor: pointer;
            border: 2px solid #dee2e6;
            border-radius: 0.25rem;
            margin-top: 0.5rem;
        }
        .screenshot-thumb:hover {
            border-color: var(--info-color);
        }
        .badge-pass { background-color: var(--pass-color); }
        .badge-fail { background-color: var(--fail-color); }
        .badge-skip { background-color: var(--skip-color); }
        @media print {
            .test-body { display: block !important; }
            .header { background: #667eea; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="container">
            <h1 class="display-4"><i class="bi bi-clipboard-data"></i> Custom Test Report</h1>
            <p class="lead">Automated Test Execution Summary</p>
            <p class="mb-0">
                <i class="bi bi-calendar3"></i> ${this.formatTimestamp(startTime)} - ${this.formatTimestamp(endTime)}
                <span class="ms-3"><i class="bi bi-clock"></i> Duration: ${this.calculateDuration(startTime, endTime)}</span>
            </p>
        </div>
    </div>

    <!-- Summary Cards -->
    <div class="container mb-4">
        <div class="row g-4">
            <div class="col-md-3">
                <div class="card summary-card text-center">
                    <div class="card-body">
                        <i class="bi bi-list-check fs-1 text-primary"></i>
                        <div class="stat-value text-primary">${summary.total}</div>
                        <div class="stat-label text-muted">Total Tests</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card summary-card text-center">
                    <div class="card-body">
                        <i class="bi bi-check-circle fs-1" style="color: var(--pass-color);"></i>
                        <div class="stat-value" style="color: var(--pass-color);">${summary.passed}</div>
                        <div class="stat-label text-muted">Passed</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card summary-card text-center">
                    <div class="card-body">
                        <i class="bi bi-x-circle fs-1" style="color: var(--fail-color);"></i>
                        <div class="stat-value" style="color: var(--fail-color);">${summary.failed}</div>
                        <div class="stat-label text-muted">Failed</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card summary-card text-center">
                    <div class="card-body">
                        <i class="bi bi-skip-forward-circle fs-1" style="color: var(--skip-color);"></i>
                        <div class="stat-value" style="color: var(--skip-color);">${summary.skipped}</div>
                        <div class="stat-label text-muted">Skipped</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pass Percentage -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Pass Rate</h5>
                        <div class="progress" style="height: 30px;">
                            <div class="progress-bar bg-success" role="progressbar"
                                 style="width: ${summary.passPercentage}%;"
                                 aria-valuenow="${summary.passPercentage}"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                                ${summary.passPercentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Test Details -->
    <div class="container mb-5">
        <h2 class="mb-4"><i class="bi bi-file-earmark-text"></i> Test Details</h2>
        ${this.generateTestRows(tests)}
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3 mt-5">
        <div class="container">
            <p class="mb-0">Generated on ${this.formatTimestamp(new Date())} | Playwright Custom Reporter</p>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Toggle test details
        function toggleTest(testId) {
            const body = document.getElementById('test-body-' + testId);
            const icon = document.getElementById('icon-' + testId);
            if (body.style.display === 'none' || body.style.display === '') {
                body.style.display = 'block';
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-up');
            } else {
                body.style.display = 'none';
                icon.classList.remove('bi-chevron-up');
                icon.classList.add('bi-chevron-down');
            }
        }

        // Expand screenshot
        function expandScreenshot(imgSrc) {
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center;';
            modal.onclick = () => modal.remove();

            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.cssText = 'max-width: 90%; max-height: 90%; border: 2px solid white;';

            modal.appendChild(img);
            document.body.appendChild(modal);
        }
    </script>
</body>
</html>`;
    }

    /**
     * Generate test rows HTML
     * @param {Array} tests
     * @returns {string}
     */
    static generateTestRows(tests) {
        if (!tests || tests.length === 0) {
            return '<div class="alert alert-info">No tests executed</div>';
        }

        return tests.map((test, index) => {
            const statusBadge = this.getStatusBadge(test.status);
            const logs = test.logs || [];

            return `
            <div class="test-row">
                <div class="test-header" onclick="toggleTest(${index})">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h5 class="mb-1">
                                <i class="bi bi-chevron-down" id="icon-${index}"></i>
                                ${test.testName}
                            </h5>
                            <small class="text-muted">${test.testFile}</small>
                        </div>
                        <div class="col-md-3">
                            ${statusBadge}
                        </div>
                        <div class="col-md-3 text-end">
                            <small class="text-muted">
                                <i class="bi bi-stopwatch"></i> ${test.duration}ms
                            </small>
                        </div>
                    </div>
                </div>
                <div class="test-body" id="test-body-${index}" style="display: none;">
                    ${logs.length > 0 ? this.generateLogs(logs) : '<p class="text-muted">No logs available</p>'}
                    ${test.error ? `<div class="alert alert-danger mt-3"><strong>Error:</strong> ${test.error}</div>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    /**
     * Generate logs HTML
     * @param {Array} logs
     * @returns {string}
     */
    static generateLogs(logs) {
        return `
        <div class="logs-container">
            <h6 class="mb-3"><i class="bi bi-journal-text"></i> Execution Logs</h6>
            ${logs.map(log => `
                <div class="log-entry ${log.level}">
                    <div class="d-flex justify-content-between">
                        <div>
                            <i class="bi ${this.getLogIcon(log.level)}"></i>
                            <strong>${log.message}</strong>
                            ${log.details ? `<div class="ms-4 mt-1"><small>${JSON.stringify(log.details)}</small></div>` : ''}
                        </div>
                        <small class="text-muted">${this.formatTimestamp(log.timestamp)}</small>
                    </div>
                    ${log.screenshot ? `
                        <img src="${log.screenshot}"
                             class="screenshot-thumb"
                             alt="Screenshot"
                             onclick="expandScreenshot('${log.screenshot}')"
                             title="Click to expand">
                    ` : ''}
                </div>
            `).join('')}
        </div>`;
    }

    /**
     * Get status badge HTML
     * @param {string} status
     * @returns {string}
     */
    static getStatusBadge(status) {
        const badges = {
            passed: '<span class="badge badge-pass"><i class="bi bi-check-circle"></i> Passed</span>',
            failed: '<span class="badge badge-fail"><i class="bi bi-x-circle"></i> Failed</span>',
            skipped: '<span class="badge badge-skip"><i class="bi bi-skip-forward"></i> Skipped</span>'
        };
        return badges[status] || '<span class="badge bg-secondary">Unknown</span>';
    }

    /**
     * Get log level icon
     * @param {string} level
     * @returns {string}
     */
    static getLogIcon(level) {
        const icons = {
            info: 'bi-info-circle-fill text-info',
            pass: 'bi-check-circle-fill text-success',
            fail: 'bi-x-circle-fill text-danger',
            error: 'bi-exclamation-triangle-fill text-danger',
            warning: 'bi-exclamation-circle-fill text-warning',
            skip: 'bi-skip-forward-fill text-warning'
        };
        return icons[level] || 'bi-circle-fill';
    }

    /**
     * Format timestamp
     * @param {string|Date} timestamp
     * @returns {string}
     */
    static formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Calculate duration between two timestamps
     * @param {string|Date} start
     * @param {string|Date} end
     * @returns {string}
     */
    static calculateDuration(start, end) {
        if (!start || !end) return 'N/A';
        const diff = new Date(end) - new Date(start);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}
