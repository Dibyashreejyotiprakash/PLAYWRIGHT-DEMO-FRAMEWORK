import {test,expect} from "@playwright/test";
import { stat } from "node:fs";

test("Day1", async function({page}){

    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

     expect(page).toHaveTitle('OrangeHRM');

    await page.waitForLoadState('load');

    await page.waitForSelector("//input[@placeholder='Username']");

     await page.getByPlaceholder('Username').fill("Admin");
    await page.getByPlaceholder('Password').fill("admin123");


    var status =await page.getByRole('button',{type:'submit'}).isVisible();
    console.log('Status of Button is ${status}');
    await page.getByRole('button',{type:'submit'}).click();

    await page.waitForURL("**/dashboard/index");

    await page.waitForLoadState('load');

    await page.locator("//*[text()='Admin']").click();

    await page.waitForLoadState('load');

    await page.waitForTimeout(300000);

    await page.locator("(//input[@class='oxd-input oxd-input--active'])[2]").fill("test");
    await page.getByText("Search").click();

    
    await page.close();


})