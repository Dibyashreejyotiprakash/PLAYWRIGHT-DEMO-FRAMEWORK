import Test from '../ReportUtility/TestLogger.js';

class MetricsCollector {
    /**
     * Collect performance metrics using Playwright's Performance API
     * @param {Object} page - Playwright page instance
     * @param {string} url - URL to test
     * @returns {Object} - Object containing performance metrics
     */
    static async collectMetricsFromPage(page, url) {
        try {
            // Navigate to the page
            await page.goto(url, { waitUntil: 'load', timeout: 60000 });

            // Wait for page to be fully loaded
            await page.waitForLoadState('networkidle', { timeout: 30000 });

            // Collect performance metrics using Performance API
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
                            resolve(perfData);
                        }

                        // Wait a bit for LCP to be captured
                        setTimeout(() => {
                            observer.disconnect();
                            perfData.lcp = lcpValue;
                            resolve(perfData);
                        }, 2000);
                    }
                });
            });

            // Calculate Speed Index approximation using FCP and Load Time
            // Note: This is not the same as Lighthouse Speed Index, but an approximation
            if (metrics.fcp && metrics.loadTime) {
                // Speed Index approximation: weighted average of FCP and Load Time
                metrics.speedIndex = Math.round((metrics.fcp * 0.7) + (metrics.loadTime * 0.3));
            }

            return metrics;

        } catch (error) {
            Test.Log.Error(`Failed to collect metrics from page: ${error.message}`);
            throw error;
        }
    }

    /**
     * Main method to get LCP and Speed Index runs (similar to C# GetLcpAndSpeedIndex)
     * @param {Object} page - Playwright page instance
     * @param {Object} htmlReport - Report object to add results to
     * @param {string} label - Label for logging
     * @param {string} pageName - Page name for the report
     * @param {number} numRuns - Number of runs (default: 3)
     * @returns {Promise<Object>} - Object containing lcpRuns and speedIndexRuns
     */
    static async getLcpAndSpeedIndex(page, htmlReport, label, pageName, numRuns = 3) {
        try {
            const lcpRuns = await this.getLcpRuns(page, numRuns);
            const avgLcp = this.calculateAverage(lcpRuns);
            const avgLcpSec = avgLcp !== null ? (avgLcp / 1000).toFixed(2) : 'N/A';

            const lcpRunsDisplay = lcpRuns.map(x => x !== null ? (x / 1000).toFixed(2) : 'N/A').join(', ');
            Test.Log.Info(`${label} LCP Runs (sec): ${lcpRunsDisplay}`);

            const speedIndexRuns = await this.getSpeedIndexRuns(page, numRuns);
            const avgSpeedIndex = this.calculateAverage(speedIndexRuns);
            const avgSpeedIndexSec = avgSpeedIndex !== null ? (avgSpeedIndex / 1000).toFixed(2) : 'N/A';

            const speedIndexRunsDisplay = speedIndexRuns.map(x => x !== null ? (x / 1000).toFixed(2) : 'N/A').join(', ');
            Test.Log.Info(`${label} Speed Index Runs (sec): ${speedIndexRunsDisplay}`);

            // Add results to HTML report if provided
            if (htmlReport && typeof htmlReport.addResult === 'function') {
                htmlReport.addResult(lcpRuns, speedIndexRuns, pageName);
            }

            return {
                lcpRuns,
                speedIndexRuns,
                avgLcp,
                avgSpeedIndex
            };

        } catch (error) {
            Test.Log.Error(`Failed to get LCP and Speed Index: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get LCP runs (similar to C# LcpHelper.GetLcpRunsAsync)
     * @param {Object} page - Playwright page instance
     * @param {number} numRuns - Number of runs (default: 3)
     * @returns {Promise<Array>} - Array of LCP values in milliseconds
     */
    static async getLcpRuns(page, numRuns = 3) {
        const lcpRuns = [];

        try {
            for (let run = 1; run <= numRuns; run++) {
                try {
                    const metrics = await this.collectMetricsFromPage(page, page.url());

                    if (metrics && metrics.lcp !== null && metrics.lcp !== undefined) {
                        lcpRuns.push(metrics.lcp);
                    } else {
                        lcpRuns.push(null);
                    }

                    // Small delay between runs
                    if (run < numRuns) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`LCP collection failed for Run ${run}: ${error.message}`);
                    lcpRuns.push(null);
                }
            }

            return lcpRuns;

        } catch (error) {
            Test.Log.Error(`Failed to get LCP runs: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get Speed Index runs (similar to C# LcpHelper.GetSpeedIndexRunsAsync)
     * @param {Object} page - Playwright page instance
     * @param {number} numRuns - Number of runs (default: 3)
     * @returns {Promise<Array>} - Array of Speed Index values in milliseconds
     */
    static async getSpeedIndexRuns(page, numRuns = 3) {
        const speedIndexRuns = [];

        try {
            for (let run = 1; run <= numRuns; run++) {
                try {
                    const metrics = await this.collectMetricsFromPage(page, page.url());

                    if (metrics && metrics.speedIndex !== null && metrics.speedIndex !== undefined) {
                        speedIndexRuns.push(metrics.speedIndex);
                    } else {
                        speedIndexRuns.push(null);
                    }

                    // Small delay between runs
                    if (run < numRuns) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`Speed Index collection failed for Run ${run}: ${error.message}`);
                    speedIndexRuns.push(null);
                }
            }

            return speedIndexRuns;

        } catch (error) {
            Test.Log.Error(`Failed to get Speed Index runs: ${error.message}`);
            throw error;
        }
    }

    /**
     * Collect LCP (Largest Contentful Paint) metrics from multiple runs using Playwright
     * @param {Object} page - Playwright page instance
     * @param {string} url - URL to test
     * @param {number} numRuns - Number of runs to perform
     * @param {string} pageName - Page name for logging
     * @returns {Array} - Array of LCP values in milliseconds
     */
    static async collectLCP(page, url, numRuns, pageName = 'Page') {
        const lcpRuns = [];

        try {
            for (let run = 1; run <= numRuns; run++) {
                Test.Log.Info(`Collecting LCP - Run ${run}/${numRuns} for ${pageName}`);

                try {
                    const metrics = await this.collectMetricsFromPage(page, url);

                    if (metrics && metrics.lcp !== null && metrics.lcp !== undefined) {
                        lcpRuns.push(metrics.lcp);
                        Test.Log.Info(`LCP Run ${run}: ${metrics.lcp}ms`);
                    } else {
                        Test.Log.Warning(`LCP not available for Run ${run}`);
                        lcpRuns.push(null);
                    }

                    // Small delay between runs
                    if (run < numRuns) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`LCP collection failed for Run ${run}: ${error.message}`);
                    lcpRuns.push(null);
                }
            }

            return lcpRuns;

        } catch (error) {
            Test.Log.Error(`Failed to collect LCP metrics: ${error.message}`);
            throw error;
        }
    }

    /**
     * Collect Speed Index metrics from multiple runs using Playwright
     * Note: This is an approximation based on FCP and Load Time, not Lighthouse Speed Index
     * @param {Object} page - Playwright page instance
     * @param {string} url - URL to test
     * @param {number} numRuns - Number of runs to perform
     * @param {string} pageName - Page name for logging
     * @returns {Array} - Array of Speed Index values in milliseconds
     */
    static async collectSpeedIndex(page, url, numRuns, pageName = 'Page') {
        const speedIndexRuns = [];

        try {
            for (let run = 1; run <= numRuns; run++) {
                Test.Log.Info(`Collecting Speed Index - Run ${run}/${numRuns} for ${pageName}`);

                try {
                    const metrics = await this.collectMetricsFromPage(page, url);

                    if (metrics && metrics.speedIndex !== null && metrics.speedIndex !== undefined) {
                        speedIndexRuns.push(metrics.speedIndex);
                        Test.Log.Info(`Speed Index Run ${run}: ${metrics.speedIndex}ms`);
                    } else {
                        Test.Log.Warning(`Speed Index not available for Run ${run}`);
                        speedIndexRuns.push(null);
                    }

                    // Small delay between runs
                    if (run < numRuns) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`Speed Index collection failed for Run ${run}: ${error.message}`);
                    speedIndexRuns.push(null);
                }
            }

            return speedIndexRuns;

        } catch (error) {
            Test.Log.Error(`Failed to collect Speed Index metrics: ${error.message}`);
            throw error;
        }
    }

    /**
     * Collect both LCP and Speed Index metrics from multiple runs using Playwright
     * @param {Object} page - Playwright page instance
     * @param {string} url - URL to test
     * @param {number} numRuns - Number of runs to perform
     * @param {string} pageName - Page name for logging
     * @returns {Object} - Object containing lcpRuns and speedIndexRuns arrays
     */
    static async collectBothMetrics(page, url, numRuns, pageName = 'Page') {
        const lcpRuns = [];
        const speedIndexRuns = [];

        try {
            Test.Log.Info(`Starting metrics collection for ${pageName} (${numRuns} runs)`);

            for (let run = 1; run <= numRuns; run++) {
                Test.Log.Info(`\n--- Run ${run}/${numRuns} for ${pageName} ---`);

                try {
                    const metrics = await this.collectMetricsFromPage(page, url);

                    // Collect LCP
                    if (metrics && metrics.lcp !== null && metrics.lcp !== undefined) {
                        lcpRuns.push(metrics.lcp);
                    } else {
                        Test.Log.Warning(`LCP not available for Run ${run}`);
                        lcpRuns.push(null);
                    }

                    // Collect Speed Index
                    if (metrics && metrics.speedIndex !== null && metrics.speedIndex !== undefined) {
                        speedIndexRuns.push(metrics.speedIndex);
                    } else {
                        Test.Log.Warning(`Speed Index not available for Run ${run}`);
                        speedIndexRuns.push(null);
                    }

                    Test.Log.Info(`Run ${run} - LCP: ${metrics.lcp}ms, Speed Index: ${metrics.speedIndex}ms`);
                    Test.Log.Info(`Additional metrics - FCP: ${metrics.fcp}ms, TTFB: ${metrics.ttfb}ms, Load: ${metrics.loadTime}ms`);

                    // Small delay between runs
                    if (run < numRuns) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`Run ${run} failed for ${pageName}: ${error.message}`);
                    lcpRuns.push(null);
                    speedIndexRuns.push(null);
                }
            }

            return {
                lcpRuns,
                speedIndexRuns
            };

        } catch (error) {
            Test.Log.Error(`Failed to collect metrics: ${error.message}`);
            throw error;
        }
    }

    /**
     * Collect comprehensive performance metrics including all available timings
     * @param {Object} page - Playwright page instance
     * @param {string} url - URL to test
     * @param {string} pageName - Page name for logging
     * @returns {Object} - Object containing all performance metrics
     */
    static async collectComprehensiveMetrics(page, url, pageName = 'Page') {
        try {
            Test.Log.Info(`Collecting comprehensive metrics for ${pageName}`);

            const metrics = await this.collectMetricsFromPage(page, url);

            Test.Log.Info(`Metrics for ${pageName}:`);
            Test.Log.Info(`  LCP: ${metrics.lcp}ms`);
            Test.Log.Info(`  Speed Index (approx): ${metrics.speedIndex}ms`);
            Test.Log.Info(`  FCP: ${metrics.fcp}ms`);
            Test.Log.Info(`  TTFB: ${metrics.ttfb}ms`);
            Test.Log.Info(`  DOM Content Loaded: ${metrics.domContentLoaded}ms`);
            Test.Log.Info(`  Load Time: ${metrics.loadTime}ms`);

            return metrics;

        } catch (error) {
            Test.Log.Error(`Failed to collect comprehensive metrics: ${error.message}`);
            throw error;
        }
    }

    /**
     * Calculate average from an array of metrics (excluding null values)
     * @param {Array} metricsArray - Array of metric values
     * @returns {number|null} - Average value or null if no valid values
     */
    static calculateAverage(metricsArray) {
        try {
            const validMetrics = metricsArray.filter(v => v !== null && v !== undefined);

            if (validMetrics.length === 0) {
                return null;
            }

            const sum = validMetrics.reduce((a, b) => a + b, 0);
            return Math.round(sum / validMetrics.length);

        } catch (error) {
            console.error(`Failed to calculate average: ${error.message}`);
            return null;
        }
    }

    /**
     * Get summary statistics for metrics
     * @param {Array} metricsArray - Array of metric values
     * @returns {Object} - Object containing min, max, avg, median
     */
    static getMetricsStatistics(metricsArray) {
        try {
            const validMetrics = metricsArray.filter(v => v !== null && v !== undefined);

            if (validMetrics.length === 0) {
                return {
                    min: null,
                    max: null,
                    avg: null,
                    median: null,
                    count: 0
                };
            }

            const sorted = [...validMetrics].sort((a, b) => a - b);
            const avg = validMetrics.reduce((a, b) => a + b, 0) / validMetrics.length;
            const median = sorted.length % 2 === 0
                ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                : sorted[Math.floor(sorted.length / 2)];

            return {
                min: Math.round(sorted[0]),
                max: Math.round(sorted[sorted.length - 1]),
                avg: Math.round(avg),
                median: Math.round(median),
                count: validMetrics.length
            };

        } catch (error) {
            console.error(`Failed to calculate statistics: ${error.message}`);
            return {
                min: null,
                max: null,
                avg: null,
                median: null,
                count: 0
            };
        }
    }
}

export default MetricsCollector;
