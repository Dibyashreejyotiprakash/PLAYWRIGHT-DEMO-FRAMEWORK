import { test, expect, chromium } from '@playwright/test';

test("Handle Multiple Windows", async () => {

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://demoqa.com/");

    await page.getByText("Alerts, Frame & Windows").click();
    await page.getByText("Browser Windows").click();

    console.log("Parent URL :", page.url());

    const [newWindow] = await Promise.all([
        context.waitForEvent("page"),
        page.locator("#windowButton").click()
    ]);

    await newWindow.waitForLoadState();

    
    console.log("New Window URL  :", newWindow.url());

    await expect(newWindow).toHaveURL(/sample/);

    await newWindow.close();

    await page.waitForTimeout(3000);

    await page.close();

    await context.close();

    await browser.close();
});