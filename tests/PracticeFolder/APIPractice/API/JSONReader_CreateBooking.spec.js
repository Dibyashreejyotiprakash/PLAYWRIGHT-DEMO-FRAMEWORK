import {test,expect} from "@playwright/test";
import fs from "fs";

var response;
test("Read JSON Data from File", async ({request}) => {
   
    
   try{
     const basedata = fs.readFileSync("./PLAYWRIGHT_JS/APITestData/basedata.json");
    const jsonobject_basedata = JSON.parse(basedata);
    console.log("Base URL is : "+jsonobject_basedata.baseurl);

    const bookingdata = fs.readFileSync("./PLAYWRIGHT_JS/APITestData/booking.json");
    const jsonobject_bookingdata = JSON.parse(bookingdata);
    console.log("Booking Data is : "+JSON.stringify(jsonobject_bookingdata));

    response = await request.post(jsonobject_basedata.baseurl+"/booking", {
             headers: 
             { "Content-Type": "application/json" },
             data: jsonobject_bookingdata
         });
     
         const response_body = await response.json();
         console.log(`Response Body is : ${JSON.stringify(response_body)}`);
     
         const statuscode = await response.status();
         console.log(`Status Code is : ${statuscode}`);
     
         expect(statuscode).toBe(200);
         expect(response.ok()).toBeTruthy();
         expect(response.body).not.toBeNull();
   }
   catch(err){ 
    console.log("Error is : "+err);
   }



})