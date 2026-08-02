import {test,expect} from "@playwright/test";
import { Dialog } from "puppeteer";

test("Hanlde Alert Pop up",async function({page}){
    await page.goto("https://testautomationpractice.blogspot.com/");

    // Handle Alert
    await page.waitForTimeout(5000);

    await page.on('dialog', async dialog=>{
        dialog.accept();
    })
    await page.locator("//*[@id='alertBtn']").click();

    //await page.waitForTimeout(5000);

    // Handle Confirm Alert

   page.on('dialog', async dialog=>{
        await dialog.accept();
   })

    await page.locator("//*[@id='confirmBtn']").click();


     //await page.waitForTimeout(5000);
    //Handle Prompt Alert
    
   page.on('dialog', async dialog=>{
    await dialog.accept("test");
   })

    await page.locator("//*[@id='promptBtn']").click();

    await page.close();
})