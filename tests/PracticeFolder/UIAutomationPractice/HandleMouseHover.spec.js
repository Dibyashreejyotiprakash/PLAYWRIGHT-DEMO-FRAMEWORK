import {test,expect, chromium} from "@playwright/test";

test.describe("Mouse Hover Action",async()=>{

    test("Mouse Hover", async function(){
        const browser = await chromium.launch({headless:false});
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://testautomationpractice.blogspot.com/");

        const element = await page.getByText("Point Me");
        await element.hover();

        await page.waitForTimeout(7000);

        const element2 = await page.getByText("Mobiles").first;
        await element2.click;

         await page.waitForTimeout(7000);
        await page.close();

        await browser.close();

    })

    test("Double Click", async function ({page}){
        await page.goto("https://testautomationpractice.blogspot.com/");
        await page.getByText("Copy Text").dblclick();
        await page.waitForTimeout(5000);
    })

    test("Drag and Drop", async function ({page}){
        await page.goto("https://testautomationpractice.blogspot.com/");
        const destination = await page.getByText("Drop here");
        await page.getByText("Drag me to my target").dragTo(destination);
        await page.waitForTimeout(5000);
    })

})