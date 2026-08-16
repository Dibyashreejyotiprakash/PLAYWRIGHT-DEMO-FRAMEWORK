# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UIAutomationPractice\BasicHardAssertions.spec.js >> Assertions
- Location: PLAYWRIGHT-DEMO-FRAMEWORK\tests\UIAutomationPractice\BasicHardAssertions.spec.js:4:1

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected: "Register1"
Received: "Register"
Timeout:  5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    13 × locator resolved to <html lang="en" xmlns="http://www.w3.org/1999/html">…</html>
       - unexpected value "Register"

```

```yaml
- banner:
  - link "image not displaying":
    - /url: http://www.automationtesting.in
    - img "image not displaying"
  - heading "Automation Demo Site" [level=1]
  - navigation:
    - list:
      - listitem:
        - link "Home":
          - /url: Index.html
      - listitem:
        - link "Register":
          - /url: Register.html
      - listitem:
        - link "WebTable":
          - /url: WebTable.html
      - listitem:
        - link "SwitchTo":
          - /url: SwitchTo.html
        - text: 
      - listitem:
        - link "Widgets":
          - /url: Widgets.html
        - text: 
      - listitem:
        - link "Interactions":
          - /url: Interactions.html
        - text: 
      - listitem:
        - link "Video":
          - /url: SwitchTo.html
        - text: 
      - listitem:
        - link "WYSIWYG":
          - /url: WYSIWYG.html
        - text: 
      - listitem:
        - link "More":
          - /url: "#"
        - text: 
      - listitem:
        - link "Practice Site":
          - /url: http://practice.automationtesting.in/
- heading "Register" [level=2]
- insertion:
  - heading "These are topics related to the article that might interest you" [level=2]: Discover more
  - link "UI testing services"
  - link "Automation demo site"
  - link "email"
  - link "WYSIWYG editor testing"
  - link "Cross-browser testing"
  - link "Web application testing"
  - link "Software testing tutorials"
  - link "Western Europeans"
- text: Full Name*
- textbox "First Name"
- textbox "Last Name"
- text: Address
- textbox
- text: Email address*
- textbox
- text: Phone*
- textbox
- text: Gender*
- radio "Male"
- text: Male
- radio "FeMale"
- text: FeMale Hobbies
- checkbox
- text: Cricket
- checkbox
- text: Movies
- checkbox
- text: Hockey Languages Skills
- combobox:
  - option "Select Skills" [selected]
  - option "Adobe InDesign"
  - option "Adobe Photoshop"
  - option "Analytics"
  - option "Android"
  - option "APIs"
  - option "Art Design"
  - option "AutoCAD"
  - option "Backup Management"
  - option "C"
  - option "C++"
  - option "Certifications"
  - option "Client Server"
  - option "Client Support"
  - option "Configuration"
  - option "Content Managment"
  - option "Content Management Systems (CMS)"
  - option "Corel Draw"
  - option "Corel Word Perfect"
  - option "CSS"
  - option "Data Analytics"
  - option "Desktop Publishing"
  - option "Design"
  - option "Diagnostics"
  - option "Documentation"
  - option "End User Support"
  - option "Email"
  - option "Engineering"
  - option "Excel"
  - option "FileMaker Pro"
  - option "Fortran"
  - option "HTML"
  - option "Implementation"
  - option "Installation"
  - option "Internet"
  - option "iOS"
  - option "iPhone"
  - option "Linux"
  - option "Java"
  - option "Javascript"
  - option "Mac"
  - option "Matlab"
  - option "Maya"
  - option "Microsoft Excel"
  - option "Microsoft Office"
  - option "Microsoft Outlook"
  - option "Microsoft Publisher"
  - option "Microsoft Word"
  - option "Microsoft Visual"
  - option "Mobile"
  - option "MySQL"
  - option "Networks"
  - option "Open Source Software"
  - option "Oracle"
  - option "Perl"
  - option "PHP"
  - option "Presentations"
  - option "Processing"
  - option "Programming"
  - option "PT Modeler"
  - option "Python"
  - option "QuickBooks"
  - option "Ruby"
  - option "Shade"
  - option "Software"
  - option "Spreadsheet"
  - option "SQL"
  - option "Support"
  - option "Systems Administration"
  - option "Tech Support"
  - option "Troubleshooting"
  - option "Unix"
  - option "UI / UX"
  - option "Web Page Design"
  - option "Windows"
  - option "Word Processing"
  - option "XML"
  - option "XHTML"
- text: Country*
- combobox:
  - option "Select Country" [selected]
- text: "Select Country :"
- combobox
- text: Date Of Birth
- combobox:
  - option "year" [selected]
  - option "1916"
  - option "1917"
  - option "1918"
  - option "1919"
  - option "1920"
  - option "1921"
  - option "1922"
  - option "1923"
  - option "1924"
  - option "1925"
  - option "1926"
  - option "1927"
  - option "1928"
  - option "1929"
  - option "1930"
  - option "1931"
  - option "1932"
  - option "1933"
  - option "1934"
  - option "1935"
  - option "1936"
  - option "1937"
  - option "1938"
  - option "1939"
  - option "1940"
  - option "1941"
  - option "1942"
  - option "1943"
  - option "1944"
  - option "1945"
  - option "1946"
  - option "1947"
  - option "1948"
  - option "1949"
  - option "1950"
  - option "1951"
  - option "1952"
  - option "1953"
  - option "1954"
  - option "1955"
  - option "1956"
  - option "1957"
  - option "1958"
  - option "1959"
  - option "1960"
  - option "1961"
  - option "1962"
  - option "1963"
  - option "1964"
  - option "1965"
  - option "1966"
  - option "1967"
  - option "1968"
  - option "1969"
  - option "1970"
  - option "1971"
  - option "1972"
  - option "1973"
  - option "1974"
  - option "1975"
  - option "1976"
  - option "1977"
  - option "1978"
  - option "1979"
  - option "1980"
  - option "1981"
  - option "1982"
  - option "1983"
  - option "1984"
  - option "1985"
  - option "1986"
  - option "1987"
  - option "1988"
  - option "1989"
  - option "1990"
  - option "1991"
  - option "1992"
  - option "1993"
  - option "1994"
  - option "1995"
  - option "1996"
  - option "1997"
  - option "1998"
  - option "1999"
  - option "2000"
  - option "2001"
  - option "2002"
  - option "2003"
  - option "2004"
  - option "2005"
  - option "2006"
  - option "2007"
  - option "2008"
  - option "2009"
  - option "2010"
  - option "2011"
  - option "2012"
  - option "2013"
  - option "2014"
  - option "2015"
- combobox:
  - option "Month" [selected]
  - option "January"
  - option "February"
  - option "March"
  - option "April"
  - option "May"
  - option "June"
  - option "July"
  - option "August"
  - option "September"
  - option "October"
  - option "November"
  - option "December"
- combobox:
  - option "Day" [selected]
  - option "1"
  - option "2"
  - option "3"
  - option "4"
  - option "5"
  - option "6"
  - option "7"
  - option "8"
  - option "9"
  - option "10"
  - option "11"
  - option "12"
  - option "13"
  - option "14"
  - option "15"
  - option "16"
  - option "17"
  - option "18"
  - option "19"
  - option "20"
  - option "21"
  - option "22"
  - option "23"
  - option "24"
  - option "25"
  - option "26"
  - option "27"
  - option "28"
  - option "29"
  - option "30"
  - option "31"
- text: Password
- textbox
- text: Confirm Password
- textbox
- button "Submit"
- button "Refresh"
- text: Photo
- img
- button "Choose File"
- insertion:
  - iframe
- contentinfo:
  - text: "\"@ 2016\""
  - link "Automation Testing":
    - /url: "#"
  - text: "\"All Rights Reserved.\""
  - link "":
    - /url: https://www.facebook.com/automationtesting2016/
  - link "":
    - /url: https://twitter.com/krishnasakinala
  - link "":
    - /url: https://www.linkedin.com/nhome/?trk=hb_signin
  - link "":
    - /url: https://plus.google.com/105286300926085335367
  - link "":
    - /url: https://www.youtube.com/channel/UCmQRa3pWM9zsB474URz8ESg
```

# Test source

```ts
  1  | import {test,expect} from "@playwright/test"
  2  | import { stat } from "node:fs";
  3  | 
  4  | test("Assertions", async function ({page}){
  5  | 
  6  |  await page.goto("https://demo.automationtesting.in/Register.html");
  7  | 
  8  |  await expect(page).toHaveURL("https://demo.automationtesting.in/Register.html");
  9  | 
> 10 |  await expect(page).toHaveTitle("Register1");
     |                     ^ Error: expect(page).toHaveTitle(expected) failed
  11 | 
  12 |  var status = await page.getByPlaceholder("First Name").isVisible();
  13 |  console.log(`status is ${status}`);
  14 | 
  15 |  const fullname = await page.getByPlaceholder('First Name');
  16 |  await expect(fullname).toBeVisible();
  17 | 
  18 |  const submitbtn = await page.getByText(' Submit ');
  19 |  await expect(submitbtn).toBeEnabled();
  20 | 
  21 |  const radiobtn = await page.locator("//input[@value='Male']");
  22 |  await radiobtn.click();
  23 | 
  24 |  await expect(radiobtn).toBeChecked();
  25 | 
  26 |  await expect(page.locator("//*[@id='submitbtn']")).toHaveText("Submit");
  27 | 
  28 |  const options = await page.locator("//select[@placeholder='Month']/option");
  29 |  await expect(options).toHaveCount(13);
  30 | 
  31 |  await page.close();
  32 | 
  33 | })
```