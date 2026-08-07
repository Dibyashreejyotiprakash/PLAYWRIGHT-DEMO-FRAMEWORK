import {test,expect} from "@playwright/test"

test.describe("Browser Application Lunch",()=>{
    test("Validate You Tube Test", async function({page}){
   

    await page.goto("https://www.youtube.com/feed/playlists");
})

test("Validate  Flipkart Test", async function({page}){

    await page.goto("https://www.flipkart.com/");
})

test("Validate Amazon Skip Test", async function({page}){


    await page.goto("https://www.amazon.com/");
})
})