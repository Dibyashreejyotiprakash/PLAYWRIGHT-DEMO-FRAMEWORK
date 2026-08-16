import {test,expect} from "@playwright/test"

test("Handle Input Box", async function({page}){
    await page.goto("https://demo.automationtesting.in/Register.html");

    const username = await page.getByPlaceholder("First Name");
    await expect(username).toBeVisible();
    await expect(username).toBeEnabled();
    await expect(username).toBeEditable();
    await expect(username).toBeEmpty();

    await username.fill("admin");

    await page.waitForTimeout(40000);

    await page.close();

})