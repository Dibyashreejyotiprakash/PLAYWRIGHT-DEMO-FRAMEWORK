import { request } from '@playwright/test';
import { HealthCheckMetric } from './UnifiedPerformanceDataModels.js';
import Test from '../ReportUtility/TestLogger.js';
import fs from 'fs';
import path from 'path';

/**
 * Health Check Runner
 * Executes health check validations across API endpoints
 * Validates server masking and health status
 */
class HealthCheckRunner {
    /**
     * Run health checks from JSON configuration
     * @param {string} jsonFilePath - Path to apihealth_{env}.json file
     * @returns {Promise<Array<HealthCheckMetric>>} - Health check results
     */
    static async runHealthChecks(jsonFilePath) {
        const healthMetrics = [];

        Test.Log.Info(`Starting health checks from: ${jsonFilePath}`);

        // Read health check configuration
        if (!fs.existsSync(jsonFilePath)) {
            Test.Log.Error(`Health check configuration file not found: ${jsonFilePath}`);
            return healthMetrics;
        }

        try {
            const configData = fs.readFileSync(jsonFilePath, 'utf-8');
            const config = JSON.parse(configData);
            const endpoints = config.apiHealthEndpoints || [];

            Test.Log.Info(`Running ${endpoints.length} health checks...`);

            // Create Playwright API context
            const apiContext = await request.newContext({
                extraHTTPHeaders: {
                    'accept': 'application/json'
                },
                timeout: 30000,
                ignoreHTTPSErrors: true // Allow self-signed certificates in test environments
            });

            // Execute health checks in parallel with Promise.allSettled
            // This ensures all checks complete even if some fail
            const checks = endpoints.map(endpoint =>
                this._checkEndpoint(apiContext, endpoint)
            );

            const results = await Promise.allSettled(checks);

            // Process results
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    healthMetrics.push(result.value);
                } else {
                    // Create failed health metric
                    const metric = new HealthCheckMetric();
                    metric.id = endpoints[index].id;
                    metric.name = endpoints[index].name;
                    metric.version = endpoints[index].version || 'N/A';
                    metric.namespace = endpoints[index].namespace || 'Default';
                    metric.healthUrl = endpoints[index].stageHealthUrl || endpoints[index].prodHealthUrl;
                    metric.status = 'Error';
                    metric.errorMessage = result.reason.message;
                    metric.timestamp = new Date();
                    healthMetrics.push(metric);

                    Test.Log.Warning(`Health check failed: ${metric.name} - ${metric.errorMessage}`);
                }
            });

            // Dispose API context
            await apiContext.dispose();

            // Log summary
            const healthyCount = healthMetrics.filter(h => h.status === 'Healthy').length;
            const unhealthyCount = healthMetrics.filter(h => h.status === 'Unhealthy').length;
            const errorCount = healthMetrics.filter(h => h.status === 'Error').length;

            Test.Log.Pass(`✓ Health checks completed: ${healthMetrics.length} total`);
            Test.Log.Info(`  Healthy: ${healthyCount}, Unhealthy: ${unhealthyCount}, Error: ${errorCount}`);

        } catch (error) {
            Test.Log.Error(`Failed to run health checks: ${error.message}`);
            throw error;
        }

        return healthMetrics;
    }

    /**
     * Check single health endpoint
     * @param {APIRequestContext} apiContext - Playwright API context
     * @param {object} endpoint - Endpoint configuration
     * @returns {Promise<HealthCheckMetric>}
     * @private
     */
    static async _checkEndpoint(apiContext, endpoint) {
        const metric = new HealthCheckMetric();
        metric.id = endpoint.id;
        metric.name = endpoint.name;
        metric.version = endpoint.version || 'N/A';
        metric.namespace = endpoint.namespace || 'Default';

        // Determine which URL to use (stage or prod based on config)
        metric.healthUrl = endpoint.stageHealthUrl || endpoint.prodHealthUrl;

        const startTime = Date.now();

        try {
            Test.Log.Info(`  Checking: ${metric.name} (${metric.version}) - ${metric.healthUrl}`);

            const response = await apiContext.get(metric.healthUrl);

            metric.responseTime = Date.now() - startTime;
            metric.statusCode = response.status();
            metric.timestamp = new Date();

            if (response.ok()) {
                // Parse response body
                let body;
                try {
                    body = await response.json();
                } catch (e) {
                    // If JSON parsing fails, try text
                    const text = await response.text();
                    body = { status: text.toLowerCase().includes('healthy') ? 'Healthy' : 'Unhealthy' };
                }

                // Check health status
                // Support different response formats: { status: "Healthy" } or { Status: "Healthy" }
                const status = body.status || body.Status || body.health || body.Health;
                if (status && (status.toLowerCase() === 'healthy' || status.toLowerCase() === 'ok')) {
                    metric.status = 'Healthy';
                } else {
                    metric.status = 'Unhealthy';
                    metric.errorMessage = `Status: ${status}`;
                }

                // Validate server masking (server header should not be exposed for security)
                const headers = response.headers();
                metric.serverMasked = !headers.server || headers.server === '';

                if (!metric.serverMasked) {
                    Test.Log.Warning(`  Server header exposed for ${metric.name}: ${headers.server}`);
                }

                Test.Log.Pass(`  ✓ ${metric.name}: ${metric.status} (${metric.responseTime}ms)`);

            } else {
                metric.status = 'Unhealthy';
                metric.errorMessage = `HTTP ${response.status()} - ${response.statusText()}`;
                Test.Log.Warning(`  ${metric.name}: ${metric.status} - ${metric.errorMessage}`);
            }

        } catch (error) {
            metric.status = 'Error';
            metric.errorMessage = error.message;
            metric.responseTime = Date.now() - startTime;
            metric.timestamp = new Date();

            Test.Log.Warning(`  ${metric.name}: Error - ${metric.errorMessage}`);
        }

        return metric;
    }

    /**
     * Get health check summary statistics
     * @param {Array<HealthCheckMetric>} healthMetrics - Array of health metrics
     * @returns {object} - Summary statistics
     */
    static getHealthCheckSummary(healthMetrics) {
        const total = healthMetrics.length;
        const healthy = healthMetrics.filter(h => h.status === 'Healthy').length;
        const unhealthy = healthMetrics.filter(h => h.status === 'Unhealthy').length;
        const error = healthMetrics.filter(h => h.status === 'Error').length;
        const serverMasked = healthMetrics.filter(h => h.serverMasked === true).length;
        const serverExposed = healthMetrics.filter(h => h.serverMasked === false).length;

        const avgResponseTime = healthMetrics.length > 0
            ? Math.round(healthMetrics.reduce((sum, h) => sum + h.responseTime, 0) / healthMetrics.length)
            : 0;

        return {
            total,
            healthy,
            unhealthy,
            error,
            healthPercentage: total > 0 ? Math.round((healthy / total) * 100) : 0,
            serverMasked,
            serverExposed,
            avgResponseTime
        };
    }
}

export default HealthCheckRunner;
