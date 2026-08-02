import {test,expect} from "@playwright/test";
import APIBase from '../../Initiate/APIBase.js';

let baseurl = null;
let firstbookingid;
let response;
let response_body;
let statuscode;

const base = new APIBase();
test.beforeAll(async function() {
  baseurl = await base.getBaseUrl();
  console.log(`Base URL is : ${baseurl}`);
})

test.afterAll(async function() {
  if (base.context) {
    await base.context.close();
  }
  if (base.browser) {
    await base.browser.close();
  }
})

test.beforeEach(async function() {
  console.log('API Test started');

})

test.afterEach(async function() {
  console.log('API Test completed');
})

test.describe("Booking Tests", () => {
    test("Get_Validate Bookings IDS", async ({request}) => {

        try{
        response = await request.get(baseurl+"/booking");
        response_body = await response.json();
        console.log(`Response Body is : ${JSON.stringify(response_body)}`);
        console.log(`Response Body Length is : ${response_body.length}`);
        console.log(`Response Body is ${JSON.stringify(response_body)}`);
        statuscode = await response.status();
        console.log(`Status Code is : ${statuscode}`);
        const headers = await response.headers();
        console.log(headers);
        const responseheaders = await response.headersArray();
        console.log(responseheaders);
        expect(statuscode).toBe(200);
        const responsetime = await response.responsetime;
        firstbookingid = response_body[0].bookingid;
        console.log(`First Booking ID is : ${firstbookingid}`);
        }
        catch(error){
            console.log(`Error is : ${error}`);
        }

    })

    test("Get First Booking ID:", async ({request}) =>{

       try{
         const response = await request.get(`${baseurl}/booking/${firstbookingid}`);
        const response_body = await response.json();
        console.log(`Response Body for First Booking ID is : ${JSON.stringify(response_body)}`);
        statuscode = await response.status();
        console.log(`Status Code is : ${statuscode}`);
       }
       catch(error){
        console.log(`Error is : ${error}`);
       }
    })
})