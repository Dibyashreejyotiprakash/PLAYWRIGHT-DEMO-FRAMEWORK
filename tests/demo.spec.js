import {test, expect, chromium, firefox, webkit} from '@playwright/test';
import Base from '../Initiate/Base.js';

const base = new Base();

test.describe('Demo Test Suite', () => {

test.beforeAll(async function() {
  await base.launchBrowser();
   await base.getUrl();
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


test('Validate Title', async function() {
  try{

  const title = await base.page.title();
  expect(title).toBe('Automation Testing Practice');
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
})

test('Validate Current Url', async function() {
  try{
  const url = base.page.url();
  expect(url).toBe('https://testautomationpractice.blogspot.com/');
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
})

})
