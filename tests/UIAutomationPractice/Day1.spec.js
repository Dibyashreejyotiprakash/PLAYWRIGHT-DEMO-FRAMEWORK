import {test,expect} from "@playwright/test";

test("Loactors in Playwright",async function(){

    const browser = await chromium.launch({headless:false});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://testautomationpractice.blogspot.com/");
    
    const pagetitle = await page.title();
    await pagetitle.toBe("");

    await expect(page).toHavetitle("Practice Page");
    await expect(page).toHaveURL("https://testautomationpractice.blogspot.com/");

    let textbox = await page.getByPlaceholder("Enter Name");
    await expect(textbox).tobeVisible();
    await expect(textbox).tobeEnabled();


})