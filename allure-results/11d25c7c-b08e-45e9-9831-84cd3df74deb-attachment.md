# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateVanityUrl.spec.js >> Load all URLs
- Location: tests\UI_Automation\Smoke\ValidateVanityUrl.spec.js:5:5

# Error details

```
ReferenceError: chromium is not defined
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import ReadJson from "../../../Utility/FileReader/JsonReader.js";
  3  | import Base from '../../../Initiate/Base.js';
  4  | 
  5  | test("Load all URLs", async () => {
  6  | 
  7  |     const file = "./TestData/prodvanityurl.json";
  8  | 
  9  |     const urls = ReadJson.GetValue(file, "ProdVanityUrl");
  10 | 
  11 |     const base = new Base();
  12 | 
  13 |     for (const url of urls) {
  14 | 
  15 |          try{
  16 |             
> 17 |             const browser = await chromium.launch({ headless: false });
     |                             ^ ReferenceError: chromium is not defined
  18 |             const context = await browser.newContext();
  19 |             const page = await context.newPage();
  20 | 
  21 | 
  22 | 
  23 |             await page.goto(url);
  24 |             await page.waitForLoadState('load');
  25 |             let title = await page.title();
  26 |             console.log('Title for URL', url, ':', title);
  27 |             await page.waitForTimeout(2000);
  28 |             await page.close();
  29 |            
  30 |          }
  31 |          catch (error) {
  32 |            console.error('Error occurred:', error);
  33 |            throw error;
  34 |          }
  35 |     }    
  36 | 
  37 | });
```