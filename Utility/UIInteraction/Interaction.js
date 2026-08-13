import { expect } from 'allure-playwright';


class Interaction {

    constructor(page) {
        this.page = page;
    }

    async goToUrl(url){
        try{
            await this.page.goto(url);
            await this.page.waitForLoadState('load');
            let title = await this.page.title();
            console.log('Title for URL', url, ':', title);
            await this.page.waitForTimeout(2000);
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async refreshPage(){
        try{
            await this.page.reload();
            await this.page.waitForLoadState('load');
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async backToPreviousPage(){
        try{
            await this.page.goBack();
            await this.page.waitForLoadState('load');
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async forwardToNextPage(){
        try{
            await this.page.goForward();
            await this.page.waitForLoadState('load');
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async getTitle(){
         try{
           return await this.page.title();
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async getCurrentUrl(){
         try{
           return await this.page.url();
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitForTimeout(milliseconds){
        try{
            await this.page.waitForTimeout(milliseconds);
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitforUrlToLoad(url, timeout = 30000){
        try{
            await this.page.waitForURL(url, { timeout: timeout });
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitforUrlToLoad(url){
        try{
            await this.page.waitForURL(url);
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitforLoadState(state = 'load', timeout = 30000){
        try{
            await this.page.waitForLoadState(state, { timeout: timeout });
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitforDocumentReadyState(state ='domcontentloaded',timeout = 30000){
        try{
            await this.page.waitforDocumentReadyState(state, { timeout: timeout });
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitforNetWorkIdle(timeout = 30000){
        try{
            await this.page.waitForLoadState('networkidle', { timeout: timeout });
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async forTimeOut(milliseconds){
        try{
            await this.page.waitForTimeout(milliseconds);
        }
        catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }

    async waitforVisibleSelector(selector, options = { state: 'visible', timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, options);
        }
        catch (error) {
            console.error('Error occurred:', error,selector);
            throw error;
        }
    }

   async waitForHidden(selector, options = { state: "hidden", timeout: 30000 }) {
    try {
        await this.page.waitForSelector(selector, options);
    }
    catch (error) {
        console.error("Error waiting for hidden:", selector, error);
        throw error;
    }

   }

   async waitForAttached(selector, options = { state: "attached", timeout: 30000 }) {
    try {
        await this.page.waitForSelector(selector, options);
    }
    catch (error) {
        console.error("Error waiting for attached:", selector, error);
        throw error;
    }
  }

  async waitForLocatorDetached(selector, options = { state: "detached", timeout: 30000 }) {
    try {
        await this.page.locator(selector).waitFor(options);
    }
    catch (error) {
        console.error("Error waiting for locator detached:", selector, error);
        throw error;
    }
  }


    async waitforEvent(event, options = { timeout: 30000 }){
        try{
            await this.page.waitForEvent(event, options);
        }
        catch (error) {
            console.error('Error occurred:', error,event);
            throw error;
        }
    }

    async waitForDownLoad(filepath){
        try{
            const download = await this.page.waitForEvent("download");
            await download.saveAs(filepath);
        }
        catch(error){
            console.error('waitForDownLoad Error occurred:', error,event);
            throw error;
        }
    }

    async Focus(selector, options = { timeout: 30000 }){
        try{
            await this.page.locator(selector).focus();
        }
        catch (error) {
            console.error('Error occurred while focusing on element:', selector, error);
            throw error;
        }
    }

    async Blur(selector, options = { timeout: 30000 }){
        try{
            await this.page.locator(selector).blur();
        }
        catch (error) {
            console.error('Error occurred while blurring on element:', selector, error);
            throw error;
        }
    }

    

    async ClickOnElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.click(selector, options);
        }
        catch (error) {
            console.error('Error occurred while clicking on element:', selector, error);
            throw error;
        }
    }

    async DoubleClickOnElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.dblclick(selector, options);
        }
        catch (error) {
            console.error('Error occurred while double clicking on element:', selector, error);
            throw error;
        }
    }

    async RightClickOnElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.click(selector, { button: 'right', ...options });
        }
        catch (error) {
            console.error('Error occurred while right clicking on element:', selector, error);
            throw error;
        }
    }

    async HoverOnElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.hover(selector, options);
        }
        catch (error) {
            console.error('Error occurred while hovering on element:', selector, error);
            throw error;
        }
    }

    async HoverAndClickOnElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.hover(selector, options);
            await this.page.click(selector, options);
        }
        catch (error) {
            console.error('Error occurred while hovering and clicking on element:', selector, error);
            throw error;
        }
    }

    async FillInputField(selector, value, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.fill(selector, value, options);
        }
        catch (error) {
            console.error('Error occurred while filling input field:', selector, error);
            throw error;
        }
    }

    async ClearInputField(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.fill(selector, '', options);
        }
        catch (error) {
            console.error('Error occurred while clearing input field:', selector, error);
            throw error;
        }
    }

    async GetElementText(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            const text = await this.page.textContent(selector, options);
            return text;
        }
        catch (error) {
            console.error('Error occurred while getting element text:', selector, error);
            throw error;
        }
    }

    async GetElementAttribute(selector, attribute, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            const attrValue = await this.page.getAttribute(selector, attribute, options);
            return attrValue;
        }
        catch (error) {
            console.error('Error occurred while getting element attribute:', selector, attribute, error);
            throw error;
        }
    }

    //Radio button and checkbox methods
    async CheckElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.check(selector, options);
            await expect(await this.page.isChecked(selector)).toBe(true);
        }
        catch (error) {
            console.error('Error occurred while checking element:', selector, error);
            throw error;
        }
    }

    async UncheckElement(selector, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.uncheck(selector, options);
            await expect(await this.page.isChecked(selector)).toBe(false);
        }
        catch (error) {
            console.error('Error occurred while unchecking element:', selector, error);
            throw error;
        }
    }

    //Handle Select Tag DropDown
    async SelectOptionByValue(selector, value, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.selectOption(selector, { value: value }, options);
        }
        catch (error) {
            console.error('Error occurred while selecting option by value:', selector, value, error);
            throw error;
        }
    }

    async SelectOptionByLabel(selector, label, options = { timeout: 30000 }){
        try{
            await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
            await this.page.selectOption(selector, { label: label }, options);
        }
        catch (error) {
            console.error('Error occurred while selecting option by label:', selector, label, error);
            throw error;
        }
    }

    async SelectMultipleOptions(selector, values = [], timeout = 30000) {
        try {
            await this.page.locator(selector).selectOption(values, { timeout });
        } catch (error) {
            console.error("Error occurred:", error, selector);
            throw error;
        }
   }

   //Scrolling
    async ScrollToBottom() {
        try {
            await this.page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    }

    async ScrollToTop() {
        try {
            await this.page.evaluate(() => {
                window.scrollTo(0, 0);
            });
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    }

    async ScrollIntoView(selector, timeout = 30000) {
        try {
            await this.page.locator(selector).scrollIntoViewIfNeeded({ timeout });
        } catch (error) {
            console.error("Error occurred:", error, selector);
            throw error;
        }
    }

    async ScrollDown(pixels = 500) 
    {
        try {
            await this.page.evaluate((y) => {
                window.scrollBy(0, y);
            }, pixels);
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    }

    async ScrollUp(pixels = 500) {
    try {
        await this.page.evaluate((y) => {
            window.scrollBy(0, -y);
        }, pixels);
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
    }

    async ScrollUntilVisible(selector, maxScrolls = 20, pixels = 500) {
        try {
            const element = this.page.locator(selector);

            for (let i = 0; i < maxScrolls; i++) {
                if (await element.isVisible()) {
                    return;
                }

                await this.page.evaluate((y) => {
                    window.scrollBy(0, y);
                }, pixels);

                await this.page.waitForTimeout(300);
            }

            throw new Error(`Element not found after ${maxScrolls} scrolls.`);
        } catch (error) {
            console.error("Error occurred:", error, selector);
            throw error;
        }
    }

   async KeyBoardPress(key) {
        try {
            await this.page.keyboard.press(key);
        } catch (error) {
            console.error("Error occurred:", error, key);
            throw error;
        }
    }

    async AssertTitle(expectedTitle){
        try{
            let act_title = await this.page.title();
            await expect(act_title).toBe(expectedTitle);
        }
        catch(error){

        }
    }

     async AssertCurrentUrl(expectedurl){
        try{
            let act_title = await this.page.url();
            await expect(act_title).toBe(expectedTitle);
        }
        catch(error){
            console .log("AssertCurrentUrl failed due "+ error);
        }
    }

    async AssertElementHiden(locator){
        try{
            await expect(locator).toBeHidden();
        }
        catch(error){
            console .log("AssertElementHiden failed due "+ error);
        }
    }

    async AssertElementVisible(locator){
        try{
            await expect(locator).toBeVisible();
        }
        catch(error){
            console .log("AssertElementVisible failed due "+ error);
        }
    }

     async AssertElementEnabled(locator){
        try{
            await expect(locator).toBeEnabled();
        }
        catch(error){
            console .log("AssertElementEnabled failed due "+ error);
        }
    }

    async AssertElementDisabled(locator){
        try{
            await expect(locator).toBeDisabled();
        }
        catch(error){
            console .log("AssertElementDisabled failed due "+ error);
             throw error;
        }
    }

    async AssertElementEdiatble(locator){
        try{
            await expect(locator).toBeEditable();
        }
        catch(error){
            console .log("AssertElementDisabled failed due "+ error);
             throw error;
        }
    }

    async GetText(selector){
        try{
            return await this.page.locator(selector).textContent();
        }
        catch(error){
            console .log("GetText failed due "+ error);
             throw error;
        }
    }

     async GetInnerText(selector){
        try{
            return await this.page.locator(selector).innerText();
        }
        catch(error){
            console .log("GetInnerText failed due "+ error);
             throw error;
        }
    }

    async GetAttribute(selector){
        try{

        }
        catch(error){
            console .log("GetAttribute failed due "+ error);
            throw error;
        }
    }

   async acceptDialog(promptText = null) {
    try {
        this.page.on("dialog", async (dialog) => {
            await dialog.accept(promptText);
        });
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}

async dismissDialog() {
    try {
        this.page.on("dialog", async (dialog) => {
            await dialog.dismiss();
        });
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}

async getDialogMessage() {
    try {
        return new Promise((resolve) => {
            this.page.on("dialog", async (dialog) => {
                const message = dialog.message();
                console.log("Dialog Message:", message);
                await dialog.dismiss();
                resolve(message);
            });
        });
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}

async handleDialog(action = "accept", promptText = null) {
    try {
        return new Promise((resolve) => {
            this.page.once("dialog", async (dialog) => {
                const message = dialog.message();

                if (action === "accept") {
                    await dialog.accept(promptText);
                } else if (action === "dismiss") {
                    await dialog.dismiss();
                }

                resolve(message);
            });
        });
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
}



}

export default Interaction;