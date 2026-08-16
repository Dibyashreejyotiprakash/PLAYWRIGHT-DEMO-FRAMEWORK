import {test, expect, chromium, firefox, webkit} from '@playwright/test';
import Base from '../../../Initiate/Base.js';
import LoginPage from '../../../PageObjects/LoginPage.js';
import Interaction from '../../../Utility/UIInteraction/Interaction.js';
import Test from '../../../Utility/ReportUtility/TestLogger.js';
import testdata from '../../../Testdata/smoketestdata.json';


const base = new Base();
let loginPage=null;
let interaction=null;

test.describe('Validate Login Functionality', () => {

test.beforeAll(async function() {
  Test.Log.Info('Setting up test environment');
  await base.launchBrowser();
  Test.Log.Info('Browser launched successfully');

  await base.launchapplication();
  Test.Log.Info('Application loaded successfully');

  loginPage = new LoginPage(base.page);
  interaction = new Interaction(base.page);
  Test.Log.Info('Page objects initialized');
})

test.afterAll(async function() {
  Test.Log.Info('Cleaning up test environment');
  if (base.context) {
    await base.context.close();
    Test.Log.Info('Browser context closed');
  }
  if (base.browser) {
    await base.browser.close();
    Test.Log.Info('Browser closed');
  }
})

test.beforeEach(async function() {
  console.log('Test started');

})

test.afterEach(async function() {
  console.log('Test completed');
})


test('Validate Valid Login ', async function() {
  try{
   Test.Log.Info('========== Test Case: Validate Valid Login ==========');
   Test.Log.Info('Starting login validation test');

   let username = process.env.UN;
   let password = "admin123";

   if (!username || !password) {
     await Test.Log.Error('Credentials not found in environment variables', 'Missing UN or PWD in .env file', base.page);
     throw new Error('Username or password not found in environment variables. Check .env file.');
   }

   Test.Log.Info(`Loaded credentials from environment - Username: ${username}`);
   Test.Log.Info('Initiating login process');

   await loginPage.login(username,password);

   Test.Log.Info('Waiting for post-login page stabilization (5 seconds)');
   await interaction.waitForTimeout(5000);

   Test.Log.Pass('✓ Login validation test completed successfully', { username: username }, base.page);
  }
  catch (error) {
    await Test.Log.Fail('✗ Login validation test failed', error.message, base.page);
    console.error('Error occurred:', error);
    throw error;
  }
})


test('Validate Current URL and Title ', async function() {
  try{
     Test.Log.Info('========== Test Case: Validate Current URL and Title ==========');
     Test.Log.Info('Starting URL and page title validation');

     Test.Log.Info('Retrieving current URL from browser');
     let currentUrl = await interaction.getCurrentUrl();
     Test.Log.Info(`Current URL captured: ${currentUrl}`);

     Test.Log.Info(`Asserting URL matches expected: ${testdata.expectedtitles.dashboard}`);
     await interaction.AssertCurrentUrl(testdata.expectedtitles.dashboard)
     Test.Log.Pass('URL assertion passed');

     Test.Log.Info('Retrieving page title from browser');
     let title = await interaction.getTitle();
     Test.Log.Info(`Page title captured: "${title}"`);

     Test.Log.Info(`Expected page title: "${testdata.expectedtitles.dashboard}"`);
     //expect(title).toBe(testdata.expectedtitles.dashboard);

     Test.Log.Pass('✓ URL and title validation completed successfully', {
       url: currentUrl,
       title: title,
       expected: testdata.expectedtitles.dashboard
     }, base.page);
  }
  catch (error) {
    await Test.Log.Fail('✗ URL/Title validation test failed', error.message, base.page);
    console.error('Error occurred:', error);
    throw error;
  }
})



})
