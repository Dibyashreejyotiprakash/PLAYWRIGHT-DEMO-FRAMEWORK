let users=["John","Peter","David"];

console.log(users[0]);

for(let user of users)
{
    console.log(user);
}

let fruits = ["Apple", "Banana"];

fruits.push("Orange");

console.log(fruits);

//--------------------------------

let fruits = ["Apple", "Banana"];

fruits.push("Orange", "Mango");

console.log(fruits);

//--------------------------------

let fruits = ["Apple", "Banana", "Orange"];

fruits.pop();

console.log(fruits);

//--------------------------------
//Store Remove and Replace
let fruits = ["Apple", "Banana", "Orange"];

let removed = fruits.pop();

console.log(removed);
console.log(fruits);

//--------------------------------
let fruits = ["Apple", "Banana", "Orange"];

fruits.shift();

console.log(fruits);

//Store the removed element

let fruits = ["Apple", "Banana", "Orange"];

let removed = fruits.shift();

console.log(removed);
console.log(fruits);

//----------------------------------

//UnSfit --Add Elements to the beginning of the array

let fruits = ["Banana", "Orange"];

fruits.unshift("Apple");

console.log(fruits);

//Adding the multiple elemnts

let fruits = ["Orange"];

fruits.unshift("Apple", "Banana");

console.log(fruits);

//----------------------------------
//Includes

let fruits = ["Apple", "Banana", "Orange"];

console.log(fruits.includes("Banana"));

//----------------------------------

//Index of
let fruits = ["Apple", "Banana", "Orange"];

console.log(fruits.indexOf("Banana"));

//----------------------------------

//Length of the array
let fruits = ["Apple", "Banana", "Orange"];

console.log(fruits.length);
//----------------------------------
const browsers = ["chromium", "firefox"];

browsers.push("webkit");

for (let i = 0; i < browsers.length; i++) {
    console.log("Running tests in:", browsers[i]);
}

//----------------------------------


