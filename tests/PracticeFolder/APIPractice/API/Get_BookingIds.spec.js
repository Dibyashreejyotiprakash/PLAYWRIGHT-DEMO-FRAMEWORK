import {test,expect} from "@playwright/test";

var baseurl = "https://restful-booker.herokuapp.com";
var firstbookingid;
var response;
var response_body;
var statuscode;

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