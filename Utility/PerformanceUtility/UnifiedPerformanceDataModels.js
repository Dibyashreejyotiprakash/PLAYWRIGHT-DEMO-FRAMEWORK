/**
 * Unified Performance Data Models
 * Data structures for all metric types in the unified performance framework
 */

/**
 * Page Performance Metric
 * Tracks page load performance (LCP, Speed Index)
 */
class PageMetric {
    constructor() {
        this.pageName = '';
        this.label = '';
        this.lcpRuns = [];           // Array of LCP values [2340, 2450, 2390]
        this.speedIndexRuns = [];    // Array of Speed Index values
        this.avgLcp = 0;
        this.avgSpeedIndex = 0;
        this.performanceRating = ''; // 'Excellent', 'Good', 'Average', 'Poor'
    }
}

/**
 * API Performance Metric
 * Tracks API performance from JMeter results
 */
class ApiMetric {
    constructor() {
        this.serviceName = '';
        this.endpoint = '';
        this.threadGroup = '';
        this.avgResponseTime = 0;
        this.minResponseTime = 0;
        this.maxResponseTime = 0;
        this.throughput = 0;
        this.errorRate = 0;
        this.totalSamples = 0;
        this.successCount = 0;
        this.failureCount = 0;
    }
}

/**
 * Health Check Metric
 * Tracks API health check results
 */
class HealthCheckMetric {
    constructor() {
        this.id = 0;
        this.name = '';
        this.version = '';
        this.namespace = '';
        this.healthUrl = '';
        this.status = '';            // 'Healthy', 'Unhealthy', 'Error'
        this.responseTime = 0;
        this.statusCode = 0;
        this.serverMasked = null;    // true/false/null
        this.errorMessage = '';
        this.timestamp = new Date();
    }
}

/**
 * Functional Flow Metric
 * Tracks end-to-end functional flow validation
 */
class FunctionalFlowMetric {
    constructor() {
        this.flowName = '';
        this.category = '';
        this.executionTime = new Date();
        this.passed = false;
        this.stepLogs = [];              // Array of StepLogMetric
        this.jsErrorCount = 0;
        this.otherConsoleErrorCount = 0;
        this.error400Count = 0;
        this.error500Count = 0;
        this.errorMessage = '';
    }
}

/**
 * Step Log Metric
 * Tracks individual steps within a functional flow
 */
class StepLogMetric {
    constructor() {
        this.stepName = '';
        this.pageUrl = '';
        this.duration = 0;           // seconds
        this.consoleErrors = [];     // Array of ConsoleErrorMetric
        this.timestamp = new Date();
    }
}

/**
 * Console Error Metric
 * Tracks console errors, page errors, and network errors
 */
class ConsoleErrorMetric {
    constructor() {
        this.type = '';              // 'error', 'page-error', 'network-error'
        this.message = '';
        this.timestamp = new Date();
        this.pageUrl = '';
        this.pageName = '';
        this.statusCode = null;      // For network errors
        this.url = '';               // For network errors (request URL)
    }
}

/**
 * Unified Performance Data Container
 * Consolidates all metric types into a single data structure
 */
class UnifiedPerformanceData {
    constructor() {
        this.metadata = {
            businessUnit: '',
            environment: '',
            jmxFileName: '',
            generatedAt: new Date(),
            totalPages: 0,
            totalApis: 0,
            totalHealthChecks: 0,
            totalFlows: 0
        };
        this.pageMetrics = [];           // Array of PageMetric
        this.apiMetrics = [];            // Array of ApiMetric
        this.healthCheckMetrics = [];    // Array of HealthCheckMetric
        this.functionalFlows = [];       // Array of FunctionalFlowMetric
        this.consoleErrors = [];         // Array of ConsoleErrorMetric
    }
}

export {
    PageMetric,
    ApiMetric,
    HealthCheckMetric,
    FunctionalFlowMetric,
    StepLogMetric,
    ConsoleErrorMetric,
    UnifiedPerformanceData
};
