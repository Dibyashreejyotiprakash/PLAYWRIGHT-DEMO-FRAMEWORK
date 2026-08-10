import {test, expect, chromium, firefox, webkit} from '@playwright/test';
import Base from '../../../Initiate/Base.js';
import LoginPage from '../../../PageObjects/LoginPage.js';
import Interaction from '../../../Utility/UIInteraction/Interaction.js';
import Test from '../../../Utility/ReportUtility/TestLogger.js';
import testdata from '../../../Testdata/smoketestdata.json';
import HomePage  from '../../../PageObjects/HomePage.js';


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
  homepage = new HomePage(base.page);
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


test('Validate PIM Filelds ', async function() {
  try{
   Test.Log.Info('========== Test Case: Validate Valid PIM ==========');
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


   //Validate PIM
   await homepage.ClickOnPIM();
   Test.Log.Info("Clicked on PIM");


  }
  catch (error) {
    await Test.Log.Fail('✗ Login validation test failed', error.message, base.page);
    console.error('Error occurred:', error);
    throw error;
  }
})






})
