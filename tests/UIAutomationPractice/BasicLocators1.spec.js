import {test,expect} from "@playwright/test";
import { stat } from "node:fs";

test("Day1", async function({page}){

    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    expect(page).toHaveTitle('OrangeHRM');

    //Get By Alt Text

    var status = await page.getByAltText('company-branding');
    console.log(`Status of logo is ${status}`)

    await expect(status).toBeVisible();

    //Get By Place Holder
    var statuofusername = await page.getByPlaceholder('Benutzername');
    expect(statuofusername).toBeVisible();

    await page.waitForTimeout(3000);

    await page.getByPlaceholder('Benutzername').fill("Admin");
    await page.getByPlaceholder('Passwort').fill("admin123");


    var status =await page.getByRole('button',{type:'submit'}).isVisible();
    console.log('Status of Button is ${status}');
    await page.getByRole('button',{type:'submit'}).click();

    await page.waitForURL("**/dashboard/index");

    await page.waitForLoadState('load');


    await page.waitForTimeout(3000);

    await page.close();


})