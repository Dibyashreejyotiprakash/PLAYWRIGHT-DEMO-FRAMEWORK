# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateLoginTest.spec.js >> Validate Login Functionality >> Validate Valid Login 
- Location: tests\UI_Automation\Smoke\ValidateLoginTest.spec.js:41:5

# Error details

```
TypeError: Cannot read properties of undefined (reading 'waitForSelector')
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - img "company-branding"
    - generic [ref=e8]:
      - heading "Login" [level=5] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e12]:
          - paragraph [ref=e13]: "Username : Admin"
          - paragraph [ref=e14]: "Password : admin123"
        - generic [ref=e15]:
          - generic [ref=e17]:
            - generic [ref=e18]:
              - generic [ref=e19]: 
              - generic [ref=e20]: Username
            - textbox "Username" [active] [ref=e22]
          - generic [ref=e24]:
            - generic [ref=e25]:
              - generic [ref=e26]: 
              - generic [ref=e27]: Password
            - textbox "Password" [ref=e29]
          - button "Login" [ref=e31] [cursor=pointer]
          - paragraph [ref=e33] [cursor=pointer]: Forgot your password?
        - separator [ref=e34]
        - paragraph [ref=e36]: Or login with
        - generic "Homenick" [ref=e38] [cursor=pointer]:
          - paragraph [ref=e39]: Homenick
      - generic [ref=e40]:
        - generic [ref=e41]:
          - link [ref=e42] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/orangehrm/mycompany/
          - link [ref=e45] [cursor=pointer]:
            - /url: https://www.facebook.com/OrangeHRM/
          - link [ref=e48] [cursor=pointer]:
            - /url: https://twitter.com/orangehrm?lang=en
          - link [ref=e51] [cursor=pointer]:
            - /url: https://www.youtube.com/c/OrangeHRMInc
        - generic [ref=e54]:
          - paragraph [ref=e55]: OrangeHRM OS 5.9
          - paragraph [ref=e56]:
            - text: © 2005 - 2026
            - link "OrangeHRM, Inc" [ref=e57] [cursor=pointer]:
              - /url: http://www.orangehrm.com
            - text: . All rights reserved.
  - generic [ref=e58]:
    - img "orangehrm-logo"
```

# Test source

```ts
  190 |         try{
  191 |             await this.page.waitForEvent(event, options);
  192 |         }
  193 |         catch (error) {
  194 |             console.error('Error occurred:', error,event);
  195 |             throw error;
  196 |         }
  197 |     }
  198 | 
  199 |     async waitForDownLoad(filepath){
  200 |         try{
  201 |             const download = await this.page.waitForEvent("download");
  202 |             await download.saveAs(filepath);
  203 |         }
  204 |         catch(error){
  205 |             console.error('waitForDownLoad Error occurred:', error,event);
  206 |             throw error;
  207 |         }
  208 |     }
  209 | 
  210 |     async Focus(selector, options = { timeout: 30000 }){
  211 |         try{
  212 |             await this.page.locator(selector).focus();
  213 |         }
  214 |         catch (error) {
  215 |             console.error('Error occurred while focusing on element:', selector, error);
  216 |             throw error;
  217 |         }
  218 |     }
  219 | 
  220 |     async Blur(selector, options = { timeout: 30000 }){
  221 |         try{
  222 |             await this.page.locator(selector).blur();
  223 |         }
  224 |         catch (error) {
  225 |             console.error('Error occurred while blurring on element:', selector, error);
  226 |             throw error;
  227 |         }
  228 |     }
  229 | 
  230 |     
  231 | 
  232 |     async ClickOnElement(selector, options = { timeout: 30000 }){
  233 |         try{
  234 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  235 |             await this.page.click(selector, options);
  236 |         }
  237 |         catch (error) {
  238 |             console.error('Error occurred while clicking on element:', selector, error);
  239 |             throw error;
  240 |         }
  241 |     }
  242 | 
  243 |     async DoubleClickOnElement(selector, options = { timeout: 30000 }){
  244 |         try{
  245 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  246 |             await this.page.dblclick(selector, options);
  247 |         }
  248 |         catch (error) {
  249 |             console.error('Error occurred while double clicking on element:', selector, error);
  250 |             throw error;
  251 |         }
  252 |     }
  253 | 
  254 |     async RightClickOnElement(selector, options = { timeout: 30000 }){
  255 |         try{
  256 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  257 |             await this.page.click(selector, { button: 'right', ...options });
  258 |         }
  259 |         catch (error) {
  260 |             console.error('Error occurred while right clicking on element:', selector, error);
  261 |             throw error;
  262 |         }
  263 |     }
  264 | 
  265 |     async HoverOnElement(selector, options = { timeout: 30000 }){
  266 |         try{
  267 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  268 |             await this.page.hover(selector, options);
  269 |         }
  270 |         catch (error) {
  271 |             console.error('Error occurred while hovering on element:', selector, error);
  272 |             throw error;
  273 |         }
  274 |     }
  275 | 
  276 |     async HoverAndClickOnElement(selector, options = { timeout: 30000 }){
  277 |         try{
  278 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  279 |             await this.page.hover(selector, options);
  280 |             await this.page.click(selector, options);
  281 |         }
  282 |         catch (error) {
  283 |             console.error('Error occurred while hovering and clicking on element:', selector, error);
  284 |             throw error;
  285 |         }
  286 |     }
  287 | 
  288 |     async FillInputField(selector, value, options = { timeout: 30000 }){
  289 |         try{
> 290 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
      |                             ^ TypeError: Cannot read properties of undefined (reading 'waitForSelector')
  291 |             await this.page.fill(selector, value, options);
  292 |         }
  293 |         catch (error) {
  294 |             console.error('Error occurred while filling input field:', selector, error);
  295 |             throw error;
  296 |         }
  297 |     }
  298 | 
  299 |     async ClearInputField(selector, options = { timeout: 30000 }){
  300 |         try{
  301 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  302 |             await this.page.fill(selector, '', options);
  303 |         }
  304 |         catch (error) {
  305 |             console.error('Error occurred while clearing input field:', selector, error);
  306 |             throw error;
  307 |         }
  308 |     }
  309 | 
  310 |     async GetElementText(selector, options = { timeout: 30000 }){
  311 |         try{
  312 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  313 |             const text = await this.page.textContent(selector, options);
  314 |             return text;
  315 |         }
  316 |         catch (error) {
  317 |             console.error('Error occurred while getting element text:', selector, error);
  318 |             throw error;
  319 |         }
  320 |     }
  321 | 
  322 |     async GetElementAttribute(selector, attribute, options = { timeout: 30000 }){
  323 |         try{
  324 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  325 |             const attrValue = await this.page.getAttribute(selector, attribute, options);
  326 |             return attrValue;
  327 |         }
  328 |         catch (error) {
  329 |             console.error('Error occurred while getting element attribute:', selector, attribute, error);
  330 |             throw error;
  331 |         }
  332 |     }
  333 | 
  334 |     //Radio button and checkbox methods
  335 |     async CheckElement(selector, options = { timeout: 30000 }){
  336 |         try{
  337 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  338 |             await this.page.check(selector, options);
  339 |             await expect(await this.page.isChecked(selector)).toBe(true);
  340 |         }
  341 |         catch (error) {
  342 |             console.error('Error occurred while checking element:', selector, error);
  343 |             throw error;
  344 |         }
  345 |     }
  346 | 
  347 |     async UncheckElement(selector, options = { timeout: 30000 }){
  348 |         try{
  349 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  350 |             await this.page.uncheck(selector, options);
  351 |             await expect(await this.page.isChecked(selector)).toBe(false);
  352 |         }
  353 |         catch (error) {
  354 |             console.error('Error occurred while unchecking element:', selector, error);
  355 |             throw error;
  356 |         }
  357 |     }
  358 | 
  359 |     //Handle Select Tag DropDown
  360 |     async SelectOptionByValue(selector, value, options = { timeout: 30000 }){
  361 |         try{
  362 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  363 |             await this.page.selectOption(selector, { value: value }, options);
  364 |         }
  365 |         catch (error) {
  366 |             console.error('Error occurred while selecting option by value:', selector, value, error);
  367 |             throw error;
  368 |         }
  369 |     }
  370 | 
  371 |     async SelectOptionByLabel(selector, label, options = { timeout: 30000 }){
  372 |         try{
  373 |             await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  374 |             await this.page.selectOption(selector, { label: label }, options);
  375 |         }
  376 |         catch (error) {
  377 |             console.error('Error occurred while selecting option by label:', selector, label, error);
  378 |             throw error;
  379 |         }
  380 |     }
  381 | 
  382 |     async SelectMultipleOptions(selector, values = [], timeout = 30000) {
  383 |         try {
  384 |             await this.page.locator(selector).selectOption(values, { timeout });
  385 |         } catch (error) {
  386 |             console.error("Error occurred:", error, selector);
  387 |             throw error;
  388 |         }
  389 |    }
  390 | 
```