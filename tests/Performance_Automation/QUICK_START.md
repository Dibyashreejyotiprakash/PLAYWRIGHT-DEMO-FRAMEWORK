# Quick Start Guide - Enhanced Performance Testing

## 🚀 Quick Start (5 Minutes)

### Step 1: Verify Prerequisites
```bash
# Make sure you have Node.js installed
node --version

# Install dependencies if needed
npm install
```

### Step 2: Configure Environment
Create or update `.env` file:
```env
browsername=chromium
environment=prod
prod_url=https://opensource-demo.orangehrmlive.com
```

### Step 3: Run Your First Test
```bash
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js --headed
```

### Step 4: View Results
- **Console:** See real-time progress in terminal
- **HTML Report:** Open `Reports/Comprehensive_Performance_Report.html` in browser

---

## 📝 Customize Your Test (2 Minutes)

### Add Your URLs
Edit [ComprehensivePerformanceTest.spec.js](./ComprehensivePerformanceTest.spec.js) line 29-38:

```javascript
const pagesToTest = [
    {
        name: 'Your Home Page',
        url: 'https://your-website.com'
    },
    {
        name: 'Your Product Page',
        url: 'https://your-website.com/products'
    }
];
```

### Change Number of Runs
Edit line 27:
```javascript
const NUM_RUNS = 5; // Change from 3 to 5
```

### Customize Report Name
Edit line 94-98:
```javascript
const businessUnit = 'My Company Name';
const reportPath = await EnhancedPerformanceReporter.generateEnhancedReport(
    allTestResults,
    'My_Custom_Report.html',  // Your custom name
    businessUnit,
    environment
);
```

---

## 🎯 Common Commands

### Run Tests
```bash
# Run with browser visible
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js --headed

# Run in background (headless)
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js

# Run with debug mode
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js --debug

# Run specific test only
npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js -g "Comprehensive Performance"
```

### View Reports
```bash
# Open HTML report in default browser (Windows)
start Reports/Comprehensive_Performance_Report.html

# Open HTML report in default browser (Mac)
open Reports/Comprehensive_Performance_Report.html

# Open HTML report in default browser (Linux)
xdg-open Reports/Comprehensive_Performance_Report.html
```

---

## 📊 Understanding the Report

### Performance Badges
- 🟢 **Excellent** = Fast (LCP < 1s, SI < 1s)
- 🔵 **Good** = Acceptable (LCP 1-2.5s, SI 1-2s)  
- 🟡 **Average** = Moderate (LCP 2.5-4s, SI 2-3.5s)
- 🔴 **Needs Improvement** = Slow (LCP > 4s, SI > 3.5s)

### Key Metrics
- **LCP** = Largest Contentful Paint (when main content loads)
- **SI** = Speed Index (how quickly content appears)

### Report Sections
1. **Performance Summary** - Overview with averages and ratings
2. **Detailed Metrics** - All individual runs (Run 1, 2, 3)
3. **Legend** - Performance threshold explanations

---

## 🔧 Quick Troubleshooting

### ❌ Error: "Lighthouse only supports Chromium"
**Fix:** Update `.env` file:
```env
browsername=chromium
```

### ❌ Error: "CDP port already in use"
**Fix:** Close all Chrome browsers and try again

### ❌ Report shows "N/A" values
**Fix:** Check internet connection and try again

### ❌ Test is very slow
**Fix:** Reduce number of runs temporarily:
```javascript
const NUM_RUNS = 1; // Quick test
```

---

## 💡 Pro Tips

### Tip 1: Test with Clean Browser
For accurate results, the test automatically uses a clean browser state.

### Tip 2: Run Multiple Times
For production benchmarks, use 5-10 runs:
```javascript
const NUM_RUNS = 10;
```

### Tip 3: Compare Environments
Test both staging and production:
```bash
# Test production
environment=prod npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js

# Test staging
environment=stage npx playwright test tests/Performance_Automation/ComprehensivePerformanceTest.spec.js
```

### Tip 4: Schedule Regular Tests
Run daily/weekly to track performance trends over time.

---

## 📁 Where Are My Reports?

All reports are saved in:
```
PLAYWRIGHT-DEMO-FRAMEWORK/
└── Reports/
    └── Comprehensive_Performance_Report.html
```

---

## 🎓 Next Steps

1. ✅ Run your first test
2. ✅ Customize URLs for your application
3. ✅ Set performance budgets in `performancetestdata.json`
4. ✅ Schedule automated runs
5. ✅ Share reports with team

---

## 📚 Need More Help?

- **Full Documentation:** [README_PERFORMANCE.md](./README_PERFORMANCE.md)
- **Example Test Files:**
  - [ComprehensivePerformanceTest.spec.js](./ComprehensivePerformanceTest.spec.js) - Recommended
  - [EnhancedMultiPagePerformanceTest.spec.js](./EnhancedMultiPagePerformanceTest.spec.js) - Alternative

---

## 🎨 Sample Report Preview

Your report will look like this:

```
╔════════════════════════════════════════════════════════════╗
║          Enhanced Performance Test Summary                ║
╠════════════════════════════════════════════════════════════╣
║ 1. Login Page                                             ║
║    LCP:    R1: 390ms    R2: 400ms    R3: 430ms           ║
║    SI:     R1: 1890ms   R2: 1870ms   R3: 1970ms          ║
║    Avg:    LCP: 407ms        SI: 1910ms                  ║
╠════════════════════════════════════════════════════════════╣
║ HTML Report: Reports/Comprehensive_Performance_Report.html║
╚════════════════════════════════════════════════════════════╝
```

---

**Happy Testing! 🎉**
