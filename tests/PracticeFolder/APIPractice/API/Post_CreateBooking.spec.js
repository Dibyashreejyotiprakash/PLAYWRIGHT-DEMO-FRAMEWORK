import { test, expect } from "@playwright/test";

var baseurl = "https://restful-booker.herokuapp.com";
var firstbookingid;
var response;
test("Post - Create Booking", async ({ request }) => {
    const request_body = {
        firstname: "Sally",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: "2013-02-23",
            checkout: "2014-10-23"
        },
        additionalneeds: "Breakfast"
    };

        response = await request.post(baseurl+"/booking", {
        headers: 
        { "Content-Type": "application/json" },
        data: request_body
    });

    const response_body = await response.json();
    console.log(`Response Body is : ${JSON.stringify(response_body)}`);

    const statuscode = await response.status();
    console.log(`Status Code is : ${statuscode}`);

    expect(statuscode).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.body).not.toBeNull();
});