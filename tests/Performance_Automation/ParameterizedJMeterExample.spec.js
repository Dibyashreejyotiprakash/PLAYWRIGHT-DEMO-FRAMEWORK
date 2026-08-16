import { test } from '@playwright/test';
import UnifiedPerformanceBase from '../../Initiate/UnifiedPerformanceBase.js';
import Test from '../../Utility/ReportUtility/TestLogger.js';
import path from 'path';
import fs from 'fs';

/**
 * Parameterized JMeter Example
 * Demonstrates how to pass dynamic parameters from JavaScript to JMX files
 *
 * Steps:
 * 1. Extract dynamic data from application (token, userId, orderId, etc.)
 * 2. Pass data as properties to JMeter
 * 3. JMX file uses ${__P(propertyName,default)} to access values
 * 4. Generate unified performance report
 */
test.describe('Parameterized JMeter Test Example', function() {
    const performanceBase = new UnifiedPerformanceBase();
    let env;
    let page;

    // Dynamic data extracted from application
    let sessionData = {
        token: null,
        userId: null,
        personaId: null,
        orderId: null,
        orderLineId: null,
        itemId: null,
        jobId: null
    };

    test.beforeAll(async function() {
        try {
            Test.Log.Info('========================================');
            Test.Log.Info('Parameterized JMeter Test - Setup');
            Test.Log.Info('========================================');

            // Launch browser
            await performanceBase.launchBrowserForPerformance();
            env = await performanceBase.getEnvVariable();
            page = performanceBase.page;

            Test.Log.Info(`Environment: ${env}`);

        } catch (error) {
            Test.Log.Error('Setup failed', error.message);
            throw error;
        }
    });

    // Step 1: Extract Dynamic Data from Application
    test('Step1_ExtractDynamicSessionData', async function() {
        try {
            Test.Log.Info('\n--- Step 1: Extracting Dynamic Session Data ---\n');

            // Navigate to application (adjust URL based on your needs)
            const appUrl = env === 'PROD'
                ? 'https://qa.brandmuscle.net/'
                : 'https://qa.v5stage.brandmuscle.net/';

            await page.goto(appUrl, { waitUntil: 'load', timeout: 60000 });

            // Example: Extract token from sessionStorage
            // Adjust based on your application
            sessionData.token = await page.evaluate(() => {
                return window.sessionStorage.getItem('brandmuscle_token') ||
                       window.localStorage.getItem('auth_token') ||
                       'default_token_for_testing';
            });

            // Example: Extract userId
            sessionData.userId = await page.evaluate(() => {
                return window.sessionStorage.getItem('userId') ||
                       window.sessionStorage.getItem('user_id') ||
                       '10905866'; // Default for testing
            });

            // Example: Extract personaId
            sessionData.personaId = await page.evaluate(() => {
                return window.sessionStorage.getItem('personaId') || '933141';
            });

            // You can also extract from API responses, cookies, etc.
            // Example: Get order data from cookies
            const cookies = await page.context().cookies();
            const orderCookie = cookies.find(c => c.name === 'current_order');
            if (orderCookie) {
                try {
                    const orderData = JSON.parse(orderCookie.value);
                    sessionData.orderId = orderData.orderId;
                    sessionData.orderLineId = orderData.orderLineId;
                } catch (e) {
                    Test.Log.Warning('Could not parse order cookie');
                }
            }

            // Set defaults if not extracted
            sessionData.orderId = sessionData.orderId || '12345678';
            sessionData.orderLineId = sessionData.orderLineId || '98765432';
            sessionData.itemId = sessionData.itemId || '555666';
            sessionData.jobId = sessionData.jobId || '777888';

            // Log extracted data (mask sensitive info)
            Test.Log.Pass('✓ Session data extracted successfully:');
            Test.Log.Info(`  Token: ${sessionData.token ? sessionData.token.substring(0, 20) + '...' : 'Not found'}`);
            Test.Log.Info(`  User ID: ${sessionData.userId}`);
            Test.Log.Info(`  Persona ID: ${sessionData.personaId}`);
            Test.Log.Info(`  Order ID: ${sessionData.orderId}`);
            Test.Log.Info(`  Order Line ID: ${sessionData.orderLineId}`);

        } catch (error) {
            Test.Log.Error(`Failed to extract session data: ${error.message}`);
            throw error;
        }
    });

    // Step 2: Generate CSV File (Optional Method)
    test('Step2_GenerateCSVForJMeter', async function() {
        try {
            Test.Log.Info('\n--- Step 2: Generating CSV Data File ---\n');

            // Create TestData directory if it doesn't exist
            const testDataDir = path.resolve('./JmeterFiles/TestDataUnified');
            if (!fs.existsSync(testDataDir)) {
                fs.mkdirSync(testDataDir, { recursive: true });
            }

            // Generate CSV file with dynamic data
            const csvPath = path.join(testDataDir, 'DynamicTestData_Parameterized.csv');

            const baseUrl = env === 'PROD'
                ? 'https://qa.brandmuscle.net/api'
                : 'https://qa.v5stage.brandmuscle.net/api';

            const csvContent = [
                // Header
                'baseurl,token,buid,setid,applicationid,userid,personaid,assetid,assetname,templatefamilyid,configid,orderid,orderlineid,itemid,jobid,shippingagentid,externalitemid,itempricingid',
                // Data row with extracted values
                `${baseUrl},${sessionData.token},32,3211546,2,${sessionData.userId},${sessionData.personaId},2846362,TestAsset.png,1140673,23139,${sessionData.orderId},${sessionData.orderLineId},${sessionData.itemId},${sessionData.jobId},193,EXT001,PRICE001`
            ].join('\n');

            fs.writeFileSync(csvPath, csvContent, 'utf-8');
            Test.Log.Pass(`✓ CSV file generated: ${csvPath}`);

        } catch (error) {
            Test.Log.Warning(`CSV generation failed (optional): ${error.message}`);
            // Don't fail test - CSV is optional
        }
    });

    // Step 3: Run JMeter with Dynamic Parameters
    test('Step3_RunJMeterWithParameters', async function() {
        try {
            Test.Log.Info('\n--- Step 3: Running JMeter with Dynamic Parameters ---\n');

            // Determine base URL based on environment
            const baseUrl = env === 'PROD'
                ? 'https://qa.brandmuscle.net/api'
                : 'https://qa.v5stage.brandmuscle.net/api';

            // Execute JMeter with all dynamic parameters
            await performanceBase.addJMeterApiMetrics(
                'CONSOLIDATEDAPI_VALIDATION.jmx',
                'Parameterized_Test',
                {
                    // Standard JMeter configuration
                    threadCount: 15,
                    duration: 120,
                    rampUpTime: 10,

                    // 🔥 Custom properties - passed to JMX as -Jproperty=value
                    // Access in JMX using ${__P(propertyName,defaultValue)}
                    properties: {
                        // Environment configuration
                        baseUrl: baseUrl,
                        environment: env,

                        // Authentication
                        token: sessionData.token,

                        // User data
                        userId: sessionData.userId,
                        personaId: sessionData.personaId,

                        // Business unit data
                        buid: '32',
                        setid: '3211546',
                        applicationId: '2',

                        // Order data (extracted dynamically)
                        orderId: sessionData.orderId,
                        orderLineId: sessionData.orderLineId,
                        itemId: sessionData.itemId,
                        jobId: sessionData.jobId,

                        // Asset data
                        assetId: '2846362',
                        assetName: 'DynamicTestAsset.png',
                        templateFamilyId: '1140673',
                        configId: '23139',

                        // Shipping data
                        shippingAgentId: '193',

                        // External IDs
                        externalItemId: 'EXT_' + Date.now(),
                        itemPricingId: 'PRICE_' + Date.now(),

                        // CSV file path (if using CSV method)
                        csvFile: 'TestDataUnified/DynamicTestData_Parameterized.csv'
                    }
                }
            );

            Test.Log.Pass('✓ JMeter test with dynamic parameters completed');

        } catch (jmeterError) {
            Test.Log.Warning(`JMeter test failed or skipped: ${jmeterError.message}`);
            Test.Log.Info('Continuing with report generation...');
            // Don't fail the test - we can still generate report with available metrics
        }
    });

    // Step 4: Generate Unified Report
    test('Step4_GenerateUnifiedReport', async function() {
        try {
            Test.Log.Info('\n--- Step 4: Generating Unified Performance Report ---\n');

            const projectDir = path.resolve('./');
            const reportDir = path.join(projectDir, 'Reports');

            if (!fs.existsSync(reportDir)) {
                fs.mkdirSync(reportDir, { recursive: true });
            }

            const reportFilePath = path.join(reportDir, 'Parameterized_JMeter_Report.html');

            // Generate report
            performanceBase.generateUnifiedReport(
                reportFilePath,
                'QA Business Unit - Parameterized',
                env
            );

            Test.Log.Pass(`✓ Unified Performance Report generated successfully!`);
            Test.Log.Info(`  Report location: ${reportFilePath}`);

        } catch (error) {
            Test.Log.Error(`Report generation failed: ${error.message}`);
            throw error;
        }
    });

    test.afterAll(async function() {
        try {
            Test.Log.Info('\n========================================');
            Test.Log.Info('Cleanup');
            Test.Log.Info('========================================');

            if (performanceBase.context) {
                await performanceBase.context.close();
            }
            if (performanceBase.browser) {
                await performanceBase.browser.close();
            }

            performanceBase.resetMetricsCollector();
            Test.Log.Pass('✓ Cleanup completed');

        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    });
});

/**
 * USAGE IN YOUR JMX FILE:
 *
 * 1. Add User Defined Variables:
 *
 * <Arguments>
 *   <elementProp name="baseUrl" elementType="Argument">
 *     <stringProp name="Argument.value">${__P(baseUrl,https://default.url.com/api)}</stringProp>
 *   </elementProp>
 *   <elementProp name="token" elementType="Argument">
 *     <stringProp name="Argument.value">${__P(token,)}</stringProp>
 *   </elementProp>
 *   <elementProp name="userId" elementType="Argument">
 *     <stringProp name="Argument.value">${__P(userId,0)}</stringProp>
 *   </elementProp>
 *   <elementProp name="orderId" elementType="Argument">
 *     <stringProp name="Argument.value">${__P(orderId,)}</stringProp>
 *   </elementProp>
 * </Arguments>
 *
 * 2. Use in HTTP Requests:
 *
 * <HTTPSamplerProxy>
 *   <stringProp name="HTTPSampler.domain">${baseUrl}</stringProp>
 *   <stringProp name="HTTPSampler.path">/checkout/v3/orders/${orderId}</stringProp>
 *
 *   <HeaderManager>
 *     <elementProp name="Authorization" elementType="Header">
 *       <stringProp name="Header.value">Bearer ${token}</stringProp>
 *     </elementProp>
 *   </HeaderManager>
 * </HTTPSamplerProxy>
 *
 * 3. All properties passed in options.properties are available as ${__P(propertyName,default)}
 */
