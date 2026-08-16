import {test,expect, chromium,firefox,webkit} from "@playwright/test"


    test('Run with YouTube @Smoke', async function(){


    const browser = await chromium.launch({headless:false})
    const context = await browser.newContext();
    const page = await context.newPage()

    await page.goto("https://www.youtube.com/feed/playlists");
})

test('Run with Flipkart @Regression', async function(){


    const browser = await firefox.launch({headless:false})
    const context = await browser.newContext();
    const page = await context.newPage()

    await page.goto("https://www.flipkart.com/");
})

test('Run with Amazon @Regression', async function(){


    const browser = await webkit.launch({headless:false})
    const context = await browser.newContext();
    const page = await context.newPage()

    await page.goto("https://www.amazon.com/");
})
