# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateLoginTest.spec.js >> Validate Login Functionality >> Validate Current URL and Title 
- Location: tests\UI_Automation\Smoke\ValidateLoginTest.spec.js:59:5

# Error details

```
TypeError: Cannot read properties of null (reading 'url')
```

# Test source

```ts
  1   | import { expect } from 'allure-playwright';
  2   | import Base from '../../Initiate/Base.js';
  3   | 
  4   | 
  5   | const base = new Base();
  6   | 
  7   | class Interaction {
  8   | 
  9   |     async goToUrl(url){
  10  |         try{
  11  |             await base.page.goto(url);
  12  |             await base.page.waitForLoadState('load');
  13  |             let title = await base.page.title();
  14  |             console.log('Title for URL', url, ':', title);
  15  |             await base.page.waitForTimeout(2000);
  16  |         }
  17  |         catch (error) {
  18  |             console.error('Error occurred:', error);
  19  |             throw error;
  20  |         }
  21  |     }
  22  | 
  23  |     async refreshPage(){
  24  |         try{
  25  |             await base.page.reload();
  26  |             await base.page.waitForLoadState('load');
  27  |         }
  28  |         catch (error) {
  29  |             console.error('Error occurred:', error);
  30  |             throw error;
  31  |         }
  32  |     }
  33  | 
  34  |     async backToPreviousPage(){
  35  |         try{
  36  |             await base.page.goBack();
  37  |             await base.page.waitForLoadState('load');
  38  |         }
  39  |         catch (error) {
  40  |             console.error('Error occurred:', error);
  41  |             throw error;
  42  |         }
  43  |     }
  44  | 
  45  |     async forwardToNextPage(){
  46  |         try{
  47  |             await base.page.goForward();
  48  |             await base.page.waitForLoadState('load');
  49  |         }
  50  |         catch (error) {
  51  |             console.error('Error occurred:', error);
  52  |             throw error;
  53  |         }
  54  |     }
  55  | 
  56  |     async getTitle(){
  57  |          try{
  58  |            return await base.page.title();
  59  |         }
  60  |         catch (error) {
  61  |             console.error('Error occurred:', error);
  62  |             throw error;
  63  |         }
  64  |     }
  65  | 
  66  |     async getCurrentUrl(){
  67  |          try{
> 68  |            return await base.page.url();
      |                                   ^ TypeError: Cannot read properties of null (reading 'url')
  69  |         }
  70  |         catch (error) {
  71  |             console.error('Error occurred:', error);
  72  |             throw error;
  73  |         }
  74  |     }
  75  | 
  76  |     async waitForTimeout(milliseconds){
  77  |         try{
  78  |             await base.page.waitForTimeout(milliseconds);
  79  |         }
  80  |         catch (error) {
  81  |             console.error('Error occurred:', error);
  82  |             throw error;
  83  |         }
  84  |     }
  85  | 
  86  |     async waitforUrlToLoad(url, timeout = 30000){
  87  |         try{
  88  |             await base.page.waitForURL(url, { timeout: timeout });
  89  |         }
  90  |         catch (error) {
  91  |             console.error('Error occurred:', error);
  92  |             throw error;
  93  |         }
  94  |     }
  95  | 
  96  |     async waitforUrlToLoad(url){
  97  |         try{
  98  |             await base.page.waitForURL(url);
  99  |         }
  100 |         catch (error) {
  101 |             console.error('Error occurred:', error);
  102 |             throw error;
  103 |         }
  104 |     }
  105 | 
  106 |     async waitforLoadState(state = 'load', timeout = 30000){
  107 |         try{
  108 |             await base.page.waitForLoadState(state, { timeout: timeout });
  109 |         }
  110 |         catch (error) {
  111 |             console.error('Error occurred:', error);
  112 |             throw error;
  113 |         }
  114 |     }
  115 | 
  116 |     async waitforDocumentReadyState(state ='domcontentloaded',timeout = 30000){
  117 |         try{
  118 |             await base.page.waitforDocumentReadyState(state, { timeout: timeout });
  119 |         }
  120 |         catch (error) {
  121 |             console.error('Error occurred:', error);
  122 |             throw error;
  123 |         }
  124 |     }
  125 | 
  126 |     async waitforNetWorkIdle(timeout = 30000){
  127 |         try{
  128 |             await base.page.waitForLoadState('networkidle', { timeout: timeout });
  129 |         }
  130 |         catch (error) {
  131 |             console.error('Error occurred:', error);
  132 |             throw error;
  133 |         }
  134 |     }
  135 | 
  136 |     async forTimeOut(milliseconds){
  137 |         try{
  138 |             await base.page.waitForTimeout(milliseconds);
  139 |         }
  140 |         catch (error) {
  141 |             console.error('Error occurred:', error);
  142 |             throw error;
  143 |         }
  144 |     }
  145 | 
  146 |     async waitforVisibleSelector(selector, options = { state: 'visible', timeout: 30000 }){
  147 |         try{
  148 |             await base.page.waitForSelector(selector, options);
  149 |         }
  150 |         catch (error) {
  151 |             console.error('Error occurred:', error,selector);
  152 |             throw error;
  153 |         }
  154 |     }
  155 | 
  156 |    async waitForHidden(selector, options = { state: "hidden", timeout: 30000 }) {
  157 |     try {
  158 |         await base.page.waitForSelector(selector, options);
  159 |     }
  160 |     catch (error) {
  161 |         console.error("Error waiting for hidden:", selector, error);
  162 |         throw error;
  163 |     }
  164 | 
  165 |    }
  166 | 
  167 |    async waitForAttached(selector, options = { state: "attached", timeout: 30000 }) {
  168 |     try {
```