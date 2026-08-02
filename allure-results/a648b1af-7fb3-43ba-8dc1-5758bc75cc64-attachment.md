# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateVanityUrl.spec.js >> Load all URLs
- Location: tests\UI_Automation\Smoke\ValidateVanityUrl.spec.js:5:5

# Error details

```
Error: Playwright Test did not expect test() to be called here.
Most common reasons include:
- You are calling test() in a configuration file.
- You are calling test() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
- You are calling test() from an async test.describe() block. Only sync ones are supported.
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
> 15 |        test('Validate Valid Login ', async function({page}) {
     |            ^ Error: Playwright Test did not expect test() to be called here.
  16 |          try{
  17 |           
  18 |             await page.goto(url);
  19 |             await base.page.waitForLoadState('load');
  20 |            
  21 |          }
  22 |          catch (error) {
  23 |            console.error('Error occurred:', error);
  24 |            throw error;
  25 |          }
  26 |        })
  27 | 
  28 |     }
  29 | 
  30 |     
  31 | 
  32 | });
```