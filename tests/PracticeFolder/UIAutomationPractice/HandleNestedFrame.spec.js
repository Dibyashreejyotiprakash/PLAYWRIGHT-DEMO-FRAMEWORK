import { test } from '@playwright/test';

test.only("nested frames", async ({ page }) => {

    // Nested Frames
    await page.goto("https://play1.automationcamp.ir/frames.html");

    const parentFrame = page.frameLocator("#frame1");
    // page.frame({ name: 'nameoframe' })

    const childFrame = parentFrame.frameLocator("#frame2");

    await childFrame.locator("#click_me_2").click();

    await page.waitForTimeout(5000);

    await page.close();
});