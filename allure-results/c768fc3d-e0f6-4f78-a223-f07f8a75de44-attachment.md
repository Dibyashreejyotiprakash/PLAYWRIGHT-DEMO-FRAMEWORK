# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Performance_Automation\LighthouseTest.spec.js >> Lighthouse Performance Tests >> Measure LCP and Speed Index for Homepage
- Location: tests\Performance_Automation\LighthouseTest.spec.js:31:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
ProtocolError: Protocol error (Target.closeTarget): No target with given id found
```

# Test source

```ts
  24  | 
  25  |             // Viewport configuration options:
  26  |             // Standard HD: { width: 1920, height: 1080 }
  27  |             // Ultra-wide: { width: 2560, height: 1440 }
  28  |             // 4K: { width: 3840, height: 2160 }
  29  |             const viewportWidth = process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 2560;
  30  |             const viewportHeight = process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1440;
  31  |             const zoomLevel = process.env.ZOOM_LEVEL ? parseFloat(process.env.ZOOM_LEVEL) : 1.0;
  32  | 
  33  |             this.browser = await chromium.launch({
  34  |                 headless: false,
  35  |                 args: [
  36  |                     `--remote-debugging-port=${this.cdpPort}`,
  37  |                     '--start-maximized',
  38  |                     `--force-device-scale-factor=${zoomLevel}`
  39  |                 ]
  40  |             });
  41  | 
  42  |             this.context = await this.browser.newContext({
  43  |                 viewport: { width: viewportWidth, height: viewportHeight },
  44  |                 userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  45  |                 deviceScaleFactor: zoomLevel
  46  |             });
  47  | 
  48  |             this.page = await this.context.newPage();
  49  | 
  50  |             // Log viewport configuration
  51  |             console.log(`\n📐 Viewport Configuration:`);
  52  |             console.log(`   Width: ${viewportWidth}px`);
  53  |             console.log(`   Height: ${viewportHeight}px`);
  54  |             console.log(`   Zoom Level: ${zoomLevel}x\n`);
  55  | 
  56  |             if (!this.page) {
  57  |                 throw new Error("Failed to create page object");
  58  |             }
  59  | 
  60  |         } catch (error) {
  61  |             console.error("Error in launching browser for performance: " + error);
  62  |             throw error;
  63  |         }
  64  |     }
  65  | 
  66  |     async getBrowser() {
  67  |         const browsername = process.env.browsername;
  68  |         if (!browsername) {
  69  |             throw new Error("browsername not found in environment variables. Check .env file.");
  70  |         }
  71  |         return browsername;
  72  |     }
  73  | 
  74  |     async getEnvVariable() {
  75  |         const envVariable = process.env.environment;
  76  |         if (!envVariable) {
  77  |             throw new Error("environment not found in environment variables. Check .env file.");
  78  |         }
  79  |         return envVariable;
  80  |     }
  81  | 
  82  |     async getUrlForEnvironment() {
  83  |         try {
  84  |             const env = await this.getEnvVariable();
  85  |             let url;
  86  | 
  87  |             if (env === "prod") {
  88  |                 url = process.env.prod_url;
  89  |             } else if (env === "stage") {
  90  |                 url = process.env.stage_url;
  91  |             } else if (env === "qa") {
  92  |                 url = process.env.qa_url;
  93  |             } else {
  94  |                 throw new Error(`Invalid environment: ${env}. Expected: prod, stage, or qa`);
  95  |             }
  96  | 
  97  |             if (!url) {
  98  |                 throw new Error(`URL not found for environment: ${env}. Check .env file.`);
  99  |             }
  100 | 
  101 |             return url;
  102 |         } catch (error) {
  103 |             console.error("Error in getting URL: " + error);
  104 |             throw error;
  105 |         }
  106 |     }
  107 | 
  108 |     async runLighthouseAudit(url) {
  109 |         try {
  110 |             if (!url) {
  111 |                 throw new Error("URL is required for Lighthouse audit");
  112 |             }
  113 | 
  114 |             console.log(`Running Lighthouse audit for: ${url}`);
  115 | 
  116 |             const options = {
  117 |                 logLevel: 'info',
  118 |                 output: 'json',
  119 |                 onlyCategories: ['performance'],
  120 |                 port: this.cdpPort,
  121 |                 disableStorageReset: true
  122 |             };
  123 | 
> 124 |             const runnerResult = await lighthouse(url, options);
      |                                  ^ ProtocolError: Protocol error (Target.closeTarget): No target with given id found
  125 | 
  126 |             if (!runnerResult || !runnerResult.lhr) {
  127 |                 throw new Error("Lighthouse audit failed to return results");
  128 |             }
  129 | 
  130 |             this.lighthouseResults = runnerResult.lhr;
  131 | 
  132 |             const metrics = await this.getPerformanceMetrics();
  133 | 
  134 |             return metrics;
  135 | 
  136 |         } catch (error) {
  137 |             console.error("Error in running Lighthouse audit: " + error);
  138 |             throw error;
  139 |         }
  140 |     }
  141 | 
  142 |     async getPerformanceMetrics() {
  143 |         try {
  144 |             if (!this.lighthouseResults) {
  145 |                 throw new Error("No Lighthouse results available. Run runLighthouseAudit() first.");
  146 |             }
  147 | 
  148 |             const audits = this.lighthouseResults.audits;
  149 |             const categories = this.lighthouseResults.categories;
  150 | 
  151 |             const metrics = {
  152 |                 performanceScore: Math.round(categories.performance.score * 100),
  153 | 
  154 |                 lcp: audits['largest-contentful-paint']?.numericValue
  155 |                     ? Math.round(audits['largest-contentful-paint'].numericValue)
  156 |                     : null,
  157 | 
  158 |                 speedIndex: audits['speed-index']?.numericValue
  159 |                     ? Math.round(audits['speed-index'].numericValue)
  160 |                     : null,
  161 | 
  162 |                 fcp: audits['first-contentful-paint']?.numericValue
  163 |                     ? Math.round(audits['first-contentful-paint'].numericValue)
  164 |                     : null,
  165 | 
  166 |                 cls: audits['cumulative-layout-shift']?.numericValue
  167 |                     ? parseFloat(audits['cumulative-layout-shift'].numericValue.toFixed(3))
  168 |                     : null,
  169 | 
  170 |                 tbt: audits['total-blocking-time']?.numericValue
  171 |                     ? Math.round(audits['total-blocking-time'].numericValue)
  172 |                     : null,
  173 | 
  174 |                 ttfb: audits['server-response-time']?.numericValue
  175 |                     ? Math.round(audits['server-response-time'].numericValue)
  176 |                     : null,
  177 | 
  178 |                 tti: audits['interactive']?.numericValue
  179 |                     ? Math.round(audits['interactive'].numericValue)
  180 |                     : null,
  181 | 
  182 |                 si: audits['speed-index']?.numericValue
  183 |                     ? Math.round(audits['speed-index'].numericValue)
  184 |                     : null
  185 |             };
  186 | 
  187 |             metrics.url = this.lighthouseResults.finalUrl || this.lighthouseResults.requestedUrl;
  188 |             metrics.timestamp = new Date().toISOString();
  189 |             metrics.fetchTime = this.lighthouseResults.fetchTime;
  190 | 
  191 |             return metrics;
  192 | 
  193 |         } catch (error) {
  194 |             console.error("Error in getting performance metrics: " + error);
  195 |             throw error;
  196 |         }
  197 |     }
  198 | 
  199 |     async navigateToUrl(url) {
  200 |         try {
  201 |             if (!this.page) {
  202 |                 throw new Error("Page object not initialized. Call launchBrowserForPerformance() first.");
  203 |             }
  204 | 
  205 |             await this.page.goto(url);
  206 |             await this.page.waitForLoadState('load');
  207 | 
  208 |         } catch (error) {
  209 |             console.error("Error in navigating to URL: " + error);
  210 |             throw error;
  211 |         }
  212 |     }
  213 | 
  214 |     async closeBrowser() {
  215 |         try {
  216 |             if (this.context) {
  217 |                 await this.context.close();
  218 |             }
  219 |             if (this.browser) {
  220 |                 await this.browser.close();
  221 |             }
  222 |         } catch (error) {
  223 |             console.error("Error in closing browser: " + error);
  224 |             throw error;
```