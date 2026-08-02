/**
 * TestLogger - Proper implementation using Playwright test.info().attachments
 *
 * This version stores logs as test attachments which are accessible by the reporter
 */

import { test } from '@playwright/test';

class TestLogger {

    /**
     * Log informational message (Blue)
     */
    static Info(message, details = null) {
        this._addLog('info', message, details);
    }

    /**
     * Log pass/success message (Green)
     */
    static Pass(message, details = null, page = null) {
        this._addLog('pass', message, details, page);
    }

    /**
     * Log failure message with optional screenshot (Red)
     */
    static async Fail(message, details = null, page = null) {
        await this._addLog('fail', message, details, page);
    }

    /**
     * Log error message with optional screenshot (Red)
     */
    static async Error(message, error = null, page = null) {
        const errorDetails = error instanceof Error ? error.message : error;
        await this._addLog('error', message, errorDetails, page);
    }

    /**
     * Log warning message (Orange/Yellow)
     */
    static Warning(message, details = null) {
        this._addLog('warning', message, details);
    }

    /**
     * Log skipped test message (Yellow)
     */
    static Skip(message, details = null) {
        this._addLog('skip', message, details);
    }

    /**
     * Internal method to add a log entry
     */
    static async _addLog(level, message, details = null, page = null) {
        const timestamp = new Date().toISOString();

        // Capture screenshot for fail/error logs
        let screenshot = null;
        if ((level === 'fail' || level === 'error') && page) {
            try {
                const buffer = await page.screenshot({ type: 'png', fullPage: false });
                screenshot = `data:image/png;base64,${buffer.toString('base64')}`;
            } catch (error) {
                console.warn('Failed to capture screenshot:', error.message);
            }
        }

        const logEntry = {
            timestamp,
            level,
            message,
            details,
            screenshot
        };

        // Console output with color coding
        const colors = {
            info: '\x1b[36m',
            pass: '\x1b[32m',
            fail: '\x1b[31m',
            error: '\x1b[31m',
            warning: '\x1b[33m',
            skip: '\x1b[33m'
        };
        const reset = '\x1b[0m';
        const color = colors[level] || reset;

        const prefix = `[${level.toUpperCase()}]`;
        const detailsStr = details ? ` | Details: ${JSON.stringify(details)}` : '';
        console.log(`${color}${prefix} ${message}${detailsStr}${reset}`);

        // Attach log to current test
        try {
            const testInfo = test.info();
            await testInfo.attach(`log-${timestamp}`, {
                body: JSON.stringify(logEntry),
                contentType: 'application/json'
            });
        } catch (error) {
            console.warn('[TestLogger] Not in test context, log not attached');
        }
    }
}

// Export as 'Test' for usage like: Test.Log.Info()
export default class Test {
    static Log = TestLogger;
}
