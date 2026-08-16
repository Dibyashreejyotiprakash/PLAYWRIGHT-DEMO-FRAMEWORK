import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { ApiMetric } from '../PerformanceUtility/UnifiedPerformanceDataModels.js';
import Test from '../ReportUtility/TestLogger.js';

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);

/**
 * JMeter Test Orchestrator
 * Executes JMeter tests and parses results for API performance metrics
 * Singleton pattern for thread-safe execution
 */
class JMeterOrchestrator {
    constructor() {
        this.config = null;
        this.resultsCache = new Map(); // Cache for concurrent test safety
    }

    /**
     * Load JMeter configuration from JSON
     */
    async loadConfiguration() {
        try {
            const configPath = path.resolve('./Testdata/LoadTestConfiguration.json');
            const configData = await readFile(configPath, 'utf-8');
            this.config = JSON.parse(configData).JMeterConfiguration;
            Test.Log.Info('JMeter configuration loaded successfully');
        } catch (error) {
            Test.Log.Error(`Failed to load JMeter configuration: ${error.message}`);
            throw error;
        }
    }

    /**
     * Execute JMeter test
     * @param {string} jmxFileName - JMX file name (e.g., 'CONSOLIDATEDAPI_VALIDATION.jmx')
     * @param {string} testName - Unique test identifier
     * @param {object} options - Optional parameters (threadCount, duration, rampUpTime, properties)
     * @param {object} options.properties - Custom JMeter properties { baseUrl: 'https://...', token: '...', etc. }
     * @returns {Promise<object>} - { jtlPath, xmlPath }
     */
    async executeJMeterTest(jmxFileName, testName, options = {}) {
        if (!this.config) await this.loadConfiguration();

        Test.Log.Info(`Preparing to execute JMeter test: ${testName}`);

        const testMapping = this._getTestMapping(testName) || {};

        const threadCount = options.threadCount || testMapping.ThreadCount || this.config.DefaultThreadCount;
        const duration = options.Duration || testMapping.Duration || this.config.DefaultDuration;
        const rampUpTime = options.RampUpTime || testMapping.RampUpTime || this.config.DefaultRampUpTime;
        const customProperties = options.properties || {};

        const jmxPath = path.resolve(`./JmeterFiles/${jmxFileName}`);
        const resultsDir = path.resolve(this.config.ResultsFolder || 'JMeterResults');
        const jtlPath = path.join(resultsDir, `results_${testName}.jtl`);
        const xmlPath = path.join(resultsDir, `ViewResultsTree_${testName}.xml`);

        // Create results directory if it doesn't exist
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir, { recursive: true });
            Test.Log.Info(`Created JMeter results directory: ${resultsDir}`);
        }

        // Verify JMX file exists
        if (!fs.existsSync(jmxPath)) {
            throw new Error(`JMX file not found: ${jmxPath}`);
        }

        // Delete old result files if they exist
        if (fs.existsSync(jtlPath)) fs.unlinkSync(jtlPath);
        if (fs.existsSync(xmlPath)) fs.unlinkSync(xmlPath);

        // JMeter command
        const jmeterCmd = path.resolve(this.config.JMeterPath);

        if (!fs.existsSync(jmeterCmd)) {
            throw new Error(`JMeter executable not found at: ${jmeterCmd}`);
        }

        const htmlReportDir = path.join(this.config.HtmlReportsFolder || 'JMeterReports', testName);

        // Create HTML report directory
        if (fs.existsSync(htmlReportDir)) {
            // Clear existing HTML report directory
            fs.rmSync(htmlReportDir, { recursive: true, force: true });
        }
        fs.mkdirSync(htmlReportDir, { recursive: true });

        const args = [
            '-n',                                    // Non-GUI mode
            '-t', jmxPath,                          // Test plan
            '-l', jtlPath,                          // Results file (JTL)
            '-Jthreads=' + threadCount,             // Thread count property
            '-Jduration=' + duration,               // Duration property
            '-JrampUp=' + rampUpTime,               // Ramp-up property
            '-e',                                    // Generate HTML report
            '-o', htmlReportDir                     // HTML output directory
        ];

        // Add custom properties to JMeter command
        // These will be accessible in JMX using ${__P(propertyName,defaultValue)}
        for (const [key, value] of Object.entries(customProperties)) {
            args.push(`-J${key}=${value}`);
            Test.Log.Info(`  Custom property: ${key}=${value}`);
        }

        Test.Log.Info(`Starting JMeter test: ${testName}`);
        Test.Log.Info(`  JMX File: ${jmxFileName}`);
        Test.Log.Info(`  Threads: ${threadCount}, Duration: ${duration}s, Ramp-up: ${rampUpTime}s`);
        Test.Log.Info(`  Command: ${jmeterCmd} ${args.join(' ')}`);

        return new Promise((resolve, reject) => {
            const jmeterProcess = spawn(jmeterCmd, args, {
                cwd: path.dirname(jmeterCmd),
                shell: true
            });

            let stdout = '';
            let stderr = '';

            jmeterProcess.stdout.on('data', data => {
                const output = data.toString();
                stdout += output;
                // Log progress
                if (output.includes('summary')) {
                    Test.Log.Info(`  ${output.trim()}`);
                }
            });

            jmeterProcess.stderr.on('data', data => {
                stderr += data.toString();
            });

            jmeterProcess.on('close', code => {
                if (code === 0) {
                    Test.Log.Pass(`✓ JMeter test completed successfully: ${testName}`);
                    Test.Log.Info(`  Results: ${jtlPath}`);
                    Test.Log.Info(`  HTML Report: ${htmlReportDir}/index.html`);
                    resolve({ jtlPath, xmlPath });
                } else {
                    const errorMsg = `JMeter test failed with exit code ${code}\n${stderr}`;
                    Test.Log.Error(errorMsg);
                    reject(new Error(errorMsg));
                }
            });

            jmeterProcess.on('error', err => {
                Test.Log.Error(`JMeter process error: ${err.message}`);
                reject(err);
            });

            // Timeout based on configuration
            const timeoutMs = (this.config.TimeoutMinutes || 30) * 60 * 1000;
            setTimeout(() => {
                jmeterProcess.kill();
                const errorMsg = `JMeter test timeout after ${this.config.TimeoutMinutes || 30} minutes: ${testName}`;
                Test.Log.Error(errorMsg);
                reject(new Error(errorMsg));
            }, timeoutMs);
        });
    }

    /**
     * Parse JMeter results and extract API metrics
     * @param {string} jtlPath - Path to JTL results file
     * @param {string} xmlPath - Path to XML results file (optional)
     * @returns {Promise<Array<ApiMetric>>} - Array of API metrics
     */
    async parseJMeterResults(jtlPath, xmlPath = null) {
        Test.Log.Info(`Parsing JMeter results from: ${jtlPath}`);
        const metrics = [];

        // Check if JTL file exists
        if (!fs.existsSync(jtlPath)) {
            Test.Log.Warning(`JTL file not found: ${jtlPath}`);
            return metrics;
        }

        try {
            // Parse JTL file (CSV format)
            const jtlData = await readFile(jtlPath, 'utf-8');
            const lines = jtlData.split('\n').filter(line => line.trim());

            if (lines.length === 0) {
                Test.Log.Warning('JTL file is empty');
                return metrics;
            }

            // Parse header
            const headers = lines[0].split(',');
            const timestampIdx = headers.indexOf('timeStamp');
            const elapsedIdx = headers.indexOf('elapsed');
            const labelIdx = headers.indexOf('label');
            const responseCodeIdx = headers.indexOf('responseCode');
            const successIdx = headers.indexOf('success');

            if (labelIdx === -1 || elapsedIdx === -1) {
                Test.Log.Error('Invalid JTL format: missing required columns');
                return metrics;
            }

            // Aggregate samples by label
            const samples = {};

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                const cols = lines[i].split(',');
                if (cols.length < headers.length) continue;

                const label = cols[labelIdx];
                const elapsed = parseInt(cols[elapsedIdx]);
                const success = successIdx !== -1 ? cols[successIdx] === 'true' : true;

                if (!label || isNaN(elapsed)) continue;

                if (!samples[label]) {
                    samples[label] = {
                        responseTimes: [],
                        successCount: 0,
                        failureCount: 0
                    };
                }

                samples[label].responseTimes.push(elapsed);
                if (success) {
                    samples[label].successCount++;
                } else {
                    samples[label].failureCount++;
                }
            }

            // Create ApiMetric objects
            for (const [label, data] of Object.entries(samples)) {
                const metric = new ApiMetric();
                metric.serviceName = label;
                metric.endpoint = label;
                metric.threadGroup = this._extractThreadGroup(label);
                metric.avgResponseTime = this._calculateAverage(data.responseTimes);
                metric.minResponseTime = Math.min(...data.responseTimes);
                metric.maxResponseTime = Math.max(...data.responseTimes);
                metric.totalSamples = data.responseTimes.length;
                metric.successCount = data.successCount;
                metric.failureCount = data.failureCount;
                metric.errorRate = parseFloat((data.failureCount / metric.totalSamples * 100).toFixed(2));

                // Calculate throughput (requests per second)
                // Approximate: totalSamples / (total time in seconds)
                const totalTime = data.responseTimes.reduce((a, b) => a + b, 0) / 1000; // Convert to seconds
                metric.throughput = totalTime > 0 ? parseFloat((metric.totalSamples / totalTime).toFixed(2)) : 0;

                metrics.push(metric);
            }

            Test.Log.Pass(`✓ Parsed ${metrics.length} API metrics from JMeter results`);

            // Log summary
            metrics.forEach(metric => {
                Test.Log.Info(`  ${metric.serviceName}: Avg ${metric.avgResponseTime}ms, Success: ${metric.successCount}/${metric.totalSamples}`);
            });

        } catch (error) {
            Test.Log.Error(`Failed to parse JTL file: ${error.message}`);
            throw error;
        }

        return metrics;
    }

    /**
     * Get test mapping from configuration
     * @param {string} testName - Test name
     * @returns {object|null} - Test mapping or null
     * @private
     */
    _getTestMapping(testName) {
        if (!this.config || !this.config.TestMappings) return null;
        const mappings = this.config.TestMappings;
        return mappings.find(m => testName.includes(m.TestNamePattern));
    }

    /**
     * Extract thread group from label
     * @param {string} label - Sample label
     * @returns {string} - Thread group name
     * @private
     */
    _extractThreadGroup(label) {
        // Try to extract thread group from label (format: "ThreadGroup - SampleName")
        if (label.includes(' - ')) {
            return label.split(' - ')[0];
        }
        // Try to extract from API path
        if (label.startsWith('/api/')) {
            const parts = label.split('/');
            if (parts.length >= 3) {
                return parts[2]; // /api/[service]/...
            }
        }
        return 'Default';
    }

    /**
     * Calculate average of array
     * @param {Array<number>} arr - Array of numbers
     * @returns {number} - Average value
     * @private
     */
    _calculateAverage(arr) {
        if (arr.length === 0) return 0;
        return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }
}

// Singleton instance
const jmeterOrchestrator = new JMeterOrchestrator();

export default jmeterOrchestrator;
export { JMeterOrchestrator };
