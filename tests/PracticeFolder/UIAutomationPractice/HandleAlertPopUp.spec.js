import { test, expect } from "@playwright/test";

test("Handle Simple Alert", async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

    page.on('dialog', async (d) => {

        expect(d.type()).toContain("alert");

        expect(d.message()).toContain("I am a JS Alert");

        await d.accept();

    });

    await page.locator("//button[text()='Click for JS Alert']").click();
     await page.close();

});

test("Handle Confirm Alert", async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

    page.on('dialog', async (d) => {

        expect(d.type()).toContain("confirm");

        expect(d.message()).toContain("I am a JS Confirm");


        //await d.cancel();
        await d.accept();

    });

    await page.locator("//button[text()='Click for JS Confirm']").click();
     await page.close();

});


test("Handle Prompt Alert", async ({ page }) => {

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");

    page.on('dialog', async (d) => {

        expect(d.type()).toContain("prompt");

        expect(d.message()).toContain("I am a JS prompt");

        await d.accept().finally('Test Passed');



    });

    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();

    await page.close();

});




