# Unified Performance Testing Framework - Setup Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [Usage Guide](#usage-guide)
7. [Core Components](#core-components)
8. [Test Data Files](#test-data-files)
9. [Sample Test Implementation](#sample-test-implementation)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The **Unified Performance Testing Framework** is a comprehensive C# .NET 8.0 testing framework that combines:
- **Page Performance Metrics** (LCP, Speed Index via Lighthouse/Puppeteer)
- **API Performance Metrics** (via JMeter load testing)
- **Functional Flow Validation** (smoke tests with error tracking)
- **API Health Checks** (service availability monitoring)
- **Consolidated HTML Reporting** (interactive dashboards with charts)

### Key Features
- ✅ Parallel execution of browser tests and JMeter load tests
- ✅ Real-time console error tracking (JS errors, network failures)
- ✅ Automated API health checks with server masking validation
- ✅ Multi-environment support (QA, Stage, Prod)
- ✅ Beautiful HTML reports with Chart.js visualizations
- ✅ Thread-safe JMeter orchestration for parallel test runs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   UnifiedPerformanceReport.cs                     │
│              (Your Test Class - Inherits Base)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ extends
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│               UnifiedPerformanceBase.cs                           │
│  - Setup/TearDown hooks                                           │
│  - Browser launch (Puppeteer/Playwright)                          │
│  - Console error handlers                                         │
│  - JMeter result parsing                                          │
│  - API health check runner                                        │
│  - Report generation                                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ extends
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  JMeterLoadBase.cs                                │
│  - JMeter test orchestration                                      │
│  - LoadTest attribute processing                                  │
│  - Parallel JMeter execution                                      │
│  - Results caching                                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌─────────────────┐  ┌──────────────┐  ┌────────────────────┐
│ MetricsCollector│  │ JMeter       │  │ Report Generator   │
│ - PageMetric    │  │ Orchestrator │  │ - HTML/CSS/Charts  │
│ - ApiMetric     │  │ - CLI Exec   │  │ - Chart.js         │
│ - HealthCheck   │  │ - Parser     │  │ - Collapsible UI   │
│ - ConsoleError  │  │ - Results    │  │                    │
│ - FunctionalFlow│  │   Cache      │  │                    │
└─────────────────┘  └──────────────┘  └────────────────────┘
```

---

## 📦 Prerequisites

### 1. **Software Requirements**
- **.NET 8.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Apache JMeter 5.6.3** - [Download](https://jmeter.apache.org/download_jmeter.cgi)
- **Visual Studio 2022** (or VS Code with C# extensions)
- **Node.js** (optional - for Playwright browser installation)

### 2. **NuGet Packages**
The framework uses these key packages (see [NextGenAutomation.csproj](NextGenAutomation/NextGenAutomation/NextGenAutomation.csproj)):

```xml
<PackageReference Include="Microsoft.Playwright" Version="1.48.0" />
<PackageReference Include="Microsoft.Playwright.NUnit" Version="1.48.0" />
<PackageReference Include="PuppeteerSharp" Version="16.0.0" />
<PackageReference Include="NUnit" Version="3.14.0" />
<PackageReference Include="NUnit3TestAdapter" Version="4.5.0" />
<PackageReference Include="ExtentReports" Version="5.0.4" />
<PackageReference Include="LighthouseDotnet" Version="15.0.0" />
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
```

### 3. **Browser Requirements**
- **Chrome/Chromium** (for Playwright/Puppeteer)
- Install Playwright browsers:
  ```bash
  pwsh bin/Debug/net8.0/playwright.ps1 install
  ```

---

## 🚀 Installation & Setup

### Step 1: Clone and Restore
```bash
cd "c:\BBREPOS\BB UNIFIED PERFORMANCE REPORT\AnsiraCreateBB\NextGenAutomation"
dotnet restore
```

### Step 2: Install JMeter
1. Download Apache JMeter 5.6.3
2. Extract to `c:\apache-jmeter-5.6.3\` (or custom path)
3. Set environment variable (optional):
   ```bash
   setx JMETER_HOME "c:\apache-jmeter-5.6.3"
   ```

### Step 3: Configure JMeter Path
Edit `TestData/LoadTestConfiguration.json`:
```json
{
  "JMeterConfiguration": {
    "JMeterPath": "JmeterFiles\\apache-jmeter-5.6.3\\apache-jmeter-5.6.3\\bin\\jmeter.bat",
    "ResultsFolder": "JMeterResults",
    "HtmlReportsFolder": "JMeterReports",
    "MaxConcurrentTests": 5,
    "DefaultThreadCount": 10,
    "DefaultRampUpTime": 5,
    "DefaultDuration": 60,
    "TimeoutMinutes": 30
  }
}
```

### Step 4: Create Required Folders
The framework auto-creates these folders, but you can pre-create them:
```
NextGenAutomation/
├── JMeterResults/        # JMeter .jtl and .xml files
├── JMeterReports/        # JMeter HTML reports
├── Reports/              # Unified performance reports
├── ScreenShots/          # Test screenshots
└── TestData/             # JSON configuration files
```

---

## ⚙️ Configuration

### 1. **Environment Configuration** (`TestData/appsettings.json`)
```json
{
  "Environment": "STAGE",
  "NextGenQaUrl": "https://qa.v5qa.brandmuscle.net/",
  "NextGenStageUrl": "https://qa.v5stage.brandmuscle.net/",
  "NextGenProdUrl": "https://qa.brandmuscle.net/"
}
```

### 2. **Load Test Configuration** (`TestData/LoadTestConfiguration.json`)
```json
{
  "JMeterConfiguration": {
    "JMeterPath": "JmeterFiles\\apache-jmeter-5.6.3\\apache-jmeter-5.6.3\\bin\\jmeter.bat",
    "ResultsFolder": "JMeterResults",
    "HtmlReportsFolder": "JMeterReports",
    "MaxConcurrentTests": 5,
    "DefaultThreadCount": 10,
    "DefaultRampUpTime": 5,
    "DefaultDuration": 60,
    "TimeoutMinutes": 30
  },
  "TestMappings": [
    {
      "TestNamePattern": "GetPageLoadTime",
      "JmxFile": "CONSOLIDATEDAPI_VALIDATION.jmx",
      "ThreadCount": 15,
      "Duration": 120,
      "RampUpTime": 10
    }
  ]
}
```

### 3. **API Health Check Configuration** (`TestData/apihealth_stage.json`)
```json
{
  "apiHealthEndpoints": [
    {
      "id": 1,
      "name": "Address Book",
      "stageHealthUrl": "https://api-i.stage.brandmuscle.net/api/addressbook/v1/health",
      "prodHealthUrl": "https://api-i.brandmuscle.net/api/addressbook/v1/health",
      "version": "v1",
      "namespace": "Default"
    },
    {
      "id": 2,
      "name": "Checkout",
      "stageHealthUrl": "https://api-i.stage.brandmuscle.net/api/checkout/v3/health",
      "prodHealthUrl": "https://api-i.brandmuscle.net/api/checkout/v3/health",
      "version": "v3",
      "namespace": "Default"
    }
  ]
}
```

Create separate files for each environment:
- `apihealth_qa.json`
- `apihealth_stage.json`
- `apihealth_prod.json`

### 4. **Smoke Test Data** (`TestData/prodsmoketestdata.json`)
```json
{
  "username": "your_test_user",
  "password": "your_test_password",
  "SFDeliveryApprovalItem": "4710896"
}
```

---

## 📚 Usage Guide

### Creating a Unified Performance Test

#### 1. **Basic Test Structure**
```csharp
using NextGenAutomation.Initiate;
using NextGenAutomation.Attributes;
using NUnit.Framework;

[TestFixture]
[Parallelizable(ParallelScope.All)]
public class UnifiedPerformanceReport : UnifiedPerformanceBase
{
    [Test]
    [Category("UnifiedPerformanceReport_Prod")]
    [LoadTest(JmxFileName = "CONSOLIDATEDAPI_VALIDATION.jmx")]
    [Order(1)]
    public async Task GetPageLoadTime()
    {
        // Clear previous metrics (important for retries)
        MetricsCollector.GetAllMetrics().PageMetrics.Clear();
        
        GetJsonData _data = new GetJsonData();
        string env = _data.ReadJsonValueAsync("Environment").Result;
        string url = GetLoginUrl(env, "AmericanFamily");
        
        try
        {
            using (var browser = await LaunchBrowserAsync())
            using (var page = await browser.NewPageAsync())
            {
                // Navigate to Login Page
                await page.GoToAsync(url, new NavigationOptions
                {
                    WaitUntil = new[] { WaitUntilNavigation.DOMContentLoaded },
                    Timeout = 30000
                });
                
                // Capture performance metrics
                await MetricsCollector.AddPageMetricAsync(page, "Login Page", "Login Page");
                
                // More page navigation and metrics...
            }
        }
        finally
        {
            // Parse JMeter results
            await AddJMeterApiMetricsAsync();
        }
    }
}
```

#### 2. **Functional Flow Test with Error Tracking**
```csharp
[Test]
[Category("UnifiedPerformanceReport_FunctionalFlow_Prod")]
[LoadTest(JmxFileName = "CONSOLIDATEDAPI_VALIDATION.jmx")]
[Order(2)]
public async Task Validate_ComposerFlow()
{
    var flowMetric = new FunctionalFlowMetric
    {
        FlowName = "Composer Flow Validation",
        Category = "UnifiedPerformanceReport_FunctionalFlow_Prod",
        ExecutionTime = DateTime.Now,
        Passed = false
    };
    
    var stepDurations = new Dictionary<string, double>();
    var stopwatch = new Stopwatch();
    
    try
    {
        await GetUrl();
        
        // Step 1: Login
        stopwatch.Restart();
        await _login.Login(username, password, "QA");
        stopwatch.Stop();
        stepDurations["Login Page to Landing Page"] = stopwatch.Elapsed.TotalSeconds;
        MetricsCollector.AssociateErrorsWithPage("Login Page to Landing Page", Page.Url);
        
        // Step 2: Search
        stopwatch.Restart();
        await _searchpage.SearchWithKeyWord(setid);
        stopwatch.Stop();
        stepDurations["Keyword Search Results"] = stopwatch.Elapsed.TotalSeconds;
        MetricsCollector.AssociateErrorsWithPage("Keyword Search Results", Page.Url);
        
        // Mark flow as passed
        flowMetric.Passed = true;
    }
    catch (Exception ex)
    {
        flowMetric.Passed = false;
        flowMetric.ErrorMessage = ex.Message;
        Assert.Fail($"Test failed: {ex.Message}");
    }
    finally
    {
        // Collect step logs
        var stepNames = new[]
        {
            "Login Page to Landing Page",
            "Keyword Search Results"
        };
        
        foreach (var stepName in stepNames)
        {
            var stepLog = MetricsCollector.GetStepLogForPage(
                stepName,
                durationInSeconds: stepDurations.ContainsKey(stepName) ? stepDurations[stepName] : 0
            );
            flowMetric.StepLogs.Add(stepLog);
        }
        
        // Count errors
        var allErrors = MetricsCollector.GetAllMetrics().ConsoleErrors;
        flowMetric.JsErrorCount = allErrors.Count(e => e.Type == "error");
        flowMetric.OtherConsoleErrorCount = allErrors.Count(e => e.Type == "page-error");
        flowMetric.Error400Count = allErrors.Count(e => e.Type == "network-error" && e.StatusCode >= 400 && e.StatusCode < 500);
        flowMetric.Error500Count = allErrors.Count(e => e.Type == "network-error" && e.StatusCode >= 500);
        
        // Add flow metric
        MetricsCollector.AddFunctionalFlow(flowMetric);
        
        // Parse JMeter results
        await AddJMeterApiMetricsAsync();
    }
}
```

#### 3. **Final Test - Generate Report**
```csharp
[Test]
[Category("UnifiedPerformanceReport_Prod")]
[Order(999)]  // Run last
public async Task GenerateReport()
{
    string env = _data.ReadJsonValueAsync("Environment").Result;
    string buname = "AmericanFamily";
    
    // Run API Health Checks
    string healthCheckJsonPath = Path.Combine(projectDir, "TestData", $"apihealth_{env.ToLower()}.json");
    if (File.Exists(healthCheckJsonPath))
    {
        await RunApiHealthChecksAsync(healthCheckJsonPath);
    }
    
    // Generate consolidated report
    string reportDir = Path.Combine(projectDir, "Reports");
    Directory.CreateDirectory(reportDir);
    string reportFilePath = Path.Combine(reportDir, "AnsiraCreateBB Unified Performance Report.html");
    
    GenerateUnifiedReport(reportFilePath, buname, env);
    
    // Reset collector
    ResetMetricsCollector();
}
```

---

## 🧩 Core Components

### 1. **UnifiedPerformanceBase.cs**
**Location**: `NextGenAutomation/Initiate/UnifiedPerformanceBase.cs`

**Key Methods**:
```csharp
// Setup hooks
[SetUp]
public new async Task UnifiedSetUp()

// Get environment-specific URL
public string GetLoginUrl(string env, string bu)

// Launch browser
protected async Task<IBrowser> LaunchBrowserAsync()

// Attach console error handlers (Playwright)
protected void AttachConsoleErrorHandlers(Microsoft.Playwright.IPage page)

// Attach console error handlers (PuppeteerSharp)
protected void AttachConsoleErrorHandlers(PuppeteerSharp.IPage page)

// Parse JMeter results and add to collector
protected async Task AddJMeterApiMetricsAsync(string testName = null)

// Run API health checks
protected async Task RunApiHealthChecksAsync(string jsonFilePath)

// Generate unified report
protected void GenerateUnifiedReport(string filePath, string buName = null, string env = null)

// Reset metrics collector
protected void ResetMetricsCollector()
```

### 2. **UnifiedPerformanceMetricsCollector.cs**
**Location**: `NextGenAutomation/PerformanceUtility/UnifiedPerformanceMetricsCollector.cs`

**Key Methods**:
```csharp
// Add health check
public void AddHealthCheckMetric(HealthCheckMetric healthCheck)

// Add page performance metric
public async Task AddPageMetricAsync(IPage page, string pageName, string label = null)

// Add API metrics from JMeter
public void AddApiMetricsFromJMeter(string jtlFilePath, string xmlResultsPath = null)

// Set test metadata
public void SetMetadata(string businessUnit = null, string environment = null, string jmxFileName = null)

// Add console error
public void AddConsoleError(ConsoleErrorMetric error)

// Associate errors with page
public void AssociateErrorsWithPage(string pageName, string pageUrl)

// Get step log for page
public StepLogMetric GetStepLogForPage(string pageName, double durationInSeconds = 0)

// Add functional flow
public void AddFunctionalFlow(FunctionalFlowMetric flow)

// Get all metrics
public UnifiedPerformanceData GetAllMetrics()
```

### 3. **UnifiedPerformanceReportGenerator.cs**
**Location**: `NextGenAutomation/PerformanceUtility/UnifiedPerformanceReportGenerator.cs`

**Generates HTML report with**:
- Summary cards (total APIs, health status, functional tests, endpoints)
- Interactive charts (LCP, API health distribution, response times, functional flows)
- Collapsible sections (page metrics, functional flows, health checks, API services)
- Beautiful gradient UI with hover effects

### 4. **JMeterTestOrchestrator.cs**
**Location**: `NextGenAutomation/LoadTestUtility/JMeterTestOrchestrator.cs`

**Key Methods**:
```csharp
// Singleton instance
public static JMeterTestOrchestrator Instance

// Start JMeter test in background
public async Task<string> StartLoadTestAsync(string testName, string jmxFileName, LoadTestAttribute attribute = null)

// Wait for test completion
public async Task<JMeterResults> WaitForCompletionAsync(string testId, TimeSpan timeout)

// Get test mapping
public TestMapping GetTestMapping(string testName)
```

### 5. **LoadTestAttribute.cs**
**Location**: `NextGenAutomation/Attributes/LoadTestAttribute.cs`

**Usage**:
```csharp
[LoadTest(
    JmxFileName = "CONSOLIDATEDAPI_VALIDATION.jmx",
    ThreadCount = 15,
    RampUpTime = 10,
    Duration = 120,
    FailOnLoadTestError = false
)]
```

---

## 📄 Test Data Files

### File Structure
```
TestData/
├── appsettings.json              # Environment URLs
├── LoadTestConfiguration.json    # JMeter configuration
├── apihealth_qa.json             # QA health endpoints
├── apihealth_stage.json          # Stage health endpoints
├── apihealth_prod.json           # Prod health endpoints
├── prodsmoketestdata.json        # Test credentials
└── APITestData/                  # API-specific data
```

### Sample JMeter Test Data CSV
**Location**: `JmeterFiles/apache-jmeter-5.6.3/apache-jmeter-5.6.3/bin/TestDataUnified/ConsolidateTestData_Prod.csv`

```csv
baseurl,token,buid,setid,applicationid,userid,personaid,assetid,assetname,templatefamilyid,configid,orderid,orderlineid,itemid,jobid,shippingagentid,externalitemid,itempricingid
https://qa.brandmuscle.net/api,<token>,32,3211546,2,10905866,933141,2846362,TestAsset.png,1140673,23139,<orderid>,<orderlineid>,<itemid>,<jobid>,193,<externalitemid>,<itempricingid>
```

This CSV is dynamically generated by the `SetupJMeterTestData` test method.

---

## 📝 Sample Test Implementation

### Complete Example: Unified Performance Report
**File**: `NextGenAutomation/Test/PerformanceTest/UnifiedPerformanceReport.cs`

```csharp
[TestFixture]
[Parallelizable(ParallelScope.All)]
internal class UnifiedPerformanceReport : UnifiedPerformanceBase
{
    // Test 1: Page Load Time + JMeter API Test
    [Test]
    [Category("UnifiedPerformanceReport_Prod")]
    [Order(1)]
    public async Task GetPageLoadTime()
    {
        MetricsCollector.GetAllMetrics().PageMetrics.Clear();
        
        GetJsonData _data = new GetJsonData();
        string env = _data.ReadJsonValueAsync("Environment").Result;
        string url = GetLoginUrl(env, "AmericanFamily");
        
        try
        {
            using (var browser = await LaunchBrowserAsync())
            using (var page = await browser.NewPageAsync())
            {
                // Login Page
                await page.GoToAsync(url, new NavigationOptions
                {
                    WaitUntil = new[] { WaitUntilNavigation.DOMContentLoaded },
                    Timeout = 30000
                });
                await MetricsCollector.AddPageMetricAsync(page, "Login Page", "Login Page");
                
                // Login
                await page.TypeAsync("#UserName", username);
                await page.TypeAsync("#Password", password);
                await page.ClickAsync("#LoginButton");
                await page.WaitForNavigationAsync();
                
                // Landing Page
                await MetricsCollector.AddPageMetricAsync(page, "Landing Page", "Landing Page");
                
                // PLP Page
                await page.GoToAsync(plpUrl);
                await MetricsCollector.AddPageMetricAsync(page, "PLP Page", "PLP Page");
            }
        }
        finally
        {
            await AddJMeterApiMetricsAsync();
        }
    }
    
    // Test 2: Setup JMeter Test Data
    [Test]
    [Category("UnifiedPerformanceReport_Prod")]
    [Order(2)]
    public async Task SetupJMeterTestData()
    {
        // Extract token and order details
        string token = await Page.EvaluateAsync<string>(
            "() => window.sessionStorage.getItem('brandmuscle_token')"
        );
        
        var orderAddressJson = await checkoutapi.GetOrderAddressProd(token);
        string orderId = json.SelectToken("order.orderId")?.ToString();
        
        // Write CSV for JMeter
        string csvPath = Path.Combine(projectDir, @"JmeterFiles\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\TestDataUnified\ConsolidateTestData_Prod.csv");
        using (StreamWriter writer = new StreamWriter(csvPath, false, System.Text.Encoding.UTF8))
        {
            writer.WriteLine("baseurl,token,buid,setid,applicationid,userid,personaid,assetid,assetname,templatefamilyid,configid,orderid,orderlineid,itemid,jobid,shippingagentid,externalitemid,itempricingid");
            writer.WriteLine($"{baseUrl},{token},{buid},{setid},{applicationId},{userid},{personaid},{assetid},{assetname},{templatefamilyid},{configid},{orderId},{orderlineid},{itemid},{jobid},{shippingagentid},{externalitemid},{itempricingid}");
        }
    }
    
    // Test 3: Functional Flow Validation
    [Test]
    [Category("UnifiedPerformanceReport_FunctionalFlow_Prod")]
    [LoadTest(JmxFileName = "CONSOLIDATEDAPI_VALIDATION.jmx")]
    [Order(3)]
    public async Task Validate_ComposerFlow()
    {
        var flowMetric = new FunctionalFlowMetric
        {
            FlowName = "Composer Flow Validation",
            Category = "UnifiedPerformanceReport_FunctionalFlow_Prod",
            ExecutionTime = DateTime.Now,
            Passed = false
        };
        
        var stepDurations = new Dictionary<string, double>();
        var stopwatch = new Stopwatch();
        
        try
        {
            // Login
            stopwatch.Restart();
            await _login.Login(username, password, "QA");
            stopwatch.Stop();
            stepDurations["Login Page to Landing Page"] = stopwatch.Elapsed.TotalSeconds;
            MetricsCollector.AssociateErrorsWithPage("Login Page to Landing Page", Page.Url);
            
            // Search
            stopwatch.Restart();
            await _searchpage.SearchWithKeyWord(setid);
            stopwatch.Stop();
            stepDurations["Keyword Search Results"] = stopwatch.Elapsed.TotalSeconds;
            MetricsCollector.AssociateErrorsWithPage("Keyword Search Results", Page.Url);
            
            flowMetric.Passed = true;
        }
        catch (Exception ex)
        {
            flowMetric.Passed = false;
            flowMetric.ErrorMessage = ex.Message;
            Assert.Fail($"Test failed: {ex.Message}");
        }
        finally
        {
            // Collect step logs
            foreach (var stepName in stepNames)
            {
                var stepLog = MetricsCollector.GetStepLogForPage(
                    stepName,
                    durationInSeconds: stepDurations.ContainsKey(stepName) ? stepDurations[stepName] : 0
                );
                flowMetric.StepLogs.Add(stepLog);
            }
            
            // Count errors
            var allErrors = MetricsCollector.GetAllMetrics().ConsoleErrors;
            flowMetric.JsErrorCount = allErrors.Count(e => e.Type == "error");
            flowMetric.Error400Count = allErrors.Count(e => e.Type == "network-error" && e.StatusCode >= 400 && e.StatusCode < 500);
            flowMetric.Error500Count = allErrors.Count(e => e.Type == "network-error" && e.StatusCode >= 500);
            
            MetricsCollector.AddFunctionalFlow(flowMetric);
            await AddJMeterApiMetricsAsync();
        }
    }
    
    // Test 4: Final Report Generation
    [Test]
    [Category("UnifiedPerformanceReport_Prod")]
    [Order(999)]
    public async Task Validate_FulfillmentItemCheckout()
    {
        // ... functional test logic ...
        
        // FINAL STEP: Generate report
        string env = _data.ReadJsonValueAsync("Environment").Result;
        string healthCheckJsonPath = Path.Combine(projectDir, "TestData", $"apihealth_{env.ToLower()}.json");
        
        if (File.Exists(healthCheckJsonPath))
        {
            await RunApiHealthChecksAsync(healthCheckJsonPath);
        }
        
        string reportFilePath = Path.Combine(reportDir, "AnsiraCreateBB Unified Performance Report.html");
        GenerateUnifiedReport(reportFilePath, "QA", env);
        ResetMetricsCollector();
    }
}
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. **JMeter Not Found**
```
Error: JMeter executable not found at path
```
**Solution**: Update `LoadTestConfiguration.json` with correct JMeter path
```json
{
  "JMeterConfiguration": {
    "JMeterPath": "c:\\apache-jmeter-5.6.3\\bin\\jmeter.bat"
  }
}
```

#### 2. **Playwright Browser Not Installed**
```
Error: Browser executable not found
```
**Solution**: Install Playwright browsers
```bash
pwsh bin/Debug/net8.0/playwright.ps1 install
```

#### 3. **CSV File Not Generated for JMeter**
```
Error: ConsolidateTestData_Prod.csv not found
```
**Solution**: Ensure `SetupJMeterTestData` test runs before JMeter tests. Use `[Order(2)]` attribute.

#### 4. **Empty API Metrics in Report**
```
No API metrics extracted from JMeter results
```
**Solution**: 
- Verify JMeter test completed successfully
- Check JTL file exists: `JMeterResults/results_<testname>.jtl`
- Check XML file exists: `JMeterResults/ViewResultsTree_<testname>.xml`
- Ensure `AddJMeterApiMetricsAsync()` is called in `finally` block

#### 5. **Console Errors Not Captured**
```
Total Console Errors: 0
```
**Solution**: Attach console error handlers
```csharp
// For Playwright
AttachConsoleErrorHandlers(page);

// For PuppeteerSharp
AttachConsoleErrorHandlers(page);
```

#### 6. **Health Check Timeout**
```
Health check failed: Timeout after 30000ms
```
**Solution**: Increase timeout in `RunApiHealthChecksAsync`:
```csharp
var apiContext = await playwright.APIRequest.NewContextAsync(new Microsoft.Playwright.APIRequestNewContextOptions
{
    ExtraHTTPHeaders = new Dictionary<string, string> { { "accept", "application/json" } },
    Timeout = 60000  // Increase to 60 seconds
});
```

---

## 📊 Report Structure

### Generated Report Location
```
Reports/
└── AnsiraCreateBB Unified Performance Report.html
```

### Report Sections
1. **Header**: Environment, Business Unit, Timestamp
2. **Summary Cards**: Total API Services, API Health %, Functional Tests %, Total Endpoints
3. **Charts**:
   - Page Load Performance (LCP) - Bar Chart
   - API Health Distribution - Doughnut Chart
   - API Response Time by Service - Horizontal Bar Chart
   - Functional Flow Status - Pie Chart
4. **Page Load Time Metrics**: Table with LCP, Speed Index, Performance Rating
5. **Functional Flow Validation**: Collapsible sections with step logs and error counts
6. **API Health Checks**: Service-level health status and server masking validation
7. **API Service Performance**: Collapsible sections grouped by Thread Group

### Sample Report Output
```html
📊 AnsiraCreateBB Performance Report
Unified Performance Analysis - STAGE Environment
Business Unit: QA
🕐 Generated: August 06, 2026 at 14:32:15

┌─────────────────────────────────────────────────────┐
│ Total API Services: 8                               │
│ API Health Status: 95%                              │
│ Functional Tests: 100%                              │
│ Total Endpoints: 42                                 │
└─────────────────────────────────────────────────────┘

📈 Performance Analytics
[Charts displayed here]

⚡ Page Load Time Metrics
┌────────────────┬──────────┬────────────┬─────────────┐
│ Page Name      │ Avg LCP  │ Speed Index│ Rating      │
├────────────────┼──────────┼────────────┼─────────────┤
│ Login Page     │ 2.34s    │ 1.98s      │ ✓ Good      │
│ Landing Page   │ 1.87s    │ 1.52s      │ ✓ Excellent │
│ PLP Page       │ 3.12s    │ 2.76s      │ ⚠ Acceptable│
└────────────────┴──────────┴────────────┴─────────────┘
```

---

## 🎯 Best Practices

### 1. **Test Execution Order**
Use `[Order(n)]` attribute to ensure proper test sequence:
```csharp
[Order(1)] GetPageLoadTime()      // Collect page metrics
[Order(2)] SetupJMeterTestData()  // Generate CSV for JMeter
[Order(3)] Validate_ComposerFlow() // Functional flow with JMeter
[Order(999)] GenerateReport()     // Final report generation
```

### 2. **Retry Logic**
Use `[Retry(2)]` for flaky tests:
```csharp
[Test]
[Retry(2)]
public async Task GetPageLoadTime()
{
    MetricsCollector.GetAllMetrics().PageMetrics.Clear(); // Clear on retry
}
```

### 3. **Error Association**
Always associate errors with pages:
```csharp
stopwatch.Restart();
await _login.Login(username, password, "QA");
stopwatch.Stop();
stepDurations["Login Page"] = stopwatch.Elapsed.TotalSeconds;
MetricsCollector.AssociateErrorsWithPage("Login Page", Page.Url);
```

### 4. **JMeter Result Parsing**
Always call in `finally` block:
```csharp
finally
{
    await AddJMeterApiMetricsAsync();
}
```

### 5. **Report Generation**
Generate report only in the last test to capture all metrics:
```csharp
[Order(999)]
public async Task GenerateReport()
{
    // All tests complete - now generate report
    GenerateUnifiedReport(reportFilePath, buname, env);
    ResetMetricsCollector();
}
```

---

## 📖 Additional Resources

### Key Files Reference
| File | Location | Purpose |
|------|----------|---------|
| UnifiedPerformanceBase.cs | `Initiate/` | Base class with setup/teardown hooks |
| UnifiedPerformanceMetricsCollector.cs | `PerformanceUtility/` | Metrics collection and aggregation |
| UnifiedPerformanceReportGenerator.cs | `PerformanceUtility/` | HTML report generation |
| UnifiedPerformanceData.cs | `PerformanceUtility/` | Data model for metrics |
| JMeterLoadBase.cs | `Initiate/` | JMeter orchestration base |
| JMeterTestOrchestrator.cs | `LoadTestUtility/` | Thread-safe JMeter executor |
| LoadTestAttribute.cs | `Attributes/` | Custom NUnit attribute |
| PageMetric.cs | `PerformanceUtility/` | Page performance data model |
| ApiMetricFromJMeter.cs | `PerformanceUtility/` | API performance data model |
| HealthCheckMetric.cs | `PerformanceUtility/` | Health check data model |
| FunctionalFlowMetric.cs | `PerformanceUtility/` | Functional flow data model |
| ConsoleErrorMetric.cs | `PerformanceUtility/` | Console error data model |

### Environment URLs
| Environment | URL |
|------------|-----|
| QA | https://qa.v5qa.brandmuscle.net/ |
| Stage | https://qa.v5stage.brandmuscle.net/ |
| Prod | https://qa.brandmuscle.net/ |

### JMeter Files
| File | Location | Purpose |
|------|----------|---------|
| CONSOLIDATEDAPI_VALIDATION.jmx | `JmeterFiles/` | Main API validation test plan |
| ConsolidateTestData_Prod.csv | `JmeterFiles/apache-jmeter-5.6.3/bin/TestDataUnified/` | Dynamic test data (generated) |

---

## 🚦 Quick Start Checklist

- [ ] Install .NET 8.0 SDK
- [ ] Install Apache JMeter 5.6.3
- [ ] Install Playwright browsers (`pwsh playwright.ps1 install`)
- [ ] Update `LoadTestConfiguration.json` with JMeter path
- [ ] Update `appsettings.json` with environment
- [ ] Create `apihealth_<env>.json` files
- [ ] Create `prodsmoketestdata.json` with credentials
- [ ] Build solution (`dotnet build`)
- [ ] Run test suite (`dotnet test`)
- [ ] Check report in `Reports/AnsiraCreateBB Unified Performance Report.html`

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review sample implementation in [UnifiedPerformanceReport.cs](NextGenAutomation/Test/PerformanceTest/UnifiedPerformanceReport.cs)
3. Examine generated reports for error details
4. Check JMeter logs in `JMeterResults/` folder

---

**Last Updated**: August 6, 2026  
**Framework Version**: 1.0.0  
**Maintained By**: AnsiraCreateBB Team
