import {test,expect, chromium} from "@playwright/test"

test("Handle Frames", async function (){

    const browser = await chromium.launch({headless:false});
    const conetxt = await browser.newContext();
    const page = await conetxt.newPage();

    await page.goto("https://ui.vision/demo/webtest/frames/");

    const framecount = await page.frames();
    console.log("No of Frames =="+ framecount.length);
    const frame_inputbox =await page.frameLocator("input[name='mytext1']").locator("//*[@name='mytext1']");
    await frame_inputbox.fill("automation");

    await page.waitForTimeout(5000);
})