import {test,expect} from "@playwright/test";

test("Handle drop down", async function ({page}){
    await page.goto("https://demo.automationtesting.in/Register.html");

    const dropdown = await page.locator("//*[@id='Skills']");

    await dropdown.selectText('Adobe InDesign');

    await page.waitForTimeout(3000);

    await dropdown.selectOption("Adobe InDesign");

     await page.waitForTimeout(3000);

     await dropdown.selectOption({label:'Adobe Photoshop'});

    await page.waitForTimeout(3000);

    await dropdown.selectOption({index:4});

    await page.waitForTimeout(3000);

    const coutryddn = await page.locator("//*[@id='countries']/option");

    const countrycount = await coutryddn.count();
    
    for(let i=0;i< coutryddn.count;i++){
        console.log(await coutryddn.nth(i).textContent());
    }
    await page.close();
})