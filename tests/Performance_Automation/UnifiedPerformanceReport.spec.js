import { test } from '@playwright/test';
import UnifiedPerformanceBase from '../../Initiate/UnifiedPerformanceBase.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';
import PageUrl from '../../Utility/PerformanceUtility/PageUrl.js';
import { FunctionalFlowMetric } from '../../Utility/PerformanceUtility/UnifiedPerformanceDataModels.js';
import path from 'path';
import fs from 'fs';

/**
 * Unified Performance Report - Example Test
 * Demonstrates integration of:
 * - Page performance metrics (LCP, Speed Index)
 * - JMeter API testing
 * - Health checks
 * - Functional flow validation
 * - Console error tracking
 * - Unified HTML reporting with Chart.js
 */
test.describe('Unified Performance Report - QA BU', function() {
    const performanceBase = new UnifiedPerformanceBase();
    let env;
    let page;
    const pageUrlInstance = new PageUrl();

    test.beforeAll(async function() {
        try {
            Test.Log.Info('========================================');
            Test.Log.Info('Unified Performance Testing - Setup');
            Test.Log.Info('========================================');

            // Launch browser for performance testing
            Test.Log.Info('Launching browser for unified performance testing...');
            await performanceBase.launchBrowserForPerformance();

            // Get environment
            env = await performanceBase.getEnvVariable();
            Test.Log.Info(`Testing environment: ${env}`);

            // Get page instance
            page = performanceBase.page;

            if (!page) {
                throw new Error('Playwright page instance not available. Ensure browser is launched.');
            }

            // Attach console error handlers
            performanceBase.attachConsoleErrorHandlers(page);
            Test.Log.Pass('✓ Console error handlers attached');

        } catch (error) {
            Test.Log.Error('Setup failed in beforeAll', error.message);
            throw error;
        }
    });

    // Test 1: Page Load Performance + JMeter API Test
    test('Test1_PageLoadPerformance_WithJMeter', async function() {
        const buName = 'QA Business Unit';

        try {
            Test.Log.Info(`\n${'='.repeat(80)}`);
            Test.Log.Info(`Test 1: Page Load Performance + JMeter API Testing`);
            Test.Log.Info(`Business Unit: ${buName}`);
            Test.Log.Info(`Environment: ${env}`);
            Test.Log.Info(`${'='.repeat(80)}\n`);

            // Search Page
            Test.Log.Info('Navigating to Search Page...');
            const searchPageUrl = await pageUrlInstance.QA_SearchPageUrl(env);
            await page.goto(searchPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await performanceBase.metricsCollector.addPageMetric(page, 'Search Page', 'Search Page', 3);
            performanceBase.metricsCollector.associateErrorsWithPage('Search Page', page.url());

            // Work Center Page
            Test.Log.Info('Navigating to Work Center Page...');
            const workCenterPageUrl = await pageUrlInstance.QA_WorkCenterPageUrl(env);
            await page.goto(workCenterPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await performanceBase.metricsCollector.addPageMetric(page, 'Workcenter', 'Workcenter Page', 3);
            performanceBase.metricsCollector.associateErrorsWithPage('Workcenter', page.url());

            // Keyword Search Page
            Test.Log.Info('Navigating to Keyword Search Page...');
            const keywordSearchPageUrl = await pageUrlInstance.QA_KeyWordSearchPageUrl(env);
            await page.goto(keywordSearchPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await performanceBase.metricsCollector.addPageMetric(page, 'Keyword Search', 'Keyword Search Page', 3);
            performanceBase.metricsCollector.associateErrorsWithPage('Keyword Search', page.url());

            // PDP Page
            Test.Log.Info('Navigating to PDP Page...');
            const pdpPageUrl = await pageUrlInstance.QA_PDPPageUrl(env);
            await page.goto(pdpPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await performanceBase.metricsCollector.addPageMetric(page, 'PDP', 'PDP Page', 3);
            performanceBase.metricsCollector.associateErrorsWithPage('PDP', page.url());

            // Cart Page
            Test.Log.Info('Navigating to Cart Page...');
            const cartPageUrl = await pageUrlInstance.QA_CartPageUrl(env);
            await page.goto(cartPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await performanceBase.metricsCollector.addPageMetric(page, 'Cart Page', 'Cart Page', 3);
            performanceBase.metricsCollector.associateErrorsWithPage('Cart Page', page.url());

            Test.Log.Pass('✓ All pages tested successfully');

        } catch (error) {
            Test.Log.Error(`Test failed with exception: ${error.message}`);
            throw error;
        } finally {
            // Execute JMeter test for API metrics
            // Note: This requires JMeter to be installed and configured
            // Set failOnJMeterError to false to continue even if JMeter fails
            try {
                await performanceBase.addJMeterApiMetrics(
                    'CONSOLIDATEDAPI_VALIDATION.jmx',
                    'QA_UnifiedTest',
                    {
                        threadCount: 10,
                        duration: 60,
                        rampUpTime: 5
                    }
                );
            } catch (jmeterError) {
                Test.Log.Warning(`JMeter test skipped or failed: ${jmeterError.message}`);
                // Continue with test - JMeter is optional
            }
        }
    });

    // Test 2: Functional Flow Validation (Optional Example)
    test('Test2_FunctionalFlow_Example', async function() {
        const flowMetric = new FunctionalFlowMetric();
        flowMetric.flowName = 'Sample Functional Flow';
        flowMetric.category = 'UnifiedPerformanceReport_FunctionalFlow';
        flowMetric.executionTime = new Date();
        flowMetric.passed = false;

        const stepDurations = {};

        try {
            Test.Log.Info('\n--- Functional Flow Validation Example ---\n');

            // Step 1: Navigate to Search Page
            const startTime1 = Date.now();
            const searchPageUrl = await pageUrlInstance.QA_SearchPageUrl(env);
            await page.goto(searchPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            stepDurations['Search Page Navigation'] = (Date.now() - startTime1) / 1000;
            performanceBase.metricsCollector.associateErrorsWithPage('Search Page Navigation', page.url());

            // Step 2: Navigate to PDP
            const startTime2 = Date.now();
            const pdpPageUrl = await pageUrlInstance.QA_PDPPageUrl(env);
            await page.goto(pdpPageUrl, { waitUntil: 'load', timeout: 60000 });
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            stepDurations['PDP Page Navigation'] = (Date.now() - startTime2) / 1000;
            performanceBase.metricsCollector.associateErrorsWithPage('PDP Page Navigation', page.url());

            flowMetric.passed = true;
            Test.Log.Pass('✓ Functional flow completed successfully');

        } catch (error) {
            flowMetric.passed = false;
            flowMetric.errorMessage = error.message;
            Test.Log.Error(`Functional flow failed: ${error.message}`);
        } finally {
            // Collect step logs
            const stepNames = ['Search Page Navigation', 'PDP Page Navigation'];
            stepNames.forEach(stepName => {
                const stepLog = performanceBase.metricsCollector.getStepLogForPage(
                    stepName,
                    stepDurations[stepName] || 0
                );
                flowMetric.stepLogs.push(stepLog);
            });

            // Count errors
            const allErrors = performanceBase.metricsCollector.getAllMetrics().consoleErrors;
            flowMetric.jsErrorCount = allErrors.filter(e => e.type === 'error').length;
            flowMetric.otherConsoleErrorCount = allErrors.filter(e => e.type === 'page-error').length;
            flowMetric.error400Count = allErrors.filter(e => e.type === 'network-error' && e.statusCode >= 400 && e.statusCode < 500).length;
            flowMetric.error500Count = allErrors.filter(e => e.type === 'network-error' && e.statusCode >= 500).length;

            // Add flow metric
            performanceBase.metricsCollector.addFunctionalFlow(flowMetric);
        }
    });

    // Test 3: Generate Final Unified Report
    test('Test3_GenerateFinalReport', async function() {
        try {
            Test.Log.Info('\n========================================');
            Test.Log.Info('Generating Final Unified Report');
            Test.Log.Info('========================================\n');

            // Run API health checks
            const healthCheckJsonPath = performanceBase.getHealthCheckJsonPath(env);
            if (healthCheckJsonPath && fs.existsSync(healthCheckJsonPath)) {
                await performanceBase.runApiHealthChecks(healthCheckJsonPath);
            } else {
                Test.Log.Warning(`Health check JSON not found for environment: ${env}`);
            }

            // Generate unified report
            const projectDir = path.resolve('./');
            const reportDir = path.join(projectDir, 'Reports');

            // Create Reports directory if it doesn't exist
            if (!fs.existsSync(reportDir)) {
                fs.mkdirSync(reportDir, { recursive: true });
            }

            const reportFilePath = path.join(reportDir, 'Unified_Performance_Report.html');

            performanceBase.generateUnifiedReport(reportFilePath, 'QA Business Unit', env);

            // Log error summary
            const errorCounts = performanceBase.getErrorCounts();
            Test.Log.Info('\nError Summary:');
            Test.Log.Info(`  JS Errors: ${errorCounts.jsErrors}`);
            Test.Log.Info(`  Page Errors: ${errorCounts.pageErrors}`);
            Test.Log.Info(`  Network Errors: ${errorCounts.networkErrors}`);
            Test.Log.Info(`  4xx Errors: ${errorCounts.error400s}`);
            Test.Log.Info(`  5xx Errors: ${errorCounts.error500s}`);
            Test.Log.Info(`  Total Errors: ${errorCounts.total}`);

            Test.Log.Pass(`\n✓ Unified Performance Report generated successfully!`);
            Test.Log.Pass(`  Report location: ${reportFilePath}`);

        } catch (error) {
            Test.Log.Error(`Report generation failed: ${error.message}`);
            throw error;
        }
    });

    test.afterAll(async function() {
        try {
            Test.Log.Info('\n========================================');
            Test.Log.Info('Cleaning up browser resources');
            Test.Log.Info('========================================');

            if (performanceBase.context) {
                await performanceBase.context.close();
            }
            if (performanceBase.browser) {
                await performanceBase.browser.close();
            }

            // Reset metrics collector for next run
            performanceBase.resetMetricsCollector();

            Test.Log.Pass('✓ Cleanup completed successfully');

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });
});
