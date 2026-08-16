import {test,expect} from "@playwright/test";

var baseurl = "https://restful-booker.herokuapp.com";

test("Create Token", async ({request})=>{

    const requestpayload = {
        username: "admin",
        password: "password123"
    }
    const response = await request.
    post(baseurl+"/auth",{headers: {"Content-Type": "application/json"},data: requestpayload});
    
    var response_body = await response.json();
    console.log("Response Body is : "+JSON.stringify(response_body));

    expect(response.ok()).toBeTruthy();
    expect(response_body).not.toBeNull();

    const statuscode = await response.status();
    console.log("Status Code is : "+statuscode);
    expect(statuscode).toBe(200);

    const responsebody = await response.json();
    console.log("Response Body is : "+JSON.stringify(responsebody));

    const token = responsebody.token;
    console.log("Token is : "+token);

    expect(token).not.toBeNull();

})