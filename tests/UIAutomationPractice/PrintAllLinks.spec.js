import {test,expect} from "@playwright/test";
import { link } from "node:fs";

test("Day1", async function({page}){

    await page.goto("https://www.demoblaze.com/index.html");

    const allinks = await page.$$('a');
    const links_count = await allinks.count;
    console.log(`Total Links Count is : ${links_count}`);

    for(const link of allinks){
        const linkname = await link.textContent();
        console.log("Link Name "+linkname);
    }



   for(let i = 0; i < links_count; i++){
        const linktext = await allinks.nth(i).textContent();
        console.log(`Link Text is : ${linktext}`);
    }


    await page.close();
})