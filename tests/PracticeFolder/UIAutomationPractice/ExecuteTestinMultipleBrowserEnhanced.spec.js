import {test,expect, chromium, firefox, webkit} from "@playwright/test";

var browser = null;
var context = null;
var page = null;
var url = "https://demo.automationtesting.in/AutoComplete.html";

test.describe("Execute Test with Multiple Browser", async function (){

test("Running-Chrome", async ()=>{
    browser = await chromium.launch({headless: false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);
    await page.close();
    await browser.close();   
})

test("Running-Firefox", async ()=>{
    browser = await firefox.launch({headless: false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);
    await page.close();
    await browser.close();   
})

test("Running-Safari", async ()=>{
    browser = await webkit.launch({headless: false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);
    await page.close();
    await browser.close();   
})
})