import Test from '../ReportUtility/TestLogger.js';

/**
 * Performance Helper Utility
 * Provides helper methods for running multiple performance tests
 * Similar to C# LcpHelper class
 */
class PerformanceHelper {

    /**
     * Run LCP measurements multiple times for a given page
     * @param {PageLoadTimeBase} performanceBase - Performance base instance
     * @param {string} url - URL to test
     * @param {number} runs - Number of runs (default: 3)
     * @returns {Promise<Array<number>>} - Array of LCP values in milliseconds
     */
    static async getLcpRuns(performanceBase, url, runs = 3) {
        try {
            const lcpRuns = [];

            for (let i = 0; i < runs; i++) {
                Test.Log.Info(`Running LCP measurement ${i + 1}/${runs} for: ${url}`);

                try {
                    const metrics = await performanceBase.runLighthouseAudit(url);
                    lcpRuns.push(metrics.lcp);

                    Test.Log.Info(`LCP Run ${i + 1}: ${metrics.lcp}ms`);

                    // Small delay between runs (2 seconds)
                    if (i < runs - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`LCP Run ${i + 1} failed: ${error.message}`);
                    lcpRuns.push(null);
                }
            }

            return lcpRuns;

        } catch (error) {
            console.error('Error in getLcpRuns:', error);
            throw error;
        }
    }

    /**
     * Run Speed Index measurements multiple times for a given page
     * @param {PageLoadTimeBase} performanceBase - Performance base instance
     * @param {string} url - URL to test
     * @param {number} runs - Number of runs (default: 3)
     * @returns {Promise<Array<number>>} - Array of Speed Index values in milliseconds
     */
    static async getSpeedIndexRuns(performanceBase, url, runs = 3) {
        try {
            const speedIndexRuns = [];

            for (let i = 0; i < runs; i++) {
                Test.Log.Info(`Running Speed Index measurement ${i + 1}/${runs} for: ${url}`);

                try {
                    const metrics = await performanceBase.runLighthouseAudit(url);
                    speedIndexRuns.push(metrics.speedIndex);

                    Test.Log.Info(`Speed Index Run ${i + 1}: ${metrics.speedIndex}ms`);

                    // Small delay between runs (2 seconds)
                    if (i < runs - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`Speed Index Run ${i + 1} failed: ${error.message}`);
                    speedIndexRuns.push(null);
                }
            }

            return speedIndexRuns;

        } catch (error) {
            console.error('Error in getSpeedIndexRuns:', error);
            throw error;
        }
    }

    /**
     * Run both LCP and Speed Index measurements together
     * More efficient as it runs Lighthouse once per iteration
     * @param {PageLoadTimeBase} performanceBase - Performance base instance
     * @param {string} url - URL to test
     * @param {number} runs - Number of runs (default: 3)
     * @returns {Promise<{lcpRuns: Array<number>, speedIndexRuns: Array<number>}>}
     */
    static async getPerformanceRuns(performanceBase, url, runs = 3) {
        try {
            const lcpRuns = [];
            const speedIndexRuns = [];

            for (let i = 0; i < runs; i++) {
                Test.Log.Info(`Running performance measurement ${i + 1}/${runs} for: ${url}`);

                try {
                    const metrics = await performanceBase.runLighthouseAudit(url);

                    lcpRuns.push(metrics.lcp);
                    speedIndexRuns.push(metrics.speedIndex);

                    Test.Log.Info(`Run ${i + 1} - LCP: ${metrics.lcp}ms, Speed Index: ${metrics.speedIndex}ms`);

                    // Small delay between runs (2 seconds)
                    if (i < runs - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }

                } catch (error) {
                    Test.Log.Warning(`Performance Run ${i + 1} failed: ${error.message}`);
                    lcpRuns.push(null);
                    speedIndexRuns.push(null);
                }
            }

            return { lcpRuns, speedIndexRuns };

        } catch (error) {
            console.error('Error in getPerformanceRuns:', error);
            throw error;
        }
    }

    /**
     * Calculate average from array of values (ignoring nulls)
     * @param {Array<number>} values - Array of values
     * @returns {number|null} - Average value or null
     */
    static calculateAverage(values) {
        const validValues = values.filter(v => v !== null && v !== undefined);
        if (validValues.length === 0) return null;
        return Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length);
    }

    /**
     * Calculate standard deviation
     * @param {Array<number>} values - Array of values
     * @returns {number|null} - Standard deviation or null
     */
    static calculateStdDev(values) {
        const validValues = values.filter(v => v !== null && v !== undefined);
        if (validValues.length < 2) return null;

        const avg = validValues.reduce((a, b) => a + b, 0) / validValues.length;
        const squareDiffs = validValues.map(value => Math.pow(value - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / validValues.length;

        return Math.round(Math.sqrt(avgSquareDiff));
    }

    /**
     * Get performance statistics for a set of runs
     * @param {Array<number>} values - Array of values
     * @returns {Object} - Statistics object with min, max, avg, stdDev
     */
    static getStatistics(values) {
        const validValues = values.filter(v => v !== null && v !== undefined);

        if (validValues.length === 0) {
            return {
                min: null,
                max: null,
                avg: null,
                stdDev: null,
                validCount: 0,
                totalCount: values.length
            };
        }

        return {
            min: Math.min(...validValues),
            max: Math.max(...validValues),
            avg: this.calculateAverage(values),
            stdDev: this.calculateStdDev(values),
            validCount: validValues.length,
            totalCount: values.length
        };
    }

    /**
     * Format metrics for console output
     * @param {Array<number>} lcpRuns - LCP runs
     * @param {Array<number>} speedIndexRuns - Speed Index runs
     * @param {string} pageName - Page name
     */
    static logMetricsSummary(lcpRuns, speedIndexRuns, pageName) {
        const lcpStats = this.getStatistics(lcpRuns);
        const siStats = this.getStatistics(speedIndexRuns);

        Test.Log.Info(`\n========== Performance Summary: ${pageName} ==========`);

        if (lcpStats.validCount > 0) {
            Test.Log.Info(`LCP Statistics:`);
            Test.Log.Info(`  Runs: ${lcpRuns.map(v => v !== null ? v + 'ms' : 'N/A').join(', ')}`);
            Test.Log.Info(`  Average: ${lcpStats.avg}ms`);
            Test.Log.Info(`  Min: ${lcpStats.min}ms | Max: ${lcpStats.max}ms`);
            if (lcpStats.stdDev !== null) {
                Test.Log.Info(`  Std Dev: ${lcpStats.stdDev}ms`);
            }
        }

        if (siStats.validCount > 0) {
            Test.Log.Info(`Speed Index Statistics:`);
            Test.Log.Info(`  Runs: ${speedIndexRuns.map(v => v !== null ? v + 'ms' : 'N/A').join(', ')}`);
            Test.Log.Info(`  Average: ${siStats.avg}ms`);
            Test.Log.Info(`  Min: ${siStats.min}ms | Max: ${siStats.max}ms`);
            if (siStats.stdDev !== null) {
                Test.Log.Info(`  Std Dev: ${siStats.stdDev}ms`);
            }
        }

        Test.Log.Info(`====================================================\n`);
    }

    /**
     * Check if metrics meet performance thresholds
     * @param {number} avgLcp - Average LCP
     * @param {number} avgSpeedIndex - Average Speed Index
     * @param {Object} budgets - Budget thresholds
     * @returns {Object} - Pass/fail status
     */
    static checkPerformanceBudget(avgLcp, avgSpeedIndex, budgets) {
        const results = {
            lcpPass: avgLcp !== null && avgLcp <= budgets.LCP_MaxMs,
            speedIndexPass: avgSpeedIndex !== null && avgSpeedIndex <= budgets.SpeedIndex_MaxMs,
            lcpValue: avgLcp,
            speedIndexValue: avgSpeedIndex,
            lcpBudget: budgets.LCP_MaxMs,
            speedIndexBudget: budgets.SpeedIndex_MaxMs
        };

        results.allPassed = results.lcpPass && results.speedIndexPass;

        return results;
    }
}

export default PerformanceHelper;
