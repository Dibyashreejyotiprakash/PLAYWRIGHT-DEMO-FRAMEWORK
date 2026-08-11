# JMeter JMX Parameterization Guide

## Overview

This guide shows how to **pass dynamic parameters from JavaScript tests to your JMX files**, enabling data-driven and environment-specific JMeter tests.

---

## 🎯 Method 1: Using Custom Properties (Recommended)

### Step 1: Update Your JavaScript Test

Pass custom properties in the `properties` object:

```javascript
import { test } from '@playwright/test';
import UnifiedPerformanceBase from '../../Initiate/UnifiedPerformanceBase.js';

test('Parameterized JMeter Test', async () => {
    const performanceBase = new UnifiedPerformanceBase();
    
    // Get dynamic values from your test
    const token = await page.evaluate(() => 
        window.sessionStorage.getItem('brandmuscle_token')
    );
    const userId = await page.evaluate(() => 
        window.sessionStorage.getItem('userId')
    );
    
    // Execute JMeter with custom parameters
    await performanceBase.addJMeterApiMetrics(
        'CONSOLIDATEDAPI_VALIDATION.jmx',
        'QA_ParameterizedTest',
        {
            // Standard JMeter options
            threadCount: 15,
            duration: 120,
            rampUpTime: 10,
            
            // 🔥 Custom properties passed to JMX
            properties: {
                baseUrl: 'https://qa.v5stage.brandmuscle.net/api',
                token: token,
                buid: '32',
                setid: '3211546',
                applicationId: '2',
                userId: userId,
                personaId: '933141',
                assetId: '2846362',
                assetName: 'TestAsset.png',
                templateFamilyId: '1140673',
                configId: '23139',
                orderId: '12345678',
                orderLineId: '98765432',
                itemId: '555666',
                jobId: '777888',
                shippingAgentId: '193',
                externalItemId: '111222',
                itemPricingId: '333444',
                environment: 'STAGE'
            }
        }
    );
});
```

### Step 2: Reference Properties in Your JMX File

In your JMX file, use `${__P(propertyName,defaultValue)}`:

```xml
<!-- User Defined Variables -->
<elementProp name="baseUrl" elementType="Argument">
    <stringProp name="Argument.name">baseUrl</stringProp>
    <stringProp name="Argument.value">${__P(baseUrl,https://default.url.com)}</stringProp>
</elementProp>

<elementProp name="token" elementType="Argument">
    <stringProp name="Argument.name">token</stringProp>
    <stringProp name="Argument.value">${__P(token,)}</stringProp>
</elementProp>

<elementProp name="buid" elementType="Argument">
    <stringProp name="Argument.name">buid</stringProp>
    <stringProp name="Argument.value">${__P(buid,1)}</stringProp>
</elementProp>

<elementProp name="userId" elementType="Argument">
    <stringProp name="Argument.name">userId</stringProp>
    <stringProp name="Argument.value">${__P(userId,0)}</stringProp>
</elementProp>
```

### Step 3: Use Variables in HTTP Requests

```xml
<HTTPSamplerProxy>
    <stringProp name="HTTPSampler.domain">${baseUrl}</stringProp>
    <stringProp name="HTTPSampler.path">/checkout/v3/orders/${orderId}</stringProp>
    <elementProp name="HTTPsampler.Arguments">
        <collectionProp name="Arguments.arguments">
            <elementProp name="userId" elementType="HTTPArgument">
                <stringProp name="Argument.value">${userId}</stringProp>
            </elementProp>
        </collectionProp>
    </elementProp>
    <elementProp name="HTTPSampler.header_manager">
        <collectionProp name="HeaderManager.headers">
            <elementProp name="Authorization">
                <stringProp name="Header.value">Bearer ${token}</stringProp>
            </elementProp>
        </collectionProp>
    </elementProp>
</HTTPSamplerProxy>
```

---

## 🔧 Method 2: Using CSV Data Files

### Step 1: Generate CSV from JavaScript Test

```javascript
import fs from 'fs';
import path from 'path';

test('Generate CSV for JMeter', async ({ page }) => {
    const performanceBase = new UnifiedPerformanceBase();
    
    // Extract data from application
    const token = await page.evaluate(() => 
        window.sessionStorage.getItem('brandmuscle_token')
    );
    
    const orderData = await checkoutApi.getOrderData(token);
    
    // Generate CSV file
    const csvPath = path.resolve('./JmeterFiles/TestData/DynamicTestData.csv');
    const csvContent = [
        // Header
        'baseUrl,token,buid,setid,userId,orderId,orderLineId',
        // Data row
        `https://qa.v5stage.brandmuscle.net/api,${token},32,3211546,${userId},${orderData.orderId},${orderData.orderLineId}`
    ].join('\n');
    
    fs.writeFileSync(csvPath, csvContent, 'utf-8');
    console.log(`✓ CSV file generated: ${csvPath}`);
    
    // Now run JMeter test
    await performanceBase.addJMeterApiMetrics(
        'CONSOLIDATEDAPI_VALIDATION.jmx',
        'CSV_Test',
        {
            threadCount: 10,
            duration: 60,
            properties: {
                csvFile: 'TestData/DynamicTestData.csv'
            }
        }
    );
});
```

### Step 2: Configure CSV Data Set in JMX

```xml
<CSVDataSet>
    <stringProp name="filename">${__P(csvFile,TestData/default.csv)}</stringProp>
    <stringProp name="fileEncoding">UTF-8</stringProp>
    <stringProp name="variableNames">baseUrl,token,buid,setid,userId,orderId,orderLineId</stringProp>
    <boolProp name="recycle">true</boolProp>
    <boolProp name="stopThread">false</boolProp>
    <stringProp name="shareMode">shareMode.all</stringProp>
</CSVDataSet>
```

---

## 📊 Method 3: Using Property Files

### Step 1: Generate Properties File from JavaScript

```javascript
test('Generate Properties File', async ({ page }) => {
    const performanceBase = new UnifiedPerformanceBase();
    
    // Extract data
    const token = await page.evaluate(() => 
        window.sessionStorage.getItem('brandmuscle_token')
    );
    
    // Generate .properties file
    const propsPath = path.resolve('./JmeterFiles/TestData/test.properties');
    const propsContent = [
        `baseUrl=https://qa.v5stage.brandmuscle.net/api`,
        `token=${token}`,
        `buid=32`,
        `userId=10905866`,
        `environment=STAGE`
    ].join('\n');
    
    fs.writeFileSync(propsPath, propsContent, 'utf-8');
    
    // Run JMeter with property file
    await performanceBase.addJMeterApiMetrics(
        'CONSOLIDATEDAPI_VALIDATION.jmx',
        'Props_Test',
        {
            threadCount: 10,
            duration: 60,
            properties: {
                propertyFile: 'TestData/test.properties'
            }
        }
    );
});
```

### Step 2: Load Properties in JMX (Custom Script)

Add BeanShell PreProcessor to load properties:

```java
import java.io.FileInputStream;
import java.util.Properties;

Properties props = new Properties();
String propFile = "${__P(propertyFile,TestData/default.properties)}";
props.load(new FileInputStream(propFile));

// Set JMeter variables
props.forEach((key, value) -> {
    vars.put(key.toString(), value.toString());
});
```

---

## 🚀 Complete Example: Real-World Scenario

### Scenario: Dynamic API Testing with Session Data

```javascript
import { test } from '@playwright/test';
import UnifiedPerformanceBase from '../../Initiate/UnifiedPerformanceBase.js';
import LoginPage from '../../PageObjects/LoginPage.js';
import CheckoutAPI from '../../API/CheckoutAPI.js';

test.describe('Dynamic JMeter Test with Session Data', () => {
    const performanceBase = new UnifiedPerformanceBase();
    let page;
    let token;
    let userId;
    let orderId;

    test.beforeAll(async () => {
        await performanceBase.launchBrowserForPerformance();
        page = performanceBase.page;
    });

    test('Step1_Login_And_ExtractSessionData', async () => {
        // Login to application
        const loginPage = new LoginPage(page);
        await loginPage.login('testuser@example.com', 'password123');
        
        // Extract session data
        token = await page.evaluate(() => 
            window.sessionStorage.getItem('brandmuscle_token')
        );
        
        userId = await page.evaluate(() => 
            window.sessionStorage.getItem('userId')
        );
        
        console.log(`✓ Token extracted: ${token.substring(0, 20)}...`);
        console.log(`✓ User ID: ${userId}`);
    });

    test('Step2_CreateOrder_And_ExtractOrderData', async () => {
        // Create an order via UI or API
        const checkoutApi = new CheckoutAPI();
        const orderResponse = await checkoutApi.createOrder(token, {
            buid: 32,
            items: [{ assetId: 2846362, quantity: 1 }]
        });
        
        orderId = orderResponse.orderId;
        console.log(`✓ Order created: ${orderId}`);
    });

    test('Step3_RunJMeter_WithDynamicParameters', async () => {
        // Run JMeter with all dynamic data
        await performanceBase.addJMeterApiMetrics(
            'CONSOLIDATEDAPI_VALIDATION.jmx',
            'Dynamic_API_Test',
            {
                threadCount: 20,
                duration: 180,
                rampUpTime: 15,
                
                properties: {
                    // Base configuration
                    baseUrl: 'https://qa.v5stage.brandmuscle.net/api',
                    environment: 'STAGE',
                    
                    // Session data
                    token: token,
                    userId: userId,
                    
                    // Order data
                    orderId: orderId,
                    
                    // Business unit data
                    buid: '32',
                    setid: '3211546',
                    applicationId: '2',
                    
                    // Asset data
                    assetId: '2846362',
                    assetName: 'DynamicTestAsset.png',
                    templateFamilyId: '1140673',
                    configId: '23139',
                    
                    // Other IDs
                    personaId: '933141',
                    shippingAgentId: '193'
                }
            }
        );
    });

    test('Step4_GenerateUnifiedReport', async () => {
        // Generate report with all metrics
        performanceBase.generateUnifiedReport(
            './Reports/Dynamic_Performance_Report.html',
            'QA Business Unit',
            'STAGE'
        );
    });

    test.afterAll(async () => {
        await performanceBase.context?.close();
        await performanceBase.browser?.close();
        performanceBase.resetMetricsCollector();
    });
});
```

---

## 🎨 JMX Configuration Examples

### Example 1: User Defined Variables with Properties

```xml
<Arguments guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables">
    <collectionProp name="Arguments.arguments">
        <!-- Environment -->
        <elementProp name="baseUrl" elementType="Argument">
            <stringProp name="Argument.name">baseUrl</stringProp>
            <stringProp name="Argument.value">${__P(baseUrl,https://default.url.com/api)}</stringProp>
        </elementProp>
        
        <!-- Authentication -->
        <elementProp name="token" elementType="Argument">
            <stringProp name="Argument.name">token</stringProp>
            <stringProp name="Argument.value">${__P(token,)}</stringProp>
        </elementProp>
        
        <!-- User Data -->
        <elementProp name="userId" elementType="Argument">
            <stringProp name="Argument.name">userId</stringProp>
            <stringProp name="Argument.value">${__P(userId,0)}</stringProp>
        </elementProp>
        
        <!-- Business Unit -->
        <elementProp name="buid" elementType="Argument">
            <stringProp name="Argument.name">buid</stringProp>
            <stringProp name="Argument.value">${__P(buid,1)}</stringProp>
        </elementProp>
        
        <!-- Order Data -->
        <elementProp name="orderId" elementType="Argument">
            <stringProp name="Argument.name">orderId</stringProp>
            <stringProp name="Argument.value">${__P(orderId,)}</stringProp>
        </elementProp>
    </collectionProp>
</Arguments>
```

### Example 2: HTTP Request with Dynamic Headers

```xml
<HTTPSamplerProxy>
    <stringProp name="HTTPSampler.domain">${baseUrl}</stringProp>
    <stringProp name="HTTPSampler.port"></stringProp>
    <stringProp name="HTTPSampler.protocol">https</stringProp>
    <stringProp name="HTTPSampler.path">/checkout/v3/orders/${orderId}</stringProp>
    <stringProp name="HTTPSampler.method">GET</stringProp>
    
    <HeaderManager>
        <collectionProp name="HeaderManager.headers">
            <elementProp name="Authorization" elementType="Header">
                <stringProp name="Header.name">Authorization</stringProp>
                <stringProp name="Header.value">Bearer ${token}</stringProp>
            </elementProp>
            <elementProp name="Content-Type" elementType="Header">
                <stringProp name="Header.name">Content-Type</stringProp>
                <stringProp name="Header.value">application/json</stringProp>
            </elementProp>
            <elementProp name="X-User-Id" elementType="Header">
                <stringProp name="Header.name">X-User-Id</stringProp>
                <stringProp name="Header.value">${userId}</stringProp>
            </elementProp>
        </collectionProp>
    </HeaderManager>
</HTTPSamplerProxy>
```

### Example 3: POST Request with Dynamic Body

```xml
<HTTPSamplerProxy>
    <stringProp name="HTTPSampler.domain">${baseUrl}</stringProp>
    <stringProp name="HTTPSampler.path">/checkout/v3/orders</stringProp>
    <stringProp name="HTTPSampler.method">POST</stringProp>
    <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
    
    <elementProp name="HTTPsampler.Arguments">
        <collectionProp name="Arguments.arguments">
            <elementProp name="" elementType="HTTPArgument">
                <boolProp name="HTTPArgument.always_encode">false</boolProp>
                <stringProp name="Argument.value"><![CDATA[{
  "userId": ${userId},
  "buid": ${buid},
  "items": [
    {
      "assetId": ${assetId},
      "assetName": "${assetName}",
      "quantity": 1
    }
  ],
  "shippingAgentId": ${shippingAgentId}
}]]></stringProp>
            </elementProp>
        </collectionProp>
    </elementProp>
</HTTPSamplerProxy>
```

---

## 🔍 Debugging JMeter Parameters

### Method 1: Add Debug Sampler to JMX

```xml
<DebugSampler>
    <stringProp name="DebugSampler.displayJMeterProperties">true</stringProp>
    <stringProp name="DebugSampler.displayJMeterVariables">true</stringProp>
    <stringProp name="DebugSampler.displaySystemProperties">false</stringProp>
</DebugSampler>
```

### Method 2: Log Properties in JavaScript

The updated JMeterOrchestrator now logs all custom properties:

```
[INFO] Starting JMeter test: MyTest
[INFO]   JMX File: CONSOLIDATEDAPI_VALIDATION.jmx
[INFO]   Threads: 15, Duration: 120s, Ramp-up: 10s
[INFO]   Custom property: baseUrl=https://qa.v5stage.brandmuscle.net/api
[INFO]   Custom property: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[INFO]   Custom property: userId=10905866
[INFO]   Custom property: orderId=12345678
```

---

## 📋 Quick Reference: Property Function

In JMX files, use this syntax:

```
${__P(propertyName,defaultValue)}
```

**Examples:**
- `${__P(baseUrl,https://default.com)}` - Property with default
- `${__P(token,)}` - Property with empty default
- `${__P(threads,1)}` - Numeric property with default 1
- `${__P(duration,60)}` - Duration with default 60 seconds

**Built-in Properties** (automatically available):
- `${__P(threads,1)}` - Thread count
- `${__P(duration,60)}` - Test duration
- `${__P(rampUp,1)}` - Ramp-up time

---

## ✅ Best Practices

1. **Always provide default values** in JMX:
   ```xml
   ${__P(baseUrl,https://default.url.com)}
   ```

2. **Extract dynamic data in separate test**:
   ```javascript
   test('Step1_ExtractData', async () => { ... });
   test('Step2_RunJMeter', async () => { ... });
   ```

3. **Validate data before passing to JMeter**:
   ```javascript
   if (!token || !userId) {
       throw new Error('Missing required session data');
   }
   ```

4. **Use environment-specific base URLs**:
   ```javascript
   const baseUrl = env === 'PROD' 
       ? 'https://qa.brandmuscle.net/api'
       : 'https://qa.v5stage.brandmuscle.net/api';
   ```

5. **Log all parameters for debugging**:
   ```javascript
   console.log('JMeter Parameters:', JSON.stringify(properties, null, 2));
   ```

---

## 🎯 Summary

**You can now parameterize JMX files in 3 ways:**

1. ✅ **Command-line properties** (via `options.properties`) - **RECOMMENDED**
2. ✅ **CSV data files** (generate CSV from JavaScript)
3. ✅ **Property files** (generate .properties from JavaScript)

**The framework automatically:**
- Passes all properties as `-Jproperty=value`
- Logs each custom property for debugging
- Supports any number of custom parameters
- Works with existing JMX files

**Next steps:**
1. Update your JMX file to use `${__P(propertyName,default)}`
2. Pass `properties: {}` object in your test
3. Extract dynamic data from your application
4. Run JMeter with parameterized values

🚀 **Your JMX files are now fully dynamic!**
