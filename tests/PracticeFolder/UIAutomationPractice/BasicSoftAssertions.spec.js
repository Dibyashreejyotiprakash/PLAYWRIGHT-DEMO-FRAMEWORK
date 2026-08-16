import {test,expect} from "@playwright/test"
import { stat } from "node:fs";

test("Assertions", async function ({page}){

 await page.goto("https://demo.automationtesting.in/Register.html");

 await expect.soft(page).toHaveURL("https://demo.automationtesting.in/Register.html");

 await expect.soft(page).toHaveTitle("Register");

 var status = await page.getByPlaceholder("First Name").isVisible();
 console.log(`status is ${status}`);

 const fullname = await page.getByPlaceholder('First Name');
 await expect.soft(fullname).toBeVisible();

 const submitbtn = await page.getByText(' Submit ');
 await expect.soft(submitbtn).toBeEnabled();

 const radiobtn = await page.locator("//input[@value='Male']");
 await radiobtn.click();

 await expect.soft(radiobtn).toBeChecked();

 await expect.soft(page.locator("//*[@id='submitbtn']")).toHaveText("Submit");

 const options = await page.locator("//select[@placeholder='Month']/option");
 await expect.soft(options).toHaveCount(13);

 await page.close();

})