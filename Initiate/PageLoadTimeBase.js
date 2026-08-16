import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import dotenv from 'dotenv';

dotenv.config();

class PageLoadTimeBase {

    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.lighthouseResults = null;
        this.cdpPort = 9222;
    }

    async launchBrowserForPerformance() {
        try {
            const browsername = await this.getBrowser();

            if (browsername !== "chromium") {
                throw new Error(`Lighthouse only supports Chromium. Current browser: ${browsername}. Please set browsername=chromium in .env file.`);
            }

            // Viewport configuration options:
            // Standard HD: { width: 1920, height: 1080 }
            // Ultra-wide: { width: 2560, height: 1440 }
            // 4K: { width: 3840, height: 2160 }
            const viewportWidth = process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 2560;
            const viewportHeight = process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1440;
            const zoomLevel = process.env.ZOOM_LEVEL ? parseFloat(process.env.ZOOM_LEVEL) : 1.0;

            this.browser = await chromium.launch({
                headless: false,
                args: [
                    `--remote-debugging-port=${this.cdpPort}`,
                    '--start-maximized',
                    `--force-device-scale-factor=${zoomLevel}`
                ]
            });

            this.context = await this.browser.newContext({
                viewport: { width: viewportWidth, height: viewportHeight },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                deviceScaleFactor: zoomLevel
            });

            this.page = await this.context.newPage();

            // Log viewport configuration
            console.log(`\n📐 Viewport Configuration:`);
            console.log(`   Width: ${viewportWidth}px`);
            console.log(`   Height: ${viewportHeight}px`);
            console.log(`   Zoom Level: ${zoomLevel}x\n`);

            if (!this.page) {
                throw new Error("Failed to create page object");
            }

        } catch (error) {
            console.error("Error in launching browser for performance: " + error);
            throw error;
        }
    }

    async getBrowser() {
        const browsername = process.env.browsername;
        if (!browsername) {
            throw new Error("browsername not found in environment variables. Check .env file.");
        }
        return browsername;
    }

    async getEnvVariable() {
        const envVariable = process.env.environment;
        if (!envVariable) {
            throw new Error("environment not found in environment variables. Check .env file.");
        }
        return envVariable;
    }

    async getUrlForEnvironment() {
        try {
            const env = await this.getEnvVariable();
            let url;

            if (env === "prod") {
                url = process.env.prod_url;
            } else if (env === "stage") {
                url = process.env.stage_url;
            } else if (env === "qa") {
                url = process.env.qa_url;
            } else {
                throw new Error(`Invalid environment: ${env}. Expected: prod, stage, or qa`);
            }

            if (!url) {
                throw new Error(`URL not found for environment: ${env}. Check .env file.`);
            }

            return url;
        } catch (error) {
            console.error("Error in getting URL: " + error);
            throw error;
        }
    }

    async runLighthouseAudit(url) {
        try {
            if (!url) {
                throw new Error("URL is required for Lighthouse audit");
            }

            console.log(`Running Lighthouse audit for: ${url}`);

            const options = {
                logLevel: 'info',
                output: 'json',
                onlyCategories: ['performance'],
                port: this.cdpPort,
                disableStorageReset: true
            };

            const runnerResult = await lighthouse(url, options);

            if (!runnerResult || !runnerResult.lhr) {
                throw new Error("Lighthouse audit failed to return results");
            }

            this.lighthouseResults = runnerResult.lhr;

            const metrics = await this.getPerformanceMetrics();

            return metrics;

        } catch (error) {
            console.error("Error in running Lighthouse audit: " + error);
            throw error;
        }
    }

    async getPerformanceMetrics() {
        try {
            if (!this.lighthouseResults) {
                throw new Error("No Lighthouse results available. Run runLighthouseAudit() first.");
            }

            const audits = this.lighthouseResults.audits;
            const categories = this.lighthouseResults.categories;

            const metrics = {
                performanceScore: Math.round(categories.performance.score * 100),

                lcp: audits['largest-contentful-paint']?.numericValue
                    ? Math.round(audits['largest-contentful-paint'].numericValue)
                    : null,

                speedIndex: audits['speed-index']?.numericValue
                    ? Math.round(audits['speed-index'].numericValue)
                    : null,

                fcp: audits['first-contentful-paint']?.numericValue
                    ? Math.round(audits['first-contentful-paint'].numericValue)
                    : null,

                cls: audits['cumulative-layout-shift']?.numericValue
                    ? parseFloat(audits['cumulative-layout-shift'].numericValue.toFixed(3))
                    : null,

                tbt: audits['total-blocking-time']?.numericValue
                    ? Math.round(audits['total-blocking-time'].numericValue)
                    : null,

                ttfb: audits['server-response-time']?.numericValue
                    ? Math.round(audits['server-response-time'].numericValue)
                    : null,

                tti: audits['interactive']?.numericValue
                    ? Math.round(audits['interactive'].numericValue)
                    : null,

                si: audits['speed-index']?.numericValue
                    ? Math.round(audits['speed-index'].numericValue)
                    : null
            };

            metrics.url = this.lighthouseResults.finalUrl || this.lighthouseResults.requestedUrl;
            metrics.timestamp = new Date().toISOString();
            metrics.fetchTime = this.lighthouseResults.fetchTime;

            return metrics;

        } catch (error) {
            console.error("Error in getting performance metrics: " + error);
            throw error;
        }
    }

    async navigateToUrl(url) {
        try {
            if (!this.page) {
                throw new Error("Page object not initialized. Call launchBrowserForPerformance() first.");
            }

            await this.page.goto(url);
            await this.page.waitForLoadState('load');

        } catch (error) {
            console.error("Error in navigating to URL: " + error);
            throw error;
        }
    }

    async closeBrowser() {
        try {
            if (this.context) {
                await this.context.close();
            }
            if (this.browser) {
                await this.browser.close();
            }
        } catch (error) {
            console.error("Error in closing browser: " + error);
            throw error;
        }
    }
}

export default PageLoadTimeBase;
