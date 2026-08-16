import {test,expect} from "@playwright/test";
import { loadEnvFile } from "node:process";

test("Handle Check Box" ,async function ({page}){

    await page.goto("https://demo.automationtesting.in/Register.html");

    const checkbox = await page.locator("//*[@id='checkbox1']");
    await checkbox.click();
    expect.soft(checkbox).toBeChecked();
    expect(checkbox).toBeEnabled();

    const allcheckboxes = [
        "//input[@id='checkbox1']",
        "//input[@id='checkbox2']",
        "//input[@id='checkbox3']"
    ]

    for(const checkbox1 of allcheckboxes){
        await page.locator(checkbox1).click();
        await page.waitForTimeout(3000);
    }
})