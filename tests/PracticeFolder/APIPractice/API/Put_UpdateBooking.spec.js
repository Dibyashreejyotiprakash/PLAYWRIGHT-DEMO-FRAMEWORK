import {test,expect} from "@playwright/test";


var baseurl = "https://restful-booker.herokuapp.com";
var bookingid="";
var token ="";
test.describe("Booking Tests", () => {

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
    
        token = responsebody.token;
        console.log("Token is : "+token);
    
        expect(token).not.toBeNull();
    
    })
  
    test("Create Booking", async ({request})=>{

   const createbookingpayload = {
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

    const response = await request.post(baseurl+"/booking",{headers:{"Content-Type": "application/json"},data: createbookingpayload})

    const statuscode = await response.status();
    console.log("Status Code is : "+statuscode);
    expect(statuscode).toBe(200);

    const responsebody = await response.json();
    console.log("Response Body is : "+JSON.stringify(responsebody));

    bookingid = responsebody.bookingid;
    console.log("Booking ID is : "+bookingid);

    expect(bookingid).not.toBeNull();
})

test("Update Booking", async ({request})=>{
   
    const requestpayload ={
    "firstname" : "James",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
   }

   console.log("Booking ID is : "+bookingid);
    const response = await request.put(`${baseurl}/booking/${bookingid}`,{headers:{"Content-Type":"application/json","Accept":"application/json","Cookie":"token="+token},data:requestpayload});

    const statuscode = await response.status();
    console.log("Status Code is : "+statuscode);
    expect(statuscode).toBe(200);

    const responsebody = await response.json();
    console.log("Response Body is : "+JSON.stringify(responsebody));

    expect(responsebody.firstname).toBe("James");
    expect(responsebody.lastname).toBe("Brown");

})

})