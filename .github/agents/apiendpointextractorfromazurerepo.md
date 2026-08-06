# API Endpoint Extractor Workflow

**Purpose:** Extract and document all API endpoints from Azure DevOps repositories to create comprehensive API endpoint inventories for testing automation.

**Output Location:** `NextGenAutomation/NextGenAutomation/APIEndPointsSummary/`

**Created:** 2026-05-26

---

## Overview

This workflow enables systematic extraction of API endpoint information from ASP.NET Core Web API projects hosted in Azure DevOps repositories. The process leverages Azure DevOps MCP tools to explore repositories and generate structured documentation similar to the WorkCenterAPI_Endpoints.md reference format.

---

## Prerequisites

### Tools Required:
1. **Azure DevOps MCP Server** - Configured and authenticated
2. **Claude Code** - With Azure DevOps integration
3. **Reference Template** - WorkCenterAPI_Endpoints.md as format guide

### Azure DevOps Access:
- Project: **BrandBuilder**
- Required Permissions: Repository read access
- Authentication: OAuth or PAT token configured in MCP

### Target Repository Structure:
- ASP.NET Core Web API projects
- Controllers located in `/src/WebApi/Controllers/`
- Standard MVC attribute-based routing

---

## Step-by-Step Workflow

### **Step 1: Identify Target Repository**

**Input Required:**
- Azure DevOps repository URL
- Example: `https://dev.azure.com/BrandMuscle/BrandBuilder/_git/CheckoutAPI`

**Extract Information:**
- Organization: `BrandMuscle`
- Project: `BrandBuilder`
- Repository: `CheckoutAPI`

---

### **Step 2: Explore Repository Structure**

**Tool:** `mcp__azuredevops__repo_list_directory`

**Parameters:**
```json
{
  "project": "BrandBuilder",
  "repositoryId": "CheckoutAPI",
  "path": "/",
  "recursive": true,
  "recursionDepth": 3
}
```

**Purpose:**
- Understand repository layout
- Locate Controllers directory
- Identify project structure (src/WebApi pattern)

**Expected Output:**
```
/src/WebApi/Controllers/
  - Controller1.cs
  - Controller2.cs
  - Controller3.cs
```

---

### **Step 3: List All Controllers**

**Tool:** `mcp__azuredevops__repo_list_directory`

**Parameters:**
```json
{
  "project": "BrandBuilder",
  "repositoryId": "CheckoutAPI",
  "path": "/src/WebApi/Controllers",
  "recursive": false
}
```

**Purpose:**
- Get complete list of controller files
- Count total controllers
- Identify controller naming patterns

**Expected Output:**
```
- AddressController.cs
- CartController.cs
- PaymentController.cs
... (list of all controllers)
```

---

### **Step 4: Read Controller Source Code (Parallel)**

**Tool:** `mcp__azuredevops__repo_get_file_content`

**Strategy:** Read all controller files in parallel for efficiency

**Parameters (for each controller):**
```json
{
  "project": "BrandBuilder",
  "repositoryId": "CheckoutAPI",
  "path": "/src/WebApi/Controllers/ControllerName.cs"
}
```

**Purpose:**
- Extract all HTTP method attributes ([HttpGet], [HttpPost], etc.)
- Identify route patterns
- Document parameters and return types
- Capture XML documentation comments

**Example Parallel Call:**
```
Read AddressController.cs
Read CartController.cs  
Read PaymentController.cs
... (all controllers in parallel)
```

---

### **Step 5: Parse Controller Endpoints**

**For Each Controller File, Extract:**

1. **Route Attribute:** `[Route("[controller]")]` or custom route
2. **HTTP Methods:** 
   - `[HttpGet]`
   - `[HttpPost]`
   - `[HttpPut]`
   - `[HttpPatch]`
   - `[HttpDelete]`

3. **Route Templates:**
   ```csharp
   [HttpGet("{addressId}")]
   [HttpPost("Create")]
   [HttpDelete("OrderLine")]
   ```

4. **Parameters:**
   - Path parameters: `{addressId}`, `{orderId}`
   - Query parameters: `[FromQuery]`
   - Body parameters: `[FromBody]`

5. **Return Types:**
   ```csharp
   ActionResult<Address>
   ActionResult<List<OrderLine>>
   Task<ActionResult<bool>>
   ```

6. **Purpose (from code context):**
   - Method names
   - XML comments
   - Parameter names

---

### **Step 6: Categorize Endpoints**

**Classification Criteria:**

**Usage Priority:**
- ⭐⭐⭐ **Very High:** Core CRUD, primary workflows, critical business logic
- ⭐⭐ **Medium:** Secondary operations, supporting functions
- ⭐ **Low:** Debug, audit, export, admin functions

**Complexity Level:**
- ⚠️ **Very High:** Multiple integrations, complex business rules, workflows
- ⚠️ **High:** Business logic, external API calls, validation
- ⚠️ **Medium:** Data retrieval, simple operations
- ⚠️ **Low:** Configuration, simple CRUD

**Endpoint Types:**
- GET: Data retrieval
- POST: Create operations, queries, searches
- PUT: Full updates, bulk operations
- PATCH: Partial updates
- DELETE: Delete operations

---

### **Step 7: Identify Top 5 Critical Endpoints**

**Selection Criteria:**
1. **Business Impact:** Core checkout flow, order submission, payment
2. **Usage Frequency:** Called on every cart operation, every checkout
3. **Complexity:** Multi-step workflows, integrations
4. **Dependencies:** Other endpoints depend on these
5. **User-Facing:** Directly impacts user experience

**Example Top 5:**
```
1. GET /Cart - Primary cart retrieval
2. POST /Cart/SubmitOrder - Order submission
3. POST /Cart/CreateOrderLines - Add to cart
4. GET /Payment/PaymentMethods - Payment options
5. POST /Workflow/Page - Workflow orchestration
```

---

### **Step 8: Document Technical Architecture**

**Extract from Code:**

1. **Framework & Patterns:**
   - ASP.NET Core version
   - Design patterns (Manager, Repository, Adapter)
   - Dependency injection usage

2. **Authentication:**
   - JWT/Claims-based
   - User context extraction methods
   - Authorization attributes

3. **External Integrations:**
   - HttpClient dependencies (IOrderManagementClient, etc.)
   - Third-party APIs (Authorize.Net, Camunda, etc.)
   - Database connections (MongoDB, SQL Server)

4. **Key Technologies:**
   - Search engines (Elasticsearch)
   - Message queues (Azure Service Bus)
   - Workflow engines (Camunda BPM)
   - Payment gateways

---

### **Step 9: Create Workflow Documentation**

**Identify Critical Workflows:**

1. **Standard Checkout Flow:**
   ```
   GET /Cart
   ↓
   POST /Workflow/Page
   ↓
   GET /Payment/PaymentMethods
   ↓
   POST /Cart/SubmitOrder
   ```

2. **Add to Cart Flow:**
   ```
   GET /Cart/ShoppingCartOrder
   ↓
   POST /Cart/CreateOrderLines
   ↓
   GET /Cart
   ```

3. **Other Domain-Specific Flows**

---

### **Step 10: Generate Statistics**

**Calculate:**
- Total controllers
- Total endpoints
- Breakdown by HTTP method (GET, POST, PUT, PATCH, DELETE)
- Percentage distribution
- Largest controller (endpoint count)
- Complexity distribution

**Example:**
```
Total Controllers: 13
Total Endpoints: 79
GET: 46 (58%)
POST: 18 (23%)
PUT: 9 (11%)
DELETE: 5 (6%)
PATCH: 1 (1%)
```

---

### **Step 11: Write Documentation File**

**Tool:** `Write`

**File Location:**
```
NextGenAutomation/NextGenAutomation/APIEndPointsSummary/{RepositoryName}_Endpoints.md
```

**Document Structure (Based on WorkCenterAPI_Endpoints.md):**

```markdown
# {RepositoryName}API - Complete API Endpoint Inventory

**Total Endpoints:** {count} across {controllerCount} controllers

---

## Most Frequently Used / Core API Endpoints

### 🔥 **TOP 5 CRITICAL ENDPOINTS**
1. ...
2. ...

---

## API Endpoints by Controller

### 1. **ControllerName** (`/route`) - {count} endpoints
**Primary Purpose:** ...

| Method | Endpoint | Purpose | Usage |
|--------|----------|---------|-------|
| GET | `/path` | Description | ⭐⭐⭐ Very High |

**Complexity:** ⚠️ Level - Description

---

## Technical Architecture
...

## Usage Recommendations for Testing
...

## API Endpoint Statistics
...
```

---

## Output Format Template

### **Section 1: Overview**
- Total endpoints count
- Total controllers count
- Repository purpose

### **Section 2: Top 5 Critical Endpoints**
- Ranked by business importance
- Include full endpoint path and method

### **Section 3: Endpoints by Controller**
- Group by controller
- Table format with Method, Endpoint, Purpose, Usage
- Complexity rating
- Key features section

### **Section 4: Technical Architecture**
- Framework and technologies
- Design patterns
- Authentication/authorization
- External integrations

### **Section 5: Workflows**
- Critical user flows
- Step-by-step endpoint sequences
- Workflow diagrams (text-based)

### **Section 6: Statistics**
- Endpoint count by type
- Percentage breakdowns
- Complexity distribution

### **Section 7: Testing Recommendations**
- High priority endpoints for automation
- Medium priority endpoints
- Low priority endpoints

---

## Tools Reference

### **Azure DevOps MCP Tools Used:**

1. **mcp__azuredevops__repo_list_directory**
   - Purpose: Navigate repository structure
   - Returns: File and folder listings
   - Parameters: project, repositoryId, path, recursive, recursionDepth

2. **mcp__azuredevops__repo_get_file_content**
   - Purpose: Read source code files
   - Returns: File content as text
   - Parameters: project, repositoryId, path, version (optional)

3. **mcp__azuredevops__search_code** (optional)
   - Purpose: Search for specific patterns
   - Returns: Code search results
   - Parameters: searchText, repository, project

---

## Example Workflow Execution

### **Target: CheckoutAPI Repository**

**Command Sequence:**
```
1. List directory: / (recursive=true, depth=3)
   → Identify structure: /src/WebApi/Controllers/

2. List directory: /src/WebApi/Controllers (recursive=false)
   → Found 13 controller files

3. Read files (parallel):
   - AddressController.cs
   - CartController.cs
   - PaymentController.cs
   - ConfigurationController.cs
   - FulfillmentScheduleController.cs
   - FundController.cs
   - JobsController.cs
   - LocationsController.cs
   - PersonController.cs
   - RatingreviewController.cs
   - RulesController.cs
   - UserController.cs
   - WorkflowController.cs

4. Parse and analyze:
   - Extract 79 total endpoints
   - Categorize by usage and complexity
   - Identify top 5 critical endpoints

5. Generate documentation:
   - Write to CheckoutAPI_Endpoints.md
   - Follow WorkCenterAPI_Endpoints.md format
```

---

## Quality Checklist

### **Before Finalizing Documentation:**

- [ ] All controllers documented
- [ ] All endpoints have method, path, purpose, usage rating
- [ ] Top 5 critical endpoints identified
- [ ] Complexity ratings assigned
- [ ] Technical architecture section complete
- [ ] At least 2-3 critical workflows documented
- [ ] Statistics calculated and accurate
- [ ] Testing recommendations provided
- [ ] External integrations identified
- [ ] Authentication/authorization documented
- [ ] Format matches reference template
- [ ] Markdown formatting validated
- [ ] File saved in correct location

---

## Completed Examples

### **Successfully Documented APIs:**

1. **WorkCenterAPI_Endpoints.md** (Reference Template)
   - 35 endpoints across 8 controllers
   - Search, Orders, Actions, Subscription, Ingest controllers

2. **CheckoutAPI_Endpoints.md**
   - 79 endpoints across 13 controllers
   - Cart, Payment, Workflow, Address controllers
   - Camunda BPM integration documented

3. **CheckoutRulesAPI_Endpoints.md**
   - 17 endpoints across 3 controllers
   - Quantity restrictions, Chase loans, Approval rules
   - MongoDB integration documented

---

## Tips & Best Practices

### **Efficiency:**
- Read all controller files in parallel (single message, multiple tool calls)
- Use recursive directory listing to map structure quickly
- Cache controller content in context for analysis

### **Accuracy:**
- Cross-reference route attributes at controller and method level
- Document both simple and complex route patterns
- Include query parameters and body parameters
- Note optional vs required parameters

### **Completeness:**
- Don't skip "internal" or "admin" endpoints
- Document authentication requirements
- Include error response patterns
- Note any special headers or authorization

### **Formatting:**
- Use consistent emoji for ratings (⭐ for usage, ⚠️ for complexity)
- Maintain table alignment
- Use code blocks for examples
- Include links where applicable

### **Business Context:**
- Method names often indicate purpose (GetCart, SubmitOrder, etc.)
- Parameters suggest use cases (orderId, businessUnitId, etc.)
- Return types indicate data structure
- Group related endpoints together

---

## Troubleshooting

### **Issue: Controller file too large**
**Solution:** Azure DevOps may return error for very large files. Read in chunks or use search to find specific patterns.

### **Issue: Repository structure different**
**Solution:** Adjust path based on actual structure. Common patterns:
- `/src/WebApi/Controllers/`
- `/Controllers/`
- `/Api/Controllers/`
- `/src/API/Controllers/`

### **Issue: Missing route information**
**Solution:** Check for:
- Route attribute at controller level
- RoutePrefix attribute (older ASP.NET)
- Convention-based routing in Startup.cs/Program.cs
- Area attributes

### **Issue: Complex nested routes**
**Solution:** Combine controller route + method route to form full path
- Controller: `[Route("api/[controller]")]`
- Method: `[HttpGet("{id}")]`
- Full path: `GET /api/ControllerName/{id}`

---

## Future Enhancements

### **Potential Automations:**
1. Auto-generate Postman collections from endpoint documentation
2. Create test case templates for high-priority endpoints
3. Generate API client code from documented endpoints
4. Build endpoint dependency graphs
5. Auto-detect breaking changes between versions

### **Additional Metadata to Capture:**
- Request/response schemas
- Sample payloads
- Error codes and messages
- Rate limiting information
- Versioning strategy
- Deprecation notices

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-05-26 | Initial workflow documentation | Claude Code |

---

## Related Files

- **Reference Template:** [WorkCenterAPI_Endpoints.md](../APIEndPointsSummary/WorkCenterAPI_Endpoints.md)
- **Output Examples:**
  - [CheckoutAPI_Endpoints.md](../APIEndPointsSummary/CheckoutAPI_Endpoints.md)
  - [CheckoutRulesAPI_Endpoints.md](../APIEndPointsSummary/CheckoutRulesAPI_Endpoints.md)

---

## Contact & Support

For questions or improvements to this workflow:
- Review completed examples in `APIEndPointsSummary/` directory
- Reference Azure DevOps MCP tool documentation
- Consult Claude Code documentation for tool usage
