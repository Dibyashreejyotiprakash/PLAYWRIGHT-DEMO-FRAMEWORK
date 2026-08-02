import {test,expect} from "@playwright/test";

test("Day1", async function({page}){

    await page.goto("https://www.demoblaze.com/index.html");

    const landingpagetitle = await page.title();
    console.log(`Landing Page Title is ${landingpagetitle}`);
    await expect(landingpagetitle).toBe("STORE");
    await  expect(page).toHaveTitle('STORE');
   

    const landingpageurl = await page.url();
    console.log(`Landing Page URL is ${landingpageurl}`);
    await expect(landingpageurl).toBe("https://www.demoblaze.com/index.html");
    await expect(page).toHaveURL('https://www.demoblaze.com/index.html');
    
    
    await page.waitForURL("**/www.demoblaze.com/index.html");

    await page.close();


})