# Workflow: Generate Comprehensive Functional Specification Documents for QA

**Version:** 2.0  
**Last Updated:** July 31, 2026  
**Created:** May 28, 2026  
**Purpose:** Step-by-step workflow to create comprehensive functional specification documents using Azure DevOps MCP  
**Data Source:** Azure DevOps (Work Items, Wiki, Code Repository, Pipelines)  
**Key Features:** 
- ✅ 200-350 Regression Test Scenarios with full traceability
- ✅ Complete Business Logic extraction from code repository
- ✅ All API Endpoints documented from source code
- ✅ All Database Queries extracted from repository
**Example Output:** RateSheet_Functional_Specification_QA.md

---

## 🎯 What Makes This Workflow Comprehensive?

### 1. **Complete Regression Scope Coverage**
Unlike traditional documentation that relies on manual test case creation, this workflow:
- **Automatically generates 200-350+ test scenarios** from multiple sources
- **Traces every scenario** back to its source (work item, code line, API endpoint, query)
- **Covers all test types:** Happy path, validation, API, database, security, performance, edge cases
- **Includes regression tests** for every known bug
- **Validates completeness** by checking all acceptance criteria, business rules, endpoints, and queries are covered

### 2. **Business Logic from Source Code**
This workflow doesn't rely on documentation or tribal knowledge:
- **Extracts validation rules** directly from code (FluentValidation, attributes, custom validators)
- **Documents calculations** with actual formulas from the codebase
- **Captures conditional logic** (if/else branches, switch statements)
- **Identifies business exceptions** and error handling
- **References exact code locations** for every rule (File.cs:LineNumber)

### 3. **API Endpoints from Repository**
Instead of outdated API documentation:
- **Searches code for all controllers** with [ApiController] and [Route] attributes
- **Extracts HTTP methods** ([HttpGet], [HttpPost], [HttpPut], [HttpDelete])
- **Documents request/response models** from actual code
- **Identifies auth requirements** from [Authorize] attributes
- **Generates test scenarios** for each endpoint and HTTP method

### 4. **Database Queries from Code**
Rather than incomplete schema documentation:
- **Finds all SQL queries** in the codebase (inline SQL, stored procs, EF, Dapper)
- **Extracts query logic** with parameters and table relationships
- **Documents performance considerations** (indexes, execution time)
- **Links queries to APIs** and business logic that use them
- **Includes migration scripts** for schema evolution history  

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Workflow Steps](#workflow-steps)
4. [Information Gathering Phase](#information-gathering-phase)
5. [Document Structure Template](#document-structure-template)
6. [Content Generation Guidelines](#content-generation-guidelines)
7. [Quality Checklist](#quality-checklist)
8. [Automation Scripts](#automation-scripts)
9. [Appendix: Tools & Resources](#appendix-tools--resources)

---

## Overview

### Purpose
This workflow enables QA teams to generate comprehensive functional specification documents using **Azure DevOps MCP** (Model Context Protocol) as the primary data source. The workflow leverages Claude Code to automatically gather information from multiple Azure DevOps sources and generate structured documentation.

**Key Benefits:**
- ✅ **Automated Data Collection:** Use MCP tools to query Azure DevOps instead of manual searches
- ✅ **Comprehensive Coverage:** Gather data from work items, wiki, code, commits, and pipelines
- ✅ **Structured Output:** Generate consistent, well-organized documentation
- ✅ **Traceability:** Link every piece of information back to its source work item or wiki page
- ✅ **Efficiency:** Reduce documentation time from days to hours

### Document Components
This workflow generates documentation that includes:

**1. Comprehensive Regression Scope (150-250+ Test Scenarios)**
- Happy path scenarios
- Edge cases and boundary conditions
- Error handling and validation scenarios
- Integration test scenarios
- Performance and load test cases
- Security test scenarios
- Regression tests for known bugs

**2. Business Logic Documentation**
- Business rules from work items and code
- Validation logic and constraints
- Calculation algorithms
- Workflow and state transitions
- Decision matrices and conditional logic
- Priority and precedence rules

**3. Complete API Endpoint Details**
- Endpoint URLs and HTTP methods
- Request/response schemas (JSON/XML)
- Authentication and authorization requirements
- Query parameters and path variables
- Request headers and response codes
- Rate limiting and throttling
- API versioning information
- Example requests and responses

**4. Database Queries and Schema**
- Table structures and relationships
- SQL queries extracted from code repository
- Stored procedures and functions
- Database constraints and indexes
- Sample data and test data sets
- Data migration scripts
- Query performance considerations

**5. Additional Components**
- Excel file structure specifications
- Recent production releases and bug fixes
- Links to source work items, wiki pages, and code

### Input Sources (via Azure DevOps MCP)
1. **Work Items** - User stories, bugs, tasks, features with acceptance criteria
2. **Azure DevOps Wiki** - Technical documentation, API specs, architecture diagrams
3. **Code Repositories** - Search for:
   - API controllers and route definitions (`[Route]`, `[HttpGet]`, `[HttpPost]`)
   - Business logic classes and services
   - SQL queries in code (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)
   - Stored procedure calls
   - Validation logic and business rules
   - Data models and DTOs
4. **Commits & Pull Requests** - Implementation details, code changes, bug fixes
5. **Build & Release Logs** - Production deployments, release notes, hotfixes
6. **Database Schema** (via MSSQL MCP or code search) - Tables, columns, relationships, constraints

### Output
A structured Markdown document containing all functional and technical details needed for QA testing, with full traceability to Azure DevOps sources.

### Azure DevOps MCP Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AZURE DEVOPS MCP                          │
│                 (Primary Data Source)                        │
└─────────────────────────────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
           ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  Work    │    │   Wiki   │    │   Code   │
    │  Items   │    │  Pages   │    │  Search  │
    └──────────┘    └──────────┘    └──────────┘
           │                │                │
           │                │                │
           ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Commits  │    │ Pipelines│    │ Database │
    │   & PRs  │    │ & Builds │    │ (MSSQL)  │
    └──────────┘    └──────────┘    └──────────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Claude Code Agent     │
              │   Processes & Extracts  │
              └─────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  Functional Spec Doc    │
              │  (Markdown Format)      │
              └─────────────────────────┘
```

**Data Flow:**
1. **Search & Query:** Use MCP tools to search work items, wiki, and code
2. **Extract Details:** Get full work item details, comments, attachments
3. **Discover APIs:** Find endpoint definitions from wiki and code search
4. **Retrieve Schema:** Get database schema from SQL queries or MSSQL MCP
5. **Track Changes:** Link commits, PRs, and builds to work items
6. **Generate Document:** Compile all information into structured Markdown

---

## Prerequisites

### Required Tools
1. **Azure DevOps Access** - PAT token with read access to:
   - Work Items (queries, search)
   - Repositories (code, pull requests)
   - Pipelines (builds, releases)
   - Wiki (documentation)
2. **Database Access** - Read-only access to target database (optional via MSSQL MCP)
3. **Text Editor** - VS Code, Notepad++, or similar
4. **MCP Servers** (required for Claude Code)
   - **Azure DevOps MCP Server** (primary data source)
   - **MSSQL MCP Server** (optional for database schema)

### Configuration Files
Create or update `.claude/settings.json` in your project root:
```json
{
  "mcpServers": {
    "azuredevops": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "YourOrgName", "--authentication", "env"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/YourOrg",
        "AZURE_DEVOPS_PAT": "YOUR_PAT_TOKEN"
      }
    },
    "mssql": {
      "command": "npx",
      "args": ["-y", "mssql-mcp"],
      "env": {
        "DB_SERVER": "your-sql-server.database.windows.net",
        "DB_DATABASE": "YourDatabase",
        "DB_USER": "username",
        "DB_PASSWORD": "password",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "true",
        "DB_TRUST_SERVER_CERTIFICATE": "false"
      }
    }
  }
}
```

**Note:** The MSSQL MCP server configuration is optional and only needed if you want to query database schema directly.

---

## Workflow Steps

### Phase 1: Discovery & Planning (30-60 minutes)

#### Step 1.1: Define Scope
- [ ] Identify the feature/module to document (e.g., RateSheet Management)
- [ ] List related modules and dependencies
- [ ] Identify stakeholders (Product Owner, Dev Lead, QA Lead)
- [ ] Set documentation goals:
  - [ ] **Regression Scope:** Define test coverage targets (e.g., 200+ scenarios)
  - [ ] **Business Logic:** Document all business rules and validations
  - [ ] **API Coverage:** Identify all endpoints to document
  - [ ] **Database Queries:** Extract all SQL from repository
- [ ] Identify Azure DevOps project(s) and repository name(s)

**Example:**
```
Feature: RateSheet Management
Related Modules: Checkout, Pricing, Inventory, Shipping
Stakeholders: QA Team, API Test Engineers
Goal: Complete functional spec with 200+ test scenarios
```

#### Step 1.2: Identify Keywords for Search
Create a list of search terms for Azure DevOps Work Items:
- Feature names: "RateSheet", "Rate Management", "ItemPricing"
- Related terms: "pricing", "tax code", "shipping rate", "kit"
- Module names: "Admin Tools", "Rate Management"
- Technical terms: "API", "endpoint", "database", "excel upload"
- Area paths: Identify relevant Area Paths in your project
- Tags: Common tags used in your project

**Template:**
```
Primary Keywords: [Feature Name]
Secondary Keywords: [Related Features]
Technical Keywords: [API, DB, Integration Points]
Area Paths: [Project Areas]
Tags: [Relevant Tags]
```

---

### Phase 2: Information Gathering (2-4 hours)

#### Step 2.1: Azure DevOps Work Item Collection

**A) Search for Feature Work Items**
Use Azure DevOps MCP to search work items:
```
Use: mcp__azuredevops__search_workitem
Parameters:
  - searchText: "RateSheet OR Rate Management OR ItemPricing"
  - project: ["YourProjectName"]
  - workItemType: ["User Story", "Feature"]
  - state: ["Active", "Resolved", "Closed"]
  - top: 50
```

**B) Search for API-Related Work Items**
```
Use: mcp__azuredevops__search_workitem
Parameters:
  - searchText: "API AND (Cart OR Pricing OR endpoint)"
  - project: ["YourProjectName"]
  - workItemType: ["Task", "User Story"]
  - top: 50
```

**C) Search for Bug Fixes**
```
Use: mcp__azuredevops__search_workitem
Parameters:
  - searchText: "rate sheet OR pricing"
  - project: ["YourProjectName"]
  - workItemType: ["Bug"]
  - state: ["Resolved", "Closed"]
  - top: 100
```

**D) Get Recent Work Items (Last 6 Months)**
```
Use: mcp__azuredevops__wit_query with WIQL:
WIQL Query:
SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType]
FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.ChangedDate] >= @Today - 180
  AND ([System.Title] CONTAINS 'rate' 
       OR [System.Title] CONTAINS 'pricing' 
       OR [System.Title] CONTAINS 'item')
ORDER BY [System.ChangedDate] DESC
```

**Collection Checklist:**
- [ ] Feature stories/User Stories (10-20 work items)
- [ ] Bug reports (20-50 work items)
- [ ] API-related work items (10-30 work items)
- [ ] Recent releases (30-50 work items)
- [ ] Database-related work items (5-10 work items)

#### Step 2.2: Extract Key Information from Work Items

For each work item category, extract using Azure DevOps MCP:

**From Feature Work Items:**
Use `mcp__azuredevops__wit_work_item` to get full details:
- Business requirements (Description field)
- Acceptance criteria (Acceptance Criteria field)
- Field definitions (check attachments and related work items)
- Business rules and validations (from discussion/comments)

**From Bug Work Items:**
Use `mcp__azuredevops__wit_work_item` to get:
- Repro steps and root cause
- SQL queries (often in Repro Steps or Discussion)
- Error scenarios and stack traces
- Workarounds and resolution details

**From API-Related Work Items:**
Extract from work item details and attachments:
- Endpoint URLs and HTTP methods
- Request/response examples (often in attachments or comments)
- Authentication requirements
- Test data examples

**From Recent Work Items:**
Use `mcp__azuredevops__wit_work_item` to retrieve:
- Related pull requests (via `mcp__azuredevops__repo_pull_request`)
- Build/release information
- Production issues resolved
- New features and improvements

**Extraction Commands:**
```
1. Get work item details:
   mcp__azuredevops__wit_work_item (action: "get", id: <work-item-id>)

2. Get work item comments:
   mcp__azuredevops__wit_work_item (action: "list_comments", workItemId: <id>)

3. Get work item attachments:
   Check fields.System.AttachmentCount and retrieve via API

4. Get related commits/PRs:
   Use mcp__azuredevops__repo_search_commits or check Links field
```

**Extraction Template:**
```markdown
## Work Item: [ID] - [Title]
**Type:** [User Story/Bug/Task/Feature]
**State:** [Active/Resolved/Closed]
**Area Path:** [Area]
**Key Findings:**
- Business Rule: [From Description/Acceptance Criteria]
- SQL Query: [From Repro Steps/Comments]
- API Endpoint: [From Description/Attachments]
- Test Scenario: [From Acceptance Criteria]
**Related Items:** [Linked work items, PRs, commits]
```

#### Step 2.3: Database Schema Discovery

**Option A: From Azure DevOps Work Items**
Search for work items containing SQL queries:
```
Use: mcp__azuredevops__search_workitem
Parameters:
  - searchText: "SELECT FROM WHERE"
  - project: ["YourProjectName"]
  - top: 100
```

Then extract SQL from work item descriptions, comments, and attachments.

**Option B: From Azure DevOps Wiki**
Search wiki pages for database documentation:
```
Use: mcp__azuredevops__search_wiki
Parameters:
  - searchText: "database schema OR table structure OR [TableName]"
  - project: ["YourProjectName"]
  - top: 50
```

**Option C: Direct Database Query via MSSQL MCP (if configured)**
```
Use MSSQL MCP commands:

1. List all databases:
   mcp__mssql__mssql_list_databases

2. List tables in schema:
   mcp__mssql__mssql_list_schema_objects
   Parameters:
     - objectType: "tables"
     - schemaName: "dbo"

3. Describe table columns:
   mcp__mssql__mssql_describe_table_columns
   Parameters:
     - tableName: "ItemPricing"
     - schemaName: "dbo"

4. Query table data (for examples):
   mcp__mssql__mssql_read_table_rows
   Parameters:
     - tableName: "ItemPricing"
     - limit: 10
```

**Alternative: Direct SQL Query (if needed):**
```sql
-- Get all tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'BrandBuilder';

-- Get columns for specific table
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ItemPricing';
```

**Schema Documentation Template:**
```markdown
### Table: [TableName]

| Column Name | Data Type | Length | Nullable | Description |
|-------------|-----------|--------|----------|-------------|
| ItemId | INT | - | NO | Primary key |
| ExternalItemId | VARCHAR | 100 | NO | SKU identifier |
| ItemPrice | DECIMAL | 18,4 | NO | Unit price |
```

#### Step 2.4: API Endpoint Discovery from Repository

**A) Search Code Repository for API Controllers**

Use Azure DevOps code search to find API endpoints directly from source code:

```
1. Search for API Controller classes:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "[ApiController] OR [Route"
     - project: "YourProject"
     - path: ["Controllers", "Api"]
     - top: 100

2. Search for HTTP method attributes:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "[HttpGet] OR [HttpPost] OR [HttpPut] OR [HttpDelete]"
     - project: "YourProject"
     - top: 100

3. Search for specific route patterns:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "Route(\"api/ OR /api/"
     - project: "YourProject"
```

**B) Extract API Details from Code Files**

Once you find API controller files, read them to extract:

```
Use: mcp__azuredevops__repo_file (action: "get_content")
Parameters:
  - repositoryId: "YourRepoName"
  - path: "/Controllers/CartController.cs"
  - version: "main"
```

**Extract from code:**
- Route templates: `[Route("api/[controller]")]`
- HTTP methods: `[HttpGet]`, `[HttpPost("{id}")]`
- Parameters: `[FromRoute]`, `[FromBody]`, `[FromQuery]`
- Response types: `ActionResult<T>`, `IActionResult`
- Authorization: `[Authorize]`, `[AllowAnonymous]`
- Model binding and validation attributes

**C) Search for API Documentation in Wiki**

```
mcp__azuredevops__search_wiki
Parameters:
  - searchText: "API documentation OR endpoint reference OR swagger"
  - project: ["YourProject"]
  - top: 30
```

**D) Search Work Items for API Requirements**

```
mcp__azuredevops__search_workitem
Parameters:
  - searchText: "API endpoint OR REST API OR /api/"
  - workItemType: ["Task", "User Story"]
  - top: 50
```

**Complete API Endpoint Template:**
```markdown
### Endpoint [Number]: [Endpoint Name]

**Source:** [ControllerName.cs:LineNumber]

```http
[HTTP_METHOD] /api/[route-path]
Authorization: Bearer {token}  [if [Authorize] attribute present]

Headers:
  Content-Type: application/json
  [Additional headers from code]

Path Parameters:
  - {paramName}: [Type] - [Description from XML comments]

Query Parameters:
  - paramName: [Type] - [Description] [Required/Optional]

Request Body:
{
  "modelProperty": "value"  [From [FromBody] parameter type]
}

Response: 200 OK
{
  "responseProperty": "value"  [From return type]
}

Error Responses:
  - 400 Bad Request: [Validation failures]
  - 401 Unauthorized: [Auth failures]
  - 404 Not Found: [Resource not found]
  - 500 Internal Server Error: [Server errors]
```

**Code File:** [RepoName/Path/Controller.cs]
**Work Item Reference:** [WI-ID] - [Title]
**Wiki Reference:** [Wiki Page Path]
**Related Tests:** [TestFileName.cs] (if found)
```

**Example Extraction from C# Code:**
```csharp
// File: Controllers/CartController.cs

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    [HttpGet("User/{userId}/BusinessUnitId/{businessUnitId}/Person/{personId}")]
    [Authorize]
    public async Task<ActionResult<CartDto>> GetCart(
        [FromRoute] int userId,
        [FromRoute] int businessUnitId,
        [FromRoute] int personId)
    {
        // Business logic...
    }
}
```

**Extracted Documentation:**
```markdown
### Endpoint 1: Get User Cart

**Source:** CartController.cs:25

```http
GET /api/Cart/User/{userId}/BusinessUnitId/{businessUnitId}/Person/{personId}
Authorization: Bearer {token}

Path Parameters:
  - userId: int - User identifier
  - businessUnitId: int - Business unit identifier
  - personId: int - Person identifier

Response: 200 OK
{
  "cartId": 123,
  "items": [],
  "totalAmount": 0.00
}
```

**Code File:** CartApi/Controllers/CartController.cs:25
**Related Work Items:** Search results from step D
```

#### Step 2.5: Business Logic Extraction from Repository

**A) Search for Business Logic Classes**

```
1. Search for Service/Manager/Handler classes:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "public class AND Service OR Manager OR Handler"
     - project: "YourProject"
     - path: ["Services", "Business", "Core", "Domain"]

2. Search for validation logic:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "Validate OR ValidationAttribute OR FluentValidation"
     - project: "YourProject"

3. Search for business rule implementations:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "if ( AND throw OR return false OR BusinessRuleException"
     - project: "YourProject"
```

**B) Extract Business Rules from Code**

Read business logic files and extract:
- Validation rules and constraints
- Calculation formulas
- Conditional logic and decision trees
- State machine transitions
- Business exceptions and error handling

**Business Logic Documentation Template:**
```markdown
### Business Rule [Number]: [Rule Name]

**Source:** [FileName.cs:LineNumber]

**Description:**
[What the rule enforces]

**Trigger Conditions:**
- Condition 1: [When this rule applies]
- Condition 2: [Additional conditions]

**Validation Logic:**
```csharp
// Extracted code snippet
if (quantity < minimumOrderQuantity)
{
    throw new BusinessRuleException("Order quantity must be at least " + minimumOrderQuantity);
}
```

**Business Impact:**
[What happens if rule is violated]

**Test Scenarios:**
- Valid: [Input that passes validation]
- Invalid: [Input that fails validation]

**Code Reference:** [RepoName/Path/File.cs:LineNumber]
**Work Item Reference:** [WI-ID]
```

**Example Code Patterns to Search:**

```csharp
// Pattern 1: Validation in services
public class PricingService
{
    public decimal CalculatePrice(decimal basePrice, decimal taxRate)
    {
        // Business Rule: Tax rate must be between 0 and 1
        if (taxRate < 0 || taxRate > 1)
            throw new ArgumentException("Tax rate must be between 0 and 1");
            
        // Business Logic: Calculate with tax
        return basePrice * (1 + taxRate);
    }
}

// Pattern 2: FluentValidation rules
public class OrderValidator : AbstractValidator<Order>
{
    public OrderValidator()
    {
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be positive")
            .LessThanOrEqualTo(1000).WithMessage("Quantity cannot exceed 1000");
    }
}

// Pattern 3: Business logic in domain models
public class Inventory
{
    public bool CanFulfillOrder(int requestedQuantity)
    {
        // Business Rule: Must have sufficient stock
        return AvailableQuantity >= requestedQuantity;
    }
}
```

**C) Document Calculation Logic**

Search for calculation methods:
```
mcp__azuredevops__search_code
Parameters:
  - searchText: "Calculate OR Compute OR decimal AND return"
  - project: "YourProject"
```

**Calculation Documentation Template:**
```markdown
### Calculation: [Calculation Name]

**Purpose:** [What is being calculated]

**Formula:**
```
Result = BaseValue * Factor + Adjustment
```

**Implementation:**
```csharp
// Code from repository
public decimal CalculateTotalPrice(decimal itemPrice, int quantity, decimal discount)
{
    decimal subtotal = itemPrice * quantity;
    decimal discountAmount = subtotal * discount;
    return subtotal - discountAmount;
}
```

**Input Parameters:**
- itemPrice: decimal - Unit price
- quantity: int - Number of items
- discount: decimal - Discount percentage (0.0 - 1.0)

**Output:** decimal - Final calculated price

**Business Rules Applied:**
- [Rule references]

**Test Cases:**
| Item Price | Quantity | Discount | Expected Result |
|------------|----------|----------|-----------------|
| 10.00 | 5 | 0.1 | 45.00 |

**Code Reference:** [File.cs:LineNumber]
```

#### Step 2.6: Database Query Extraction from Repository

**A) Search for SQL Queries in Code**

```
1. Search for inline SQL:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "SELECT FROM WHERE"
     - project: "YourProject"
     - top: 100

2. Search for stored procedure calls:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "EXEC OR EXECUTE OR sp_ OR usp_"
     - project: "YourProject"

3. Search for Entity Framework queries:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: ".Where( OR .Include( OR .Join("
     - project: "YourProject"

4. Search for Dapper queries:
   mcp__azuredevops__search_code
   Parameters:
     - searchText: "QueryAsync OR ExecuteAsync OR Query<"
     - project: "YourProject"
```

**B) Search for SQL Files in Repository**

```
mcp__azuredevops__search_code
Parameters:
  - searchText: "CREATE TABLE OR ALTER TABLE"
  - project: "YourProject"
  - path: ["Database", "Scripts", "Migrations", "SQL"]
```

**C) Extract and Document Queries**

**SQL Query Documentation Template:**
```markdown
### Query [Number]: [Query Purpose]

**Location:** [FileName.cs:LineNumber or ScriptName.sql]

**Type:** [SELECT/INSERT/UPDATE/DELETE/Stored Procedure]

**Query:**
```sql
SELECT 
    i.ItemId,
    i.ExternalItemId,
    ip.ItemPrice,
    ip.EffectiveDate
FROM Items i
INNER JOIN ItemPricing ip ON i.ItemId = ip.ItemId
WHERE i.ClientId = @ClientId
  AND ip.EffectiveDate <= GETDATE()
  AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate > GETDATE())
ORDER BY i.ExternalItemId
```

**Parameters:**
- @ClientId: int - Client identifier

**Tables Involved:**
- Items (Primary)
- ItemPricing (Joined)

**Purpose:**
Get active pricing for all items belonging to a specific client

**Returns:**
- ItemId: int - Primary key
- ExternalItemId: varchar(100) - SKU
- ItemPrice: decimal(18,4) - Current price
- EffectiveDate: datetime - Price start date

**Used By:**
- [Service/Controller name]
- [API endpoint]

**Business Logic:**
- Only returns active pricing (effective date passed, not expired)
- Results sorted by SKU

**Performance Notes:**
- Index on ItemPricing(ItemId, EffectiveDate)
- Typical execution time: <100ms

**Code Reference:** [Repository/Path/File.cs:LineNumber]
**Related Work Items:** [WI-IDs]
```

**D) Search for Database Migration Scripts**

```
mcp__azuredevops__search_code
Parameters:
  - searchText: "CREATE TABLE OR ALTER TABLE OR CREATE INDEX"
  - path: ["Migrations", "Database", "DbScripts"]
  - project: "YourProject"
```

**E) Document Complete Data Access Layer**

For each major entity/table, document:
1. **CRUD Operations:** All Create/Read/Update/Delete queries
2. **Business Queries:** Complex queries with joins and business logic
3. **Stored Procedures:** Parameters, logic, performance
4. **Migrations:** Schema changes over time

**Example Repository Search Results:**
```csharp
// File: Services/PricingService.cs:145
public async Task<IEnumerable<ItemPricing>> GetActivePricing(int clientId)
{
    var sql = @"
        SELECT 
            i.ItemId,
            i.ExternalItemId,
            ip.ItemPrice,
            ip.EffectiveDate
        FROM Items i
        INNER JOIN ItemPricing ip ON i.ItemId = ip.ItemId
        WHERE i.ClientId = @ClientId
          AND ip.EffectiveDate <= GETDATE()
          AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate > GETDATE())
        ORDER BY i.ExternalItemId";
        
    return await _connection.QueryAsync<ItemPricing>(sql, new { ClientId = clientId });
}
```

---

### Phase 3: Document Structure Creation (1-2 hours)

#### Step 3.1: Create Document Outline

Use this standard template structure:

```markdown
# [Feature Name] - Functional Specification for QA

**Document Version:** 1.0
**Last Updated:** [Date]
**System:** [System Name]
**Module:** [Module Name]

---

## Table of Contents
1. Executive Summary
2. Quick Reference Guide
3. Functional Overview
4. Key Features
5. Business Rules
6. User Workflows
7. Integration Points
8. Test Scenarios
9. Data Requirements
10. Known Issues & Edge Cases
11. Related Jira Tickets
12. Appendix A: [Detailed Specifications]
13. Appendix B: API Endpoints
14. Appendix C: Test Data Sets
15. Appendix D: Recent Releases

---

## Executive Summary
[3-5 sentences describing the feature and its importance]

## Quick Reference Guide
[Tables, checklists, key information for quick lookup]

## Functional Overview
[What the feature does, use cases, workflows]

## Key Features
[Detailed feature descriptions with examples]

## Business Rules
[Validation rules, calculations, logic]

## User Workflows
[Step-by-step user journeys]

## Integration Points
[External systems, APIs, databases]

## Test Scenarios
[Categories of test scenarios]

## Regression Test Scenarios - One Liners
[Detailed test cases in table format]

## Appendices
[Detailed technical information]
```

#### Step 3.2: Populate Each Section

**Section-by-Section Guidance:**

**1. Executive Summary (5-10 minutes)**
- Write 3-5 sentences describing:
  - What the feature is
  - Why it's important
  - Key capabilities
  - Business impact

**2. Quick Reference Guide (15-20 minutes)**
- Create summary tables
- List key fields and their purposes
- Provide upload process steps
- Add visual diagrams if helpful

**3. Functional Overview (20-30 minutes)**
- Describe the feature in detail
- List primary use cases
- Explain how it fits in the overall system

**4. Key Features (30-45 minutes)**
- List each major feature
- Provide examples for each
- Reference Jira tickets
- Include screenshots if available

**5. Business Rules (30-45 minutes)**
- Document all validation rules
- Explain calculation logic
- Define precedence and priority
- Include edge cases

**6. User Workflows (20-30 minutes)**
- Create step-by-step workflows
- Use numbered lists
- Include decision points
- Show error handling

**7. Integration Points (15-20 minutes)**
- List all external systems
- Document data flows
- Explain synchronization logic
- Note API dependencies

**8. Test Scenarios Overview (10-15 minutes)**
- Categorize test scenarios
- Provide category descriptions
- List priority levels

**9. Comprehensive Regression Test Scenarios (3-4 hours)**

Generate test scenarios from ALL collected sources:

**From Work Items:**
- Acceptance criteria → Happy path scenarios
- Bug descriptions → Regression scenarios
- Edge cases mentioned in comments

**From Business Logic Code:**
- Each validation rule → Validation test scenario
- Each if/else branch → Conditional test scenario
- Each calculation → Calculation test scenario
- Each exception thrown → Error handling scenario

**From API Endpoints:**
- Each endpoint → API test scenario
- Each parameter combination → Parameter validation scenario
- Each response code → Response handling scenario
- Authentication/authorization → Security scenarios

**From Database Queries:**
- Each query → Data retrieval scenario
- Each stored procedure → Procedure execution scenario
- Each table constraint → Constraint validation scenario

**Scenario Generation Formula:**
```
Total Scenarios = 
  (Work Item Acceptance Criteria × 2-3) +
  (Business Rules × 3-4) +
  (API Endpoints × 5-7) +
  (Database Operations × 2-3) +
  (Known Bugs × 1-2) +
  (Integration Points × 3-5)

Target: 200-300 comprehensive scenarios
```

**Test Scenario Categories:**
1. **Happy Path (20-30%)** - Normal successful workflows
2. **Validation & Error Handling (25-35%)** - Input validation, business rule violations
3. **API Testing (15-25%)** - Endpoint testing, auth, error responses
4. **Data & Database (10-15%)** - CRUD operations, data integrity
5. **Integration (10-15%)** - Module interactions, external systems
6. **Edge Cases (5-10%)** - Boundary conditions, unusual scenarios
7. **Security (5-10%)** - Auth, authorization, data protection
8. **Performance (5-10%)** - Load, stress, response time
9. **Regression (10-20%)** - Known bug prevention

**Format:**
```markdown
| # | Test Scenario | Category | Priority | Data Required | Expected Result | Source |
|---|--------------|----------|----------|---------------|-----------------|--------|
| R-001 | [Scenario] | [Category] | P0-P2 | [Test Data] | [Expected] | WI-123 / Code:File.cs:45 |
```

**Comprehensive Coverage Checklist:**
- [ ] All acceptance criteria covered
- [ ] All validation rules tested (positive & negative)
- [ ] All API endpoints tested (all HTTP methods)
- [ ] All database queries tested
- [ ] All error scenarios tested
- [ ] All known bugs have regression tests
- [ ] All integration points tested
- [ ] Security scenarios included
- [ ] Performance scenarios included

**10. Appendices (1-2 hours)**
- Detailed specifications
- API endpoints
- Database schema
- Excel file structures
- Recent releases

---

### Phase 4: Content Generation (3-5 hours)

#### Step 4.1: Write Business Rules

**Template:**
```markdown
### BR-[Number]: [Rule Name]

**Description:** [What the rule does]

**Conditions:**
- Condition 1
- Condition 2

**Logic:**
1. Step 1
2. Step 2
3. Step 3

**Example:**
[Input] → [Output]

**Referenced Work Items:** [WI-123]
```

#### Step 4.2: Create Comprehensive Test Scenarios

**Enhanced Scenario Format:**
```markdown
| # | Test Scenario | Category | Priority | Pre-requisites | Test Data | Steps | Expected Result | Source Reference |
|---|--------------|----------|----------|----------------|-----------|-------|-----------------|------------------|
| R-001 | Validate item pricing calculation for standard items | Pricing | P0 | Items exist in DB | ItemId=123, Qty=5 | 1. Get item 2. Calculate price | Price = BasePrice * Qty | Code: PricingService.cs:145 |
```

**Priority Definitions:**
- **P0 (Critical):** Must pass before release, blocker if fails - Core business logic, API endpoints, data integrity
- **P1 (High):** Should pass, significant impact if fails - Validation rules, error handling, integrations
- **P2 (Medium):** Nice to have, minor impact if fails - Edge cases, UI enhancements, performance optimizations

**Test Scenario Generation Strategy:**

**A) From Business Logic (Code Analysis)**
For each business rule found in code, create:
```
1. Happy Path Scenario
2. Boundary Condition Scenarios (min, max, edge values)
3. Invalid Input Scenarios
4. Exception Handling Scenarios

Example from code:
if (quantity < minimumOrderQuantity)
    throw new BusinessRuleException("Order quantity must be at least " + minimumOrderQuantity);

Generated Scenarios:
- R-045: Order with quantity above minimum (valid)
- R-046: Order with quantity equal to minimum (boundary - valid)
- R-047: Order with quantity below minimum (invalid - expect exception)
- R-048: Order with quantity = 0 (invalid)
- R-049: Order with negative quantity (invalid)
```

**B) From API Endpoints (Repository Analysis)**
For each API endpoint found, create:
```
1. Successful request scenario (200 OK)
2. Invalid parameter scenarios (400 Bad Request)
3. Unauthorized access scenario (401)
4. Not found scenario (404)
5. Server error handling (500)
6. Different HTTP methods if applicable

Example from CartController.cs:
[HttpGet("User/{userId}/BusinessUnitId/{businessUnitId}/Person/{personId}")]

Generated Scenarios:
- R-101: GET cart with valid userId, businessUnitId, personId (200 OK)
- R-102: GET cart with invalid userId (404 Not Found)
- R-103: GET cart without authentication token (401 Unauthorized)
- R-104: GET cart with negative userId (400 Bad Request)
- R-105: GET cart with userId of different tenant (403 Forbidden)
```

**C) From Database Queries (Code Search Results)**
For each query, create:
```
1. Data retrieval with results
2. Data retrieval with no results
3. Data insertion/update/delete
4. Constraint violation scenarios
5. Transaction rollback scenarios

Example from SQL query:
WHERE ip.EffectiveDate <= GETDATE() AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate > GETDATE())

Generated Scenarios:
- R-201: Retrieve pricing with current effective date (found)
- R-202: Retrieve pricing with future effective date (not found)
- R-203: Retrieve pricing with past expiration date (not found)
- R-204: Retrieve pricing with NULL expiration date (found)
```

**D) From Known Bugs (Work Items)**
For each bug work item, create:
```
1. Original bug reproduction scenario
2. Fix verification scenario
3. Related edge case scenarios

Example Bug: WI-5432 - Pricing calculation fails for kit items with null price
Generated Scenarios:
- R-301: Calculate price for kit with all items having valid prices (pass)
- R-302: Calculate price for kit with one item having null price (should handle gracefully)
- R-303: Calculate price for kit with multiple null prices (should handle gracefully)
- R-304: Calculate price for empty kit (edge case)
```

**Comprehensive Category Structure:**

**1. Data Validation & Input (20-30 scenarios per module)**
- Field-level validations
- Required field validations
- Format validations (email, phone, date)
- Length validations
- Range validations
- Pattern matching

**2. Business Logic & Rules (30-50 scenarios per module)**
- Calculation accuracy
- Conditional logic branches
- State transitions
- Business rule enforcement
- Precedence rules
- Default value handling

**3. API & Integration (20-40 scenarios)**
- Endpoint availability
- Request/response validation
- Authentication & authorization
- Rate limiting
- Error responses
- CORS handling
- API versioning

**4. Database Operations (15-25 scenarios)**
- CRUD operations
- Query performance
- Data integrity
- Constraint enforcement
- Transaction handling
- Concurrency

**5. Error Handling (15-25 scenarios)**
- Exception handling
- User-friendly error messages
- Logging
- Graceful degradation
- Retry logic

**6. Security (10-20 scenarios)**
- Authentication
- Authorization (role-based)
- Data encryption
- SQL injection prevention
- XSS prevention
- CSRF protection

**7. Performance (10-15 scenarios)**
- Response time
- Load testing
- Concurrent users
- Large data sets
- Caching

**8. Edge Cases & Boundaries (20-30 scenarios)**
- Minimum/maximum values
- Empty/null values
- Special characters
- Large files
- Timeout scenarios

**9. Regression (20-40 scenarios)**
- All previously fixed bugs
- Changed functionality
- Integration points
- Deprecated features

**10. User Workflows (15-25 scenarios)**
- End-to-end flows
- Multi-step processes
- Alternative paths
- Cancel/rollback flows

**Target:** 200-350 comprehensive test scenarios

**Traceability Matrix:**
Every test scenario must link to at least one source:
- Work Item ID (WI-123)
- Code File Reference (FileName.cs:LineNumber)
- API Endpoint (GET /api/cart/{id})
- Database Query Reference (Query #5)
- Business Rule ID (BR-007)
- Wiki Page (API Documentation Page 3)

#### Step 4.3: Document API Endpoints

**Endpoint Template:**
```markdown
### [Endpoint Number]: [Endpoint Name]

```http
[METHOD] /api/path/{parameter}

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Path Parameters:
  - parameter: Description

Request Body:
{
  "field": "value"
}

Response: (200 OK)
{
  "result": "success"
}

Work Item Reference: [TICKET-ID]
Use Case: [When to use this endpoint]
```
```

#### Step 4.4: Create Database Schema Documentation

**Table Documentation Template:**
```markdown
### Table: [TableName]

**Purpose:** [What this table stores]

| Column Name | Data Type | Required | Max Length | Description | Validation Rules | Example |
|-------------|-----------|----------|------------|-------------|------------------|---------|
| [Column] | [Type] | YES/NO | [Length] | [Description] | [Rules] | [Example] |

**Primary Key:** [ColumnName]
**Foreign Keys:**
- [Column] → [ReferencedTable.Column]

**Indexes:**
- [IndexName] ON ([Columns])

**Business Rules:**
- Rule 1
- Rule 2

**Example Data:**
```sql
[Sample INSERT or SELECT]
```

**Referenced Work Items:** [WI-123]
```

#### Step 4.5: Document Excel File Structures

**Sheet Documentation Template:**
```markdown
### Sheet [Number]: [SheetName]

**Purpose:** [What this sheet contains]
**Required:** YES/NO
**Row Limit:** [Typical range]

| Column Name | Data Type | Required | Max Length | Description | Validation Rules | Example |
|-------------|-----------|----------|------------|-------------|------------------|---------|
| [Column] | [Type] | YES/NO | [Length] | [Description] | [Rules] | [Example] |

**Business Rules:**
- Rule 1
- Rule 2

**Example Data:**
```excel
[Column1] | [Column2] | [Column3]
[Value1]  | [Value2]  | [Value3]
```

**Referenced Work Items:** [WI-123]
```

---

### Phase 5: Quality Review & Validation (1-2 hours)

#### Step 5.1: Self-Review Checklist

**Completeness:**
- [ ] All major features documented
- [ ] Business rules clearly defined
- [ ] API endpoints include request/response examples
- [ ] Database schema shows relationships
- [ ] Test scenarios cover all features
- [ ] Jira tickets referenced throughout
- [ ] Examples provided for complex features

**Accuracy:**
- [ ] SQL queries tested (if database access available)
- [ ] API endpoints validated against Jira tickets
- [ ] Business rules match ticket descriptions
- [ ] Excel column names match actual files
- [ ] Table/column names match database

**Clarity:**
- [ ] Technical jargon explained
- [ ] Examples provided for complex concepts
- [ ] Formatting consistent throughout
- [ ] Tables properly formatted
- [ ] Code blocks use correct syntax highlighting

**Usability:**
- [ ] Table of contents complete and linked
- [ ] Quick reference section helpful
- [ ] Test scenarios easy to follow
- [ ] Priority levels clear
- [ ] Navigation easy (internal links work)

#### Step 5.2: Validation with Stakeholders

**Share Draft with:**
- [ ] QA Lead - Review test scenarios
- [ ] Dev Lead - Verify technical accuracy
- [ ] Product Owner - Confirm business rules
- [ ] API Test Engineer - Validate endpoints

**Feedback Collection:**
- Create review checklist
- Set review deadline (3-5 business days)
- Incorporate feedback
- Document changes in revision history

#### Step 5.3: Final Quality Checks

**Run these checks:**

1. **Link Validation**
   - All internal links work
   - Jira ticket links valid
   - No broken references

2. **Format Validation**
   - Tables render correctly
   - Code blocks have syntax highlighting
   - Lists are properly formatted
   - Headers use consistent hierarchy

3. **Content Validation**
   - No placeholder text (e.g., "[TBD]", "[TODO]")
   - All examples realistic
   - Ticket references accurate
   - Version numbers updated

---

### Phase 6: Publishing & Maintenance (30 minutes)

#### Step 6.1: Version Control

**File Naming Convention:**
```
[Feature]_Functional_Specification_QA_v[X.Y].md

Example: RateSheet_Functional_Specification_QA_v1.0.md
```

**Version History:**
```markdown
## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-28 | [Name] | Initial creation |
| 1.1 | 2026-06-15 | [Name] | Added 54 P0 scenarios for Kit Management |
```

#### Step 6.2: Distribution

**Share document with:**
- QA Team (Slack, email, Confluence)
- Development Team
- Product Management
- Technical Documentation Team

**Storage Locations:**
- Git repository (version controlled)
- Confluence (for accessibility)
- SharePoint/OneDrive (for backup)
- Project Wiki (if applicable)

#### Step 6.3: Maintenance Schedule

**Monthly:**
- [ ] Review for outdated information
- [ ] Add new Jira tickets to "Recent Releases"
- [ ] Update API endpoints if changed

**Quarterly:**
- [ ] Major version update
- [ ] Add new test scenarios
- [ ] Update database schema if changed
- [ ] Refresh examples

**Annually:**
- [ ] Complete rewrite review
- [ ] Archive old versions
- [ ] Migrate to new template if needed

---

## Document Structure Template

### Complete Template File

Save this as `Functional_Spec_Template.md`:

```markdown
# [Feature Name] - Functional Specification for QA

**Document Version:** 1.0  
**Last Updated:** [YYYY-MM-DD]  
**System:** [System Name]  
**Module:** [Module/Component Name]  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Quick Reference](#quick-reference)
3. [Functional Overview](#functional-overview)
4. [Key Features](#key-features)
5. [Business Rules](#business-rules)
6. [User Workflows](#user-workflows)
7. [Integration Points](#integration-points)
8. [Test Scenarios](#test-scenarios)
9. [Data Requirements](#data-requirements)
10. [Known Issues & Edge Cases](#known-issues--edge-cases)
11. [Related Jira Tickets](#related-jira-tickets)
12. [Appendix A: Detailed Specifications](#appendix-a-detailed-specifications)
13. [Appendix B: API Endpoints](#appendix-b-api-endpoints)
14. [Appendix C: Test Data Sets](#appendix-c-test-data-sets)
15. [Appendix D: Recent Releases](#appendix-d-recent-releases)

---

## Executive Summary

**[Feature Name]** is a [type of module/feature] within [System Name] that allows [users/administrators] to [primary purpose]. The [Feature Name] system is critical for:

- **[Use Case 1]** - [Brief description]
- **[Use Case 2]** - [Brief description]
- **[Use Case 3]** - [Brief description]

---

## Quick Reference

[Include tables, checklists, key information for quick lookup]

---

## Functional Overview

### What is [Feature Name]?

[Description of the feature]

### Primary Use Cases

1. [Use case 1]
2. [Use case 2]
3. [Use case 3]

---

## Key Features

### 1. [Feature Name]
[Description]

**Referenced Ticket:** [TICKET-ID]

### 2. [Feature Name]
[Description]

---

## Business Rules

### BR-1: [Rule Name]
[Description]

---

## User Workflows

### Workflow 1: [Workflow Name]

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Integration Points

### Integration with [System Name]
[Description]

---

## Test Scenarios

[Overview of test categories]

---

## Regression Test Scenarios - One Liners

### Category 1: [Category Name]

| # | Test Scenario | Priority | Expected Result |
|---|--------------|----------|-----------------|
| R-001 | [Scenario] | P0 | [Expected result] |

---

## Known Issues & Edge Cases

### Issue 1: [Issue Name]
**Ticket:** [TICKET-ID]  
**Description:** [Description]  
**Workaround:** [Workaround if available]  

---

## Related Jira Tickets

### Feature Tickets
- [TICKET-ID] - [Description]

### Bug Fixes
- [TICKET-ID] - [Description]

---

## Appendix A: Detailed Specifications

[Detailed technical specifications]

---

## Appendix B: API Endpoints

### Endpoint 1: [Endpoint Name]

```http
[METHOD] /api/path
```

---

## Appendix C: Test Data Sets

[Sample data for testing]

---

## Appendix D: Recent Releases (Last 6 Months)

**Analysis Period:** [Start Date] - [End Date]  
**Total Tickets Analyzed:** [Number]

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial creation |

---

**Questions or Issues?**  
Contact: [Team Lead or Product Owner]  
Reference Repository: [Link]
```

---

## Content Generation Guidelines

### Writing Style

**Do:**
- ✅ Use active voice ("System validates SKU" not "SKU is validated")
- ✅ Be specific and concrete (include examples)
- ✅ Use consistent terminology
- ✅ Reference Jira tickets for traceability
- ✅ Include real data examples
- ✅ Explain technical terms
- ✅ Use tables for structured data

**Don't:**
- ❌ Use vague language ("might", "could", "sometimes")
- ❌ Assume prior knowledge
- ❌ Skip examples for complex features
- ❌ Use inconsistent naming
- ❌ Leave placeholders in final version
- ❌ Include sensitive data (passwords, API keys)

### Formatting Best Practices

**Tables:**
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
```

**Code Blocks:**
```markdown
```http
GET /api/endpoint
```
```

```markdown
```sql
SELECT * FROM Table;
```
```

**Links:**
```markdown
[Link Text](URL)
[Jira Ticket](https://jira.company.com/browse/TICKET-123)
```

**Internal Links:**
```markdown
[See Business Rules](#business-rules)
```

**Emphasis:**
```markdown
**Bold for important terms**
*Italic for emphasis*
`Code or field names`
```

---

## Quality Checklist

### Before Publishing

#### Content Quality
- [ ] All features documented
- [ ] All business rules defined
- [ ] Examples provided for complex features
- [ ] Jira tickets referenced
- [ ] Test scenarios comprehensive (150-250 minimum)
- [ ] API endpoints validated
- [ ] Database schema accurate
- [ ] Recent releases included

#### Technical Accuracy
- [ ] SQL queries tested
- [ ] API endpoints validated
- [ ] Field names match actual system
- [ ] Business rules match tickets
- [ ] Test data realistic

#### Formatting
- [ ] Table of contents complete
- [ ] All links work
- [ ] Tables formatted correctly
- [ ] Code blocks have syntax highlighting
- [ ] Consistent header hierarchy
- [ ] No formatting errors

#### Completeness
- [ ] No [TBD] or [TODO] placeholders
- [ ] All sections complete
- [ ] Version number updated
- [ ] Revision history updated
- [ ] Author names included

#### Comprehensive Coverage Verification

**Regression Scope Metrics:**
- [ ] Test scenarios: 200-350 documented
- [ ] All acceptance criteria have test scenarios
- [ ] All validation rules have test scenarios (positive + negative)
- [ ] All API endpoints have test scenarios (min 5 per endpoint)
- [ ] All database queries have test scenarios
- [ ] All known bugs have regression test scenarios
- [ ] Test scenario categories: All 10 categories represented
- [ ] Every scenario links to source (work item, code, API, query)
- [ ] Priority distribution: 30% P0, 50% P1, 20% P2

**Business Logic Coverage:**
- [ ] All Service/Manager/Handler classes reviewed
- [ ] All validation rules documented with code references
- [ ] All calculation methods documented with formulas
- [ ] All business exceptions documented
- [ ] All conditional logic branches documented
- [ ] Code references include file name and line number
- [ ] Each business rule has associated test scenarios

**API Endpoint Coverage:**
- [ ] All controllers in repository searched
- [ ] All [HttpGet/Post/Put/Delete] methods documented
- [ ] All request parameters documented
- [ ] All response models documented
- [ ] All authentication requirements documented
- [ ] All error response codes documented
- [ ] Example requests/responses included
- [ ] Each endpoint has 5-7 test scenarios

**Database Query Coverage:**
- [ ] All SELECT queries extracted and documented
- [ ] All INSERT/UPDATE/DELETE queries documented
- [ ] All stored procedure calls documented
- [ ] All Entity Framework queries documented
- [ ] Table relationships documented
- [ ] Query parameters documented
- [ ] Performance metrics included
- [ ] Each query links to code location

**Traceability Matrix:**
- [ ] 100% of test scenarios trace to source
- [ ] 100% of business rules trace to code
- [ ] 100% of API endpoints trace to controller code
- [ ] 100% of queries trace to repository/service code
- [ ] Work item IDs linked where applicable
- [ ] Code file references use format: File.cs:LineNumber

#### Review
- [ ] QA Lead reviewed
- [ ] Dev Lead reviewed
- [ ] Product Owner reviewed
- [ ] Feedback incorporated
- [ ] Final approval received

---

## Automation Scripts

### Script 1: Azure DevOps Work Item Collector

**Purpose:** Automatically collect Azure DevOps work items for documentation

**Usage with Claude Code:**
```
Search Azure DevOps for all work items related to [Feature Name] from the last 6 months. 
Use the Azure DevOps MCP to:
1. Search for work items with keywords: [Feature Name]
2. Group by work item type (User Story, Bug, Task, Feature)
3. Extract for each:
   - Work item ID, title, and state
   - Description and acceptance criteria
   - SQL queries from comments/descriptions
   - API endpoints from descriptions/attachments
   - Test scenarios from acceptance criteria
4. Get related pull requests and commits
5. Export results to a structured Markdown file
```

**MCP Commands to Use:**

```javascript
// 1. Search for feature work items
mcp__azuredevops__search_workitem({
  searchText: "[Feature Name]",
  project: ["YourProject"],
  workItemType: ["User Story", "Feature"],
  top: 100
})

// 2. Search for bugs
mcp__azuredevops__search_workitem({
  searchText: "[Feature Name]",
  project: ["YourProject"],
  workItemType: ["Bug"],
  state: ["Resolved", "Closed"],
  top: 100
})

// 3. Use WIQL for recent items
mcp__azuredevops__wit_query({
  action: "wiql",
  project: "YourProject",
  wiql: `SELECT [System.Id], [System.Title], [System.WorkItemType], [System.State]
         FROM WorkItems
         WHERE [System.TeamProject] = @project
         AND [System.ChangedDate] >= @Today - 180
         AND [System.Title] CONTAINS '[Feature Name]'
         ORDER BY [System.ChangedDate] DESC`,
  top: 100
})
```

### Script 2: Test Scenario Generator

**Purpose:** Generate test scenario tables from Jira tickets

**Template:**
```markdown
| # | Test Scenario | Priority | Expected Result | Ticket Ref |
|---|--------------|----------|-----------------|------------|
| R-{number} | {action} | P{0-2} | {expected} | {ticket} |
```

### Script 3: API Endpoint Extractor

**Purpose:** Extract API endpoints from Azure DevOps work items and wiki

**Discovery Commands:**
```javascript
// 1. Search for API-related work items
mcp__azuredevops__search_workitem({
  searchText: "GET / OR POST / OR PUT / OR DELETE / OR endpoint",
  project: ["YourProject"],
  top: 100
})

// 2. Search code for API controllers
mcp__azuredevops__search_code({
  searchText: "[Route OR [HttpGet] OR [HttpPost]",
  project: "YourProject",
  top: 50
})

// 3. Search wiki for API documentation
mcp__azuredevops__search_wiki({
  searchText: "API endpoint OR REST API",
  project: ["YourProject"],
  top: 30
})
```

**Extract:**
- HTTP Method
- Endpoint Path
- Request Body
- Response Structure
- Headers
- Authentication requirements

---

## Appendix: Tools & Resources

### Essential Tools

| Tool | Purpose | URL |
|------|---------|-----|
| **Azure DevOps** | Work items, repos, wiki, pipelines | https://dev.azure.com/your-org |
| **Azure DevOps MCP** | MCP server for Azure DevOps integration | npm: @azure-devops/mcp |
| **MSSQL MCP** | MCP server for database queries | npm: mssql-mcp |
| **Postman** | API testing | https://www.postman.com |
| **VS Code** | Markdown editing | https://code.visualstudio.com |
| **Claude Code** | AI-assisted documentation | https://claude.ai/code |
| **TableConvert** | Table formatting | https://tableconvert.com |
| **Mermaid** | Diagrams | https://mermaid.js.org |

### Azure DevOps MCP Setup

**Install:**
```bash
npm install -g @azure-devops/mcp
```

**Configure in `.claude/settings.json`:**
```json
{
  "mcpServers": {
    "azuredevops": {
      "command": "npx",
      "args": ["-y", "@azure-devops/mcp", "YourOrgName", "--authentication", "env"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/YourOrg",
        "AZURE_DEVOPS_PAT": "your_pat_token"
      }
    }
  }
}
```

**Get Azure DevOps PAT:**
1. Go to `https://dev.azure.com/[org]/_usersSettings/tokens`
2. Click "New Token"
3. Grant required permissions:
   - **Work Items: Read**
   - **Code: Read**
   - **Build: Read**
   - **Release: Read**
   - **Wiki: Read**
4. Copy token and add to `.claude/settings.json`

**Key Azure DevOps MCP Tools:**
- `mcp__azuredevops__search_workitem` - Search work items
- `mcp__azuredevops__wit_work_item` - Get work item details
- `mcp__azuredevops__wit_query` - Execute WIQL queries
- `mcp__azuredevops__search_code` - Search code repositories
- `mcp__azuredevops__search_wiki` - Search wiki pages
- `mcp__azuredevops__wiki` - Get wiki content
- `mcp__azuredevops__repo_pull_request` - Get PR information
- `mcp__azuredevops__pipelines_build` - Get build information

### MS SQL MCP Setup (Optional)

**Install:**
```bash
npm install -g mssql-mcp
```

**Configure in `.claude/settings.json`:**
```json
{
  "mcpServers": {
    "mssql": {
      "command": "npx",
      "args": ["-y", "mssql-mcp"],
      "env": {
        "DB_SERVER": "your-sql-server.database.windows.net",
        "DB_DATABASE": "YourDatabase",
        "DB_USER": "username",
        "DB_PASSWORD": "password",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "true",
        "DB_TRUST_SERVER_CERTIFICATE": "false"
      }
    }
  }
}
```

**Key MSSQL MCP Tools:**
- `mcp__mssql__mssql_list_databases` - List all databases
- `mcp__mssql__mssql_list_schema_objects` - List tables, views, procedures
- `mcp__mssql__mssql_describe_table_columns` - Get table schema
- `mcp__mssql__mssql_read_table_rows` - Read table data
- `mcp__mssql__mssql_run_sql_query` - Execute custom SQL

### Markdown Cheat Sheet

**Headers:**
```markdown
# H1
## H2
### H3
```

**Lists:**
```markdown
- Bullet point
1. Numbered list
- [ ] Checkbox
```

**Tables:**
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

**Code:**
```markdown
`inline code`

```language
code block
```
```

**Links:**
```markdown
[Text](URL)
[Internal Link](#section-name)
```

---

## Example: Following This Workflow

### Real Example: RateSheet Documentation

**Step 1: Discovery (30 min)**
- Feature: RateSheet Management
- Keywords: "RateSheet", "Rate Management", "ItemPricing", "pricing", "tax code"
- Azure DevOps Project: Identified target project and area paths
- Goal: Complete functional spec with 200+ test scenarios

**Step 2: Azure DevOps Collection (2 hours)**
- Used `mcp__azuredevops__search_workitem` with searchText: "RateSheet OR Rate Management"
- Found 300+ work items
- Categorized: 50 features/stories, 100 bugs, 50 API-related tasks, 50 recent releases
- Retrieved full details using `mcp__azuredevops__wit_work_item` for key items

**Step 3: Information Extraction (2 hours)**
- Extracted 7 Excel sheet structures from work item descriptions and attachments
- Found 15+ API endpoints from work items and wiki pages using `mcp__azuredevops__search_wiki`
- Discovered database schema from SQL queries in work item comments
- Used `mcp__azuredevops__wit_query` with WIQL to get 50 recent releases
- Retrieved related commits using `mcp__azuredevops__repo_search_commits`

**Step 4: Document Creation (4 hours)**
- Created outline (15 min)
- Wrote Executive Summary (10 min)
- Documented Excel file structure (1 hour)
- Created database schema (1 hour)
- Generated 187 test scenarios (1.5 hours)
- Documented 30+ API endpoints (45 min)

**Step 5: Review (1 hour)**
- Self-review with checklist
- Fixed formatting issues
- Validated Azure DevOps work item references
- Verified wiki page links
- Added missing examples

**Step 6: Publishing (15 min)**
- Versioned as v1.0
- Shared with QA team
- Uploaded to Azure DevOps Git repository
- Posted link in Teams/Slack
- Optionally published to Azure DevOps Wiki for team access

**Total Time:** ~10 hours
**Output:** 2000+ line comprehensive specification

---

## Tips for Success

### Time Management
- **Dedicate focused blocks:** 2-3 hour sessions
- **Don't aim for perfection:** Get 80% done, then refine
- **Use templates:** Copy structure from previous docs
- **Automate collection:** Use scripts and MCPs
- **Batch similar tasks:** Collect all tickets at once

### Common Pitfalls to Avoid
- ❌ Trying to document everything in one sitting
- ❌ Not referencing Azure DevOps work items
- ❌ Skipping examples
- ❌ Inconsistent formatting
- ❌ Not getting stakeholder review
- ❌ Forgetting to version the document

### Quality Accelerators
- ✅ Start with a template
- ✅ Use Azure DevOps MCP and MSSQL MCP for automation
- ✅ Leverage Azure DevOps Wiki for existing documentation
- ✅ Copy examples from similar docs
- ✅ Get early feedback (don't wait for perfection)
- ✅ Update incrementally
- ✅ Keep it simple and clear

---

## Conclusion

This workflow enables you to create comprehensive functional specification documents by:

1. **Systematically gathering** information from Azure DevOps (work items, wiki, code, pipelines) and databases
2. **Organizing** content in a consistent, reusable structure
3. **Documenting** features, APIs, schemas, and test scenarios
4. **Validating** accuracy with stakeholders
5. **Maintaining** documents over time

**Key Data Sources:**
- **Work Items:** User stories, bugs, tasks, features
- **Azure DevOps Wiki:** Technical documentation, API specs
- **Code Search:** API controllers, endpoint definitions
- **Commits & PRs:** Implementation details, code changes
- **Build/Release Logs:** Production releases, deployments
- **Database (via MSSQL MCP):** Schema, relationships, sample data

**Expected Output Quality:**

**Quantitative Metrics:**
- **200-350 regression test scenarios** with full source traceability
- **15-30 business rules** documented with code references
- **10-40 API endpoints** fully documented with request/response examples
- **15-50 database queries** extracted and documented
- **50-100+ Azure DevOps work item references**
- **25-75+ code file references** (File.cs:LineNumber format)
- **10-30+ wiki page links** for technical documentation
- **3000-5000 lines** of comprehensive documentation

**Qualitative Metrics:**
- **100% traceability:** Every test scenario links to source
- **100% API coverage:** All endpoints in repository documented
- **100% business rule coverage:** All validation/calculation logic documented
- **100% query coverage:** All SQL queries in code documented
- **Comprehensive test types:** All 10 test categories represented
- **Code-level accuracy:** Direct extraction from source code, not assumptions
- **Maintainable:** Easy to update when code/requirements change

**Coverage Breakdown:**
```
Regression Scenarios (200-350):
├── Data Validation (20-30)
├── Business Logic (30-50)
├── API Endpoints (20-40)
├── Database Operations (15-25)
├── Error Handling (15-25)
├── Security (10-20)
├── Performance (10-15)
├── Edge Cases (20-30)
├── Regression (20-40)
└── User Workflows (15-25)

Business Logic (15-30 rules):
├── Validation Rules (40%)
├── Calculation Logic (25%)
├── Conditional Logic (20%)
└── State Transitions (15%)

API Endpoints (10-40):
├── GET endpoints (35%)
├── POST endpoints (30%)
├── PUT endpoints (20%)
└── DELETE endpoints (15%)

Database Queries (15-50):
├── SELECT queries (50%)
├── INSERT/UPDATE/DELETE (25%)
├── Stored Procedures (15%)
└── EF/LINQ queries (10%)
```

**Time Investment:**
- Initial creation: 8-12 hours
- Maintenance: 1-2 hours/month
- Major updates: 4-6 hours/quarter

---

**Need Help?**
- Reference: `RateSheet_Functional_Specification_QA.md` as example
- Tools: Claude Code with Azure DevOps MCP and MSSQL MCP
- Azure DevOps Wiki: Check for existing documentation templates
- Contact: QA Documentation Team

**Complete Quick Start Command for Claude Code:**
```
"Using Azure DevOps MCP, create a COMPREHENSIVE functional specification document for [Feature Name]. 

REGRESSION SCOPE - Generate 200+ test scenarios from:
- All acceptance criteria from work items
- Every validation rule in the code
- All API endpoints in the repository
- All database queries and stored procedures
- All known bugs (regression prevention)
- Integration points and workflows

BUSINESS LOGIC - Extract and document:
- All business rules from Services/Managers/Handlers
- Validation logic (FluentValidation, attributes, custom validators)
- Calculation formulas and algorithms
- Conditional logic and decision trees
- State machine transitions
- Error handling and exceptions

API ENDPOINTS - Search code repository for:
- All [ApiController] and [Route] attributes
- HTTP methods ([HttpGet], [HttpPost], [HttpPut], [HttpDelete])
- Request/response models
- Authorization requirements
- Query parameters and path variables
- Document each endpoint with full request/response examples

DATABASE QUERIES - Extract from repository:
- All SQL queries (SELECT, INSERT, UPDATE, DELETE)
- Stored procedure calls (EXEC, sp_, usp_)
- Entity Framework queries (.Where, .Include, .Join)
- Dapper queries (QueryAsync, ExecuteAsync)
- Database migration scripts
- Document with table relationships and performance notes

SOURCES TO SEARCH:
1. Work Items: Use search_workitem for user stories, bugs, tasks
2. Wiki: Use search_wiki for API docs and technical specs
3. Code: Use search_code for controllers, services, SQL queries
4. Commits: Use repo_search_commits for recent changes
5. Database: Use MSSQL MCP tools if configured

OUTPUT: Structured Markdown with:
- Executive Summary
- 200-350 regression test scenarios (with source traceability)
- Complete business logic documentation (with code references)
- All API endpoints (with request/response examples)
- All database queries (with table schemas)
- Full traceability to work items and code"
```

---

## Complete Example Output Structure

### Example: Pricing Module Documentation

**What Gets Generated:**

**1. Regression Scope (285 Test Scenarios)**
```markdown
## Regression Test Scenarios

### A. Data Validation (42 scenarios)
| # | Test Scenario | Category | Priority | Source |
|---|--------------|----------|----------|--------|
| R-001 | Validate item price is positive decimal | Validation | P0 | Code: PricingService.cs:87 |
| R-002 | Validate item price maximum 999999.99 | Validation | P0 | Code: ItemPricing.cs:45, WI-1234 |
| R-003 | Reject negative price with error message | Validation | P0 | Code: PricingValidator.cs:12 |
...

### B. Business Logic (68 scenarios)
| # | Test Scenario | Category | Priority | Source |
|---|--------------|----------|----------|--------|
| R-043 | Calculate price with standard tax rate | Calculation | P0 | Code: TaxCalculator.cs:156 |
| R-044 | Apply client-specific pricing override | Business Rule | P0 | WI-2345, Code: PricingService.cs:234 |
| R-045 | Handle kit pricing with component pricing | Business Rule | P1 | Code: KitPricingService.cs:89 |
...

### C. API Endpoints (95 scenarios)
| # | Test Scenario | Category | Priority | Source |
|---|--------------|----------|----------|--------|
| R-111 | GET /api/pricing/{itemId} returns 200 OK | API | P0 | Code: PricingController.cs:45 |
| R-112 | POST /api/pricing creates new price | API | P0 | Code: PricingController.cs:78 |
| R-113 | PUT /api/pricing/{id} with invalid auth returns 401 | API | P0 | Code: PricingController.cs:45 |
...

### D. Database Operations (38 scenarios)
| # | Test Scenario | Category | Priority | Source |
|---|--------------|----------|----------|--------|
| R-206 | Retrieve active pricing for client | Database | P0 | Code: PricingRepository.cs:123 (SQL Query) |
| R-207 | Insert pricing with effective date constraint | Database | P0 | Migration: 20240115_AddPricingTable.sql |
| R-208 | Update pricing maintains audit trail | Database | P1 | Code: PricingRepository.cs:189 |
...

### E. Known Bug Regression (22 scenarios)
| # | Test Scenario | Category | Priority | Source |
|---|--------------|----------|----------|--------|
| R-267 | Kit pricing handles null component prices | Regression | P0 | Bug WI-5432, Fixed in WI-5450 |
| R-268 | Effective date comparison uses UTC | Regression | P1 | Bug WI-5621, Code: PricingService.cs:267 |
...

### F. Integration & Performance (20 scenarios)
[Additional scenarios...]
```

**2. Business Logic Documentation (15 Rules)**
```markdown
## Business Rules

### BR-001: Price Validation
**Source:** PricingValidator.cs:12-45
**Description:** Item prices must be positive decimals with max 2 decimal places
**Logic:**
```csharp
if (price <= 0 || price > 999999.99m)
    throw new ValidationException("Price must be between 0.01 and 999999.99");
```
**Test Scenarios:** R-001, R-002, R-003

### BR-002: Tax Calculation
**Source:** TaxCalculator.cs:156-178
**Description:** Calculate tax based on item tax code and customer location
**Formula:** `TotalPrice = (BasePrice * Quantity) * (1 + TaxRate)`
**Conditions:**
- Tax rate retrieved from TaxCodes table
- Location determines applicable tax jurisdiction
- Tax-exempt items have rate = 0
**Test Scenarios:** R-043, R-044, R-045, R-046
...
```

**3. API Endpoint Documentation (12 Endpoints)**
```markdown
## API Endpoints

### Endpoint 1: Get Item Pricing
**Source:** PricingController.cs:45-62

```http
GET /api/pricing/{itemId}?clientId={clientId}&effectiveDate={date}
Authorization: Bearer {token}

Path Parameters:
  - itemId: int - Item identifier (required)

Query Parameters:
  - clientId: int - Client identifier (optional)
  - effectiveDate: datetime - Effective date (optional, defaults to today)

Response: 200 OK
{
  "itemId": 123,
  "basePrice": 45.99,
  "clientPrice": 42.99,
  "effectiveDate": "2026-01-15T00:00:00Z",
  "expirationDate": null,
  "taxCode": "STANDARD"
}

Error Responses:
  - 400 Bad Request: Invalid itemId
  - 401 Unauthorized: Missing/invalid token
  - 404 Not Found: Item not found
```

**Business Logic Applied:** BR-001, BR-004
**Related Queries:** Q-003, Q-007
**Test Scenarios:** R-111 through R-125
**Code Reference:** Controllers/PricingController.cs:45
...
```

**4. Database Query Documentation (18 Queries)**
```markdown
## Database Queries

### Query 3: Get Active Client Pricing
**Source:** PricingRepository.cs:123-145
**Type:** SELECT with JOIN

```sql
SELECT 
    ip.ItemId,
    ip.ItemPrice AS BasePrice,
    cp.ClientPrice,
    ip.EffectiveDate,
    ip.ExpirationDate,
    tc.TaxCode
FROM ItemPricing ip
LEFT JOIN ClientPricing cp ON ip.ItemId = cp.ItemId AND cp.ClientId = @ClientId
INNER JOIN TaxCodes tc ON ip.TaxCodeId = tc.TaxCodeId
WHERE ip.ItemId = @ItemId
  AND ip.EffectiveDate <= @EffectiveDate
  AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate > @EffectiveDate)
ORDER BY cp.ClientPrice DESC, ip.ItemPrice DESC
```

**Parameters:**
- @ItemId: int - Item to retrieve pricing for
- @ClientId: int - Client for override pricing (nullable)
- @EffectiveDate: datetime - Date to check pricing against

**Tables:**
- ItemPricing (main) - Base pricing table
- ClientPricing (left join) - Client-specific overrides
- TaxCodes (inner join) - Tax code lookup

**Business Logic:**
- Returns active pricing based on effective/expiration dates
- Client pricing overrides base pricing if available
- Results ordered to prioritize client pricing

**Performance:**
- Indexes: IX_ItemPricing_ItemId_EffectiveDate, IX_ClientPricing_ItemId_ClientId
- Typical execution: <50ms
- Cached for 5 minutes

**Used By:**
- API: GET /api/pricing/{itemId}
- Service: PricingService.GetItemPrice()

**Test Scenarios:** R-206, R-207, R-215, R-223
...
```
```
