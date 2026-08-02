# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateVanityUrl.spec.js >> Load all URLs
- Location: tests\UI_Automation\Smoke\ValidateVanityUrl.spec.js:24:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://opensource-demo.orangehrmlive.com/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect,chromium } from "@playwright/test";
  2  | import ReadJson from "../../../Utility/FileReader/JsonReader.js";
  3  | import Base from '../../../Initiate/Base.js';
  4  | 
  5  | 
  6  | let browser = null;
  7  | let context = null;
  8  | let page = null;
  9  | 
  10 | test.beforeAll(async() => {
  11 |             browser = await chromium.launch({ headless: false });
  12 |             context = await browser.newContext();
  13 |             page = await context.newPage();
  14 | }); 
  15 | 
  16 | test.afterAll(async() => {
  17 |             await page.close();
  18 |             await context.close();
  19 |             await browser.close();
  20 | });
  21 | 
  22 | 
  23 | 
  24 | test("Load all URLs", async () => {
  25 | 
  26 |     const file = "./TestData/prodvanityurl.json";
  27 |     const urls = ReadJson.GetValue(file, "ProdVanityUrl");
  28 | 
  29 |     for (const url of urls) {
  30 | 
  31 |          try{
> 32 |             await page.goto(url);
     |                        ^ Error: page.goto: Target page, context or browser has been closed
  33 |             await page.waitForLoadState('load');
  34 |             let title = await page.title();
  35 |             console.log('Title for URL', url, ':', title);
  36 |             await page.waitForTimeout(2000);
  37 |             
  38 |          }
  39 |          catch (error) {
  40 |            console.error('Error occurred:', error);
  41 |            throw error;
  42 |          }
  43 |     }    
  44 | 
  45 | });
```