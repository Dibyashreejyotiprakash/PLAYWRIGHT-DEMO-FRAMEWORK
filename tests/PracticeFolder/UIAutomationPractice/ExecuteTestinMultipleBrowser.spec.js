import {test,expect, chromium, firefox, webkit} from "@playwright/test";

test.describe("Execute Test with Multiple Browser", async function (){

    // test.describe.configure({ mode: 'parallel' });

    test("Handle Auto Suggest Drop Down-Chrome", async ()=>{

    const browser = await chromium.launch({headless: false});

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto("https://demo.automationtesting.in/AutoComplete.html");

    // Your test steps

    await page.close();
    await browser.close();   
})

test("Handle Auto Suggest Drop Down-Firefox", async ()=>{

    const browser = await firefox.launch({headless: false});

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto("https://demo.automationtesting.in/AutoComplete.html");

    await page.waitForTimeout(7000);

    // Your test steps

    await page.close();
    await browser.close();   
})

test("Handle Auto Suggest Drop Down-Safari", async ()=>{

    const browser = await webkit.launch({headless: false});

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto("https://demo.automationtesting.in/AutoComplete.html");

    // Your test steps

    await page.close();
    await browser.close();   
})
})