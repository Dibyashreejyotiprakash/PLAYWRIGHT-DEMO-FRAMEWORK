import {test, expect, chromium, firefox, webkit} from '@playwright/test';
import Base from '../../../Initiate/Base.js';
import LoginPage from '../../../PageObjects/LoginPage.js';
const testdata = JSON.parse(JSON.stringify(require('../../../Testdata/smoketestdata.json')));

const base = new Base();
let loginPage=null;

test.describe('Validate Login Functionality', () => {

test.beforeAll(async function() {
  await base.launchBrowser();
  await base.launchapplication();
  loginPage = new LoginPage(base.page);
})

test.afterAll(async function() {
  if (base.context) {
    await base.context.close();
  }
  if (base.browser) {
    await base.browser.close();
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
   let username = testdata.credentials.username;
   let password = testdata.credentials.password;

   if (!username || !password) {
     throw new Error('Username or password not found in environment variables. Check .env file.');
   }

   console.log('Attempting login with username:', username);
   await loginPage.login(username,password);
  }
  catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
})


test('Validate Current URL and Title ', async function() {
  try{
     let currentUrl = base.page.url();
     console.log('Current URL before invalid login attempt:', currentUrl);
     let expectedurl = testdata.expectedurls.dashboard;
     expect(currentUrl).toBe(expectedurl);

      let title = await base.page.title();
      console.log('Page title after login:', title);
      expect(title).toBe(testdata.expectedtitles.dashboard);
  }
  catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
})



})
