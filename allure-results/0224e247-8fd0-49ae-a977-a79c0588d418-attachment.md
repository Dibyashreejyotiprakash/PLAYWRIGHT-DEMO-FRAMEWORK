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
  169 |         try{
  170 |             await base.page.waitForEvent(event, options);
  171 |         }
  172 |         catch (error) {
  173 |             console.error('Error occurred:', error,event);
  174 |             throw error;
  175 |         }
  176 |     }
  177 | 
  178 |     async waitForDownLoad(filepath){
  179 |         try{
  180 |             const download = await base.page.waitForEvent("download");
  181 |             await download.saveAs(filepath);
  182 |         }
  183 |         catch(error){
  184 |             console.error('waitForDownLoad Error occurred:', error,event);
  185 |             throw error;
  186 |         }
  187 |     }
  188 | 
  189 |     async Focus(selector, options = { timeout: 30000 }){
  190 |         try{
  191 |             await base.page.locator(selector).focus();
  192 |         }
  193 |         catch (error) {
  194 |             console.error('Error occurred while focusing on element:', selector, error);
  195 |             throw error;
  196 |         }
  197 |     }
  198 | 
  199 |     async Blur(selector, options = { timeout: 30000 }){
  200 |         try{
  201 |             await base.page.locator(selector).blur();
  202 |         }
  203 |         catch (error) {
  204 |             console.error('Error occurred while blurring on element:', selector, error);
  205 |             throw error;
  206 |         }
  207 |     }
  208 | 
  209 |     
  210 | 
  211 |     async ClickOnElement(selector, options = { timeout: 30000 }){
  212 |         try{
  213 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  214 |             await base.page.click(selector, options);
  215 |         }
  216 |         catch (error) {
  217 |             console.error('Error occurred while clicking on element:', selector, error);
  218 |             throw error;
  219 |         }
  220 |     }
  221 | 
  222 |     async DoubleClickOnElement(selector, options = { timeout: 30000 }){
  223 |         try{
  224 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  225 |             await base.page.dblclick(selector, options);
  226 |         }
  227 |         catch (error) {
  228 |             console.error('Error occurred while double clicking on element:', selector, error);
  229 |             throw error;
  230 |         }
  231 |     }
  232 | 
  233 |     async RightClickOnElement(selector, options = { timeout: 30000 }){
  234 |         try{
  235 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  236 |             await base.page.click(selector, { button: 'right', ...options });
  237 |         }
  238 |         catch (error) {
  239 |             console.error('Error occurred while right clicking on element:', selector, error);
  240 |             throw error;
  241 |         }
  242 |     }
  243 | 
  244 |     async HoverOnElement(selector, options = { timeout: 30000 }){
  245 |         try{
  246 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  247 |             await base.page.hover(selector, options);
  248 |         }
  249 |         catch (error) {
  250 |             console.error('Error occurred while hovering on element:', selector, error);
  251 |             throw error;
  252 |         }
  253 |     }
  254 | 
  255 |     async HoverAndClickOnElement(selector, options = { timeout: 30000 }){
  256 |         try{
  257 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  258 |             await base.page.hover(selector, options);
  259 |             await base.page.click(selector, options);
  260 |         }
  261 |         catch (error) {
  262 |             console.error('Error occurred while hovering and clicking on element:', selector, error);
  263 |             throw error;
  264 |         }
  265 |     }
  266 | 
  267 |     async FillInputField(selector, value, options = { timeout: 30000 }){
  268 |         try{
> 269 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
      |                             ^ TypeError: Cannot read properties of null (reading 'waitForSelector')
  270 |             await base.page.fill(selector, value, options);
  271 |         }
  272 |         catch (error) {
  273 |             console.error('Error occurred while filling input field:', selector, error);
  274 |             throw error;
  275 |         }
  276 |     }
  277 | 
  278 |     async ClearInputField(selector, options = { timeout: 30000 }){
  279 |         try{
  280 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  281 |             await base.page.fill(selector, '', options);
  282 |         }
  283 |         catch (error) {
  284 |             console.error('Error occurred while clearing input field:', selector, error);
  285 |             throw error;
  286 |         }
  287 |     }
  288 | 
  289 |     async GetElementText(selector, options = { timeout: 30000 }){
  290 |         try{
  291 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  292 |             const text = await base.page.textContent(selector, options);
  293 |             return text;
  294 |         }
  295 |         catch (error) {
  296 |             console.error('Error occurred while getting element text:', selector, error);
  297 |             throw error;
  298 |         }
  299 |     }
  300 | 
  301 |     async GetElementAttribute(selector, attribute, options = { timeout: 30000 }){
  302 |         try{
  303 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  304 |             const attrValue = await base.page.getAttribute(selector, attribute, options);
  305 |             return attrValue;
  306 |         }
  307 |         catch (error) {
  308 |             console.error('Error occurred while getting element attribute:', selector, attribute, error);
  309 |             throw error;
  310 |         }
  311 |     }
  312 | 
  313 |     //Radio button and checkbox methods
  314 |     async CheckElement(selector, options = { timeout: 30000 }){
  315 |         try{
  316 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  317 |             await base.page.check(selector, options);
  318 |             await expect(await base.page.isChecked(selector)).toBe(true);
  319 |         }
  320 |         catch (error) {
  321 |             console.error('Error occurred while checking element:', selector, error);
  322 |             throw error;
  323 |         }
  324 |     }
  325 | 
  326 |     async UncheckElement(selector, options = { timeout: 30000 }){
  327 |         try{
  328 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  329 |             await base.page.uncheck(selector, options);
  330 |             await expect(await base.page.isChecked(selector)).toBe(false);
  331 |         }
  332 |         catch (error) {
  333 |             console.error('Error occurred while unchecking element:', selector, error);
  334 |             throw error;
  335 |         }
  336 |     }
  337 | 
  338 |     //Handle Select Tag DropDown
  339 |     async SelectOptionByValue(selector, value, options = { timeout: 30000 }){
  340 |         try{
  341 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  342 |             await base.page.selectOption(selector, { value: value }, options);
  343 |         }
  344 |         catch (error) {
  345 |             console.error('Error occurred while selecting option by value:', selector, value, error);
  346 |             throw error;
  347 |         }
  348 |     }
  349 | 
  350 |     async SelectOptionByLabel(selector, label, options = { timeout: 30000 }){
  351 |         try{
  352 |             await base.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  353 |             await base.page.selectOption(selector, { label: label }, options);
  354 |         }
  355 |         catch (error) {
  356 |             console.error('Error occurred while selecting option by label:', selector, label, error);
  357 |             throw error;
  358 |         }
  359 |     }
  360 | 
  361 |     async SelectMultipleOptions(selector, values = [], timeout = 30000) {
  362 |         try {
  363 |             await base.page.locator(selector).selectOption(values, { timeout });
  364 |         } catch (error) {
  365 |             console.error("Error occurred:", error, selector);
  366 |             throw error;
  367 |         }
  368 |    }
  369 | 
```