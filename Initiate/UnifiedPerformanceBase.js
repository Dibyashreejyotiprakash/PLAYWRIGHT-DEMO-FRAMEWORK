import PageLoadTimeBase from './PageLoadTimeBase.js';
import metricsCollector from '../Utility/PerformanceUtility/UnifiedMetricsCollector.js';
import ConsoleErrorHandler from '../Utility/PerformanceUtility/ConsoleErrorHandler.js';
import jmeterOrchestrator from '../Utility/LoadTestUtility/JMeterOrchestrator.js';
import HealthCheckRunner from '../Utility/PerformanceUtility/HealthCheckRunner.js';
import UnifiedReportGenerator from '../Utility/PerformanceUtility/UnifiedReportGenerator.js';
import Test from '../Utility/ReportUtility/TestLogger.js';
import path from 'path';
import fs from 'fs';

/**
 * Unified Performance Base Class
 * Orchestrates all performance testing components:
 * - Page performance (LCP, Speed Index)
 * - API performance (JMeter integration)
 * - Health checks
 * - Functional flows
 * - Console error tracking
 * - Unified reporting with Chart.js
 *
 * Extends PageLoadTimeBase for backward compatibility
 */
class UnifiedPerformanceBase extends PageLoadTimeBase {
    constructor() {
        super();
        this.metricsCollector = metricsCollector;
        this.jmeterResults = null;
    }

    /**
     * Attach console error handlers to page
     * Call this in test setup after page creation
     * @param {Object} page - Playwright page instance
     */
    attachConsoleErrorHandlers(page) {
        ConsoleErrorHandler.attachErrorListeners(page);
    }

    /**
     * Remove console error handlers from page
     * @param {Object} page - Playwright page instance
     */
    removeConsoleErrorHandlers(page) {
        ConsoleErrorHandler.removeErrorListeners(page);
    }

    /**
     * Get current error counts
     * @returns {Object} - Error counts by type
     */
    getErrorCounts() {
        return ConsoleErrorHandler.getErrorCounts();
    }

    /**
     * Execute JMeter test and add API metrics to collector
     * @param {string} jmxFileName - JMX file name (e.g., 'CONSOLIDATEDAPI_VALIDATION.jmx')
     * @param {string} testName - Unique test identifier
     * @param {object} options - JMeter options { threadCount, duration, rampUpTime }
     */
    async addJMeterApiMetrics(jmxFileName, testName, options = {}) {
        try {
            Test.Log.Info(`Starting JMeter test: ${testName}`);

            // Execute JMeter test
            const { jtlPath, xmlPath } = await jmeterOrchestrator.executeJMeterTest(
                jmxFileName,
                testName,
                options
            );

            this.jmeterResults = { jtlPath, xmlPath };

            // Parse JMeter results and extract API metrics
            Test.Log.Info('Parsing JMeter results...');
            const apiMetrics = await jmeterOrchestrator.parseJMeterResults(jtlPath, xmlPath);

            // Add each API metric to the unified collector
            apiMetrics.forEach(metric => {
                this.metricsCollector.addApiMetric(metric);
            });

            Test.Log.Pass(`✓ Added ${apiMetrics.length} API metrics from JMeter`);

            // Set JMX filename in metadata
            this.metricsCollector.setMetadata(
                this.metricsCollector._data.metadata.businessUnit,
                this.metricsCollector._data.metadata.environment,
                jmxFileName
            );

        } catch (error) {
            Test.Log.Error(`JMeter test failed: ${error.message}`);
            // Don't fail the entire test - continue with other metrics
            // This allows partial reporting even if JMeter fails
        }
    }

    /**
     * Run API health checks and add to collector
     * @param {string} jsonFilePath - Path to apihealth_{env}.json file
     */
    async runApiHealthChecks(jsonFilePath) {
        try {
            Test.Log.Info('Running API health checks...');

            // Execute health checks
            const healthMetrics = await HealthCheckRunner.runHealthChecks(jsonFilePath);

            // Add each health metric to the unified collector
            healthMetrics.forEach(metric => {
                this.metricsCollector.addHealthCheckMetric(metric);
            });

            // Log summary
            const summary = HealthCheckRunner.getHealthCheckSummary(healthMetrics);
            Test.Log.Pass(`✓ Health checks completed: ${summary.healthy}/${summary.total} healthy (${summary.healthPercentage}%)`);

            if (summary.serverExposed > 0) {
                Test.Log.Warning(`⚠ Server headers exposed on ${summary.serverExposed} endpoints`);
            }

        } catch (error) {
            Test.Log.Error(`Health checks failed: ${error.message}`);
            // Don't fail the entire test - continue with other metrics
        }
    }

    /**
     * Generate unified performance report
     * @param {string} filePath - Output file path
     * @param {string} businessUnit - Business unit name
     * @param {string} environment - Environment (QA/Stage/Prod)
     */
    generateUnifiedReport(filePath, businessUnit, environment) {
        try {
            Test.Log.Info('Generating unified performance report...');

            // Get all collected metrics
            const allMetrics = this.metricsCollector.getAllMetrics();

            // Set metadata
            this.metricsCollector.setMetadata(businessUnit, environment);

            // Create report generator and generate HTML report
            const reportGenerator = new UnifiedReportGenerator();
            reportGenerator.generateReport(filePath, allMetrics, businessUnit, environment);

            Test.Log.Pass(`✓ Unified Performance Report generated successfully`);
            Test.Log.Info(`  File: ${filePath}`);
            Test.Log.Info(`  Pages: ${allMetrics.metadata.totalPages}`);
            Test.Log.Info(`  APIs: ${allMetrics.metadata.totalApis}`);
            Test.Log.Info(`  Health Checks: ${allMetrics.metadata.totalHealthChecks}`);
            Test.Log.Info(`  Functional Flows: ${allMetrics.metadata.totalFlows}`);
            Test.Log.Info(`  Console Errors: ${allMetrics.consoleErrors.length}`);

        } catch (error) {
            Test.Log.Error(`Report generation failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Reset metrics collector
     * Call this after report generation or between test runs
     */
    resetMetricsCollector() {
        this.metricsCollector.reset();
        this.jmeterResults = null;
        Test.Log.Info('Metrics collector reset');
    }

    /**
     * Get environment-specific health check JSON file path
     * @param {string} env - Environment (QA/Stage/Prod)
     * @returns {string} - Path to health check JSON file
     */
    getHealthCheckJsonPath(env) {
        const projectDir = path.resolve('./');
        const envLower = env.toLowerCase();
        const jsonPath = path.join(projectDir, 'Testdata', `apihealth_${envLower}.json`);

        if (!fs.existsSync(jsonPath)) {
            Test.Log.Warning(`Health check JSON not found: ${jsonPath}`);
            return null;
        }

        return jsonPath;
    }

    /**
     * Get login URL for environment and business unit
     * Helper method for backward compatibility
     * @param {string} env - Environment
     * @param {string} bu - Business unit
     * @returns {string} - Login URL
     */
    getLoginUrl(env, bu) {
        // This can be customized based on business unit
        const baseUrl = this.getUrlForEnvironment(env);
        return baseUrl;
    }

    /**
     * Execute complete unified performance test workflow
     * This is a convenience method that runs all steps in order
     * @param {Object} config - Configuration object
     * @returns {Promise<void>}
     */
    async executeUnifiedPerformanceTest(config) {
        const {
            businessUnit,
            environment,
            pages = [],
            jmxFileName = null,
            jmeterOptions = {},
            healthCheckJson = null,
            reportPath = './Reports/Unified_Performance_Report.html'
        } = config;

        try {
            Test.Log.Info('========================================');
            Test.Log.Info('Starting Unified Performance Test');
            Test.Log.Info(`Business Unit: ${businessUnit}`);
            Test.Log.Info(`Environment: ${environment}`);
            Test.Log.Info('========================================');

            // Step 1: Collect page metrics
            if (pages.length > 0) {
                Test.Log.Info(`Step 1: Collecting page metrics (${pages.length} pages)...`);
                for (const pageConfig of pages) {
                    await this.metricsCollector.addPageMetric(
                        pageConfig.page,
                        pageConfig.name,
                        pageConfig.label || pageConfig.name,
                        pageConfig.numRuns || 3
                    );
                    this.metricsCollector.associateErrorsWithPage(pageConfig.name, pageConfig.page.url());
                }
            }

            // Step 2: Execute JMeter API tests
            if (jmxFileName) {
                Test.Log.Info('Step 2: Executing JMeter API tests...');
                await this.addJMeterApiMetrics(jmxFileName, `${businessUnit}_Test`, jmeterOptions);
            }

            // Step 3: Run health checks
            if (healthCheckJson) {
                Test.Log.Info('Step 3: Running health checks...');
                await this.runApiHealthChecks(healthCheckJson);
            }

            // Step 4: Generate report
            Test.Log.Info('Step 4: Generating unified report...');
            this.generateUnifiedReport(reportPath, businessUnit, environment);

            Test.Log.Pass('========================================');
            Test.Log.Pass('✓ Unified Performance Test Completed');
            Test.Log.Pass('========================================');

        } catch (error) {
            Test.Log.Error(`Unified performance test failed: ${error.message}`);
            throw error;
        }
    }
}

export default UnifiedPerformanceBase;
