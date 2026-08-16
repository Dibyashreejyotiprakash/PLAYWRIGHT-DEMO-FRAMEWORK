# Agent Code Generation Rules (MANDATORY)
## Rules for Generating PageObjects and Test Scripts

**Version:** 1.0  
**Last Updated:** August 14, 2026  
**Status:** MANDATORY - Must be followed for ALL code generation

---

## 🚨 CRITICAL RULE #1: Use Existing Interaction.js Methods

**BEFORE creating ANY action in a PageObject method:**

### Step 1: Search Interaction.js for Existing Method

```bash
# Search for the action you need
search/textSearch: "async {ActionName}"
# Examples:
search/textSearch: "async Fill"           # For filling input
search/textSearch: "async Click"          # For clicking
search/textSearch: "async Select"         # For dropdowns
search/textSearch: "async Check"          # For checkboxes
search/textSearch: "async Assert"         # For assertions
search/textSearch: "async Get"            # For getting values
search/textSearch: "async wait"           # For waits
```

### Step 2: Use Found Method (DO NOT Create New!)

**❌ NEVER DO THIS:**
```javascript
// ❌ WRONG - Creating custom action
async login(username, password) {
    await this.usernameInput.fill(username);  // Direct Playwright!
    await this.loginButton.click();  // Direct Playwright!
}
```

**✅ ALWAYS DO THIS:**
```javascript
// ✅ CORRECT - Using existing Interaction.js methods
async login(username, password) {
    try {
        Test.Log.Info('Entering username');
        await this.interaction.FillInputField(this.usernameInput, username);  // Existing method!
        
        Test.Log.Info('Clicking login button');
        await this.interaction.ClickOnElement(this.loginButton);  // Existing method!
        
        Test.Log.Pass('Login completed', null, this.page);
    }
    catch(error) {
        Test.Log.Error('Login failed', error.message, this.page);
        throw error;
    }
}
```

---

## 📋 Available Interaction.js Methods (Reference)

### Click Actions:
```javascript
✅ await this.interaction.ClickOnElement(selector)
✅ await this.interaction.DoubleClickOnElement(selector)
✅ await this.interaction.RightClickOnElement(selector)
✅ await this.interaction.HoverOnElement(selector)
✅ await this.interaction.HoverAndClickOnElement(selector)
```

### Input Actions:
```javascript
✅ await this.interaction.FillInputField(selector, value)
✅ await this.interaction.ClearInputField(selector)
```

### Checkbox/Radio Actions:
```javascript
✅ await this.interaction.CheckElement(selector)
✅ await this.interaction.UncheckElement(selector)
```

### Dropdown Actions:
```javascript
✅ await this.interaction.SelectOptionByValue(selector, value)
✅ await this.interaction.SelectOptionByLabel(selector, label)
✅ await this.interaction.SelectMultipleOptions(selector, [values])
```

### Get Information:
```javascript
✅ await this.interaction.GetElementText(selector)
✅ await this.interaction.GetElementAttribute(selector, 'attribute')
✅ await this.interaction.getCurrentUrl()
✅ await this.interaction.getTitle()
```

### Wait Actions:
```javascript
✅ await this.interaction.waitForTimeout(milliseconds)
✅ await this.interaction.waitforLoadState('load')  // 'load', 'domcontentloaded', 'networkidle'
✅ await this.interaction.waitforNetWorkIdle()
✅ await this.interaction.waitforVisibleSelector(selector)
✅ await this.interaction.waitForHidden(selector)
✅ await this.interaction.waitforUrlToLoad(url)
```

### Assertions:
```javascript
✅ await this.interaction.AssertElementVisible(locator)
✅ await this.interaction.AssertElementHiden(locator)
✅ await this.interaction.AssertElementEnabled(locator)
✅ await this.interaction.AssertElementDisabled(locator)
✅ await this.interaction.AssertCurrentUrl(expectedUrl)
✅ await this.interaction.AssertTitle(expectedTitle)
```

### Navigation:
```javascript
✅ await this.interaction.goToUrl(url)
✅ await this.interaction.refreshPage()
✅ await this.interaction.backToPreviousPage()
✅ await this.interaction.forwardToNextPage()
```

### Focus/Blur:
```javascript
✅ await this.interaction.Focus(selector)
✅ await this.interaction.Blur(selector)
```

---

## 🚨 CRITICAL RULE #2: NEVER Use Direct Playwright Methods

**❌ FORBIDDEN - Direct Playwright Calls:**
```javascript
// ❌ NEVER use these in PageObject methods:
await locator.fill(value)
await locator.click()
await locator.check()
await locator.hover()
await locator.selectOption(value)
await page.fill(selector, value)
await page.click(selector)
await page.goto(url)
await page.waitForTimeout(ms)
await expect(locator).toBeVisible()
```

**✅ REQUIRED - Interaction.js Methods:**
```javascript
// ✅ ALWAYS use these instead:
await this.interaction.FillInputField(locator, value)
await this.interaction.ClickOnElement(locator)
await this.interaction.CheckElement(locator)
await this.interaction.HoverOnElement(locator)
await this.interaction.SelectOptionByValue(locator, value)
await this.interaction.goToUrl(url)
await this.interaction.waitForTimeout(ms)
await this.interaction.AssertElementVisible(locator)
```

---

## 🚨 CRITICAL RULE #3: Locators Must Be Objects, NOT Strings

**❌ WRONG - String Selectors:**
```javascript
constructor(page) {
    this.page = page;
    this.interaction = new Interaction(page);
    
    // ❌ WRONG - String selectors!
    this.usernameInput = "#username";
    this.loginButton = "//button[@name='Login']";
    this.errorMessage = ".error-message";
}
```

**✅ CORRECT - Playwright Locator Objects:**
```javascript
constructor(page) {
    this.page = page;
    this.interaction = new Interaction(page);
    
    // ✅ CORRECT - Locator objects!
    this.usernameInput = page.getByPlaceholder('Username');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
}
```

---

## 🚨 CRITICAL RULE #4: All Methods Must Have Try-Catch + Test.Log

**❌ WRONG - No Try-Catch or Logging:**
```javascript
async login(username, password) {
    await this.interaction.FillInputField(this.usernameInput, username);
    await this.interaction.FillInputField(this.passwordInput, password);
    await this.interaction.ClickOnElement(this.loginButton);
}
```

**✅ CORRECT - Try-Catch + Test.Log:**
```javascript
async login(username, password) {
    try {
        Test.Log.Info('Entering username in login form');
        await this.interaction.FillInputField(this.usernameInput, username);

        Test.Log.Info('Entering password in login form');
        await this.interaction.FillInputField(this.passwordInput, password);

        Test.Log.Info('Clicking on login button');
        await this.interaction.ClickOnElement(this.loginButton);

        Test.Log.Info('Waiting for page to load');
        await this.interaction.waitforLoadState('load');

        Test.Log.Pass('Login action completed successfully', null, this.page);
    }
    catch(error) {
        Test.Log.Error('Login action failed', error.message, this.page);
        console.log(`Login failed due to ${error}`);
        throw error;
    }
}
```

---

## 🚨 CRITICAL RULE #5: Check for Existing PageObject Methods

**BEFORE creating a new method in a PageObject:**

### Step 1: Search Existing PageObjects

```bash
# Search for similar method
search/textSearch: "async login("
search/textSearch: "async fillForm("
search/textSearch: "async submit("
search/textSearch: "async select"
```

### Step 2: Reuse or Extend (DO NOT Duplicate!)

**If method exists:**
```javascript
// ✅ REUSE existing method
import LoginPage from '../PageObjects/LoginPage.js';

test('TC-1: Valid login', async function() {
    await loginPage.login(username, password);  // Existing method!
});
```

**If similar method exists but needs extension:**
```javascript
// ✅ EXTEND existing method with optional parameters
class LoginPage {
    // Existing method
    async login(username, password) {
        // ... implementation
    }
    
    // NEW method - extends existing with remember me option
    async loginWithRememberMe(username, password) {
        try {
            Test.Log.Info('Checking remember me checkbox');
            await this.interaction.CheckElement(this.rememberMeCheckbox);
            
            // Reuse existing login logic
            Test.Log.Info('Proceeding with login');
            await this.login(username, password);  // Call existing method!
            
            Test.Log.Pass('Login with remember me completed', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Login with remember me failed', error.message, this.page);
            throw error;
        }
    }
}
```

**❌ NEVER duplicate existing methods:**
```javascript
// ❌ WRONG - Duplicating login method
class LoginPage {
    async login(username, password) {
        // ... implementation
    }
    
    // ❌ WRONG - This is a duplicate!
    async performLogin(username, password) {
        // Same implementation as login() above - DON'T DO THIS!
    }
}
```

---

## 📋 Code Generation Workflow (MANDATORY STEPS)

### When Generating a PageObject Method:

```
Step 1: Identify required actions
   └─ Example: Need to fill input and click button

Step 2: Search Interaction.js for methods
   ├─ search/textSearch: "async Fill"
   ├─ Found: FillInputField(selector, value) ✅
   ├─ search/textSearch: "async Click"
   └─ Found: ClickOnElement(selector) ✅

Step 3: Check if similar PageObject method exists
   ├─ search/textSearch: "async login("
   └─ Not found, safe to create ✅

Step 4: Generate method using ONLY Interaction.js methods
   ├─ Use this.interaction.FillInputField() ✅
   ├─ Use this.interaction.ClickOnElement() ✅
   ├─ Wrap in try-catch ✅
   ├─ Add Test.Log.Info/Pass/Error ✅
   └─ Throw error in catch block ✅

Step 5: Verify generated code
   ├─ No direct Playwright calls ✅
   ├─ All Interaction.js methods exist ✅
   ├─ Try-catch present ✅
   ├─ Test.Log present ✅
   └─ Locators are objects, not strings ✅
```

---

## ✅ Complete Example (Following All Rules)

### Step 1: Search Interaction.js
```bash
search/textSearch: "async Fill"
# Found: FillInputField(selector, value)

search/textSearch: "async Click"
# Found: ClickOnElement(selector)

search/textSearch: "async Assert"
# Found: AssertElementEnabled(locator), AssertElementVisible(locator)

search/textSearch: "async wait"
# Found: waitforLoadState(state)
```

### Step 2: Check Existing PageObjects
```bash
search/textSearch: "async login("
# Check if login method already exists in any PageObject
# If not found, proceed to create
```

### Step 3: Generate PageObject

```javascript
import {test, expect} from '@playwright/test';
import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class LoginPage {

    constructor(page) {
        this.page = page;
        this.interaction = new Interaction(page);  // ✅ Create Interaction instance
        
        // ✅ Locators as Playwright objects, NOT strings!
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async login(username, password) {
        try {
            // ✅ Using Interaction.js method (searched and found!)
            Test.Log.Info('Entering username in login form');
            await this.interaction.FillInputField(this.usernameInput, username);

            // ✅ Using Interaction.js method (searched and found!)
            Test.Log.Info('Entering password in login form');
            await this.interaction.FillInputField(this.passwordInput, password);

            // ✅ Using Interaction.js method (searched and found!)
            Test.Log.Info('Verifying login button is enabled');
            await this.interaction.AssertElementEnabled(this.loginButton);

            // ✅ Using Interaction.js method (searched and found!)
            Test.Log.Info('Clicking on login button');
            await this.interaction.ClickOnElement(this.loginButton);

            // ✅ Using Interaction.js method (searched and found!)
            Test.Log.Info('Waiting for page to load after login');
            await this.interaction.waitforLoadState('load');

            // ✅ Test.Log.Pass on success
            Test.Log.Pass('Login action completed successfully', null, this.page);
        }
        catch(error) {
            // ✅ Test.Log.Error on failure
            Test.Log.Error('Login action failed', error.message, this.page);
            console.log(`Login failed due to ${error}`);
            throw error;  // ✅ Throw error
        }
    }
}

export default LoginPage;
```

---

## 🚫 What NOT to Do

### ❌ Creating Random Utilities
```javascript
// ❌ NEVER create custom helper methods in PageObjects
class LoginPage {
    // ❌ WRONG - Custom click helper (Interaction.js already has this!)
    async customClick(locator) {
        await locator.click();
    }
    
    // ❌ WRONG - Custom fill helper (Interaction.js already has this!)
    async customFill(locator, value) {
        await locator.fill(value);
    }
}
```

### ✅ Use Existing Interaction.js Methods
```javascript
// ✅ CORRECT - Use existing methods
class LoginPage {
    async login(username, password) {
        try {
            // ✅ Use existing Interaction.js methods
            await this.interaction.FillInputField(this.usernameInput, username);
            await this.interaction.ClickOnElement(this.loginButton);
            Test.Log.Pass('Login completed', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Login failed', error.message, this.page);
            throw error;
        }
    }
}
```

---

## 📋 Pre-Generation Checklist

Before generating ANY PageObject method, verify:

- [ ] **Searched Interaction.js** for existing methods
- [ ] **Found matching methods** in Interaction.js (don't create new!)
- [ ] **Checked existing PageObjects** for similar methods
- [ ] **No duplication** (reuse or extend existing methods)
- [ ] **Locators are objects** (page.getByRole, page.getByPlaceholder, etc.)
- [ ] **No direct Playwright calls** (use this.interaction.{Method})
- [ ] **Try-catch block** present
- [ ] **Test.Log.Info** before each action
- [ ] **Test.Log.Pass** on success
- [ ] **Test.Log.Error** on failure
- [ ] **Throw error** in catch block

---

## 🎯 Decision Tree

```
Need to perform an action?
    ├─ Search Interaction.js first
    │   ├─ Method found? → Use it! ✅
    │   └─ Method not found? → Ask user if should be added to Interaction.js
    │
    ├─ Need to create PageObject method?
    │   ├─ Search existing PageObjects for similar method
    │   │   ├─ Exists? → Reuse it! ✅
    │   │   └─ Not exists? → Create using Interaction.js methods ✅
    │   │
    │   └─ Use ONLY Interaction.js methods
    │       ├─ this.interaction.FillInputField() ✅
    │       ├─ this.interaction.ClickOnElement() ✅
    │       ├─ this.interaction.AssertElementVisible() ✅
    │       └─ NEVER locator.fill(), locator.click() ❌
    │
    └─ Wrap everything in try-catch + Test.Log ✅
```

---

## 🎉 Summary

**ALWAYS:**
1. ✅ Search Interaction.js for existing methods FIRST
2. ✅ Use found methods (DON'T create new utilities!)
3. ✅ Search existing PageObjects for similar methods
4. ✅ Reuse or extend (DON'T duplicate!)
5. ✅ Use Locator objects (NOT strings!)
6. ✅ Wrap in try-catch with Test.Log
7. ✅ Use this.interaction.{Method}() (NOT direct Playwright!)

**NEVER:**
1. ❌ Create random utilities
2. ❌ Use direct Playwright methods (locator.fill, locator.click, etc.)
3. ❌ Use string selectors ("#id", "//xpath")
4. ❌ Skip try-catch or Test.Log
5. ❌ Duplicate existing methods
6. ❌ Create methods without checking if they exist

**This ensures:**
- Consistent code across framework
- No duplicate utilities
- Proper error handling and logging
- Maintainable, reusable code
- Framework compliance

---

**END OF MANDATORY GENERATION RULES**
