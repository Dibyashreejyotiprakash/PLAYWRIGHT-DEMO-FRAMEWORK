# 🤖 GENERIC AI AGENT TEST AUTOMATION WORKFLOW GUIDE

**Version:** 1.0  
**Last Updated:** 2026-08-14  
**Framework:** Generic Test Automation Framework  
**Approach:** AI-Powered Test Case Creation with MCP Tools  

---

## 🚨 **MANDATORY 6-STAGE WORKFLOW** 🚨

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║  ⛔⛔⛔ CRITICAL - NO EXCEPTIONS ALLOWED ⛔⛔⛔                        ║
║                                                                          ║
║  EVERY NEW TEST CASE MUST FOLLOW THIS 6-STAGE WORKFLOW:                 ║
║                                                                          ║
║  STAGE 0: SMART PRE-PLANNING (SAVES 60-90 MINUTES)                      ║
║  ├─ Run inventory check script FIRST                                    ║
║  ├─ Identify what methods/locators ALREADY exist                        ║
║  ├─ List ONLY missing elements that need MCP                            ║
║  └─ Skip MCP for elements that can be REUSED                            ║
║                                                                          ║
║  STAGE 1: PLANNING                                                       ║
║  ├─ Extract ALL locators with MCP BEFORE writing ANY code               ║
║  ├─ Create LOCATOR PLAN document                                        ║
║  └─ Verify ALL elements exist                                           ║
║                                                                          ║
║  STAGE 2: GENERATE                                                       ║
║  ├─ Add locators to Page Objects                                        ║
║  ├─ Create Page Object methods                                          ║
║  └─ Write test case (calls Page Object methods only)                    ║
║                                                                          ║
║  STAGE 3: BUILD                                                          ║
║  ├─ Run build command                                                   ║
║  ├─ Fix ALL compilation errors                                          ║
║  └─ Verify: 0 errors before proceeding                                  ║
║                                                                          ║
║  STAGE 4: EXECUTE                                                        ║
║  ├─ Run test execution command                                          ║
║  ├─ Monitor execution logs                                              ║
║  └─ If PASSED → Go to Stage 5 | If FAILED → Go to Stage 4.5 (HEALER)    ║
║                                                                          ║
║  STAGE 4.5: HEALER (If test failed)                                     ║
║  ├─ Navigate to failing page with MCP                                   ║
║  ├─ Click failing element with MCP → Get correct locator                ║
║  ├─ Fix locator/wait in Page Object                                     ║
║  ├─ Rebuild and rerun test                                              ║
║  └─ Repeat until PASSED → Go to Stage 5                                 ║
║                                                                          ║
║  STAGE 5: VALIDATE                                                       ║
║  ├─ Run test 1st time → Verify PASSED                                   ║
║  ├─ Wait 30 seconds                                                     ║
║  ├─ Run test 2nd time → Verify PASSED                                   ║
║  └─ Both runs PASSED → Test is STABLE ✅                                ║
║                                                                          ║
║  ⛔ DO NOT SKIP ANY STAGE                                               ║
║  ⛔ DO NOT MARK TEST COMPLETE UNTIL STAGE 5 VALIDATION PASSES           ║
║  ⛔ DO NOT WRITE CODE BEFORE STAGE 1 (PLANNING) IS COMPLETE             ║
║                                                                          ║
║  VIOLATION PENALTY: 30-50 minutes wasted time + test instability        ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 📋 PURPOSE

This guide provides a universal workflow for creating automated test cases using AI agents with MCP (Model Context Protocol) tools. The workflow is framework-agnostic and can be adapted to any test automation project.

---

## 🚀 **STAGE 0: SMART PRE-PLANNING** 🚀

### **⚠️ CRITICAL: RUN THIS FIRST BEFORE ANY MCP EXTRACTION!**

**Problem:** Extracting locators with MCP for elements that ALREADY exist wastes 60-90 minutes per test.

**Solution:** Run inventory check FIRST to identify what you can REUSE!

### **🔧 MCP Tools Used in Stage 0:**

**File & Search Operations:**
- `search/fileSearch` - Search for existing Page Objects and test files
- `search/listDirectory` - List directories to find existing code structure
- `search/readFile` - Read existing Page Objects and test files
- `search/textSearch` - Search for existing methods and locators in codebase

---

### **🎯 STAGE 0 WORKFLOW (10 minutes - MANDATORY)**

```
┌────────────────────────────────────────────────────────────────┐
│  STAGE 0: SMART PRE-PLANNING                                   │
│  (Run BEFORE touching MCP - Saves 60-90 minutes!)              │
└────────────────────────────────────────────────────────────────┘

STEP 1: Read Test Steps (2 minutes)
   • Open test requirements document
   • Identify all UI interactions needed
   • List all elements mentioned (buttons, textboxes, dropdowns, etc.)

STEP 2: Run Inventory Check (1 minute)
   • Execute inventory check script/tool
   • Review output - lists ALL existing methods and locators
   • Identify available Page Objects

STEP 3: Create Inventory Document (5 minutes)
   • Map test steps to Page Objects
   • Mark ✅ ALREADY EXISTS for methods found in inventory
   • Mark ❌ NEEDS MCP for missing elements only
   • Create list: "REUSE" vs "EXTRACT WITH MCP"

STEP 4: Estimate MCP Time (2 minutes)
   • Count missing elements
   • Each element = 2-3 min MCP extraction
   • If missing < 5 elements → Quick 10-15 min MCP session
   • If missing > 10 elements → 30-40 min MCP session
   • If missing = 0 → SKIP MCP, go straight to STAGE 2!

✅ GATE CHECK: Do NOT proceed until:
   □ Inventory check executed
   □ All existing methods identified
   □ Clear list of what to REUSE vs what needs MCP
   □ Estimated MCP time calculated
```

---

### **📝 Inventory Document Template**

Create this document BEFORE any MCP extraction:

```markdown
# LOCATOR INVENTORY - {TestName}

## Test Steps Summary
Steps 1-10: {Summary of steps}
Steps 11-25: {Summary of steps}
Steps 26-50: {Summary of steps}

## ✅ ALREADY EXISTS (REUSE - NO MCP NEEDED)

### {PageObjectName1}
- [x] MethodName1() ← Step X
- [x] MethodName2() ← Step Y
- [x] ElementLocator (LOCATOR VERIFIED)

### {PageObjectName2}
- [x] MethodName3() ← Steps X-Y
- [x] ElementLocator2 (LOCATOR VERIFIED)

## ❌ MISSING (NEEDS MCP EXTRACTION)

### {PageObjectName1}
- [ ] NewElement1 - Need MCP (Step X)
- [ ] NewElement2 - Need MCP (Step Y)

### {PageObjectName2}
- [ ] NewElement3 - Need MCP (Step Z)

## 📊 MCP EXTRACTION NEEDED
- **Total Missing Elements:** X
- **Estimated MCP Time:** X-Y minutes
- **Time Saved by Reusing:** X-Y minutes ✅

## 🎯 DECISION
✅ Proceed with TARGETED MCP extraction (only X elements)
❌ Do NOT extract locators for elements marked "ALREADY EXISTS"
```

---

### **✅ MANDATORY CHECKLIST FOR STAGE 0**

**Before proceeding to STAGE 1, verify:**

```
✅ STAGE 0 CHECKLIST (ALL must be checked):

□ Read complete test requirements/steps
□ Ran inventory check script/tool
□ Created Inventory Document with:
  □ All existing methods identified (✅ REUSE)
  □ All missing elements identified (❌ MCP NEEDED)
  □ Estimated MCP time calculated
□ Identified specific Page Objects to reference
□ Listed exact locators/methods to reuse
□ Clear plan: What to REUSE vs what needs MCP

⛔ IF ANY BOX UNCHECKED → DO NOT PROCEED TO STAGE 1
✅ IF ALL BOXES CHECKED → Proceed to STAGE 1 (MCP extraction for missing only)
```

---

## 🔄 **STAGE 1: PLANNING (MCP Analysis)**

**⚠️ CRITICAL: Get ALL locators BEFORE writing any code!**

### **🔧 MCP Tools Used in Stage 1:**

**Browser Navigation:**
- `playwright-test/browser_navigate` - Navigate to application URL
- `playwright-test/browser_navigate_back` - Navigate back to previous page
- `playwright-test/browser_close` - Close browser/page after planning
- `playwright-test/browser_resize` - Resize browser for different viewports
- `playwright-test/browser_tabs` - Manage multiple tabs during exploration

**Browser Interactions (Locator Extraction):**
- `playwright-test/browser_click` - Click elements to extract locators
- `playwright-test/browser_type` - Type in form fields to identify input locators
- `playwright-test/browser_press_key` - Press keys to test keyboard interactions
- `playwright-test/browser_hover` - Hover over elements to identify hover-based elements
- `playwright-test/browser_drag` - Test drag interactions
- `playwright-test/browser_select_option` - Identify dropdown/select elements
- `playwright-test/browser_fill_form` - Test form filling to identify all form elements
- `playwright-test/browser_file_upload` - Identify file upload elements
- `playwright-test/browser_handle_dialog` - Handle alert/dialog boxes

**Browser Evaluation & Capture:**
- `playwright-test/browser_evaluate` - Execute JavaScript to analyze DOM
- `playwright-test/browser_run_code` - Run complex automation sequences
- `playwright-test/browser_snapshot` - Capture accessibility snapshot for element analysis
- `playwright-test/browser_take_screenshot` - Take screenshots for documentation

**Browser Monitoring:**
- `playwright-test/browser_console_messages` - Monitor console for JavaScript errors
- `playwright-test/browser_network_requests` - Track network requests during exploration

**Browser Verification:**
- `playwright-test/browser_verify_element_visible` - Verify element visibility
- `playwright-test/browser_verify_list_visible` - Verify list items are visible
- `playwright-test/browser_verify_text_visible` - Verify text content is present
- `playwright-test/browser_verify_value` - Verify input/element values

**Browser Waits:**
- `playwright-test/browser_wait_for` - Wait for elements/conditions during exploration

**Planning Tools:**
- `playwright-test/planner_setup_page` - Explore UI and record structure for test planning

```
╔══════════════════════════════════════════════════════════════╗
║  ⛔ DO NOT GENERATE TEST CASE CODE UNTIL:                   ║
║                                                              ║
║  ALL LOCATORS EXTRACTED THROUGH MCP BROWSER TOOLS            ║
║                                                              ║
║  ✅ REQUIRED: Complete LOCATOR PLAN document with:          ║
║     - Every element from test steps                         ║
║     - MCP-verified locator for each element                 ║
║     - Element count verified (use .First if needed)         ║
║     - Conversion documented (if applicable)                 ║
║                                                              ║
║  ❌ NO CODE WRITING BEFORE MCP VERIFICATION                 ║
║  ❌ NO ASSUMPTIONS ABOUT LOCATORS                           ║
║  ❌ NO GUESSING OR COPYING FROM OTHER TESTS                 ║
║                                                              ║
║  This is a STRICT ACTION - Violations waste 30+ minutes     ║
╚══════════════════════════════════════════════════════════════╝
```

### **Planning Workflow:**

1. Read test steps/requirements document
2. Navigate to application with MCP browser tools
3. Login to application with MCP (if needed)
4. Navigate to target page/feature
5. Take comprehensive snapshot
6. For EACH element in test steps:
   - Click element with MCP → Get locator code
   - Verify element count → Check if .First/index needed
   - Test element visibility
   - Document: Element name, Locator, Count, Index required (Y/N)
7. Check existing Page Objects for reusable methods/locators
8. Create LOCATOR PLAN document with ALL elements mapped
9. Review plan - ensure ALL elements have correct locators

---

### **🔒 MANDATORY GATE: Before Proceeding to Stage 2**

```
CHECKLIST - ALL must be ✅ before writing ANY code:

□ Read ALL test steps/requirements (every single step)
□ Reviewed similar existing test cases for patterns
□ MCP session completed - navigated through entire flow
□ MCP browser tools used for EVERY interactive element
□ Extracted locator code for ALL elements
□ Verified element count for ALL locators
□ LOCATOR PLAN document created with ALL elements
□ ALL locators properly formatted for target language
□ Checked existing Page Objects for reusable methods
□ No assumptions made - everything MCP-verified
□ No hard-coded waits - only smart wait strategies planned

⛔ IF ANY CHECKBOX IS EMPTY → DO NOT PROCEED TO STAGE 2
✅ IF ALL CHECKBOXES CHECKED → Ready for code generation
```

---

### **📝 LOCATOR PLAN Document Template**

```markdown
## LOCATOR PLAN - {Test Name}

### Page: {PageName}

| Element | Locator | Count | Index? | MCP Verified |
|---------|---------|-------|--------|--------------|
| {ElementName1} | {LocatorCode} | 1 | NO | ✅ |
| {ElementName2} | {LocatorCode} | Multiple | YES (.First) | ✅ |
| {ElementName3} | {LocatorCode} | 1 | NO | ✅ |

### Page: {PageName2}

| Element | Locator | Count | Index? | MCP Verified |
|---------|---------|-------|--------|--------------|
| {ElementName4} | {LocatorCode} | 1 | NO | ✅ |
```

---

## 🏗️ **STAGE 2: GENERATE (Create Code)**

### **🔧 MCP Tools Used in Stage 2:**

**File Operations:**
- `edit/createFile` - Create new Page Object and test files
- `edit/createDirectory` - Create new directories for test organization
- `edit/editFiles` - Edit existing Page Objects to add new locators/methods

**Search Operations:**
- `search/fileSearch` - Find existing Page Objects to extend
- `search/listDirectory` - Browse directory structure
- `search/readFile` - Read existing files for reference
- `search/textSearch` - Search for existing methods to reuse

**Generator Tools:**
- `playwright-test/generator_setup_page` - Setup page for code generation
- `playwright-test/generator_write_test` - Auto-generate test code from plan
- `playwright-test/generator_read_log` - Read execution logs for reference

### **Code Generation Workflow:**

1. Add locators to Page Object classes (from LOCATOR PLAN)
2. Format locators for target programming language
3. Add index selectors where plan indicates multiple elements
4. Create Page Object methods with:
   - Framework-specific interaction patterns
   - Dual logging (if applicable)
   - Proper wait conditions
5. Create test case file following framework patterns
6. Test class ONLY calls Page Object methods
7. Add assertions and logging

---

### **⚠️ CRITICAL RULES:**

```
✅ DO's:
1. ALL locators go in Page Objects (never in test class)
2. Test class ONLY calls Page Object methods
3. Use framework-specific best practices
4. Implement proper wait strategies
5. Add comprehensive logging

❌ DON'Ts:
1. Never add locators in test class
2. Never use hard-coded waits (sleep/delay without reason)
3. Never duplicate existing methods
4. Never skip MCP verification
5. Never mix test logic with Page Object logic
```

---

## 🔨 **STAGE 3: BUILD**

### **🔧 MCP Tools Used in Stage 3:**

**No MCP-specific tools required for this stage.**
This stage typically uses framework-specific build commands (e.g., `dotnet build`, `npm run build`, `mvn compile`).

### **Build Workflow:**

1. Run build/compile command
2. Fix any compilation errors:
   - Missing imports/references
   - Syntax errors
   - Type mismatches
3. Verify: 0 errors before proceeding
4. If errors persist, review generated code
5. Rebuild until successful (0 errors)

---

## 🚀 **STAGE 4: EXECUTE**

### **🔧 MCP Tools Used in Stage 4:**

**Test Execution & Debugging:**
- `playwright-test/test_list` - List available tests to execute
- `playwright-test/test_run` - Execute the test
- `playwright-test/test_debug` - Debug test if execution issues occur

**Generator Tools:**
- `playwright-test/generator_read_log` - Read execution logs to analyze results

### **Execution Workflow:**

1. Set environment configuration (if applicable)
2. Run test execution command
3. Monitor test execution output/logs
4. Check test result: PASSED or FAILED
5. If PASSED → Go to Stage 5 (Validate Stability)
6. If FAILED → Go to Stage 4.5 (Healer)

---

## 🔧 **STAGE 4.5: HEALER (Fix Failed Tests)**

### **🔧 MCP Tools Used in Stage 4.5:**

**Browser Navigation:**
- `playwright-test/browser_navigate` - Navigate to failing page
- `playwright-test/browser_navigate_back` - Navigate back during debugging
- `playwright-test/browser_close` - Close browser after debugging
- `playwright-test/browser_tabs` - Switch between tabs during debugging

**Browser Interactions (Re-extract Locators):**
- `playwright-test/browser_click` - Click failing element to get correct locator
- `playwright-test/browser_type` - Re-test form input interactions
- `playwright-test/browser_hover` - Re-test hover interactions
- `playwright-test/browser_select_option` - Re-test dropdown selections
- `playwright-test/browser_fill_form` - Re-test form filling
- `playwright-test/browser_handle_dialog` - Re-test dialog handling

**Browser Evaluation & Capture:**
- `playwright-test/browser_evaluate` - Analyze DOM to understand failure
- `playwright-test/browser_snapshot` - Capture current state for comparison
- `playwright-test/browser_take_screenshot` - Screenshot failing state
- `playwright-test/browser_run_code` - Run diagnostic code

**Browser Monitoring:**
- `playwright-test/browser_console_messages` - Check for JavaScript errors
- `playwright-test/browser_network_requests` - Check for failed API calls

**Browser Verification:**
- `playwright-test/browser_verify_element_visible` - Verify element visibility issues
- `playwright-test/browser_verify_list_visible` - Verify list element issues
- `playwright-test/browser_verify_text_visible` - Verify text content issues
- `playwright-test/browser_verify_value` - Verify value mismatches

**Browser Waits:**
- `playwright-test/browser_wait_for` - Add proper wait conditions

**File Operations:**
- `edit/editFiles` - Update Page Object with corrected locators
- `search/readFile` - Read current Page Object code

**Test Execution:**
- `playwright-test/test_run` - Rerun test after fixes
- `playwright-test/test_debug` - Debug test execution
- `playwright-test/generator_read_log` - Analyze failure logs

### **Healer Workflow:**

1. Read error message and identify failure type
2. Navigate to failing page with MCP browser tools
3. Take snapshot to see current state
4. Click failing element → Get correct locator
5. Verify element count
6. Apply fix to Page Object (update locator, add index, add wait)
7. Rebuild
8. Rerun test
9. If PASSED → Go to Stage 5
10. If FAILED → Repeat Healer workflow

---

### **Common Failure Types:**

#### **Issue #1: Element Not Found**
**Symptoms:** Timeout waiting for element, element not found error

**Healer Steps (3 minutes):**
1. Navigate to failing page with MCP
2. Take snapshot
3. Click element with MCP → Get new locator
4. Update Page Object with new locator
5. Rebuild and rerun

---

#### **Issue #2: Multiple Elements Found**
**Symptoms:** Ambiguous locator, multiple elements match

**Healer Steps (2 minutes):**
1. Use MCP to check element count
2. Add .First or specific index to locator
3. Update Page Object
4. Rebuild and rerun

---

#### **Issue #3: Timing/Wait Issue**
**Symptoms:** Element not ready, stale element reference

**Healer Steps (5 minutes):**
1. Navigate to page with MCP
2. Observe loading behavior
3. Identify loading indicators
4. Add proper wait condition in Page Object
5. Rebuild and rerun

---

## ✅ **STAGE 5: VALIDATE STABILITY**

### **🔧 MCP Tools Used in Stage 5:**

**Test Execution:**
- `playwright-test/test_run` - Execute test multiple times for stability validation

**Generator Tools:**
- `playwright-test/generator_read_log` - Review execution logs from both runs

### **Validation Workflow:**

1. Run test 1st time → Verify PASSED
2. Wait 30 seconds (clean browser state)
3. Run test 2nd time → Verify PASSED
4. Verify both runs: Similar execution time (±20%)
5. Verify logs/reports generated correctly
6. Mark test case as COMPLETE ✅

---

## ❌ **COMMON MISTAKES TO AVOID**

### **🚨 CRITICAL MISTAKE #1: Writing Code Before MCP Locator Extraction**

**⛔ ABSOLUTELY FORBIDDEN:**
- Writing test case code before MCP session
- Generating Page Object methods without MCP verification
- Assuming locators based on other tests
- Guessing element selectors
- "I'll fix locators during test execution" approach

**Consequences:**
- ❌ 5-10 test execution cycles (2-3 minutes each)
- ❌ 30-50 minutes wasted on debugging
- ❌ Multiple build cycles
- ❌ Frustration and inefficiency

✅ **MANDATORY CORRECT APPROACH:**
1. Read test steps (ALL steps thoroughly)
2. Start MCP browser session
3. Navigate through ENTIRE test flow with MCP
4. Click EVERY element with MCP
5. Extract locator code for ALL elements
6. Verify element counts
7. Create LOCATOR PLAN document
8. Format ALL locators for target language
9. Review checklist - ALL boxes must be checked
10. ONLY THEN start writing code

**Result:** ✅ First test run usually PASSES

---

### **Mistake #2: Using Hard-Coded Waits**

❌ **WRONG**: `sleep(3000)` or `Thread.sleep(3000)`

✅ **CORRECT**: Use smart wait strategies (wait for element, wait for condition, wait for loader to disappear)

---

### **Mistake #3: Not Reading Test Requirements Thoroughly**

❌ **WRONG**: Skim through steps and assume behavior

✅ **CORRECT**: Read ALL steps carefully before MCP session

---

### **Mistake #4: Not Creating LOCATOR PLAN Document**

❌ **WRONG**: Keep locators in memory, write code directly

✅ **CORRECT**: Create structured document during MCP session

---

### **Mistake #5: Not Checking Existing Page Objects**

❌ **WRONG**: Create duplicate methods for existing functionality

✅ **CORRECT**: Always check existing Page Objects first, reuse what exists

---

## 📈 **TIME SAVINGS**

| Approach | Time | Outcome |
|----------|------|---------|
| ❌ **Old Way:** Skip inventory, extract all with MCP | 90-120 min | Get locators you already had |
| ❌ **Skip Planning:** Write code first | 15 min code + 45 min debugging | 5-10 test failures |
| ✅ **NEW WAY:** Inventory → Plan → Generate → Execute | **10 min inventory + 15 min MCP + 15 min code = 40 min** | **SAVES 50-80 MINUTES!** ✅ |

---

## 📊 **SUCCESS METRICS**

**A well-executed workflow should achieve:**
- ✅ Test passes on 1st or 2nd execution
- ✅ Stable test (2 consecutive passes)
- ✅ Total time: 30-60 minutes for complete test
- ✅ 90%+ code reuse from existing Page Objects
- ✅ Zero hard-coded waits
- ✅ Clean separation: Test class vs Page Objects

---

## 🎯 **WORKFLOW SUMMARY**

```
STAGE 0: SMART PRE-PLANNING (10 min)
   ↓ Inventory Check → Identify Reusable Methods
   
STAGE 1: PLANNING (10-15 min)
   ↓ MCP Extraction → LOCATOR PLAN Document
   
STAGE 2: GENERATE (10-15 min)
   ↓ Page Objects + Test Class Generation
   
STAGE 3: BUILD (2-5 min)
   ↓ Compile → Fix Errors
   
STAGE 4: EXECUTE (2-5 min)
   ↓ Run Test → PASSED or FAILED?
   
STAGE 4.5: HEALER (5-30 min, if failed)
   ↓ MCP Debug → Fix → Rebuild → Rerun
   
STAGE 5: VALIDATE (5-10 min)
   ✅ 2 Consecutive Passes → STABLE TEST
```

---

## 🔑 **KEY PRINCIPLES**

1. **Inventory First** - Always check what exists before creating new
2. **Plan Before Code** - Get ALL locators with MCP first
3. **Separation of Concerns** - Test class calls Page Objects only
4. **MCP Verification** - Never guess locators, always verify with MCP
5. **Smart Waits** - No hard-coded delays, use proper wait strategies
6. **Stability Validation** - Test must pass 2 consecutive times
7. **Comprehensive Logging** - Log every step for debugging
8. **Reusability** - Maximize reuse of existing methods/locators

---

## 📝 **FINAL CHECKLIST**

**Before marking test as COMPLETE:**

```
✅ FINAL CHECKLIST:

□ STAGE 0: Inventory check completed
□ STAGE 1: LOCATOR PLAN document created with ALL elements
□ STAGE 2: Code generated (Page Objects + Test class)
□ STAGE 3: Build successful (0 errors)
□ STAGE 4: Test executed
□ STAGE 4.5: All failures resolved (if any)
□ STAGE 5: Test passed 2 consecutive times
□ Test execution time consistent (±20%)
□ Logs/reports generated correctly
□ No hard-coded waits in code
□ All locators in Page Objects (not in test class)
□ Test class ONLY calls Page Object methods
□ Code reviewed for quality
□ Documentation updated (if needed)

⛔ IF ANY BOX UNCHECKED → TEST NOT COMPLETE
✅ IF ALL BOXES CHECKED → TEST READY FOR DEPLOYMENT
```

---

## 🎓 **CONTINUOUS IMPROVEMENT**

**After each test automation cycle:**
1. Review what worked well
2. Identify what can be improved
3. Update inventory of reusable methods
4. Refactor duplicate code into shared methods
5. Document lessons learned
6. Share knowledge with team

---

**END OF GENERIC AI AGENT TEST AUTOMATION WORKFLOW GUIDE**
