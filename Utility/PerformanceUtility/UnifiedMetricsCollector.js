import { UnifiedPerformanceData, PageMetric, ApiMetric, HealthCheckMetric,
         FunctionalFlowMetric, ConsoleErrorMetric, StepLogMetric } from './UnifiedPerformanceDataModels.js';
import Test from '../ReportUtility/TestLogger.js';

/**
 * Unified Metrics Collector
 * Centralized collector for all performance metrics (Page, API, Health, Flow, Errors)
 * Singleton pattern for shared state across tests
 */
class UnifiedMetricsCollector {
    constructor() {
        this._data = new UnifiedPerformanceData();
        this._errorBuffer = []; // Temporary storage for errors during page navigation
    }

    /**
     * Set metadata for the performance report
     * @param {string} businessUnit - Business unit name
     * @param {string} environment - Environment (QA/Stage/Prod)
     * @param {string} jmxFileName - JMeter JMX file name (optional)
     */
    setMetadata(businessUnit, environment, jmxFileName = null) {
        this._data.metadata.businessUnit = businessUnit;
        this._data.metadata.environment = environment;
        if (jmxFileName) this._data.metadata.jmxFileName = jmxFileName;
        this._data.metadata.generatedAt = new Date();
    }

    /**
     * Add page performance metric
     * @param {Object} page - Playwright page instance
     * @param {string} pageName - Page name
     * @param {string} label - Label for logging (optional)
     * @param {number} numRuns - Number of measurement runs (default: 3)
     */
    async addPageMetric(page, pageName, label = null, numRuns = 3) {
        try {
            Test.Log.Info(`Collecting page metrics for: ${pageName} (${numRuns} runs)`);

            const lcpRuns = [];
            const speedIndexRuns = [];

            // Collect metrics multiple times for average
            for (let i = 0; i < numRuns; i++) {
                Test.Log.Info(`  Run ${i + 1}/${numRuns}...`);

                // Reload page for fresh metrics
                if (i > 0) {
                    await page.reload({ waitUntil: 'load', timeout: 60000 });
                }

                await page.waitForLoadState('networkidle', { timeout: 30000 });

                // Collect metrics using Performance API
                const metrics = await this._collectMetricsFromPage(page);

                if (metrics.lcp !== null) {
                    lcpRuns.push(metrics.lcp);
                }
                if (metrics.speedIndex !== null) {
                    speedIndexRuns.push(metrics.speedIndex);
                }

                // Small delay between runs
                await page.waitForTimeout(500);
            }

            // Create PageMetric object
            const pageMetric = new PageMetric();
            pageMetric.pageName = pageName;
            pageMetric.label = label || pageName;
            pageMetric.lcpRuns = lcpRuns;
            pageMetric.speedIndexRuns = speedIndexRuns;
            pageMetric.avgLcp = this._calculateAverage(lcpRuns);
            pageMetric.avgSpeedIndex = this._calculateAverage(speedIndexRuns);
            pageMetric.performanceRating = this._getPerformanceRating(pageMetric.avgLcp);

            this._data.pageMetrics.push(pageMetric);

            Test.Log.Pass(`✓ Page metrics collected: ${pageName} - Avg LCP: ${(pageMetric.avgLcp / 1000).toFixed(2)}s`);

        } catch (error) {
            Test.Log.Error(`Failed to collect page metrics for ${pageName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Collect performance metrics from page using Performance API
     * @param {Object} page - Playwright page instance
     * @returns {Object} - Performance metrics
     * @private
     */
    async _collectMetricsFromPage(page) {
        const metrics = await page.evaluate(() => {
            return new Promise((resolve) => {
                const perfData = {
                    lcp: null,
                    fcp: null,
                    ttfb: null,
                    domContentLoaded: null,
                    loadTime: null,
                    speedIndex: null
                };

                // Get Navigation Timing metrics
                const navigationTiming = performance.getEntriesByType('navigation')[0];
                if (navigationTiming) {
                    perfData.ttfb = Math.round(navigationTiming.responseStart - navigationTiming.requestStart);
                    perfData.domContentLoaded = Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart);
                    perfData.loadTime = Math.round(navigationTiming.loadEventEnd - navigationTiming.fetchStart);
                }

                // Get Paint Timing metrics (FCP)
                const paintEntries = performance.getEntriesByType('paint');
                const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
                if (fcpEntry) {
                    perfData.fcp = Math.round(fcpEntry.startTime);
                }

                // Get LCP using PerformanceObserver
                let lcpValue = null;

                // Check if LCP is already available
                const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
                if (lcpEntries && lcpEntries.length > 0) {
                    lcpValue = Math.round(lcpEntries[lcpEntries.length - 1].startTime);
                    perfData.lcp = lcpValue;

                    // Calculate Speed Index approximation
                    if (perfData.fcp && perfData.loadTime) {
                        perfData.speedIndex = Math.round((perfData.fcp * 0.7) + (perfData.loadTime * 0.3));
                    }

                    resolve(perfData);
                } else {
                    // Use PerformanceObserver to wait for LCP
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        lcpValue = Math.round(lastEntry.startTime);
                        perfData.lcp = lcpValue;
                    });

                    try {
                        observer.observe({ entryTypes: ['largest-contentful-paint'] });
                    } catch (e) {
                        // LCP not supported, resolve with what we have
                        if (perfData.fcp && perfData.loadTime) {
                            perfData.speedIndex = Math.round((perfData.fcp * 0.7) + (perfData.loadTime * 0.3));
                        }
                        resolve(perfData);
                    }

                    // Wait for LCP to be captured
                    setTimeout(() => {
                        observer.disconnect();
                        perfData.lcp = lcpValue;

                        // Calculate Speed Index approximation
                        if (perfData.fcp && perfData.loadTime) {
                            perfData.speedIndex = Math.round((perfData.fcp * 0.7) + (perfData.loadTime * 0.3));
                        }

                        resolve(perfData);
                    }, 2000);
                }
            });
        });

        return metrics;
    }

    /**
     * Add API metric (from JMeter results)
     * @param {ApiMetric} apiMetric - API metric object
     */
    addApiMetric(apiMetric) {
        this._data.apiMetrics.push(apiMetric);
    }

    /**
     * Add health check metric
     * @param {HealthCheckMetric} healthMetric - Health check metric object
     */
    addHealthCheckMetric(healthMetric) {
        this._data.healthCheckMetrics.push(healthMetric);
    }

    /**
     * Add functional flow metric
     * @param {FunctionalFlowMetric} flowMetric - Functional flow metric object
     */
    addFunctionalFlow(flowMetric) {
        this._data.functionalFlows.push(flowMetric);
    }

    /**
     * Add console error
     * @param {ConsoleErrorMetric} error - Console error object
     */
    addConsoleError(error) {
        this._data.consoleErrors.push(error);
        this._errorBuffer.push(error);
    }

    /**
     * Associate buffered errors with a page/step
     * Call this after each page navigation or step
     * @param {string} pageName - Page name
     * @param {string} pageUrl - Page URL
     */
    associateErrorsWithPage(pageName, pageUrl) {
        this._errorBuffer.forEach(error => {
            error.pageName = pageName;
            error.pageUrl = pageUrl;
        });
        this._errorBuffer = [];
    }

    /**
     * Get step log for functional flow
     * @param {string} pageName - Page/step name
     * @param {number} durationInSeconds - Duration in seconds
     * @returns {StepLogMetric} - Step log object
     */
    getStepLogForPage(pageName, durationInSeconds = 0) {
        const stepLog = new StepLogMetric();
        stepLog.stepName = pageName;
        stepLog.duration = durationInSeconds;
        stepLog.timestamp = new Date();

        // Get errors associated with this page
        stepLog.consoleErrors = this._data.consoleErrors.filter(
            e => e.pageName === pageName
        );

        return stepLog;
    }

    /**
     * Get all collected metrics
     * @returns {UnifiedPerformanceData} - All metrics
     */
    getAllMetrics() {
        // Update metadata counts
        this._data.metadata.totalPages = this._data.pageMetrics.length;
        this._data.metadata.totalApis = this._data.apiMetrics.length;
        this._data.metadata.totalHealthChecks = this._data.healthCheckMetrics.length;
        this._data.metadata.totalFlows = this._data.functionalFlows.length;
        this._data.metadata.generatedAt = new Date();

        return this._data;
    }

    /**
     * Reset collector (clear all metrics)
     * Call this after report generation or between test runs
     */
    reset() {
        this._data = new UnifiedPerformanceData();
        this._errorBuffer = [];
        Test.Log.Info('Metrics collector reset');
    }

    /**
     * Calculate average of numeric array
     * @param {Array<number>} arr - Array of numbers
     * @returns {number|null} - Average value or null
     * @private
     */
    _calculateAverage(arr) {
        const valid = arr.filter(v => v !== null && v !== undefined && !isNaN(v));
        if (valid.length === 0) return null;
        return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
    }

    /**
     * Get performance rating based on LCP value
     * @param {number} avgLcp - Average LCP in milliseconds
     * @returns {string} - Performance rating
     * @private
     */
    _getPerformanceRating(avgLcp) {
        if (avgLcp === null) return 'N/A';
        const lcpSeconds = avgLcp / 1000;
        if (lcpSeconds < 1.0) return 'Excellent';
        if (lcpSeconds < 2.5) return 'Good';
        if (lcpSeconds < 4.0) return 'Average';
        return 'Needs Improvement';
    }
}

// Singleton instance
const metricsCollector = new UnifiedMetricsCollector();

export default metricsCollector;
export { UnifiedMetricsCollector };
