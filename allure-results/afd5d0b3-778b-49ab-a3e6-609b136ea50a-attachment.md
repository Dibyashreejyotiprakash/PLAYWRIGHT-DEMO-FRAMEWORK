# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UI_Automation\Smoke\ValidateLoginTest.spec.js >> Validate Login Functionality >> Validate Valid Login 
- Location: tests\UI_Automation\Smoke\ValidateLoginTest.spec.js:40:5

# Error details

```
TypeError: Cannot read properties of null (reading 'waitForSelector')
```

# Test source

```ts
  189 |         try{
  190 |             await base.page.waitForEvent(event, options);
  191 |         }
  192 |         catch (error) {
  193 |             console.error('Error occurred:', error,event);
  194 |             throw error;
  195 |         }
  196 |     }
  197 | 
  198 |     async waitForDownLoad(filepath){
  199 |         try{
  200 |             const download = await base.page.waitForEvent("download");
  201 |             await download.saveAs(filepath);
  202 |         }
  203 |         catch(error){
  204 |             console.error('waitForDownLoad Error occurred:', error,event);
  205 |             throw error;
  206 |         }
  207 |     }
  208 | 
  209 |     async Focus(selector, options = { timeout: 30000 }){
  210 |         try{
  211 |             await base.page.locator(selector).focus();
  212 |         }
  213 |         catch (error) {
  214 |             console.error('Error occurred while focusing on element:', selector, error);
  215 |             throw error;
  216 |         }
  217 |     }
  218 | 
  219 |     async Blur(selector, options = { timeout: 30000 }){
  220 |         try{
  221 |             await base.page.locator(selector).blur();
  222 |         }
  223 |         catch (error) {
  224 |             console.error('Error occurred while blurring on element:', selector, error);
  225 |             throw error;
  226 |         }
  227 |     }
  228 | 
  229 |     
  230 | 
  231 |     async ClickOnElement(selector, options = { timeout: 30000 }){
  232 |         try{
  233 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  234 |             await base.page.click(selector, options);
  235 |         }
  236 |         catch (error) {
  237 |             console.error('Error occurred while clicking on element:', selector, error);
  238 |             throw error;
  239 |         }
  240 |     }
  241 | 
  242 |     async DoubleClickOnElement(selector, options = { timeout: 30000 }){
  243 |         try{
  244 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  245 |             await base.page.dblclick(selector, options);
  246 |         }
  247 |         catch (error) {
  248 |             console.error('Error occurred while double clicking on element:', selector, error);
  249 |             throw error;
  250 |         }
  251 |     }
  252 | 
  253 |     async RightClickOnElement(selector, options = { timeout: 30000 }){
  254 |         try{
  255 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  256 |             await base.page.click(selector, { button: 'right', ...options });
  257 |         }
  258 |         catch (error) {
  259 |             console.error('Error occurred while right clicking on element:', selector, error);
  260 |             throw error;
  261 |         }
  262 |     }
  263 | 
  264 |     async HoverOnElement(selector, options = { timeout: 30000 }){
  265 |         try{
  266 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  267 |             await base.page.hover(selector, options);
  268 |         }
  269 |         catch (error) {
  270 |             console.error('Error occurred while hovering on element:', selector, error);
  271 |             throw error;
  272 |         }
  273 |     }
  274 | 
  275 |     async HoverAndClickOnElement(selector, options = { timeout: 30000 }){
  276 |         try{
  277 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  278 |             await base.page.hover(selector, options);
  279 |             await base.page.click(selector, options);
  280 |         }
  281 |         catch (error) {
  282 |             console.error('Error occurred while hovering and clicking on element:', selector, error);
  283 |             throw error;
  284 |         }
  285 |     }
  286 | 
  287 |     async FillInputField(selector, value, options = { timeout: 30000 }){
  288 |         try{
> 289 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
      |                             ^ TypeError: Cannot read properties of null (reading 'waitForSelector')
  290 |             await base.page.fill(selector, value, options);
  291 |         }
  292 |         catch (error) {
  293 |             console.error('Error occurred while filling input field:', selector, error);
  294 |             throw error;
  295 |         }
  296 |     }
  297 | 
  298 |     async ClearInputField(selector, options = { timeout: 30000 }){
  299 |         try{
  300 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  301 |             await base.page.fill(selector, '', options);
  302 |         }
  303 |         catch (error) {
  304 |             console.error('Error occurred while clearing input field:', selector, error);
  305 |             throw error;
  306 |         }
  307 |     }
  308 | 
  309 |     async GetElementText(selector, options = { timeout: 30000 }){
  310 |         try{
  311 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  312 |             const text = await base.page.textContent(selector, options);
  313 |             return text;
  314 |         }
  315 |         catch (error) {
  316 |             console.error('Error occurred while getting element text:', selector, error);
  317 |             throw error;
  318 |         }
  319 |     }
  320 | 
  321 |     async GetElementAttribute(selector, attribute, options = { timeout: 30000 }){
  322 |         try{
  323 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  324 |             const attrValue = await base.page.getAttribute(selector, attribute, options);
  325 |             return attrValue;
  326 |         }
  327 |         catch (error) {
  328 |             console.error('Error occurred while getting element attribute:', selector, attribute, error);
  329 |             throw error;
  330 |         }
  331 |     }
  332 | 
  333 |     //Radio button and checkbox methods
  334 |     async CheckElement(selector, options = { timeout: 30000 }){
  335 |         try{
  336 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  337 |             await base.page.check(selector, options);
  338 |             await expect(await base.page.isChecked(selector)).toBe(true);
  339 |         }
  340 |         catch (error) {
  341 |             console.error('Error occurred while checking element:', selector, error);
  342 |             throw error;
  343 |         }
  344 |     }
  345 | 
  346 |     async UncheckElement(selector, options = { timeout: 30000 }){
  347 |         try{
  348 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  349 |             await base.page.uncheck(selector, options);
  350 |             await expect(await base.page.isChecked(selector)).toBe(false);
  351 |         }
  352 |         catch (error) {
  353 |             console.error('Error occurred while unchecking element:', selector, error);
  354 |             throw error;
  355 |         }
  356 |     }
  357 | 
  358 |     //Handle Select Tag DropDown
  359 |     async SelectOptionByValue(selector, value, options = { timeout: 30000 }){
  360 |         try{
  361 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  362 |             await base.page.selectOption(selector, { value: value }, options);
  363 |         }
  364 |         catch (error) {
  365 |             console.error('Error occurred while selecting option by value:', selector, value, error);
  366 |             throw error;
  367 |         }
  368 |     }
  369 | 
  370 |     async SelectOptionByLabel(selector, label, options = { timeout: 30000 }){
  371 |         try{
  372 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  373 |             await base.page.selectOption(selector, { label: label }, options);
  374 |         }
  375 |         catch (error) {
  376 |             console.error('Error occurred while selecting option by label:', selector, label, error);
  377 |             throw error;
  378 |         }
  379 |     }
  380 | 
  381 |     async SelectMultipleOptions(selector, values = [], timeout = 30000) {
  382 |         try {
  383 |             await base.page.locator(selector).selectOption(values, { timeout });
  384 |         } catch (error) {
  385 |             console.error("Error occurred:", error, selector);
  386 |             throw error;
  387 |         }
  388 |    }
  389 | 
```