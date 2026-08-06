# API Endpoint Automation Workflow

## Overview

This document provides a standardized workflow for extracting endpoint details from Swagger documentation, documenting parameters and schemas, and gathering realistic test data using **SQL MCP** integration. This process creates comprehensive JSON test data files ready for API automation implementation.

---

## Table of Contents

1. [Workflow Structure](#workflow-structure)
2. [Step 1: Context & Planning](#step-1-context--planning)
3. [Step 2: Endpoints Overview](#step-2-endpoints-overview)
4. [Step 3: Implementation Plan](#step-3-implementation-plan)
5. [Step 4: Test Data Gathering via SQL MCP](#step-4-test-data-gathering-via-sql-mcp)
6. [Step 5: Create JSON Test Data File](#step-5-create-json-test-data-file)
7. [Complete Example: Order Management Items API](#complete-example-order-management-items-api)

---

## Workflow Structure

Every API automation project should follow this standardized workflow:

```
1. Context & Planning
   ├─ Define API scope and goals
   ├─ Identify Swagger documentation
   ├─ Reference existing patterns
   └─ Use Azure MCP to explore related files

2. Endpoints Overview
   ├─ Extract from Swagger JSON
   ├─ Categorize by HTTP method
   └─ Document parameters and responses

3. Implementation Plan
   └─ File structure planning

4. Test Data Gathering (SQL MCP)
   ├─ Execute SQL queries per endpoint
   ├─ Validate data relationships
   └─ Document data sources

5. JSON Test Data File
   ├─ Create APITestData/{apiname}.json
   ├─ Use FLAT key-value structure
   ├─ Include both valid and invalid test values
   └─ No nested objects or arrays
```

---

## Step 1: Context & Planning

### 1.1 Define Context

Create a clear context for your API automation project:

```markdown
# Automate {API Name} - {Section Name} ({N} Endpoints)

## Context

The {API Name} has {N} endpoints in the "{Section}" section that need to be automated.

**Current State:**
- API Base URL: https://api-i.stage.brandmuscle.net/api/{api-name}/{version}
- Swagger Documentation: https://api-i.stage.brandmuscle.net/api/{api-name}/{version}/swagger/index.html
- Existing Test Infrastructure: [Yes/No]
  - If Yes: List existing test files and coverage
  - If No: This will be the initial implementation

**Reference Documentation:**
- This Workflow Guide: `NextGenAutomation/AgentFile/apiendpointdetailscollector.md`
- MCP Configuration Guide: `NextGenAutomation/AgentFile/mcpconfigagent.md`
- Swagger Documentation: API-specific Swagger UI URLs

**Goal:**
Document all {N} endpoints in the {Section} section and prepare test data using:
- ✅ **SQL MCP** - Query real test data from CentivPOS database
- ✅ **Azure MCP** - Explore related files and patterns
- ✅ **JSON Test Data** - Store test data in APITestData/{apiname}.json with SQL sources
- ✅ **Swagger Documentation** - Extract complete endpoint details and schemas
```

### 1.2 Use Azure MCP to Explore Related Files

**Azure MCP Capabilities:**
- Search for existing API documentation patterns
- Find similar endpoint schemas
- Locate test data management examples
- Identify data gathering patterns

**Exploration Commands:**

```bash
# Locate test data examples
Azure MCP: Search for JSON files in TestData/APITestData folder

# Check MCP configuration
Azure MCP: Read .mcp.json and .claude/.mcp.json files

# Find similar API documentation
Azure MCP: Search for markdown files in AgentFile folder
```

**Document Findings:**
```markdown
**Existing Documentation:**
- Test Data Files: [List of existing JSON test data files]
- Similar APIs: [Related API documentation]
- Data Patterns: [Common test data structures]
```

### 1.3 SQL MCP Initial Setup

**Verify SQL MCP Configuration:**

```json
{
  "mcpServers": {
    "mssql": {
      "command": "npx",
      "args": ["-y", "mssql-mcp"],
      "env": {
        "MSSQL_SERVER": "codb01U.Brandmuscle.local",
        "MSSQL_DATABASE": "CentivPOS",
        "MSSQL_AUTHENTICATION": "windows"
      }
    }
  }
}
```

**Test Connection:**
```sql
-- Verify database connectivity
SELECT @@VERSION AS SqlServerVersion;
SELECT DB_NAME() AS CurrentDatabase;

-- Check available tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
```

---

## Step 2: Endpoints Overview

### 2.1 Extract from Swagger JSON

**Access Swagger JSON:**
```
URL: https://api-i.stage.brandmuscle.net/api/{api-name}/{version}/swagger/{version}/swagger.json
```

**Extract Endpoints by Tag/Section:**

Use WebFetch or curl to extract endpoint details:

```bash
# Using curl and jq (if available)
curl https://api-i.stage.brandmuscle.net/api/ordermanagement/v2/swagger/v2/swagger.json | \
  jq '.paths | to_entries[] | select(.value.get.tags[]? == "Items") | {method: "GET", path: .key}'

# Or use WebFetch tool directly in Claude
```

### 2.2 Categorize Endpoints

**Organize by HTTP Method:**

```markdown
## Endpoints Overview ({Total Count})

### GET Endpoints ({Count})
1. `GET /Section/Path/{param}` - Brief description
2. `GET /Section/AnotherPath` - Brief description
...

### POST Endpoints ({Count})
1. `POST /Section/Create` - Brief description
2. `POST /Section/Action/{param}` - Brief description
...

### PUT Endpoints ({Count})
1. `PUT /Section/Update/{id}` - Brief description
...

### DELETE Endpoints ({Count})
1. `DELETE /Section/Delete/{id}` - Brief description
...

### PATCH Endpoints ({Count})
1. `PATCH /Section/PartialUpdate/{id}` - Brief description
...
```

### 2.3 Document Endpoint Details Template

For each endpoint, extract:

```markdown
## Endpoint #{N}: {Endpoint Name}

### Basic Information
- **HTTP Method:** GET | POST | PUT | DELETE | PATCH
- **Path:** /path/to/endpoint/{paramName}
- **Summary:** Brief description
- **Tag/Section:** Section name from Swagger

### Parameters

#### Path Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| paramName | int64 | Yes | ID of the resource | 12345 |

#### Query Parameters
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| queryParam | string | No | null | Filter criteria | "active" |

#### Request Body
**Content-Type:** application/json
**Schema:** Namespace.Model.ClassName

```json
{
  "propertyName": "value",
  "nestedObject": {
    "property": "value"
  }
}
```

### Response
**Success (200 OK):**
```json
{
  "id": 12345,
  "name": "Resource Name",
  "status": "Active"
}
```

### Test Data Needs
- Valid {EntityId} from dbo.{TableName}
- Valid BusinessUnitId
- Valid UserId (if applicable)
```

---

## Step 3: Implementation Plan

### 3.1 File Structure Planning

**Files to Create:**

```
NextGenAutomation/
└── TestData/
    └── APITestData/
        └── {apiname}.json                ← Test Data JSON (NEW)
```

**Example for Order Management Items:**
```
NextGenAutomation/
└── TestData/
    └── APITestData/
        └── ordermanagementapi_items.json
```

---

## Step 4: Test Data Gathering via SQL MCP

### 4.1 Identify Data Requirements

For each endpoint, list required test data:

```markdown
## Endpoint: GET /Items
**Required Data:**
- ItemIds (array of valid item IDs)
- BusinessUnitId (valid business unit ID)

## Endpoint: GET /Items/JobId/{jobId}/BusinessUnitId/{businessUnitId}/OrderLineType/{orderLineType}
**Required Data:**
- JobId (valid job with associated items)
- BusinessUnitId (valid business unit)
- OrderLineType (e.g., "DropShip", "Inventory")

## Endpoint: POST /Items/SaveItemDetails/businessUnitId/{businessUnitId}
**Required Data:**
- BusinessUnitId (valid business unit)
- Item object (complete item structure)
```

### 4.2 SQL Queries for Each Endpoint

**Template for SQL Query Documentation:**

```markdown
### Endpoint #{N}: {Endpoint Name}

**SQL Query:**
```sql
-- Query Description: Get valid {entity} IDs for testing
-- Table: dbo.{TableName}
-- Purpose: {Why this data is needed}
-- Expected Results: {N} rows

SELECT TOP {N}
    {PrimaryKey},
    {RequiredField1},
    {RequiredField2},
    {OptionalField}
FROM dbo.{TableName}
WHERE IsActive = 1
  AND {RequiredField} IS NOT NULL
  AND {AdditionalCriteria}
ORDER BY CreatedDate DESC
```

**Expected Results:**
```json
{
  "fieldName": "value",
  "fieldName2": 12345
}
```

**Store in JSON as (Flat Structure):**
```json
{
  "validOrderId": "1234567890",
  "invalidOrderId": "0000000000",
  "validBusinessUnitId": "32",
  "validItemId": "123456"
}
```

**Note:** Use simple key-value pairs. No nested objects or arrays.

### 4.3 Execute SQL Queries via SQL MCP

**For Each Endpoint, Execute Queries:**

#### Example: Get Items Endpoint

**Query 1: Get Item IDs and Business Unit IDs**
```sql
-- Purpose: Get active items with business units for GET /Items endpoint
SELECT TOP 10 
    ItemId, 
    BusinessUnitId,
    ItemName,
    IsActive,
    CreatedDate
FROM dbo.Item 
WHERE IsActive = 1 
  AND BusinessUnitId IS NOT NULL
ORDER BY CreatedDate DESC
```

**Results Documentation (Flat Structure):**
```json
{
  "validItemId": "1105151",
  "validBusinessUnitId": "32",
  "fallbackBusinessUnitId": "33",
  "retrievedOn": "2024-05-29T10:30:00Z",
  "querySource": "SELECT TOP 10 ItemId, BusinessUnitId FROM dbo.Item WHERE IsActive = 1"
}
```

**Note:** Store as simple key-value pairs for easy access in tests.

#### Example: Get Items by Job ID

**Query 2: Get Jobs with Items**
```sql
-- Purpose: Get valid job IDs with associated items for GET /Items/JobId/{jobId} endpoint
SELECT TOP 5
    j.JobId,
    j.BusinessUnitId,
    ol.ItemId,
    ol.OrderLineType,
    COUNT(ol.OrderLineId) AS ItemCount
FROM dbo.Job j
INNER JOIN dbo.OrderLine ol ON j.JobId = ol.JobId
WHERE j.IsActive = 1
  AND ol.ItemId IS NOT NULL
GROUP BY j.JobId, j.BusinessUnitId, ol.ItemId, ol.OrderLineType
ORDER BY j.CreatedDate DESC
```

**Results Documentation (Flat Structure):**
```json
{
  "validJobId": "24490731",
  "validBusinessUnitId": "32",
  "validOrderLineType": "DropShip",
  "alternateOrderLineType1": "Inventory",
  "alternateOrderLineType2": "DirectMail",
  "retrievedOn": "2024-05-29T10:35:00Z"
}
```

**Note:** Arrays are flattened to individual keys (alternateOrderLineType1, alternateOrderLineType2, etc.).

### 4.4 SQL Query Checklist

For each query, verify:

- [ ] **IsActive filter** - Only active records
- [ ] **NOT NULL checks** - Required fields have values
- [ ] **Date validation** - For time-sensitive data (pricing, promotions)
- [ ] **Relationship verification** - JOIN to confirm related records exist
- [ ] **TOP N limit** - Limit results to reasonable number
- [ ] **ORDER BY CreatedDate DESC** - Get most recent data
- [ ] **Data type match** - Ensure types match API expectations

---

## Step 5: Create JSON Test Data File

### 5.1 File Location and Naming

**Location:** `NextGenAutomation/NextGenAutomation/TestData/APITestData/`

**Naming Convention:** `{apiname}_{section}.json` (lowercase with underscores)

**Examples:**
- `ordermanagementapi_items.json`
- `checkoutapi_cart.json`
- `addressbookapi_addresses.json`

### 5.2 JSON Structure Template

**IMPORTANT: Use FLAT testData format - no nested objects or arrays**

```json
{
  "apiName": "{API Name}",
  "version": "v2",
  "baseUrl": "https://api-i.stage.brandmuscle.net/api/{api-name}/{version}",
  "swaggerUrl": "https://api-i.stage.brandmuscle.net/api/{api-name}/{version}/swagger/index.html",
  "retrievedOn": "2024-05-29T10:00:00Z",
  "sqlMcpServer": "codb01U.Brandmuscle.local",
  "sqlMcpDatabase": "CentivPOS",
  
  "validOrderId": "1234567890",
  "invalidOrderId": "0000000000",
  "validCustomerId": "CUST12345",
  "invalidCustomerId": "CUST00000",
  "validProductId": "PROD67890",
  "invalidProductId": "PROD00000",
  "validOrderStatus": "Shipped",
  "invalidOrderStatus": "UnknownStatus",
  "validDateRangeStart": "2024-01-01T00:00:00Z",
  "validDateRangeEnd": "2024-12-31T23:59:59Z",
  "invalidDateRangeStart": "2025-01-01T00:00:00Z",
  "invalidDateRangeEnd": "2025-12-31T23:59:59Z"
}
```

**Key Principles:**
- Flat structure with simple key-value pairs
- No nested "commonTestData" or "endpoints" sections
- Include both valid and invalid test data values
- Use descriptive field names (validOrderId, invalidOrderId, etc.)

### 5.3 Complete Example: ordermanagementapi.json

**Simplified Flat Structure:**

```json
{
  "apiName": "Order Management",
  "version": "v2",
  "baseUrl": "https://api-i.stage.brandmuscle.net/api/ordermanagement/v2",
  "swaggerUrl": "https://api-i.stage.brandmuscle.net/api/ordermanagement/v2/swagger/index.html",
  "swaggerJsonUrl": "https://api-i.stage.brandmuscle.net/api/ordermanagement/v2/swagger/v2/swagger.json",
  "retrievedOn": "2026-05-29T00:00:00Z",
  "sqlMcpServer": "codb01s.Brandmuscle.local",
  "sqlMcpDatabase": "CentivPOS",
  "note": "Test data structure ready. Execute SQL queries via SQL MCP when database connection is available.",
  "dataStatus": "PLACEHOLDERS - Awaiting SQL MCP connection to populate with real database values",
  
  "validOrderId": "1234567890",
  "invalidOrderId": "0000000000",
  "validCustomerId": "CUST12345",
  "invalidCustomerId": "CUST00000",
  "validProductId": "PROD67890",
  "invalidProductId": "PROD00000",
  "validOrderStatus": "Shipped",
  "invalidOrderStatus": "UnknownStatus",
  "validDateRangeStart": "2024-01-01T00:00:00Z",
  "validDateRangeEnd": "2024-12-31T23:59:59Z",
  "invalidDateRangeStart": "2025-01-01T00:00:00Z",
  "invalidDateRangeEnd": "2025-12-31T23:59:59Z"
}
```

**Benefits of Flat Structure:**
- Simple key-value pairs - easy to read and maintain
- No nested navigation required
- Direct access to test values
- Supports both valid and invalid test data
    
    "endpoint_2_get_items_by_jobid": {
      "endpointPath": "GET /Items/JobId/{jobId}/BusinessUnitId/{businessUnitId}/OrderLineType/{orderLineType}",
      "description": "Get items by job ID, business unit, and order line type",
      "querySource": "SELECT TOP 5 j.JobId, j.BusinessUnitId, ol.OrderLineType FROM dbo.Job j INNER JOIN dbo.OrderLine ol ON j.JobId = ol.JobId WHERE j.IsActive = 1 AND ol.ItemId IS NOT NULL ORDER BY j.CreatedDate DESC",
      "retrievedOn": "2024-05-29T10:35:00Z",
      "data": {
        "jobId": 24490731,
        "businessUnitId": 32,
        "orderLineType": "DropShip"
      }
    },
    
    "endpoint_3_get_outofstock_items": {
      "endpointPath": "GET /Items/OutofStock/BusinessUnitId/{businessUnitId}",
      "description": "Get out of stock items by business unit",
      "querySource": "SELECT TOP 10 ItemId FROM dbo.Item WHERE IsActive = 1 AND InventoryQuantity = 0 AND BusinessUnitId = 32",
      "retrievedOn": "2024-05-29T10:40:00Z",
      "data": {
        "itemIds": [1105160, 1105161],
        "businessUnitId": 32
      }
    },
    
    "endpoint_4_get_backorder_items": {
      "endpointPath": "GET /Items/BackOrder/BusinessUnitId/{businessUnitId}",
      "description": "Get back order items",
      "querySource": "SELECT TOP 10 ItemId FROM dbo.Item WHERE IsActive = 1 AND IsBackOrder = 1 AND BusinessUnitId = 32",
      "retrievedOn": "2024-05-29T10:45:00Z",
      "data": {
        "itemIds": [1105165, 1105166],
        "businessUnitId": 32,
        "isOutOfStockItems": false
      }
    },
    
    "endpoint_5_get_items_with_warehouse_quantity": {
      "endpointPath": "GET /Items/GetItemsWithWareHouseQuantity",
      "description": "Get items with warehouse quantity information",
      "querySource": "SELECT TOP 10 ItemId, BusinessUnitId FROM dbo.Item WHERE IsActive = 1 AND WarehouseId IS NOT NULL",
      "retrievedOn": "2024-05-29T10:50:00Z",
      "data": {
        "itemIds": [1105151, 1105152, 1105153],
        "businessUnitId": 32
      }
    },
    
    "endpoint_6_get_item_pricings": {
      "endpointPath": "GET /Items/GetItemPricings/BusinessUnitId/{businessUnitId}/ItemId/{itemId}",
      "description": "Get item pricings by business unit and item ID",
      "querySource": "SELECT TOP 1 ItemId, BusinessUnitId FROM dbo.Item WHERE IsActive = 1 AND ItemId = 1105151",
      "retrievedOn": "2024-05-29T10:55:00Z",
      "data": {
        "itemId": 1105151,
        "businessUnitId": 32
      }
    },
    
    "endpoint_7_get_items_by_item_type_description": {
      "endpointPath": "GET /Items/GetItemsByItemTypeDescription",
      "description": "Get items by item type description",
      "querySource": "SELECT DISTINCT ItemTypeDescription FROM dbo.ItemType WHERE IsActive = 1",
      "retrievedOn": "2024-05-29T11:00:00Z",
      "data": {
        "itemTypeDescription": "Promotional",
        "businessUnitIDs": ["32", "33"]
      }
    },
    
    "endpoint_8_get_item_details": {
      "endpointPath": "GET /Items/item-details/businessunit/{businessUnitId}/user/{userId}",
      "description": "Get item details with pricing and warehouse quantity",
      "querySource": "SELECT TOP 10 ItemId FROM dbo.Item WHERE IsActive = 1 AND BusinessUnitId = 32 ORDER BY CreatedDate DESC",
      "retrievedOn": "2024-05-29T11:05:00Z",
      "data": {
        "itemIds": [1105151, 1105152, 1105153],
        "businessUnitId": 32,
        "userId": 8090045
      }
    },
    
    "endpoint_9_get_items_by_category": {
      "endpointPath": "GET /Items/by-category/{itemCategoryName}/businessunit/{businessUnitId}/user/{userId}",
      "description": "Get items by category name",
      "querySource": "SELECT TOP 1 ItemCategoryName FROM dbo.ItemCategory WHERE IsActive = 1",
      "retrievedOn": "2024-05-29T11:10:00Z",
      "data": {
        "itemCategoryName": "Marketing Materials",
        "businessUnitId": 32,
        "userId": 8090045,
        "orderLineType": "DropShip"
      }
    },
    
    "endpoint_10_get_items_by_search_property_set": {
      "endpointPath": "GET /Items/by-search-property-set/{searchPropertySetId}/businessunit/{businessUnitId}/user/{userId}",
      "description": "Get items by search property set ID",
      "querySource": "SELECT TOP 1 SearchPropertySetId FROM dbo.SearchPropertySet WHERE IsActive = 1 AND BusinessUnitId = 32",
      "retrievedOn": "2024-05-29T11:15:00Z",
      "data": {
        "searchPropertySetId": 456789,
        "businessUnitId": 32,
        "userId": 8090045,
        "orderLineType": "DropShip"
      }
    },
    
    "endpoint_11_get_item_pricing_by_id": {
      "endpointPath": "GET /Items/admin-get-item-pricing-by-id/{businessUnitId}/{itemPricingId}",
      "description": "Admin endpoint to get item pricing by ID",
      "querySource": "SELECT TOP 1 ItemPricingId, BusinessUnitId FROM dbo.ItemPricing WHERE IsActive = 1 AND EndDate > GETDATE() ORDER BY CreatedDate DESC",
      "retrievedOn": "2024-05-29T11:20:00Z",
      "data": {
        "businessUnitId": 32,
        "itemPricingId": 789012
      }
    },
    
    "endpoint_12_get_item_pricings_with_user": {
      "endpointPath": "GET /Items/item-pricings/businessunit/{businessUnitId}/user/{userId}/item/{itemId}",
      "description": "Get item pricings with user context",
      "querySource": "SELECT TOP 1 ItemId FROM dbo.Item WHERE IsActive = 1 AND BusinessUnitId = 32",
      "retrievedOn": "2024-05-29T11:25:00Z",
      "data": {
        "businessUnitId": 32,
        "userId": 8090045,
        "itemId": 1105151
      }
    },
    
    "endpoint_13_get_item_group_mappings": {
      "endpointPath": "GET /Items/businessunit/{businessUnitId}/item-group-mappings",
      "description": "Get item group mappings for business unit",
      "querySource": "SELECT TOP 1 ParentGroupId FROM dbo.ItemGroup WHERE IsActive = 1 AND BusinessUnitId = 32 AND ParentGroupId IS NOT NULL",
      "retrievedOn": "2024-05-29T11:30:00Z",
      "data": {
        "businessUnitId": 32,
        "parentGroupId": 999887,
        "searchText": "Marketing",
        "pageSize": 10,
        "pageNumber": 1
      }
    },
    
    "endpoint_14_post_save_item_details": {
      "endpointPath": "POST /Items/SaveItemDetails/businessUnitId/{businessUnitId}",
      "description": "Save or update item details",
      "querySource": "Manual request body creation",
      "retrievedOn": "2024-05-29T11:35:00Z",
      "data": {
        "businessUnitId": 32,
        "requestBody": {
          "itemId": 0,
          "itemName": "API Test Item {timestamp}",
          "itemTypeId": 1,
          "isActive": true,
          "createdBy": 8090045
        }
      }
    },
    
    "endpoint_15_post_get_items_by_business_unit_ids": {
      "endpointPath": "POST /Items/GetItemsByBusinessUnitIds",
      "description": "Get items filtered by business unit IDs",
      "querySource": "SELECT DISTINCT BusinessUnitId FROM dbo.Item WHERE IsActive = 1 AND BusinessUnitId IN (32, 33)",
      "retrievedOn": "2024-05-29T11:40:00Z",
      "data": {
        "requestBody": {
          "businessUnitIds": [32, 33],
          "itemIds": [1105151, 1105152]
        }
      }
    },
    
    "endpoint_16_post_get_items_by_dimension": {
      "endpointPath": "POST /Items/GetItemsByDimension/BusinessUnitId/{businessUnitId}",
      "description": "Get items filtered by dimension properties",
      "querySource": "Manual request body with search criteria",
      "retrievedOn": "2024-05-29T11:45:00Z",
      "data": {
        "businessUnitId": 32,
        "includeParentBuId": false,
        "requestBody": {
          "itemTypeId": 1,
          "searchText": "Marketing",
          "pageSize": 10,
          "pageNumber": 1
        }
      }
    },
    
    "endpoint_17_post_clone_item_pricing": {
      "endpointPath": "POST /Items/CloneItemPricing",
      "description": "Clone item pricing from one item to another",
      "querySource": "SELECT TOP 2 ItemId, ItemPricingId FROM dbo.ItemPricing WHERE IsActive = 1 ORDER BY CreatedDate DESC",
      "retrievedOn": "2024-05-29T11:50:00Z",
      "data": {
        "requestBody": {
          "sourceItemPricingId": 789012,
          "targetItemId": 1105152,
          "targetBusinessUnitId": 32
        }
      }
    },
    
    "endpoint_18_post_admin_validate_item_pricing_dates": {
      "endpointPath": "POST /Items/admin-validate-item-pricing-dates/{businessUnitId}",
      "description": "Admin endpoint to validate item pricing dates",
      "querySource": "Manual pricing date validation request",
      "retrievedOn": "2024-05-29T11:55:00Z",
      "data": {
        "businessUnitId": 32,
        "requestBody": {
          "itemPricingId": 789012,
          "startDate": "2024-01-01",
          "endDate": "2024-12-31"
        }
      }
    },
    
    "endpoint_19_post_admin_insert_item_pricing": {
      "endpointPath": "POST /Items/admin-insert-item-pricing/{businessUnitId}",
      "description": "Admin endpoint to insert new item pricing",
      "querySource": "Manual pricing creation request",
      "retrievedOn": "2024-05-29T12:00:00Z",
      "data": {
        "businessUnitId": 32,
        "requestBody": {
          "itemId": 1105151,
          "price": 29.99,
          "currencyId": 1,
          "startDate": "2024-01-01",
          "endDate": "2024-12-31",
          "isActive": true
        }
      }
    },
    
    "endpoint_20_post_admin_update_item_pricing": {
      "endpointPath": "POST /Items/admin-update-item-pricing/{businessUnitId}",
      "description": "Admin endpoint to update existing item pricing",
      "querySource": "SELECT TOP 1 ItemPricingId FROM dbo.ItemPricing WHERE IsActive = 1 ORDER BY CreatedDate DESC",
      "retrievedOn": "2024-05-29T12:05:00Z",
      "data": {
        "businessUnitId": 32,
        "requestBody": {
          "itemPricingId": 789012,
          "price": 39.99,
          "startDate": "2024-01-01",
          "endDate": "2024-12-31"
        }
      }
    },
    
    "endpoint_21_post_items_by_group_id": {
      "endpointPath": "POST /Items/businessUnitId/{businessUnitId}/items-by-group-id",
      "description": "Get items by item group ID",
      "querySource": "SELECT TOP 1 ItemGroupId FROM dbo.ItemGroup WHERE IsActive = 1 AND BusinessUnitId = 32",
      "retrievedOn": "2024-05-29T12:10:00Z",
      "data": {
        "businessUnitId": 32,
        "includeParentBuId": false,
        "requestBody": {
          "itemGroupId": 999888,
          "pageSize": 10,
          "pageNumber": 1
        }
      }
    }
  }
}
```

### 5.4 Loading JSON Test Data in C#

**Simplified Helper Class for Flat JSON:**

```csharp
using System.Text.Json;

namespace NextGenAutomation.Utility
{
    public class ApiTestDataLoader
    {
        /// <summary>
        /// Load API test data from JSON file
        /// </summary>
        /// <param name="fileName">JSON file name (e.g., "ordermanagementapi.json")</param>
        /// <returns>JsonDocument with test data</returns>
        public static async Task<JsonDocument> LoadTestDataAsync(string fileName)
        {
            string filePath = Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory,
                "TestData",
                "APITestData",
                fileName
            );

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Test data file not found: {filePath}");
            }

            using FileStream stream = File.OpenRead(filePath);
            return await JsonDocument.ParseAsync(stream);
        }

        /// <summary>
        /// Get a string value from the flat JSON structure
        /// </summary>
        public static string GetStringValue(JsonDocument testData, string key)
        {
            if (testData.RootElement.TryGetProperty(key, out var value))
            {
                return value.GetString() ?? string.Empty;
            }
            throw new KeyNotFoundException($"Key not found: {key}");
        }

        /// <summary>
        /// Get all test data as a dictionary
        /// </summary>
        public static Dictionary<string, string> GetAllTestData(JsonDocument testData)
        {
            var result = new Dictionary<string, string>();
            
            foreach (var property in testData.RootElement.EnumerateObject())
            {
                if (property.Value.ValueKind == JsonValueKind.String)
                {
                    result[property.Name] = property.Value.GetString() ?? string.Empty;
                }
            }
            
            return result;
        }
    }
}
```

**Usage in Test:**

```csharp
// Load test data JSON
var testDataJson = await ApiTestDataLoader.LoadTestDataAsync("ordermanagementapi.json");

// Get specific test values directly
string validOrderId = ApiTestDataLoader.GetStringValue(testDataJson, "validOrderId");
string invalidOrderId = ApiTestDataLoader.GetStringValue(testDataJson, "invalidOrderId");
string validCustomerId = ApiTestDataLoader.GetStringValue(testDataJson, "validCustomerId");

// Or get all test data at once
var allTestData = ApiTestDataLoader.GetAllTestData(testDataJson);
string orderId = allTestData["validOrderId"];

// Use in API call
var response = await orderApi.GetOrderAsync(validOrderId);
Assert.IsTrue(response.IsSuccess);

// Test with invalid data
var invalidResponse = await orderApi.GetOrderAsync(invalidOrderId);
Assert.IsFalse(invalidResponse.IsSuccess);
```

---

## Prerequisites

### Required Tools
- ✅ Access to Swagger UI (https://api-i.stage.brandmuscle.net)
- ✅ SQL MCP configured (Server: codb01U.Brandmuscle.local, Database: CentivPOS)
- ✅ Azure MCP configured (optional for CI/CD integration)
- ✅ NextGen Automation Framework setup

### Required Knowledge
- Basic understanding of REST APIs
- SQL queries
- JSON format

---

## Example: Order Management Items API

### Complete Workflow Example

**API Details:**
- Name: Order Management
- Section: Items
- Base URL: `https://api-i.stage.brandmuscle.net/api/ordermanagement/v2`
- Swagger: `https://api-i.stage.brandmuscle.net/api/ordermanagement/v2/swagger/index.html`
- Endpoints: 21

### Step 1: Extract from Swagger JSON

```bash
# Fetch Swagger JSON
curl https://api-i.stage.brandmuscle.net/api/ordermanagement/v2/swagger/v2/swagger.json | jq '.paths | to_entries[] | select(.value | has("get","post")) | {path: .key, methods: (.value | keys)}'
```

### Step 2: Query SQL MCP

```sql
-- Query 1: Get Item IDs
SELECT TOP 10 ItemId, BusinessUnitId, ItemName
FROM dbo.Item 
WHERE IsActive = 1 AND BusinessUnitId IS NOT NULL
ORDER BY CreatedDate DESC

-- Results:
-- ItemId: 1105151, BusinessUnitId: 32, ItemName: "Marketing Brochure"
-- ItemId: 1105152, BusinessUnitId: 32, ItemName: "Business Cards"
-- ItemId: 1105153, BusinessUnitId: 33, ItemName: "Flyer"
```

### Step 3: Create JSON Test Data File

**File:** `TestData/APITestData/ordermanagementapi_items.json`

See Step 5 for complete JSON structure with all 21 endpoints' test data including SQL query sources and retrieved data values.

---

## Quick Reference

### Endpoint Path Patterns

| Pattern | Example | Notes |
|---------|---------|-------|
| Simple path | `/Items` | No parameters |
| With path params | `/Items/{itemId}` | Curly braces for params |
| With query params | `/Items?itemIds=123&businessUnitId=32` | Question mark and ampersands |
| Nested path | `/Items/JobId/{jobId}/Type/{type}` | Multiple path segments |

### HTTP Method Usage

| Method | Purpose | Returns Data | Request Body |
|--------|---------|--------------|--------------|
| GET | Retrieve data | Yes | No |
| POST | Create/Execute | Usually | Yes |
| PUT | Full update | Sometimes | Yes |
| PATCH | Partial update | Sometimes | Yes |
| DELETE | Remove data | Sometimes | No |

### Response Status Codes

| Code | Meaning | When to Expect |
|------|---------|----------------|
| 200 OK | Success with response body | GET, POST, PUT, PATCH |
| 201 Created | Resource created | POST |
| 204 No Content | Success, no response body | DELETE, PUT, PATCH |
| 400 Bad Request | Invalid parameters | Any (error) |
| 401 Unauthorized | Missing/invalid auth | Any (error) |
| 404 Not Found | Resource doesn't exist | GET, PUT, DELETE (error) |
| 500 Internal Server Error | Server error | Any (error) |

---

## Best Practices

### Endpoint Documentation
✅ Extract all endpoint details from Swagger JSON  
✅ Document parameters (path, query, body) with examples  
✅ Include response schemas and status codes  
✅ Categorize endpoints by HTTP method  
✅ Note authentication/authorization requirements  

### JSON Test Data
✅ Use FLAT key-value structure (no nesting)  
✅ Include both valid and invalid test values  
✅ Use descriptive field names (validOrderId, invalidOrderId)  
✅ Store metadata fields (apiName, version, baseUrl, etc.)  
✅ Include timestamps for data freshness tracking  
✅ Avoid arrays - use individual keys instead  

### SQL Queries
✅ Always include `WHERE IsActive = 1` filter  
✅ Order by `CreatedDate DESC` for recent data  
✅ Use `TOP N` to limit results  
✅ Join tables to verify relationships  
✅ Check date ranges for time-sensitive data  

---

## Appendix: Tools and Resources

### SQL MCP Commands

```bash
# Connect to database
# Uses configuration from .mcp.json

# Execute query
SELECT * FROM dbo.TableName WHERE IsActive = 1

# Check table structure
EXEC sp_help 'dbo.TableName'

# Check relationships
EXEC sp_fkeys 'TableName'
```

### Swagger JSON Parsing

```bash
# Extract all endpoints
curl {swagger-json-url} | jq '.paths | keys[]'

# Extract endpoints by tag
curl {swagger-json-url} | jq '.paths | to_entries[] | select(.value.get.tags[]? == "Items") | .key'

# Extract endpoint details
curl {swagger-json-url} | jq '.paths["/Items"]'
```

---

## Conclusion

This workflow provides a standardized, repeatable process for documenting and preparing API endpoints for automation:

1. ✅ **Extract** endpoint details from Swagger documentation
2. ✅ **Document** parameters, request/response schemas, and test data requirements
3. ✅ **Query** realistic test data from database via SQL MCP
4. ✅ **Create** comprehensive JSON test data files with SQL query sources
5. ✅ **Organize** endpoint details by HTTP method and section

Following this workflow ensures:
- Complete endpoint documentation with all parameters
- Realistic test data from production database
- Traceable SQL queries for each data point
- Structured JSON format ready for test automation
- Full endpoint coverage analysis

**Next Steps:**
1. Review this workflow for your specific API
2. Execute SQL MCP queries to gather test data
3. Follow steps 1-5 to document endpoints and create test data files
4. Use the generated JSON files for API automation implementation
5. Validate data freshness periodically and re-query as needed
