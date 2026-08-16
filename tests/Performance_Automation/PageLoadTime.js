import { test } from '@playwright/test';
import PageLoadTimeBase from '../../Initiate/PageLoadTimeBase.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';
import PageUrl from '../../Utility/PerformanceUtility/PageUrl.js';
import MetricsCollector from '../../Utility/PerformanceUtility/MetricsCollector.js';
import ReportGenerator from '../../Utility/PerformanceUtility/ReportGenerator.js';
import path from 'path';
import fs from 'fs';


test.describe('Performance Report - QA BU', function() {
    const performanceBase = new PageLoadTimeBase();
    let env;
    let page;
    let htmlReport;
    const pageUrlInstance = new PageUrl();

    test.beforeAll(async function() {
        try {
            Test.Log.Info('Launching browser for performance testing with Playwright');
            await performanceBase.launchBrowserForPerformance();

            // Get environment
            env = await performanceBase.getEnvVariable();
            Test.Log.Info(`Testing environment: ${env}`);

            // Get page instance
            page = performanceBase.page;

            if (!page) {
                throw new Error('Playwright page instance not available. Ensure browser is launched.');
            }

            // Initialize HTML report generator
            htmlReport = new ReportGenerator();

        } catch (error) {
            await Test.Log.Error('Setup failed in beforeAll', error.message);
            throw error;
        }
    });

    test('GetLCP_SpeedIndexFor_QA', async function() {
        const buName = 'QA Business Unit';

        try {
            Test.Log.Info(`\n${'='.repeat(80)}`);
            Test.Log.Info(`Starting Performance Test for ${buName}`);
            Test.Log.Info(`Environment: ${env}`);
            Test.Log.Info(`${'='.repeat(80)}\n`);

            // Login Page (if applicable)
            // await page.goto('login-url');
            // await page.waitForLoadState('load');
            // await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Login Page', 'Login Page');

            // Search Page
            const searchPageUrl = await pageUrlInstance.QA_SearchPageUrl(env);
            await page.goto(searchPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Search Page', 'Search Page');

            // Work Center Page
            const workCenterPageUrl = await pageUrlInstance.QA_WorkCenterPageUrl(env);
            await page.goto(workCenterPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Workcenter', 'Workcenter Page');

            // Keyword Search Page
            const keywordSearchPageUrl = await pageUrlInstance.QA_KeyWordSearchPageUrl(env);
            await page.goto(keywordSearchPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Keyword Search', 'Keyword Search Page');

            // PDP Page
            const pdpPageUrl = await pageUrlInstance.QA_PDPPageUrl(env);
            await page.goto(pdpPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'PDP', 'PDP Page');

            // Cart Page
            const cartPageUrl = await pageUrlInstance.QA_CartPageUrl(env);
            await page.goto(cartPageUrl);
            await page.waitForLoadState('load');
            await MetricsCollector.getLcpAndSpeedIndex(page, htmlReport, 'Cart Page', 'Cart Page');

            Test.Log.Pass('All pages tested successfully');

        } catch (error) {
            Test.Log.Error(`Test failed with exception: ${error.message}`);
            throw error;
        } finally {
            try {
                // Generate performance report
                const projectDir = path.resolve('./');
                const reportDir = path.join(projectDir, 'PerformanceReport');

                // Create report directory if it doesn't exist
                if (!fs.existsSync(reportDir)) {
                    fs.mkdirSync(reportDir, { recursive: true });
                }

                const reportFilePath = path.join(reportDir, 'Performance_Report.html');

                htmlReport.generateReport(reportFilePath, buName, env);
                Test.Log.Pass(`✓ Performance Report generated: ${reportFilePath}`);

            } catch (reportError) {
                Test.Log.Error(`Report generation failed: ${reportError.message}`);
            }
        }
    });

    test.afterAll(async function() {
        try {
            Test.Log.Info('Cleaning up browser resources');
            if (performanceBase.context) {
                await performanceBase.context.close();
            }
            if (performanceBase.browser) {
                await performanceBase.browser.close();
            }
            Test.Log.Info('Cleanup completed successfully');

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });
});
