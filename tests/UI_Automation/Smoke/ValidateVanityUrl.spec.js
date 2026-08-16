import { test, expect,chromium } from "@playwright/test";
import ReadJson from "../../../Utility/FileReader/JsonReader.js";
import Base from '../../../Initiate/Base.js';


let browser = null;
let context = null;
let page = null;

test.beforeAll(async() => {
            browser = await chromium.launch({ headless: false });
            context = await browser.newContext();
            page = await context.newPage();
}); 

test.afterAll(async() => {
            await page.close();
            await context.close();
            await browser.close();
});

test("Load all URLs", async () => {

    const file = "./TestData/prodvanityurl.json";
    const urls = ReadJson.GetValue(file, "ProdVanityUrl");

    for (const url of urls) {

         try{
            await page.goto(url);
            await page.waitForLoadState('load');
            let title = await page.title();
            console.log('Title for URL', url, ':', title);
            await page.waitForTimeout(2000);
            
         }
         catch (error) {
           console.error('Error occurred:', error);
           throw error;
         }
    }    

});