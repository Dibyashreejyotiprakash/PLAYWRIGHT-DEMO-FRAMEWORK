# QA Test Case Generation Workflow
## Using Jira MCP & Azure DevOps MCP

**Version:** 1.0  
**Last Updated:** April 16, 2026  
**Purpose:** Standard workflow for generating comprehensive, Confluence-ready test cases from Jira tickets and Azure DevOps PRs  
**Applies To:** All projects using Jira and Azure DevOps

---

## Overview

This document provides a step-by-step workflow for QA engineers to generate comprehensive test cases by analyzing Jira tickets and their associated Pull Requests in Azure DevOps. The workflow leverages MCP (Model Context Protocol) tools for automated data retrieval and analysis.

---

## Prerequisites

### Required Access
- ✅ Jira MCP configured with access to your Atlassian instance
- ✅ Azure DevOps MCP configured with access to your Azure organization
- ✅ Confluence access for publishing test cases
- ✅ Database access (QA and Stage environments) for validation testing
- ✅ API testing tools (Postman, REST Client, etc.)

### Required Information
- 📌 Jira Ticket ID (e.g., PROJ-1234)
- 📌 Azure DevOps Organization name
- 📌 Azure DevOps Project name
- 📌 Pull Request ID or URL (if available)

### Project Structure
- 📁 **TestCaseFromPR/** folder must exist in your project root
  - This is where all generated test case documents will be saved
  - File naming convention: `[TICKET-ID]_TestCases.md`

---

## Step-by-Step Workflow

### Step 1: Fetch Jira Ticket Details

**Objective:** Gather complete requirement information from the Jira ticket.

**Actions:**
```
Use Jira MCP: mcp__plugin_atlassian_atlassian__getJiraIssue

Parameters:
- cloudId: <your-organization>.atlassian.net
- issueIdOrKey: <TICKET-ID>
- responseContentFormat: markdown
```

**Information to Extract:**
- ✅ Ticket Summary/Title
- ✅ Description (full requirement details)
- ✅ Acceptance Criteria (most critical for test case generation)
- ✅ Story Points/Complexity
- ✅ Priority/Severity
- ✅ Assignee/Developer information
- ✅ Status (In Development, In Testing, etc.)
- ✅ Linked issues (dependencies, blockers, related stories)
- ✅ Comments (clarifications, technical discussions)
- ✅ Attachments (design specs, mockups, diagrams)
- ✅ Custom fields (if applicable to your project)

**Key Focus Areas:**
- 🎯 **High-Level Scope:** What is being built/changed?
- 🎯 **Functional Requirements:** What should the feature do?
- 🎯 **Business Rules:** What validations/constraints apply?
- 🎯 **Acceptance Criteria:** How do we verify success?
- 🎯 **Dependencies:** What existing functionality is affected?

---

### Step 2: Identify Linked Pull Request(s)

**Objective:** Find the code changes associated with this ticket.

**Option A - PR ID/URL Known:**
```
Use Azure DevOps MCP: mcp__azuredevops__repo_get_pull_request_by_id

Parameters:
- repositoryId: <repository-name>
- pullRequestId: <PR-ID>
- project: <project-name>
- includeWorkItemRefs: true
```

**Option B - PR ID Unknown:**
```
Step 1: List repositories in the project
Use: mcp__azuredevops__repo_list_repos_by_project
Parameters:
- project: <project-name>

Step 2: Search for PRs by work item
Use: mcp__azuredevops__repo_list_pull_requests_by_repo_or_project
Filter by created_by_user or search commits with ticket ID
```

**Information to Extract from PR:**
- ✅ PR Title and Description
- ✅ Source and Target branches
- ✅ Author/Developer
- ✅ Reviewers and approval status
- ✅ Merge status (Active, Completed, Abandoned)
- ✅ Merge date
- ✅ Associated Work Items
- ✅ Build/CI status
- ✅ Number of files changed
- ✅ Lines added/deleted

---

### Step 3: Analyze Code Changes

**Objective:** Understand what was modified and identify impact areas.

**Get Commit Details:**
```
Use: mcp__azuredevops__repo_search_commits

Parameters:
- project: <project-name>
- repository: <repository-name>
- version: <source-branch-name>
- versionType: Branch
- top: 20
```

**Analyze PR Threads (Code Review Comments):**
```
Use: mcp__azuredevops__repo_list_pull_request_threads

Parameters:
- repositoryId: <repository-name>
- pullRequestId: <PR-ID>
- project: <project-name>
- fullResponse: true
```

**Extract from Code Analysis:**
- 📁 **Files Modified:** List all changed files (Controllers, Services, Models, DB scripts, UI components)
- 🔧 **Type of Changes:** New features, bug fixes, refactoring, performance improvements
- 🗄️ **Database Changes:** Schema modifications, new tables, altered columns, indexes
- 🌐 **API Changes:** New endpoints, modified request/response, deprecated APIs
- 🎨 **UI Changes:** New screens, modified components, styling updates
- 🔗 **Integration Points:** External services, message queues, webhooks
- ⚙️ **Configuration Changes:** App settings, feature flags, environment variables
- 🔐 **Security Changes:** Authentication, authorization, encryption, validation

**Key Questions to Answer:**
1. What functionality is being added/modified?
2. Which existing features might be affected (regression)?
3. Are there database migrations?
4. Are there API contract changes?
5. What are the edge cases introduced?
6. What validations are implemented?
7. Are there performance implications?
8. What error handling is added?

---

### Step 4: Identify Impact Areas

**Objective:** Map changes to affected system components and user workflows.

**Impact Assessment Matrix:**

| Impact Category | Analysis Method | Documentation |
|----------------|-----------------|---------------|
| **Functional Modules** | Map changed files to feature areas | List all affected modules/features |
| **Database Layer** | Review DB scripts, model changes | Tables, columns, constraints, indexes modified |
| **API Layer** | Review controllers, services | Endpoints added/modified, request/response schema |
| **UI Layer** | Review components, pages | Screens, forms, validation, user flows |
| **Business Logic** | Review service classes, utilities | Rules, calculations, workflows |
| **Integration Points** | Review external service calls | APIs called, webhooks, message queues |
| **Security & Auth** | Review auth middleware, validation | Permissions, roles, data access |
| **Performance** | Review queries, loops, caching | Database queries, algorithm complexity |
| **Configuration** | Review settings files | Feature flags, environment configs |
| **Dependencies** | Review upstream/downstream | Services that depend on this change |

**Document Impact Areas as:**

### 1. [Component Name] - [Purpose]
**Purpose:** Brief description of what this component does

- **Components Modified:**
  - Specific file/class/module names
  - 
- **Functionality:**
  - What changed in this component
  - What new behavior was added
  - What existing behavior was modified
  
- **Test Cases:** TC X-Y (reference test cases covering this area)

---

### Step 5: Generate Test Scenarios

**Objective:** Create comprehensive test scenario list covering all test types.

**IMPORTANT: Test scenarios must be written as concise one-liners (under 100 characters). Keep descriptions brief and focused.**

**Test Scenario Categories:**

#### A. Positive Scenarios (Happy Path)
- ✅ Primary user workflows
- ✅ Expected inputs with expected outputs
- ✅ Successful API calls
- ✅ Valid data processing
- ✅ Successful integrations

**Template (One-liner format):**
- "Verify [action] with [condition]"
- "Validate [system behavior] when [scenario]"
- "Test [functionality] for [use case]"

#### B. Negative Scenarios (Unhappy Path)
- ❌ Invalid inputs
- ❌ Missing required fields
- ❌ Authorization failures
- ❌ Business rule violations
- ❌ Invalid data types/formats

**Template (One-liner format):**
- "Verify error for [invalid input/condition]"
- "Validate rejection when [scenario]"
- "Test validation for [invalid case]"

#### C. Edge Cases (Boundary Conditions)
- 🔄 Empty/null values
- 🔄 Maximum/minimum values
- 🔄 Special characters
- 🔄 Large datasets
- 🔄 Concurrent operations
- 🔄 Timeout scenarios

**Template (One-liner format):**
- "Verify handling of [edge case/boundary]"
- "Test [functionality] with [boundary value]"
- "Validate behavior for [edge condition]"

#### D. Regression Scenarios
- 🔁 Existing features still work
- 🔁 No breaking changes to APIs
- 🔁 Backward compatibility maintained
- 🔁 Dependent features unaffected

**Template (One-liner format):**
- "Verify [existing feature] still works"
- "Test backward compatibility for [component]"
- "Validate no regression in [functionality]"

#### E. Integration Scenarios
- 🔗 API to Database flow
- 🔗 UI to API integration
- 🔗 Service to service communication
- 🔗 External system integration
- 🔗 End-to-end workflows

**Template (One-liner format):**
- "Verify [component A] to [component B] integration"
- "Test end-to-end [workflow] flow"
- "Validate data flow from [source] to [destination]"

#### F. Security & Validation Scenarios
- 🔒 Authentication required
- 🔒 Authorization checks
- 🔒 Input validation/sanitization
- 🔒 SQL injection prevention
- 🔒 XSS prevention
- 🔒 CSRF protection

**Template (One-liner format):**
- "Verify authorization for [resource/action]"
- "Test input validation for [field/endpoint]"
- "Validate security against [threat type]"

#### G. Performance & Scalability Scenarios
- ⚡ Response time under load
- ⚡ Large dataset handling
- ⚡ Concurrent user operations
- ⚡ Database query performance
- ⚡ Caching effectiveness

**Template (One-liner format):**
- "Verify performance of [operation] under [load]"
- "Test response time for [scenario/dataset]"
- "Validate scalability with [concurrent users/data]"

#### H. Data Integrity & Audit Scenarios
- 📊 Data consistency across systems
- 📊 Audit trail logging
- 📊 Foreign key relationships
- 📊 Transaction rollback on failure
- 📊 Duplicate prevention

**Template (One-liner format):**
- "Verify data consistency for [operation/entity]"
- "Test audit trail for [action/event]"
- "Validate transaction rollback on [failure]"

---

### Step 6: Generate Test Cases (Confluence-Ready Format)

**Objective:** Create detailed, executable test cases in tabular format.

**Standard Table Format:**

```markdown
| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
```

**Column Definitions:**

| Column | Description | Guidelines |
|--------|-------------|------------|
| **Sr No** | Sequential test case number | 1, 2, 3... or TC-1, TC-2... |
| **Test Scenario** | Brief one-liner description of what is being tested | **ONE-LINER ONLY** - Keep under 100 characters. Use action verbs (Verify, Validate, Test). Example: "Verify user login with valid credentials" |
| **Expected Results** | Expected outcome or behavior when test is executed | Describe what should happen when the test scenario is performed. Be specific about the expected system behavior, data, or response. |
| **Test Data** | Test data to be used for test execution | Leave EMPTY - to be filled manually with specific test data (usernames, IDs, values, etc.) needed for test execution |
| **QA Env Execution Status** | Test execution status in QA environment | Leave EMPTY - to be filled during test execution (Pass/Fail/Blocked/Not Run) |
| **Stage Env Execution Status** | Test execution status in Stage environment | Leave EMPTY - to be filled during test execution (Pass/Fail/Blocked/Not Run) |

**Writing Guidelines:**

1. **Test Scenario (MUST BE ONE-LINER):**
   - Use action verbs (Verify, Validate, Test, Check)
   - Be specific about what aspect is being tested
   - **CRITICAL: Keep it concise - ONE LINE ONLY, under 100 characters**
   - No multi-line scenarios allowed
   - Should clearly describe what functionality or behavior is being tested

2. **Expected Results:**
   - Describe the expected outcome when the test scenario is performed
   - Be specific about what should happen (status codes, messages, data changes, UI behavior)
   - Include expected error messages for negative scenarios
   - Mention data validation points where applicable

3. **Test Data:**
   - Leave empty during test case creation
   - To be filled manually with specific test data required for execution
   - Examples: user credentials, IDs, input values, file names, etc.

4. **QA Env Execution Status:**
   - Leave empty during test case creation
   - To be filled during test execution with: Pass, Fail, Blocked, or Not Run
   - Include defect IDs if test fails

5. **Stage Env Execution Status:**
   - Leave empty during test case creation
   - To be filled during test execution with: Pass, Fail, Blocked, or Not Run
   - Include defect IDs if test fails

**Example Test Cases (Note: Test Scenario is ONE-LINER):**

```markdown
| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
| 1 | Verify API creates record with valid data | Record created successfully with 201 status, all fields saved correctly | | | |
| 2 | Verify API rejects missing required field | API returns 400 error with validation message for missing field | | | |
| 3 | Verify user login with valid credentials | User successfully logged in and redirected to dashboard | | | |
| 4 | Verify error message for invalid password | Error message displayed: "Invalid password. Please try again." | | | |
```

---

### Step 7: Output Document Structure (MANDATORY ORDER)

**Objective:** Organize all information into a professional, Confluence-ready document.

**File Naming and Location:**
- **Directory:** All test case documents MUST be saved in the `TestCaseFromPR/` folder
- **File Name Format:** `[TICKET-ID]_TestCases.md` (e.g., `PROJ-1234_TestCases.md`)
- **Full Path Example:** `TestCaseFromPR/PROJ-1234_TestCases.md`

**Instructions:**
1. Ensure the `TestCaseFromPR/` directory exists in your project root
2. Save the generated test case document using the ticket ID as the filename
3. Use the exact format specified above for consistency

---

**Document Template:**

```markdown
# Test Cases for [TICKET-ID]: [Ticket Title]

## Story Summary
[Brief summary of the story/requirement]

---

## BU Impacted


---

## Question to ask


---

## Config Details


---

## DB Details


---

## API Validation Needed/Not


---

## Load Test Needed/Not


---

## Can be executed on QA Env


---

## Can be executed with QA BU


---

## Test case Review Status


---

## Any Review feedback


---

## Pre-Requisites - Set up needed - Role/Config Etc


**Note:** 
- If API Testing is mentioned in Jira ticket or PR, it will be documented here
- If Load/Performance Testing is mentioned in Jira ticket or PR, it will be documented here  
- If Database Testing is mentioned in Jira ticket or PR, it will be documented here

---

## QA Validation Test Data


---

## Stage Validation Test Data


---

## Prod Validation Test Data


---

## Impact Areas & Components

### 1. [Component Name] - [Purpose]
**Purpose:** [What this component does]

- **Components Modified:**
  - [Component 1]
  - [Component 2]

- **Functionality:**
  - [Change 1]
  - [Change 2]

- **Test Cases:** TC X-Y

[Repeat for each impacted component]

---

## Cross-Component Impact Areas

### [Impact Area Name]
- **[Aspect] Modified:** 
  - [Detail 1]
  - [Detail 2]
- **Affected Components:** [List components]
- **Test Cases:** TC X, Y, Z

[Repeat for each cross-component area]

---

## Test Cases

| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
| [#] | [One-liner scenario description] | [Expected outcome/behavior] | | | |

[All test cases here]
```

---

## Tips & Best Practices

### 1. Code Analysis Best Practices
- 📖 Read the full PR description and comments
- 🔍 Look for code review feedback - reveals edge cases
- 📝 Check commit messages for context
- 🗂️ Group related file changes by component
- 🔗 Trace data flow through layers (UI → API → Service → DB)

### 2. Test Case Writing Best Practices
- ✍️ **Test Scenario MUST be one-liner** - Keep under 100 characters, no multi-line scenarios
- 🎯 One test case = one scenario (don't combine multiple tests)
- 📝 Use clear, specific action verbs (Verify, Validate, Test, Check)
- 🔍 Ensure test scenarios are unambiguous and testable
- ⚙️ Focus on what is being tested, not how to test it

### 3. Test Coverage Best Practices
- ✅ Every acceptance criterion must map to at least one test case
- ✅ Include at least one negative test per positive scenario
- ✅ Test both UI and API layers when applicable
- ✅ Include database validation for data operations
- ✅ Cover regression areas identified in impact analysis

### 4. Documentation Best Practices
- 📚 Use consistent formatting and terminology
- 🔗 Include hyperlinks to Jira, PRs, Confluence pages
- 📊 Use tables for easy scanning
- 🎨 Use emojis/icons for visual organization (sparingly)
- 📝 Keep language clear and jargon-free

### 5. Collaboration Best Practices
- 💬 Review test cases with developer before execution
- 🤝 Discuss edge cases and assumptions with PO
- 🔄 Update test cases based on feedback
- 📢 Share test results promptly with stakeholders
- 🐛 Link defects back to test cases

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Skip reading the full Jira description and acceptance criteria
- Assume you know the requirements without verification
- Create test cases without understanding code changes
- Ignore negative and edge case scenarios
- Test only the happy path
- Forget to verify regression areas
- Leave sections incomplete in the template
- **Write multi-line test scenarios - MUST be one-liner only**
- Include unnecessary details in test scenario column
- Write vague or ambiguous test scenarios

✅ **Do:**
- Thoroughly analyze both Jira ticket and PR
- Ask clarifying questions early
- Understand the technical implementation
- Balance positive, negative, and edge cases
- Test both new features and existing functionality
- Map every test case to an acceptance criterion
- Complete all sections of the template
- **Keep test scenarios as concise one-liners (under 100 characters)**
- Write clear, specific test scenario descriptions
- Use action verbs (Verify, Validate, Test, Check)

---

## Appendix A: MCP Tool Reference

### Jira MCP Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `getJiraIssue` | Get issue details | cloudId, issueIdOrKey, responseContentFormat |
| `searchJiraIssuesUsingJql` | Search issues by JQL | cloudId, jql, maxResults |
| `getJiraIssueRemoteIssueLinks` | Get linked PRs/external links | cloudId, issueIdOrKey |
| `getTransitionsForJiraIssue` | Get available status transitions | cloudId, issueIdOrKey |

### Azure DevOps MCP Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `core_list_projects` | List all projects | projectNameFilter, stateFilter |
| `repo_list_repos_by_project` | List repositories | project, repoNameFilter |
| `repo_get_pull_request_by_id` | Get PR details | repositoryId, pullRequestId, project |
| `repo_list_pull_requests_by_repo_or_project` | Search PRs | repositoryId, status, created_by_user |
| `repo_search_commits` | Get commit history | project, repository, version, versionType |
| `repo_list_pull_request_threads` | Get code review comments | repositoryId, pullRequestId |
| `wit_get_work_item` | Get work item details | id, project, expand |

---

## Appendix B: Test Case Templates by Category

### API Test Case Template
```markdown
| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
| X | Verify [endpoint] with [condition] | [Expected status code, response body, data changes] | | | |
```

### UI Test Case Template
```markdown
| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
| X | Verify [UI element/action] for [scenario] | [Expected UI behavior, messages, navigation] | | | |
```

### Database Test Case Template
```markdown
| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
| X | Verify [DB operation] for [table/condition] | [Expected data in tables, row counts, field values] | | | |
```

### Integration Test Case Template
```markdown
| Sr No | Test Scenario | Expected Results | Test Data | QA Env Execution Status | Stage Env Execution Status |
|-------|---------------|------------------|-----------|-------------------------|----------------------------|
| X | Verify [System A] to [System B] integration | [Expected data flow, successful integration, correct mapping] | | | |
```

---

## Appendix C: Sample JQL Queries

Useful Jira queries for test planning:

```jql
# Get all stories in current sprint assigned to developer
project = PROJ AND sprint in openSprints() AND assignee = "developer@example.com" AND type = Story

# Get all bugs found in testing
project = PROJ AND status = "In Testing" AND type = Bug

# Get all stories with linked PRs
project = PROJ AND issueFunction in linkedIssuesOfRemote("development")

# Get stories by epic
project = PROJ AND "Epic Link" = EPIC-123

# Get high priority issues in testing
project = PROJ AND priority = High AND status = "In Testing"
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | April 16, 2026 | Initial workflow document created | QA Team |

---

## Feedback & Improvements

This workflow document is a living document. Please provide feedback for improvements:
- 📧 Email: [qa-team@example.com]
- 💬 Slack: #qa-automation
- 📝 Confluence: [Feedback page]

---

**END OF WORKFLOW DOCUMENT**
