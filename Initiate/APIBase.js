import {test, expect, chromium, firefox, webkit} from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class APIBase{

    constructor(){
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async launchBrowser(){
       let browsername = await this.getBrowser();
    try{
        if(browsername=="chromium"){
        this.browser = await chromium.launch({headless:false});
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }
    else if(browsername=="firefox"){
        this.browser = await firefox.launch({headless:false});
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }
    else if(browsername=="webkit"){
        this.browser = await webkit.launch({headless:false});
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }
    else{
        throw new Error(`Invalid browser name: ${browsername}. Expected: chromium, firefox, or webkit`);
    }

    // Verify page object was created successfully
    if(!this.page){
        throw new Error("Failed to create page object");
    }
    }
    catch(error){
        console.error("Error in launching browser: "+error);
        throw error; // Re-throw to prevent tests from running with invalid page object
    }

}

 async getBrowser(){
    const browsername = process.env.browsername;
    if(!browsername){
        throw new Error("browsername not found in environment variables. Check .env file.");
    }
    return browsername;
 }



 async getEnvVariable(){
    const envVariable = process.env.environment;
    if(!envVariable){
        throw new Error("environment not found in environment variables. Check .env file.");
    }
    return envVariable;
}


async getBaseUrl(){
    try{
        const env = await this.getEnvVariable();
        let baseUrl;

        if(env=="prod"){
            baseUrl = process.env.prod_baseurl;
        }
        else if(env=="stage"){
            baseUrl = process.env.stage_baseurl;
        }
        else if(env=="qa"){
            baseUrl = process.env.qa_baseurl;
        }
        else{
            throw new Error(`Invalid environment: ${env}. Expected: prod, stage, or qa`);
        }

        if(!baseUrl){
            throw new Error(`Base URL not found for environment: ${env}. Check .env file.`);
        }

        return baseUrl;
    }
    catch(error){
        console.error("Error in getting base URL: "+error);
        throw error;
    }
 
    return baseUrl;
}

 async launchapplication(){
    try{
        // Verify page object exists before navigation
        if(!this.page){
            throw new Error("Page object not initialized. Call launchBrowser() first.");
        }

        const env = await this.getEnvVariable();
        let url;

        if(env=="prod"){
            url = process.env.prod_url;
        }
        else if(env=="stage"){
            url = process.env.stage_url;
        }
        else if(env=="qa"){
            url = process.env.qa_url;
        }
        else{
            throw new Error(`Invalid environment: ${env}. Expected: prod, stage, or qa`);
        }

        if(!url){
            throw new Error(`URL not found for environment: ${env}. Check .env file.`);
        }

        await this.page.goto(url);
        await this.page.waitForLoadState('load');
    }
    catch(error){
        console.error("Error in navigating to URL: "+error);
        throw error;
    }
 }


}
export default APIBase;