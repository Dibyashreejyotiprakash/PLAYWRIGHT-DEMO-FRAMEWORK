# Jira to Test Case Generation Workflow
## Using Atlassian MCP + Playwright Test Planner

**Version:** 2.0  
**Last Updated:** August 14, 2026  
**Purpose:** Automated workflow for generating comprehensive, automation-ready test cases from Jira tickets with live web application exploration  
**Applies To:** All projects using Jira + Playwright automation

---

## Overview

This workflow combines **Jira requirement analysis** with **live web application exploration** to generate comprehensive test cases that are:
- ✅ Ready for Playwright automation script generation
- ✅ Formatted for Confluence publishing
- ✅ Mapped to acceptance criteria
- ✅ Covering all test types (positive, negative, edge cases, security, etc.)

---

## Prerequisites

### Required Access & Tools
- ✅ Atlassian MCP configured with Jira access
- ✅ Playwright MCP Server installed and configured
- ✅ Claude Code with agent support
- ✅ Access to web application (QA/Stage environment)
- ✅ Confluence access for publishing (optional)

### Required Information
- 📌 Jira Ticket ID (e.g., PROJ-1234)
- 📌 Application URL (from Jira or known)
- 📌 Environment to test (QA/Stage/Dev)
- 📌 User credentials (if login required)

### Project Structure
```
project-root/
├── Testcases/                          # Test case documents saved here
│   ├── PROJ-1234_testcase.md
│   ├── PROJ-1235_testcase.md
│   └── ...
├── .github/
│   └── agents/
│       └── jira-to-playwright-test-planner.agent.md
└── ContextFiles/
    └── JIRA_TO_TESTCASE_WORKFLOW.md    # This document
```

**Note**: The `Testcases/` folder will be created automatically if it doesn't exist.

---

## How to Use This Workflow

### Method 1: Using the Agent Directly

**Step 1**: Invoke the agent with Jira ticket ID

```bash
# In Claude Code CLI or IDE extension
Use the jira-to-playwright-test-planner agent to generate test cases for PROJ-1234
```

**Step 2**: The agent will automatically:
1. Fetch Jira ticket details (summary, description, acceptance criteria)
2. Identify application URL from ticket
3. Launch browser and explore the web application
4. Map user workflows and identify interactive elements
5. Generate comprehensive test scenarios (8 categories)
6. Create test cases in tabular format
7. Save to `Testcases/PROJ-1234_testcase.md`

**Step 3**: Review and refine the generated test cases

---

### Method 2: Manual Step-by-Step Process

If you prefer manual control over each step:

#### Phase 1: Fetch Jira Details

```javascript
// Use Atlassian MCP tool
mcp__plugin_atlassian_atlassian__getJiraIssue({
  cloudId: "your-org.atlassian.net",
  issueIdOrKey: "PROJ-1234",
  responseContentFormat: "markdown"
})
```

**Extract and note:**
- Story title and summary
- Acceptance criteria (CRITICAL!)
- Description and technical details
- Application URL (if mentioned)
- Related links or attachments

#### Phase 2: Initialize Web Exploration

```javascript
// CRITICAL: First call to set up browser
planner_setup_page({
  url: "https://your-app.com/feature-page"
})
```

#### Phase 3: Explore the Application

```javascript
// Navigate and interact
browser_navigate({url: "https://your-app.com"})

// Get page snapshot (preferred over screenshot)
browser_snapshot()

// Interact with elements
browser_click({selector: "[data-testid='login-btn']"})
browser_type({selector: "#email", text: "test@example.com"})

// Observe network calls
browser_network_requests()

// Evaluate page state
browser_evaluate({expression: "document.querySelector('.error-message').textContent"})
```

#### Phase 4: Design Test Scenarios

Create one-liner scenarios across all 8 categories:

**A. Positive Scenarios**
- Verify user login with valid credentials
- Verify form submission with all required fields
- Verify data saves successfully

**B. Negative Scenarios**
- Verify error message for invalid email format
- Verify login fails with incorrect password
- Verify form rejection with missing required field

**C. Edge Cases**
- Verify handling of empty input fields
- Verify behavior with maximum character limit
- Verify special characters in text fields

**D. Regression Scenarios**
- Verify existing profile edit functionality works
- Verify no impact on related modules

**E. Integration Scenarios**
- Verify UI to API data submission flow
- Verify end-to-end checkout workflow

**F. Security Scenarios**
- Verify unauthorized user cannot access admin panel
- Verify input sanitization prevents XSS

**G. UI/UX Scenarios**
- Verify error message displays in red
- Verify loading spinner shows during API call

**H. Data Integrity Scenarios**
- Verify data persists after page refresh
- Verify audit trail logs user actions

#### Phase 5: Generate Test Cases Table

Format test cases in the standard table:

```markdown
| Sr No | Test Scenario | Expected Results | Test Data | Preconditions | QA Env Status | Stage Env Status |
|-------|---------------|------------------|-----------|---------------|---------------|------------------|
| 1 | Verify user login with valid credentials | User successfully logged in and redirected to dashboard | | User logged out | | |
| 2 | Verify error message for invalid email | Error message "Invalid email format" displayed | | User on login page | | |
```

#### Phase 6: Save Document

Save to: `Testcases/{JIRA-ID}_testcase.md`

---

## Detailed Workflow Phases

### Phase 1: Jira Analysis (Requirements Gathering)

**Objective**: Extract complete requirement information

**Key Information to Extract:**

| Information Type | Importance | Usage |
|-----------------|------------|-------|
| **Acceptance Criteria** | CRITICAL | Maps directly to test cases |
| **Story Description** | HIGH | Provides context and scope |
| **Technical Details** | HIGH | Identifies components to test |
| **User Stories** | MEDIUM | Defines user workflows |
| **Comments** | MEDIUM | Clarifications and edge cases |
| **Linked Issues** | MEDIUM | Dependencies and regression areas |
| **Attachments** | LOW-HIGH | Design specs, mockups |

**Questions to Answer from Jira:**
1. What is being built/changed?
2. What are the acceptance criteria?
3. What validations are required?
4. What are the business rules?
5. What data entities are involved?
6. What are the dependencies?
7. What could go wrong?
8. What should be tested for regression?

---

### Phase 2: Web Exploration (Discovery)

**Objective**: Understand the actual implementation through live exploration

**Exploration Checklist:**

#### UI Elements Discovery
- [ ] Identify all buttons, links, and interactive elements
- [ ] Find all form fields and their validations
- [ ] Discover dropdowns, checkboxes, radio buttons
- [ ] Locate modals, popups, and overlays
- [ ] Map navigation menus and tabs
- [ ] Identify dynamic content areas

#### User Flow Mapping
- [ ] Primary user journey (happy path)
- [ ] Alternative paths to achieve same goal
- [ ] Error handling flows
- [ ] Success and failure states
- [ ] Navigation patterns

#### Technical Observations
- [ ] API calls (network requests)
- [ ] Form validation behavior (client-side)
- [ ] Error messages and their triggers
- [ ] Loading states and async operations
- [ ] Browser console messages
- [ ] Local storage/session storage usage

#### Accessibility & UX
- [ ] ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Screen reader compatibility
- [ ] Responsive behavior

**Exploration Tips:**
- Use `browser_snapshot()` instead of screenshots (faster, text-based)
- Test both success and failure scenarios during exploration
- Note exact error messages for negative test cases
- Identify stable locators for automation (data-testid, semantic selectors)
- Document any timing/wait conditions needed

---

### Phase 3: Test Scenario Design (Coverage Planning)

**Objective**: Create comprehensive scenario list covering all test types

#### Test Design Techniques to Apply

1. **Equivalence Partitioning**
   - Valid input range → Positive test
   - Invalid input ranges → Negative tests
   - Boundary values → Edge case tests

2. **Boundary Value Analysis**
   - Minimum value
   - Just above minimum
   - Maximum value
   - Just below maximum
   - Empty/null

3. **Decision Table Testing**
   - Map all combinations of conditions
   - Identify valid and invalid combinations

4. **State Transition Testing**
   - Map state diagrams
   - Test all valid transitions
   - Test invalid transitions (negative)

5. **Use Case Testing**
   - Each acceptance criterion → Test scenarios
   - Each user workflow → Test scenarios

6. **Error Guessing**
   - Based on experience and common bugs
   - Edge cases that often fail

**Scenario Distribution Guide:**

| Category | % of Total | Typical Count (for medium story) |
|----------|-----------|----------------------------------|
| Positive (Happy Path) | 30-40% | 10-15 scenarios |
| Negative (Unhappy Path) | 25-30% | 8-12 scenarios |
| Edge Cases | 15-20% | 5-8 scenarios |
| Regression | 10-15% | 3-5 scenarios |
| Integration | 5-10% | 2-4 scenarios |
| Security | 5-10% | 2-4 scenarios |
| UI/UX | 5-10% | 2-4 scenarios |
| Data Integrity | 5-10% | 2-4 scenarios |
| **TOTAL** | **100%** | **40-60 scenarios** |

**Note**: Adjust based on story complexity and risk.

---

### Phase 4: Test Case Creation (Documentation)

**Objective**: Convert scenarios into detailed, executable test cases

#### Test Case Table Structure

| Column | Purpose | Guidelines | Example |
|--------|---------|------------|---------|
| **Sr No** | Sequential ID | 1, 2, 3... or TC-1, TC-2... | 1 |
| **Test Scenario** | What to test (ONE-LINER) | Under 100 chars, action verb | Verify user login with valid credentials |
| **Expected Results** | Expected outcome | Specific, measurable, clear | User logged in, redirected to dashboard, welcome message shown |
| **Test Data** | Data for execution | Leave EMPTY initially | [Filled during execution] |
| **Preconditions** | Setup required | Initial state needed | User logged out, valid account exists |
| **QA Env Status** | Execution status | Leave EMPTY initially | [Pass/Fail/Blocked/Not Run] |
| **Stage Env Status** | Execution status | Leave EMPTY initially | [Pass/Fail/Blocked/Not Run] |

#### Writing Effective Expected Results

✅ **Good Expected Results:**
- "User successfully logged in, redirected to /dashboard, 'Welcome John' message displayed, session token stored"
- "API returns 400 status, error message 'Email is required' shown in red below email field"
- "Form submission prevented, 'Password must be at least 8 characters' validation message appears"

❌ **Poor Expected Results:**
- "It works" (too vague)
- "Success" (not specific)
- "User can log in" (not measurable)

#### Preconditions Best Practices

**Be specific about:**
- Initial application state
- User authentication state
- Required data setup
- Configuration requirements
- Dependencies

**Examples:**
- "User is logged out, no active session exists"
- "Test user account exists with email: test@example.com"
- "Database contains at least 10 product records"
- "Feature flag 'new_checkout' is enabled"
- "User has 'Admin' role assigned"

---

### Phase 5: Impact Analysis (Component Mapping)

**Objective**: Map changes to affected system components

#### Component Documentation Template

```markdown
### 1. [Component Name] - [Purpose]
**Purpose:** Brief description of what this component does

- **UI Components Modified:**
  - LoginForm.tsx - Updated validation logic
  - DashboardPage.tsx - Added welcome message

- **Functionality:**
  - Email validation now checks for common typos
  - Dashboard shows personalized greeting

- **User Flows Affected:**
  - Login workflow
  - First-time user onboarding

- **Test Cases**: TC 1-8
```

#### Cross-Component Impact Areas

Document impacts that span multiple components:

```markdown
### Authentication Flow
- **Authentication Modified:**
  - Session timeout increased to 30 minutes
  - JWT token now includes user role
- **Affected Components**: LoginForm, Header, SessionManager, API Gateway
- **Test Cases**: TC 15, 16, 17, 22
```

---

### Phase 6: Traceability Matrix (Coverage Verification)

**Objective**: Ensure every acceptance criterion is tested

#### Traceability Matrix Format

| Acceptance Criterion | Test Cases Covering | Coverage Status |
|---------------------|---------------------|-----------------|
| User can login with email and password | TC-1, TC-2, TC-3, TC-15 | ✅ Complete |
| Invalid email shows error message | TC-4, TC-5 | ✅ Complete |
| Password must be at least 8 characters | TC-6, TC-7, TC-8 | ✅ Complete |
| User redirected to dashboard after login | TC-1, TC-9 | ✅ Complete |
| Session expires after 30 minutes | TC-20 | ⚠️ Partial (need negative test) |

**Coverage Verification Checklist:**
- [ ] Every acceptance criterion has at least ONE positive test
- [ ] Every acceptance criterion has at least ONE negative test
- [ ] All user workflows from exploration are covered
- [ ] All interactive elements discovered are tested
- [ ] All validation rules are tested (positive + negative)
- [ ] All error messages discovered are verified
- [ ] Integration points are tested end-to-end

---

## Document Structure Sections Explained

### Section 1: Header & Metadata
- Jira ticket ID and title
- Story status, priority, assignee
- Document version and dates

### Section 2: Story Summary
- Brief overview of the requirement
- Business context

### Section 3: Acceptance Criteria
- **CRITICAL SECTION**
- Copy from Jira ticket
- Numbered list
- Maps to traceability matrix

### Section 4: Application Details
- URL, environment, feature area
- User roles involved
- Access requirements

### Section 5: Test Planning Metadata
- BU Impacted
- Questions to Ask
- Config Details
- DB Details
- API Validation Needed/Not
- Load Test Needed/Not
- Environment execution flags
- Review status

### Section 6: Pre-Requisites
- Setup needed before testing
- Required roles/permissions
- Configuration requirements
- Test data requirements

### Section 7: Test Data Sections
- QA Validation Test Data
- Stage Validation Test Data
- Prod Validation Test Data
- (Filled during execution)

### Section 8: Impact Areas & Components
- Component-by-component breakdown
- UI, backend, database changes
- Cross-component impacts

### Section 9: Web Application Exploration Findings
- **UNIQUE TO THIS WORKFLOW**
- Page structure discovered
- Interactive elements found
- User workflows identified
- Validation messages
- Technical observations (API calls, etc.)

### Section 10: Test Scenarios Summary
- Count by category
- Coverage overview

### Section 11: Test Cases (The Main Section)
- Grouped by category
- Tabular format
- One table per category OR one master table

### Section 12: Automation Readiness
- Automation feasibility assessment
- Recommended for automation
- Manual testing required
- Playwright locators identified during exploration

### Section 13: Traceability Matrix
- Acceptance Criterion → Test Cases mapping
- Coverage status

### Section 14: Test Execution Notes
- QA environment results
- Stage environment results
- Defects found

### Section 15: References
- Links to Jira, Confluence, designs
- Related stories

---

## Example: Complete Test Case Generation

### Input: Jira Ticket PROJ-1234

**Story Title**: User Login with Email and Password

**Acceptance Criteria**:
1. User can login with valid email and password
2. Invalid email format shows error message
3. Invalid password shows error message
4. User is redirected to dashboard after successful login
5. "Remember me" checkbox extends session to 30 days

### Step 1: Fetch Jira Details

```javascript
mcp__plugin_atlassian_atlassian__getJiraIssue({
  cloudId: "mycompany.atlassian.net",
  issueIdOrKey: "PROJ-1234",
  responseContentFormat: "markdown"
})
```

**Extracted**:
- URL: https://app.example.com/login
- Environment: QA
- Acceptance criteria: (as above)

### Step 2: Explore Application

```javascript
// Setup browser
planner_setup_page({url: "https://app.example.com/login"})

// Navigate
browser_navigate({url: "https://app.example.com/login"})

// Get snapshot
browser_snapshot()

// Discovered elements:
// - Email input: #email
// - Password input: #password
// - Login button: [data-testid="login-btn"]
// - Remember me checkbox: #remember-me
// - Error message container: .error-message

// Test interactions
browser_type({selector: "#email", text: "invalid-email"})
browser_click({selector: "[data-testid='login-btn']"})

// Observe error
browser_evaluate({expression: "document.querySelector('.error-message').textContent"})
// Result: "Please enter a valid email address"
```

### Step 3: Generate Test Scenarios

**Positive Scenarios (Happy Path):**
1. Verify user login with valid email and password
2. Verify "Remember me" checkbox extends session
3. Verify redirect to dashboard after successful login

**Negative Scenarios:**
4. Verify error message for invalid email format
5. Verify error message for incorrect password
6. Verify error message for missing email field
7. Verify error message for missing password field
8. Verify error message for non-existent user

**Edge Cases:**
9. Verify handling of email with special characters
10. Verify handling of password with special characters
11. Verify handling of very long email (255+ chars)
12. Verify case sensitivity of email field
13. Verify whitespace trimming in email field

**Security Scenarios:**
14. Verify SQL injection prevention in email field
15. Verify XSS prevention in email field
16. Verify password is masked in input field
17. Verify password is not exposed in network requests

**UI/UX Scenarios:**
18. Verify error message displays in red color
19. Verify loading spinner shows during login API call
20. Verify login button disabled during API call
21. Verify tab navigation through form fields

**Regression Scenarios:**
22. Verify existing logout functionality still works
23. Verify password reset link still accessible

**Integration Scenarios:**
24. Verify end-to-end login to dashboard workflow
25. Verify session token stored in local storage
26. Verify API returns correct user data after login

### Step 4: Create Test Cases Table

```markdown
| Sr No | Test Scenario | Expected Results | Test Data | Preconditions | QA Env Status | Stage Env Status |
|-------|---------------|------------------|-----------|---------------|---------------|------------------|
| 1 | Verify user login with valid email and password | User successfully logged in, redirected to /dashboard, session token stored, welcome message "Welcome, John Doe" displayed | | User logged out, valid account exists | | |
| 2 | Verify "Remember me" checkbox extends session | Session cookie expiry set to 30 days when checkbox is checked | | User on login page | | |
| 4 | Verify error message for invalid email format | Error message "Please enter a valid email address" displayed in red below email field, login prevented | | User on login page | | |
| 5 | Verify error message for incorrect password | Error message "Incorrect password. Please try again." displayed, login prevented, failed attempt logged | | User on login page, valid account exists | | |
```

### Step 5: Save Document

Save to: `Testcases/PROJ-1234_testcase.md`

---

## Best Practices & Tips

### 1. Jira Analysis Best Practices

✅ **DO:**
- Read the ENTIRE ticket description and all comments
- Extract acceptance criteria verbatim
- Look for edge cases mentioned in comments
- Check linked tickets for dependencies
- Understand the business context

❌ **DON'T:**
- Skip reading comments (they often contain clarifications)
- Assume you understand without reading fully
- Ignore attachments (they may contain mockups/specs)

### 2. Web Exploration Best Practices

✅ **DO:**
- Use `browser_snapshot()` instead of screenshots (faster, text-based)
- Test both success AND failure scenarios during exploration
- Note exact error messages for test cases
- Identify stable locators (data-testid, semantic)
- Document any timing issues or waits needed
- Explore hidden sections (modals, dropdowns, accordions)
- Test keyboard navigation

❌ **DON'T:**
- Only test happy path during exploration
- Rely on visual inspection alone (get DOM snapshots)
- Skip network tab (API calls reveal integration points)
- Ignore browser console errors

### 3. Test Scenario Writing Best Practices

✅ **DO:**
- Keep scenarios as one-liners (under 100 characters)
- Use action verbs (Verify, Validate, Test, Check, Confirm)
- Be specific about what is being tested
- Make scenarios independently executable
- Focus on WHAT to test, not HOW

❌ **DON'T:**
- Write multi-line scenarios
- Combine multiple objectives in one scenario
- Use vague language ("test that it works")
- Include implementation details in scenario
- Make scenarios dependent on each other

### 4. Expected Results Best Practices

✅ **DO:**
- Be specific and measurable
- Include all observable outcomes (UI, data, API)
- Mention exact error messages
- Specify redirects/navigation
- Note data changes

❌ **DON'T:**
- Use vague terms ("it works", "success")
- Leave outcomes ambiguous
- Forget to mention negative outcomes for negative tests

### 5. Coverage Best Practices

✅ **DO:**
- Map every acceptance criterion to test cases
- Include at least one negative test per positive test
- Test all user workflows discovered
- Cover all interactive elements found
- Test integration points end-to-end
- Include security and accessibility tests

❌ **DON'T:**
- Test only happy paths
- Skip regression testing
- Ignore edge cases
- Forget about security scenarios
- Miss accessibility requirements

### 6. Automation Readiness Best Practices

✅ **DO:**
- Document stable locators during exploration
- Note any flaky elements (timing issues)
- Flag tests that require manual verification (visual checks)
- Provide API details for API-level testing
- Identify data setup requirements

❌ **DON'T:**
- Assume all tests are automatable
- Use fragile locators (CSS classes that change often)
- Ignore environment-specific considerations

---

## Common Pitfalls to Avoid

### ❌ Pitfall 1: Skipping Thorough Jira Analysis
**Problem**: Missing important requirements, edge cases, or context  
**Solution**: Read ENTIRE ticket including comments and linked issues

### ❌ Pitfall 2: Surface-Level Web Exploration
**Problem**: Missing hidden features, error states, validation messages  
**Solution**: Explore exhaustively - test failures, check all tabs/modals, review network calls

### ❌ Pitfall 3: Only Testing Happy Paths
**Problem**: Bugs found in production that weren't tested  
**Solution**: Follow the 30-40% positive, 25-30% negative, 15-20% edge case distribution

### ❌ Pitfall 4: Vague Test Scenarios
**Problem**: Test scenarios not actionable, ambiguous about what to test  
**Solution**: Use specific action verbs, be clear about what aspect is tested

### ❌ Pitfall 5: Poor Expected Results
**Problem**: Can't determine pass/fail during execution  
**Solution**: Write specific, measurable expected outcomes with exact messages

### ❌ Pitfall 6: Missing Traceability
**Problem**: Can't prove acceptance criteria are tested  
**Solution**: Create traceability matrix mapping AC → Test Cases

### ❌ Pitfall 7: Ignoring Automation Readiness
**Problem**: Test cases not suitable for automation  
**Solution**: Document locators, API calls, data requirements during exploration

### ❌ Pitfall 8: Inconsistent Formatting
**Problem**: Document not Confluence-ready or hard to read  
**Solution**: Follow the template strictly, use tables, maintain consistent structure

---

## Quality Checklist

Before finalizing the test case document, verify:

### Requirements Coverage
- [ ] All acceptance criteria are extracted from Jira
- [ ] All acceptance criteria map to at least one test case
- [ ] Traceability matrix is complete
- [ ] Business context is understood and documented

### Web Exploration Completeness
- [ ] All pages/screens mentioned in story are explored
- [ ] All interactive elements are identified
- [ ] User workflows are mapped
- [ ] Error messages are documented
- [ ] API calls are identified
- [ ] Locators are documented for automation

### Test Scenario Quality
- [ ] All 8 categories are represented
- [ ] Scenarios are one-liners (under 100 chars)
- [ ] Scenarios use action verbs
- [ ] Coverage distribution is balanced
- [ ] No duplicate scenarios

### Test Case Quality
- [ ] All columns are present (Sr No, Test Scenario, Expected Results, Test Data, Preconditions, QA Status, Stage Status)
- [ ] Expected results are specific and measurable
- [ ] Preconditions are clearly stated
- [ ] Test cases are grouped by category
- [ ] Sequential numbering is correct

### Document Quality
- [ ] File name follows convention: {JIRA-ID}_testcase.md
- [ ] File saved in Testcases/ folder
- [ ] All template sections are filled
- [ ] Markdown formatting is correct
- [ ] Tables render properly
- [ ] Links to Jira/Confluence are included
- [ ] Document is Confluence-ready

### Automation Readiness
- [ ] Stable locators documented
- [ ] API endpoints documented
- [ ] Test data requirements identified
- [ ] Flaky scenarios flagged
- [ ] Automation feasibility assessed

---

## Usage with Playwright Automation

Once test cases are generated, use them for automation:

### Step 1: Use Test Case Document as Context

```bash
# Generate Playwright test script using the test case document
claude-code: Generate Playwright test script for test cases in Testcases/PROJ-1234_testcase.md
```

### Step 2: Agent Uses Test Cases + Locators

The automation generator agent will:
- Read the test case document
- Use documented locators from exploration
- Generate Playwright test scripts
- Include assertions based on expected results
- Set up preconditions in beforeEach hooks

### Step 3: Generated Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('PROJ-1234: User Login with Email and Password', () => {
  
  test.beforeEach(async ({ page }) => {
    // Preconditions: User logged out
    await page.goto('https://app.example.com/login');
  });

  test('TC-1: Verify user login with valid email and password', async ({ page }) => {
    // Test Data (to be filled)
    const email = 'test@example.com';
    const password = 'ValidPass123!';
    
    // Actions
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('[data-testid="login-btn"]');
    
    // Expected Results
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.welcome-message')).toContainText('Welcome');
    
    // Verify session token stored
    const token = await page.evaluate(() => localStorage.getItem('sessionToken'));
    expect(token).toBeTruthy();
  });

  test('TC-4: Verify error message for invalid email format', async ({ page }) => {
    // Actions
    await page.fill('#email', 'invalid-email');
    await page.click('[data-testid="login-btn"]');
    
    // Expected Results
    const errorMsg = page.locator('.error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText('Please enter a valid email address');
    await expect(errorMsg).toHaveCSS('color', 'rgb(255, 0, 0)'); // Red color
  });
  
  // ... more test cases
});
```

---

## Publishing to Confluence

### Option 1: Copy-Paste
1. Open generated `.md` file in Testcases/ folder
2. Copy content
3. Paste into Confluence page
4. Confluence will auto-format Markdown tables

### Option 2: Using Atlassian MCP (if available)
```javascript
mcp__plugin_atlassian_atlassian__createConfluencePage({
  spaceKey: "QA",
  title: "Test Cases - PROJ-1234",
  content: "<content from .md file>",
  parentId: "<parent-page-id>"
})
```

---

## Integration with CI/CD

Use generated test cases in your automation pipeline:

```yaml
# .github/workflows/test.yml
name: Run Test Cases

on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Playwright tests for PROJ-1234
        run: npx playwright test tests/PROJ-1234.spec.ts
        
      - name: Update test case document with results
        run: |
          # Script to update QA Env Execution Status column
          node scripts/update-test-results.js PROJ-1234
```

---

## Metrics & Reporting

Track test case quality metrics:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **AC Coverage** | 100% | Every AC has ≥1 test case |
| **Negative Test Ratio** | ≥25% | Negative tests / Total tests |
| **Edge Case Coverage** | ≥15% | Edge case tests / Total tests |
| **Automation Coverage** | ≥70% | Automated tests / Total tests |
| **Defect Detection Rate** | Track | Defects found / Tests executed |
| **Test Execution Time** | Track | Avg time per test case |

---

## Troubleshooting

### Issue 1: Atlassian MCP Authentication Error
**Error**: "Authentication required for plugin:atlassian:atlassian"  
**Solution**: Authorize the Atlassian MCP server via Claude settings or `claude mcp` command

### Issue 2: Playwright Browser Not Launching
**Error**: "Browser not found"  
**Solution**: Run `npx playwright install` to install browsers

### Issue 3: Missing Application URL in Jira
**Problem**: Jira ticket doesn't mention URL  
**Solution**: Ask user for URL or check custom fields in Jira

### Issue 4: Test Case Table Not Rendering in Confluence
**Problem**: Markdown table doesn't convert properly  
**Solution**: Use Confluence's "Insert Table" feature and copy row by row

### Issue 5: Too Many Test Cases Generated
**Problem**: 100+ test cases for simple story  
**Solution**: Review and consolidate similar scenarios, remove redundant tests

### Issue 6: Locators Change After Deployment
**Problem**: Automated tests fail after UI changes  
**Solution**: Use stable data-testid attributes, document locator strategy in test cases

---

## Advanced: Customizing the Workflow

### Custom Test Categories

Add project-specific test categories:

```markdown
#### I. Performance Scenarios
**Template:** "Verify performance of [operation] under [load]"

- Verify page load time under 2 seconds
- Verify API response time under 500ms
- Verify handling of 1000 concurrent users
```

### Custom Document Sections

Add project-specific sections:

```markdown
## Compliance Requirements

**GDPR Compliance:**
- [ ] User data consent captured
- [ ] Data deletion supported
- [ ] Privacy policy linked

**HIPAA Compliance:**
- [ ] PHI data encrypted
- [ ] Audit logs enabled
- [ ] Access controls verified
```

### Integration with Other Tools

**Jira Test Management:**
- Use Zephyr/Xray APIs to sync test cases back to Jira

**Test Data Management:**
- Integrate with test data generation tools

**Defect Tracking:**
- Auto-link failed test cases to created defects

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | April 16, 2026 | Initial workflow (Jira + Azure DevOps) | QA Team |
| 2.0 | August 14, 2026 | Added Playwright web exploration, consolidated workflow | AI + QA Team |

---

## Feedback & Support

For questions or improvements:
- 📧 Email: qa-team@example.com
- 💬 Slack: #qa-automation
- 🐛 Issues: GitHub Issues
- 📚 Documentation: Confluence QA Space

---

**END OF WORKFLOW DOCUMENT**
