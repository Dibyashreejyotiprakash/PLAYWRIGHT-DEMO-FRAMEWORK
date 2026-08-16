import { test, chromium } from '@playwright/test';

test.only("Handle Multiple Tabs", async () => {

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://demoqa.com/");
    await page.locator("text = Alerts, Frame & Windows").click();
    await page.locator("text = Browser Windows").click();


    // Handle Multiple Tabs
    const [newTab] = await Promise.all([
        page.waitForEvent("popup"),
        page.locator("#tabButton").click()
    ]);

    await newTab.waitForLoadState();

    console.log("New tab url : ", newTab.url());

    await newTab.waitForTimeout(5000);

    await newTab.close();

    await page.waitForTimeout(5000);

    await page.close();

    await context.close();

    await browser.close();
});