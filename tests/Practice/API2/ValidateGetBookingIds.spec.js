import {test,expect} from "@playwright/test"

const baseurl = "https://restful-booker.herokuapp.com/";
let response=null;
let responsebody=null;
let jsonbody=null;
let headers =null;
 let headerarray =null;
 let token = null;
 let bookingid = null;

 test("Create Token", async function ({request}){

    let tokenbody = {
    "username" : "admin",
    "password" : "password123"
}

    response = await request.post(`${baseurl}auth`,{headers:{"Content-Type": "application/json"},dada:tokenbody})

    let tokenresponsebody = await response.json()
    console.log("Token Response Body" ,tokenresponsebody)

    token = tokenresponsebody.token;
 })

test("Validate Get Booking Ids", async function ({request}){

try{

    response = await request.get(baseurl+"booking");

    console.log("Response Body ", response);

    //Get the response Body
    responsebody = await response.body();

   //console.log("Response Body ",responsebody);

   //Get Rsponse Body In Json Format
   jsonbody = await response.json();
   console.log("Json Response ",jsonbody);

// Get Headers
    headers = await response.headers();
    console.log("Response Headers",headers);

    //Header Array
    headerarray = await response.headersArray();
    console.log("Headers ",headerarray)

    // Get Status Code 
    let responsestatuscode = await response.status();
    console.log("Status Code ",responsestatuscode)

    await expect(responsestatuscode).toBe(200);

    //Status Text
    let statustext = await response.statusText();
    console.log("Status Method ",statustext)

    let firstbookingid = await response.json();
    console.log("First Booking Id", firstbookingid[1].bookingid);

    await expect(firstbookingid[1].bookingid).toBe(2);
}
catch(error)
{
    console.log(error)
}

})

test("Create Bookings", async function({request}){

    let requestbody = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
}


   response =  await request.post(baseurl+"booking",{headers:"Content-Type: application/json",data:requestbody})

   responsebody = await response.json()
   console.log("Response Body", responsebody)

   // Status Code
   let statuscode = await response.status();
   console.log("Status Code ",statuscode)

   // Headers
   headerarray = await response.headersArray;
   console.log("Header Array ", headerarray)

   // Status Message
   let statusmsg = await response.statusText();
   console.log("Status Message ", statusmsg)

   //Print Booking Name
   let booking_firstname = await responsebody.booking.firstname;
   console.log("Booking Name ",booking_firstname)

   bookingid = await responsebody.bookingid;
   console.log("Booking Id",bookingid)

   expect (bookingid).not.toBe(null);

   
})

test("Update Booking Id ", async function({request}){

    let updatebody = {
    "firstname" : "James",
    "lastname" : "Brown"
}

   


   const response = await 
   request.
   put(`${baseurl}/booking/${bookingid}`, 
    {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": `token=${token}`
        },
        data: updatebody
    });

    console.log(response)

})