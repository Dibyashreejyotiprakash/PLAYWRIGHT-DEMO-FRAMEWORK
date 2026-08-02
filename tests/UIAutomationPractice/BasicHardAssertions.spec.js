import {test,expect} from "@playwright/test"
import { stat } from "node:fs";

test("Assertions", async function ({page}){

 await page.goto("https://demo.automationtesting.in/Register.html");

 await expect(page).toHaveURL("https://demo.automationtesting.in/Register.html");

 await expect(page).toHaveTitle("Register");

 var status = await page.getByPlaceholder("First Name").isVisible();
 console.log(`status is ${status}`);

 const fullname = await page.getByPlaceholder('First Name');
 await expect(fullname).toBeVisible();

 const submitbtn = await page.getByText(' Submit ');
 await expect(submitbtn).toBeEnabled();

 const radiobtn = await page.locator("//input[@value='Male']");
 await radiobtn.click();

 await expect(radiobtn).toBeChecked();

 await expect(page.locator("//*[@id='submitbtn']")).toHaveText("Submit");

 const options = await page.locator("//select[@placeholder='Month']/option");
 await expect(options).toHaveCount(13);

 await page.close();

})