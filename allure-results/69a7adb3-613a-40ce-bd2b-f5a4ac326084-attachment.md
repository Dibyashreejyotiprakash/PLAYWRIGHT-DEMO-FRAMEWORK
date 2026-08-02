# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateLoginTest.spec.js >> Validate Login Functionality >> Validate Current URL and Title 
- Location: tests\UI_Automation\Smoke\ValidateLoginTest.spec.js:59:5

# Error details

```
TypeError: interaction.currentUrl is not a function
```

# Test source

```ts
  1  | import {test, expect, chromium, firefox, webkit} from '@playwright/test';
  2  | import Base from '../../../Initiate/Base.js';
  3  | import LoginPage from '../../../PageObjects/LoginPage.js';
  4  | import Interaction from '../../../Utility/UIInteraction/Interaction.js';
  5  | 
  6  | 
  7  | const testdata = JSON.parse(JSON.stringify(require('../../../Testdata/smoketestdata.json')));
  8  | const base = new Base();
  9  | const interaction = new Interaction();
  10 | 
  11 | let loginPage=null;
  12 | 
  13 | test.describe('Validate Login Functionality', () => {
  14 | 
  15 | test.beforeAll(async function() {
  16 |   await base.launchBrowser();
  17 |   await base.launchapplication();
  18 |   loginPage = new LoginPage(base.page);
  19 | })
  20 | 
  21 | test.afterAll(async function() {
  22 |   if (base.context) {
  23 |     await base.context.close();
  24 |   }
  25 |   if (base.browser) {
  26 |     await base.browser.close();
  27 |   }
  28 | })
  29 | 
  30 | test.beforeEach(async function() {
  31 |   console.log('Test started');
  32 | 
  33 | })
  34 | 
  35 | test.afterEach(async function() {
  36 |   console.log('Test completed');
  37 | })
  38 | 
  39 | 
  40 | test('Validate Valid Login ', async function() {
  41 |   try{
  42 |    let username = process.env.UN;
  43 |    let password = process.env.PWD;
  44 | 
  45 |    if (!username || !password) {
  46 |      throw new Error('Username or password not found in environment variables. Check .env file.');
  47 |    }
  48 | 
  49 |    console.log('Attempting login with username:', username);
  50 |    await loginPage.login(username,password);
  51 |   }
  52 |   catch (error) {
  53 |     console.error('Error occurred:', error);
  54 |     throw error;
  55 |   }
  56 | })
  57 | 
  58 | 
  59 | test('Validate Current URL and Title ', async function() {
  60 |   try{
> 61 |      let currentUrl = await interaction.currentUrl();
     |                                         ^ TypeError: interaction.currentUrl is not a function
  62 |      console.log('Current URL before invalid login attempt:', currentUrl);
  63 |      await interaction.AssertCurrentUrl(testdata.expectedtitles.dashboard)
  64 | 
  65 |       let title = await base.page.title();
  66 |       console.log('Page title after login:', title);
  67 |       expect(title).toBe(testdata.expectedtitles.dashboard);
  68 |   }
  69 |   catch (error) {
  70 |     console.error('Error occurred:', error);
  71 |     throw error;
  72 |   }
  73 | })
  74 | 
  75 | 
  76 | 
  77 | })
  78 | 
```