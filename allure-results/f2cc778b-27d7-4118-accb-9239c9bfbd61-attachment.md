# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateVanityUrl.spec.js >> Load all URLs
- Location: tests\UI_Automation\Smoke\ValidateVanityUrl.spec.js:5:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import ReadJson from "../../../Utility/FileReader/JsonReader.js";
  3  | import Base from '../../../Initiate/Base.js';
  4  | 
  5  | test("Load all URLs", async ({ page }) => {
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
> 17 |             await page.goto(url);
     |                        ^ Error: page.goto: Target page, context or browser has been closed
  18 |             await page.waitForLoadState('load');
  19 |             let title = await page.title();
  20 |             console.log('Title for URL', url, ':', title);
  21 |             await page.waitForTimeout(2000);
  22 |             await page.close();
  23 |            
  24 |          }
  25 |          catch (error) {
  26 |            console.error('Error occurred:', error);
  27 |            throw error;
  28 |          }
  29 |     }    
  30 | 
  31 | });
```