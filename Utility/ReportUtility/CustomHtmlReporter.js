/**
 * CustomHtmlReporter - Playwright custom reporter
 * Collects test results and generates custom HTML report with detailed logs
 */

import fs from 'fs';
import path from 'path';
import ReportBuilder from './ReportBuilder.js';

class CustomHtmlReporter {

    constructor(options = {}) {
        this.options = options;
        this.outputFile = options.outputFile || 'custom-report.html';
        this.outputDir = options.outputDir || 'Reports';
        this.tests = [];
        this.summary = {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            passPercentage: 0
        };
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Called once before running tests
     * @param {Object} config - Test configuration
     * @param {Object} suite - Test suite
     */
    onBegin(config, suite) {
        this.startTime = new Date();
        console.log('\n========================================');
        console.log('Custom HTML Reporter - Test Run Started');
        console.log('========================================\n');
    }

    /**
     * Called when a test begins
     * @param {Object} test - Test object
     */
    onTestBegin(test) {
        // No longer needed with attachment-based logging
    }

    /**
     * Called when a test ends
     * @param {Object} test - Test object
     * @param {Object} result - Test result
     */
    onTestEnd(test, result) {
        const testId = test.id;
        const testName = test.title;
        const testFile = this.getRelativePath(test.location.file);
        const status = result.status; // 'passed', 'failed', 'skipped', 'timedOut'
        const duration = result.duration;
        const error = result.error ? result.error.message : null;

        // Extract logs from test attachments
        const logs = [];
        if (result.attachments && result.attachments.length > 0) {
            for (const attachment of result.attachments) {
                if (attachment.name && attachment.name.startsWith('log-') && attachment.body) {
                    try {
                        const logEntry = JSON.parse(attachment.body.toString('utf-8'));
                        logs.push(logEntry);
                    } catch (e) {
                        console.warn('Failed to parse log attachment:', e.message);
                    }
                }
            }
        }


        // Store test result
        this.tests.push({
            testId,
            testName,
            testFile,
            status,
            duration,
            logs,
            error
        });

        // Update summary
        this.summary.total++;
        if (status === 'passed') {
            this.summary.passed++;
        } else if (status === 'failed' || status === 'timedOut') {
            this.summary.failed++;
        } else if (status === 'skipped') {
            this.summary.skipped++;
        }
    }

    /**
     * Called after all tests complete
     * @param {Object} result - Full result object
     */
    onEnd(result) {
        this.endTime = new Date();

        // Calculate pass percentage
        if (this.summary.total > 0) {
            this.summary.passPercentage = Math.round(
                (this.summary.passed / this.summary.total) * 100
            );
        }

        // Generate HTML report
        this.generateReport();

        // Console summary
        console.log('\n========================================');
        console.log('Custom HTML Reporter - Test Run Complete');
        console.log('========================================');
        console.log(`Total Tests: ${this.summary.total}`);
        console.log(`✓ Passed: ${this.summary.passed}`);
        console.log(`✗ Failed: ${this.summary.failed}`);
        console.log(`⊘ Skipped: ${this.summary.skipped}`);
        console.log(`Pass Rate: ${this.summary.passPercentage}%`);
        console.log(`Report: ${this.getOutputPath()}`);
        console.log('========================================\n');
    }

    /**
     * Generate HTML report file
     */
    generateReport() {
        try {
            // Ensure output directory exists
            const outputPath = this.getOutputPath();
            const outputDirPath = path.dirname(outputPath);

            if (!fs.existsSync(outputDirPath)) {
                fs.mkdirSync(outputDirPath, { recursive: true });
            }

            // Prepare report data
            const reportData = {
                summary: this.summary,
                tests: this.tests,
                startTime: this.startTime,
                endTime: this.endTime
            };

            // Generate HTML
            const htmlContent = ReportBuilder.generateHTML(reportData);

            // Write to file
            fs.writeFileSync(outputPath, htmlContent, 'utf8');

            console.log(`\n✓ Custom HTML report generated: ${outputPath}`);
        } catch (error) {
            console.error('Failed to generate custom HTML report:', error);
        }
    }

    /**
     * Get full output path
     * @returns {string}
     */
    getOutputPath() {
        return path.resolve(process.cwd(), this.outputDir, this.outputFile);
    }

    /**
     * Get relative path from current working directory
     * @param {string} filePath
     * @returns {string}
     */
    getRelativePath(filePath) {
        return path.relative(process.cwd(), filePath);
    }

    /**
     * Optional: Handle test step events (for detailed logging)
     * @param {Object} test
     * @param {Object} result
     * @param {Object} step
     */
    onStepEnd(test, result, step) {
        // Can be used for detailed step-by-step logging if needed
        // Currently handled by Test.Log methods
    }

    /**
     * Optional: Handle errors
     * @param {Error} error
     */
    onError(error) {
        console.error('Reporter error:', error);
    }
}

export default CustomHtmlReporter;
