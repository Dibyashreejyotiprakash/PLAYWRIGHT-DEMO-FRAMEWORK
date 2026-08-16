import metricsCollector from './UnifiedMetricsCollector.js';
import { ConsoleErrorMetric } from './UnifiedPerformanceDataModels.js';
import Test from '../ReportUtility/TestLogger.js';

/**
 * Console Error Handler
 * Attaches listeners to Playwright page to capture console errors, page errors, and network errors
 */
class ConsoleErrorHandler {
    /**
     * Attach console error listeners to a Playwright page
     * @param {Object} page - Playwright page instance
     */
    static attachErrorListeners(page) {
        Test.Log.Info('Attaching console error listeners to page');

        // Console errors (console.error, console.warn)
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const error = new ConsoleErrorMetric();
                error.type = 'error';
                error.message = msg.text();
                error.timestamp = new Date();
                error.pageUrl = page.url();
                metricsCollector.addConsoleError(error);

                Test.Log.Warning(`Console Error: ${error.message}`);
            }
        });

        // Page errors (uncaught exceptions)
        page.on('pageerror', err => {
            const error = new ConsoleErrorMetric();
            error.type = 'page-error';
            error.message = err.message || err.toString();
            error.timestamp = new Date();
            error.pageUrl = page.url();
            metricsCollector.addConsoleError(error);

            Test.Log.Warning(`Page Error: ${error.message}`);
        });

        // Network errors (failed requests, 4xx, 5xx)
        page.on('response', async response => {
            const status = response.status();
            if (status >= 400) {
                const error = new ConsoleErrorMetric();
                error.type = 'network-error';
                error.message = `HTTP ${status} - ${response.statusText()}`;
                error.timestamp = new Date();
                error.pageUrl = page.url();
                error.statusCode = status;
                error.url = response.url();
                metricsCollector.addConsoleError(error);

                Test.Log.Warning(`Network Error: ${error.message} - ${error.url}`);
            }
        });

        Test.Log.Pass('✓ Console error listeners attached');
    }

    /**
     * Remove all error listeners from page
     * @param {Object} page - Playwright page instance
     */
    static removeErrorListeners(page) {
        page.removeAllListeners('console');
        page.removeAllListeners('pageerror');
        page.removeAllListeners('response');
        Test.Log.Info('Console error listeners removed');
    }

    /**
     * Get error counts by type
     * @returns {Object} - Error counts { jsErrors, pageErrors, networkErrors, total }
     */
    static getErrorCounts() {
        const allErrors = metricsCollector.getAllMetrics().consoleErrors;
        return {
            jsErrors: allErrors.filter(e => e.type === 'error').length,
            pageErrors: allErrors.filter(e => e.type === 'page-error').length,
            networkErrors: allErrors.filter(e => e.type === 'network-error').length,
            error400s: allErrors.filter(e => e.type === 'network-error' && e.statusCode >= 400 && e.statusCode < 500).length,
            error500s: allErrors.filter(e => e.type === 'network-error' && e.statusCode >= 500).length,
            total: allErrors.length
        };
    }
}

export default ConsoleErrorHandler;
