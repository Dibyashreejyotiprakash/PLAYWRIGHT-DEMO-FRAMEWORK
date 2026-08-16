import {test,expect, chromium, firefox, webkit} from "@playwright/test";

var browser = null;
var context = null;
var page = null;
var url = "https://demo.automationtesting.in/AutoComplete.html";

test.describe("Execute Test with Multiple Browser", async function (){


test.beforeEach("Before Each Function", async function(){
    console.log("Set Up Reporting")
})

test.afterEach("Close Browser and Page Instance", async function(){
    await page.close();
    await browser.close(); 
})

test("Running-Chrome", async ()=>{
    try{
    browser = await chromium.launch({headless: false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);  
    }
    catch(error){
    console.error("Running Chrome Failed due to "+ error);
    }
})

test("Running-Firefox", async ()=>{
    try{
        browser = await firefox.launch({headless: false});
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);
    }
    catch(error){
        console.error("Running Firefox Failed Due to "+ error);
    }
})

test("Running-Safari", async ()=>{
    try{
        browser = await webkit.launch({headless: false});
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(url);
        }
    catch(error)
        {
        console.error("Running Firefox Failed Due to "+ error);
        }
})
})