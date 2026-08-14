# Framework Pattern Guide
## Exact Pattern Matching for LoginPage.js and Interaction.js

**Version:** 1.0  
**Last Updated:** August 14, 2026  
**Purpose:** Document the exact framework patterns to be followed when generating Page Objects and test scripts

---

## 🎯 Overview

This guide documents the **exact patterns** used in your framework, extracted from actual files:
- `PageObjects/LoginPage.js`
- `Utility/UIInteraction/Interaction.js`
- `tests/UI_Automation/Smoke/ValidateLoginTest.spec.js`

**ALL generated code MUST follow these patterns exactly.**

---

## 📋 Page Object Pattern (MANDATORY)

### Template Structure

```javascript
import {test, expect} from '@playwright/test';
import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class {PageName}Page {

    constructor(page) {
        this.page = page;
        this.interaction = new Interaction(page);
        
        // Locators defined as Playwright locator objects (NOT strings!)
        this.{elementName} = page.{locatorMethod}({params});
        this.{elementName} = page.{locatorMethod}({params});
    }

    async {methodName}({params}) {
        try {
            Test.Log.Info('{description}');
            await this.interaction.{InteractionMethod}(this.{element}, {params});
            
            Test.Log.Info('{next step description}');
            await this.interaction.{InteractionMethod}(this.{element}, {params});
            
            Test.Log.Pass('{method} completed successfully', null, this.page);
        }
        catch(error) {
            Test.Log.Error('{method} failed', error.message, this.page);
            console.log(`{method} failed due to ${error}`);
            throw error;
        }
    }
}

export default {PageName}Page;
```

---

## 🔍 Locator Patterns (CRITICAL!)

### ✅ CORRECT Locator Patterns

**1. By Placeholder:**
```javascript
this.usernameInput = page.getByPlaceholder('Username');
this.passwordInput = page.getByPlaceholder('Password');
this.searchBox = page.getByPlaceholder('Search...');
```

**2. By Role:**
```javascript
this.loginButton = page.getByRole('button', { name: 'Login' });
this.submitButton = page.getByRole('button', { name: 'Submit' });
this.cancelLink = page.getByRole('link', { name: 'Cancel' });
this.checkbox = page.getByRole('checkbox', { name: 'Remember me' });
```

**3. By Label:**
```javascript
this.emailInput = page.getByLabel('Email Address');
this.phoneInput = page.getByLabel('Phone Number');
```

**4. By Test ID:**
```javascript
this.loginBtn = page.getByTestId('login-btn');
this.errorMsg = page.getByTestId('error-message');
```

**5. By Text:**
```javascript
this.welcomeText = page.getByText('Welcome');
this.errorMessage = page.getByText('Invalid credentials');
```

**6. By CSS Selector (when necessary):**
```javascript
this.specificElement = page.locator('.class-name');
this.byId = page.locator('#element-id');
this.complex = page.locator('button[type="submit"]');
```

**7. By XPath (last resort):**
```javascript
this.element = page.locator("//button[normalize-space()='Login']");
this.input = page.locator("//input[@placeholder='Username']");
```

### ❌ WRONG Locator Patterns

```javascript
// ❌ WRONG - String selectors (not locator objects!)
this.usernameInput = "//input[@placeholder='Username']";  // String XPath
this.loginButton = "#login-btn";  // String CSS
this.element = ".class-name";  // String class

// ❌ WRONG - Using getters
get usernameInput() {
    return this.page.getByPlaceholder('Username');
}

// ❌ WRONG - Direct Playwright calls in PageObject
async login(username, password) {
    await this.usernameInput.fill(username);  // Should use this.interaction.FillInputField
    await this.loginButton.click();  // Should use this.interaction.ClickOnElement
}
```

---

## 🛠️ Interaction Methods Reference

### Available Methods (from Interaction.js)

**Navigation & Page Control:**
```javascript
await this.interaction.goToUrl(url)
await this.interaction.refreshPage()
await this.interaction.backToPreviousPage()
await this.interaction.forwardToNextPage()
await this.interaction.getCurrentUrl()
await this.interaction.getTitle()
```

**Waiting Methods:**
```javascript
await this.interaction.waitForTimeout(milliseconds)
await this.interaction.waitforUrlToLoad(url)
await this.interaction.waitforLoadState('load')  // 'load', 'domcontentloaded', 'networkidle'
await this.interaction.waitforNetWorkIdle()
await this.interaction.waitforVisibleSelector(selector)
await this.interaction.waitForHidden(selector)
await this.interaction.waitForAttached(selector)
```

**Click Methods:**
```javascript
await this.interaction.ClickOnElement(selector)
await this.interaction.DoubleClickOnElement(selector)
await this.interaction.RightClickOnElement(selector)
await this.interaction.HoverOnElement(selector)
await this.interaction.HoverAndClickOnElement(selector)
```

**Input Methods:**
```javascript
await this.interaction.FillInputField(selector, value)
await this.interaction.ClearInputField(selector)
```

**Get Element Info:**
```javascript
const text = await this.interaction.GetElementText(selector)
const attr = await this.interaction.GetElementAttribute(selector, 'attribute')
```

**Checkbox/Radio:**
```javascript
await this.interaction.CheckElement(selector)
await this.interaction.UncheckElement(selector)
```

**Dropdown:**
```javascript
await this.interaction.SelectOptionByValue(selector, value)
await this.interaction.SelectOptionByLabel(selector, label)
await this.interaction.SelectMultipleOptions(selector, [val1, val2])
```

**Assertions:**
```javascript
await this.interaction.AssertTitle(expectedTitle)
await this.interaction.AssertCurrentUrl(expectedUrl)
await this.interaction.AssertElementVisible(locator)
await this.interaction.AssertElementHiden(locator)
await this.interaction.AssertElementEnabled(locator)
await this.interaction.AssertElementDisabled(locator)
await this.interaction.AssertElementEdiatble(locator)
```

**Focus/Blur:**
```javascript
await this.interaction.Focus(selector)
await this.interaction.Blur(selector)
```

---

## 📝 Complete PageObject Examples

### Example 1: LoginPage.js (Actual Pattern)

```javascript
import {test, expect} from '@playwright/test';
import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class LoginPage {

    constructor(page) {
        this.page = page;
        this.interaction = new Interaction(page);
        
        // Locators as Playwright locator objects
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async login(username, password) {
        try {
            Test.Log.Info('Entering username in login form');
            await this.interaction.FillInputField(this.usernameInput, username);

            Test.Log.Info('Entering password in login form');
            await this.interaction.FillInputField(this.passwordInput, password);

            Test.Log.Info('Verifying login button is enabled');
            await this.interaction.AssertElementEnabled(this.loginButton);

            Test.Log.Info('Clicking on login button');
            await this.interaction.ClickOnElement(this.loginButton);

            Test.Log.Info('Waiting for page to load after login');
            await this.interaction.waitforLoadState('load');

            Test.Log.Pass('Login action completed successfully', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Login action failed', error.message, this.page);
            console.log(`Login failed due to ${error}`);
            throw error;
        }
    }
}

export default LoginPage;
```

### Example 2: HomePage.js

```javascript
import {test, expect} from '@playwright/test';
import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class HomePage {

    constructor(page) {
        this.page = page;
        this.interaction = new Interaction(page);
        
        // Locators
        this.welcomeMessage = page.getByText('Welcome');
        this.userMenu = page.getByRole('button', { name: 'User Menu' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.profileLink = page.getByRole('link', { name: 'Profile' });
    }

    async getWelcomeMessage() {
        try {
            Test.Log.Info('Getting welcome message text');
            const message = await this.interaction.GetElementText(this.welcomeMessage);
            Test.Log.Pass('Welcome message retrieved successfully', null, this.page);
            return message;
        }
        catch(error) {
            Test.Log.Error('Failed to get welcome message', error.message, this.page);
            console.log(`Get welcome message failed due to ${error}`);
            throw error;
        }
    }

    async logout() {
        try {
            Test.Log.Info('Clicking on user menu');
            await this.interaction.ClickOnElement(this.userMenu);

            Test.Log.Info('Waiting for logout button to be visible');
            await this.interaction.waitforVisibleSelector(this.logoutButton);

            Test.Log.Info('Clicking on logout button');
            await this.interaction.ClickOnElement(this.logoutButton);

            Test.Log.Info('Waiting for page to load after logout');
            await this.interaction.waitforLoadState('load');

            Test.Log.Pass('Logout action completed successfully', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Logout action failed', error.message, this.page);
            console.log(`Logout failed due to ${error}`);
            throw error;
        }
    }

    async verifyDashboardLoaded() {
        try {
            Test.Log.Info('Verifying dashboard elements are visible');
            await this.interaction.AssertElementVisible(this.welcomeMessage);
            await this.interaction.AssertElementVisible(this.userMenu);
            
            Test.Log.Pass('Dashboard loaded successfully', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Dashboard verification failed', error.message, this.page);
            console.log(`Dashboard verification failed due to ${error}`);
            throw error;
        }
    }
}

export default HomePage;
```

### Example 3: RegistrationPage.js (Complex Form)

```javascript
import {test, expect} from '@playwright/test';
import Interaction from '../Utility/UIInteraction/Interaction.js';
import Test from '../Utility/ReportUtility/TestLogger.js';

class RegistrationPage {

    constructor(page) {
        this.page = page;
        this.interaction = new Interaction(page);
        
        // Form input locators
        this.firstNameInput = page.getByLabel('First Name');
        this.lastNameInput = page.getByLabel('Last Name');
        this.emailInput = page.getByPlaceholder('Enter your email');
        this.passwordInput = page.getByPlaceholder('Create password');
        this.confirmPasswordInput = page.getByPlaceholder('Confirm password');
        
        // Dropdown and checkbox locators
        this.countryDropdown = page.locator('#country');
        this.termsCheckbox = page.getByRole('checkbox', { name: 'I agree to terms' });
        
        // Button locators
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        
        // Message locators
        this.successMessage = page.getByText('Registration successful');
        this.errorMessage = page.locator('.error-message');
    }

    async fillRegistrationForm(userData) {
        try {
            Test.Log.Info('Filling first name');
            await this.interaction.FillInputField(this.firstNameInput, userData.firstName);

            Test.Log.Info('Filling last name');
            await this.interaction.FillInputField(this.lastNameInput, userData.lastName);

            Test.Log.Info('Filling email');
            await this.interaction.FillInputField(this.emailInput, userData.email);

            Test.Log.Info('Filling password');
            await this.interaction.FillInputField(this.passwordInput, userData.password);

            Test.Log.Info('Filling confirm password');
            await this.interaction.FillInputField(this.confirmPasswordInput, userData.password);

            Test.Log.Info('Selecting country from dropdown');
            await this.interaction.SelectOptionByLabel(this.countryDropdown, userData.country);

            Test.Log.Info('Checking terms and conditions');
            await this.interaction.CheckElement(this.termsCheckbox);

            Test.Log.Pass('Registration form filled successfully', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Failed to fill registration form', error.message, this.page);
            console.log(`Fill registration form failed due to ${error}`);
            throw error;
        }
    }

    async submitRegistration() {
        try {
            Test.Log.Info('Verifying register button is enabled');
            await this.interaction.AssertElementEnabled(this.registerButton);

            Test.Log.Info('Clicking on register button');
            await this.interaction.ClickOnElement(this.registerButton);

            Test.Log.Info('Waiting for page to load after registration');
            await this.interaction.waitforLoadState('load');

            Test.Log.Pass('Registration submitted successfully', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Registration submission failed', error.message, this.page);
            console.log(`Submit registration failed due to ${error}`);
            throw error;
        }
    }

    async getErrorMessage() {
        try {
            Test.Log.Info('Getting error message text');
            await this.interaction.waitforVisibleSelector(this.errorMessage);
            const message = await this.interaction.GetElementText(this.errorMessage);
            Test.Log.Pass('Error message retrieved successfully', null, this.page);
            return message;
        }
        catch(error) {
            Test.Log.Error('Failed to get error message', error.message, this.page);
            console.log(`Get error message failed due to ${error}`);
            throw error;
        }
    }

    async verifySuccessMessage() {
        try {
            Test.Log.Info('Verifying success message is visible');
            await this.interaction.AssertElementVisible(this.successMessage);
            Test.Log.Pass('Success message verified', null, this.page);
        }
        catch(error) {
            Test.Log.Error('Success message verification failed', error.message, this.page);
            console.log(`Success message verification failed due to ${error}`);
            throw error;
        }
    }
}

export default RegistrationPage;
```

---

## 🎯 Method Naming Conventions

### Pattern Rules:

**1. Action Methods (do something):**
- Use camelCase starting with lowercase
- Start with verb: `fill`, `click`, `submit`, `select`, `check`
- Examples: `login()`, `fillRegistrationForm()`, `submitOrder()`, `selectCountry()`

**2. Getter Methods (retrieve info):**
- Start with `get`: `getWelcomeMessage()`, `getErrorMessage()`, `getTitle()`
- Return the value

**3. Verification Methods (assert/check):**
- Start with `verify`: `verifyDashboardLoaded()`, `verifySuccessMessage()`
- Use assertions inside

**4. Navigation Methods:**
- Start with `navigateTo`: `navigateToCheckout()`, `navigateToProfile()`

---

## 📋 Complete Pattern Checklist

When generating a PageObject, verify:

### Constructor ✅
- [ ] Imports `test, expect` from '@playwright/test'
- [ ] Imports `Interaction` from correct relative path
- [ ] Imports `Test` from correct relative path
- [ ] Constructor takes `page` parameter
- [ ] Sets `this.page = page`
- [ ] Creates `this.interaction = new Interaction(page)`
- [ ] All locators are Playwright locator objects (NOT strings!)
- [ ] Uses `page.getByPlaceholder()`, `page.getByRole()`, etc.

### Methods ✅
- [ ] All methods are `async`
- [ ] Wrapped in `try-catch` block
- [ ] Use `Test.Log.Info()` before each action
- [ ] Use `Test.Log.Pass()` on success (in try block)
- [ ] Use `Test.Log.Error()` on failure (in catch block)
- [ ] Use `console.log()` in catch block
- [ ] `throw error` in catch block
- [ ] Use `this.interaction.{Method}()` NOT direct Playwright
- [ ] Pass locator objects (not strings) to Interaction methods

### Export ✅
- [ ] Uses `export default {ClassName}`
- [ ] Class name matches filename (e.g., `LoginPage` for `LoginPage.js`)

---

## 🚫 Common Mistakes to Avoid

### ❌ Mistake 1: String Selectors Instead of Locator Objects
```javascript
// ❌ WRONG
this.usernameInput = "//input[@placeholder='Username']";  // String!

// ✅ CORRECT
this.usernameInput = page.getByPlaceholder('Username');  // Locator object!
```

### ❌ Mistake 2: Direct Playwright Calls
```javascript
// ❌ WRONG
await this.usernameInput.fill(username);
await this.loginButton.click();

// ✅ CORRECT
await this.interaction.FillInputField(this.usernameInput, username);
await this.interaction.ClickOnElement(this.loginButton);
```

### ❌ Mistake 3: Missing Test.Log
```javascript
// ❌ WRONG
async login(username, password) {
    await this.interaction.FillInputField(this.usernameInput, username);
    await this.interaction.FillInputField(this.passwordInput, password);
}

// ✅ CORRECT
async login(username, password) {
    try {
        Test.Log.Info('Entering username in login form');
        await this.interaction.FillInputField(this.usernameInput, username);
        
        Test.Log.Info('Entering password in login form');
        await this.interaction.FillInputField(this.passwordInput, password);
        
        Test.Log.Pass('Login completed successfully', null, this.page);
    }
    catch(error) {
        Test.Log.Error('Login failed', error.message, this.page);
        throw error;
    }
}
```

### ❌ Mistake 4: Using Getters
```javascript
// ❌ WRONG
get usernameInput() {
    return this.page.getByPlaceholder('Username');
}

// ✅ CORRECT (in constructor)
constructor(page) {
    this.page = page;
    this.interaction = new Interaction(page);
    this.usernameInput = page.getByPlaceholder('Username');
}
```

### ❌ Mistake 5: Not Using Interaction Utility
```javascript
// ❌ WRONG
await this.page.fill(this.usernameInput, username);
await this.page.click(this.loginButton);

// ✅ CORRECT
await this.interaction.FillInputField(this.usernameInput, username);
await this.interaction.ClickOnElement(this.loginButton);
```

---

## 🎯 Locator Selection Priority

When creating locators, follow this priority:

**1. getByRole() - Highest Priority (Accessible)**
```javascript
page.getByRole('button', { name: 'Login' })
page.getByRole('textbox', { name: 'Username' })
page.getByRole('link', { name: 'Forgot Password' })
```

**2. getByPlaceholder() - High Priority (Forms)**
```javascript
page.getByPlaceholder('Username')
page.getByPlaceholder('Enter your email')
```

**3. getByLabel() - High Priority (Form Fields)**
```javascript
page.getByLabel('Email Address')
page.getByLabel('Password')
```

**4. getByTestId() - Medium Priority (Stable)**
```javascript
page.getByTestId('login-btn')
page.getByTestId('error-message')
```

**5. getByText() - Medium Priority (Static Text)**
```javascript
page.getByText('Welcome')
page.getByText('Invalid credentials')
```

**6. locator() with CSS - Lower Priority**
```javascript
page.locator('.error-message')
page.locator('#submit-btn')
page.locator('button[type="submit"]')
```

**7. locator() with XPath - Lowest Priority (Last Resort)**
```javascript
page.locator("//button[normalize-space()='Login']")
page.locator("//input[@placeholder='Username']")
```

---

## ✅ Generation Guidelines

When generating PageObjects from test case documents:

1. **Read Automation Readiness section** - Contains identified locators
2. **Prefer higher-priority locator methods** (getByRole > getByPlaceholder > locator)
3. **Create locators in constructor** (not as getters)
4. **Use Interaction methods** for all actions
5. **Wrap methods in try-catch** with Test.Log
6. **Follow naming conventions** (camelCase, verb-based)
7. **Group related functionality** (login methods together, navigation together)
8. **Reuse existing methods** (search before creating new)

---

## 🎉 Summary

**ALWAYS follow these patterns:**

✅ **Locators:** Playwright locator objects in constructor (NOT strings!)  
✅ **Methods:** Use `this.interaction.{Method}()` (NOT direct Playwright!)  
✅ **Logging:** Use `Test.Log.Info()`, `Test.Log.Pass()`, `Test.Log.Error()`  
✅ **Error Handling:** Wrap in try-catch, throw error in catch  
✅ **Naming:** camelCase, verb-based method names  
✅ **Priority:** getByRole > getByPlaceholder > getByLabel > getByTestId > locator  

**This pattern ensures:**
- Consistent code across all PageObjects
- Comprehensive logging for debugging
- Framework compliance
- Maintainable, readable code
- Proper error handling

---

**END OF FRAMEWORK PATTERN GUIDE**
