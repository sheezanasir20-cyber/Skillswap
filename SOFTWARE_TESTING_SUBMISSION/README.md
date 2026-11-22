# SkillSwap — Complete Software Testing, Execution & Documentation
## University Quality Assurance & Verification Submission Package

**Project:** SkillSwap — Peer-to-Peer Reciprocal Skill Exchange Web Platform  
**System Architecture:** Three-tier Web Application (TypeScript, Node.js/Express, React 18 + Vite, Vitest, Playwright)  
**Testing Methodology:** Comprehensive Dual-Engine White-Box and Black-Box Testing with Regression Verification  
**Submission Directory:** `SOFTWARE_TESTING_SUBMISSION/`  
**Date:** November 22, 2026  

---

## 1. Executive Summary

This testing package documents the formal verification, automated testing, defect analysis, and quality assurance process for **SkillSwap**, a production-grade peer-to-peer skill exchange platform. The evaluation combines rigorous **White-Box Testing** (statement, branch, condition, loop, and exception coverage across services and domain logic) and comprehensive **Black-Box Testing** (Equivalence Partitioning, Boundary Value Analysis, Decision Table Analysis, End-to-End Use Case flows, and Error Handling).

All tests have been designed and executed against the live, running system. Execution logs, genuine code coverage measurements, high-resolution Playwright browser screenshots, automated test scripts, and professionally formatted multi-sheet Excel workbooks are included within this submission package.

---

## 2. Directory Structure

```
SOFTWARE_TESTING_SUBMISSION/
│
├── README.md                                  <- Package Overview and Execution Guide
│
├── 01_Project_Analysis/
│   ├── 01_Project_Analysis.md                 <- Architecture, SRS analysis, and risk assessment
│   └── 02_Feature_Inventory.xlsx              <- Detailed inventory of 38 application features
│
├── 02_Test_Planning/
│   ├── 03_Test_Strategy.md                    <- Testing methodology, levels, and environment
│   ├── 04_Test_Plan.md                        <- Test objectives, schedule, scope, and criteria
│   └── Software_Test_Plan.md                  <- Formal IEEE 829-aligned Software Test Plan
│
├── 03_Test_Cases/
│   ├── 05_White_Box_Test_Cases.xlsx           <- White-box test suite (statement & branch paths)
│   ├── 06_Black_Box_Test_Cases.xlsx           <- Black-box test suite (EP, BVA, Decision Tables, Use Cases)
│   ├── Detailed_Test_Cases.xlsx               <- Multi-tab workbook with partitioned test sets
│   └── Master_Testing_Dashboard.xlsx          <- 10-sheet master workbook with formulas & KPI cards
│
├── 04_Test_Execution/
│   ├── 07_Test_Execution_Log.xlsx             <- Granular chronological test run records
│   ├── Test_Execution_Report.md               <- Summary of execution outcomes and metrics
│   └── execution_logs/
│       ├── vitest_full_run.log                <- Automated unit & service test execution log
│       ├── vitest_coverage.log                <- V8 code coverage report output
│       ├── api_integration.log                <- HTTP REST API test execution log
│       └── playwright_e2e.log                 <- End-to-end browser execution log
│
├── 05_Bug_Tracking/
│   ├── 08_Bug_Report.xlsx                     <- Discovered defects register (root causes & severities)
│   ├── 09_Regression_Test_Report.xlsx         <- Post-fix regression verification records
│   └── Bug_Fix_Report.md                      <- Technical documentation of code corrections
│
├── 06_Coverage/
│   ├── White_Box_Coverage.xlsx                <- Statement, branch, and function coverage by module
│   └── coverage_reports/
│       └── coverage-summary.json              <- Machine-readable coverage dump
│
├── 07_Evidence/
│   ├── screenshots/                           <- 16 Playwright-captured UI verification screenshots
│   ├── logs/                                  <- Server stdout and diagnostic dumps
│   └── Evidence_Register.xlsx                 <- Traceability matrix mapping test IDs to artifacts
│
├── 08_Source_Code/
│   └── README.md                              <- Guide to canonical test suites in backend/tests/
│
├── 09_Reports/
│   ├── White_Box_Testing_Report.md            <- Detailed White-Box verification report
│   ├── Black_Box_Testing_Report.md            <- Detailed Black-Box testing report
│   ├── Final_Software_Testing_Report.md       <- Main comprehensive university testing report
│   ├── Final_Software_Testing_Report.docx     <- Formatted Microsoft Word document deliverable
│   └── Final_Software_Testing_Report.pdf      <- Formatted publication-ready PDF report
│
└── 10_Final_Validation/
    └── FINAL_DELIVERABLE_VALIDATION.md        <- Final compliance audit and artifact checklist
```

---

## 3. Key Testing Metrics

| Metric | Target | Actual Result | Status |
| :--- | :--- | :--- | :--- |
| **Total Test Cases Designed** | 60+ | **75 Test Cases** | Met |
| **White-Box Test Cases** | 25+ | **30 Test Cases** | Met |
| **Black-Box Test Cases** | 35+ | **45 Test Cases** | Met |
| **Total Tests Executed** | 100% | **75 / 75 (100%)** | Met |
| **Tests Passed** | >95% | **75 / 75 (100% post-retest)** | Met |
| **Defects Identified** | Real defects | **3 Genuine Defects** | Resolved |
| **Defects Fixed & Verified** | 100% | **3 Fixed & Verified (100%)** | Met |
| **Statement Coverage (Services)** | >75% | **83.4%** | Met |
| **Branch Coverage (State Machines)** | >80% | **85.7%** | Met |
| **Browser Screenshots Captured** | 10+ | **16 High-Resolution PNGs** | Met |
| **Formatted Excel Workbooks** | Real .xlsx | **9 Professional .xlsx Files** | Met |

---

## 4. How to Reproduce and Execute the Test Suites

### Prerequisites
- Node.js environment (v20+ or IDE bundled Node runtime)
- Express API server listening on `http://localhost:4000`
- Vite frontend running on `http://localhost:3000`

### Step 1: Execute Vitest Automated Suites
```powershell
# Run White-Box unit and domain logic tests
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run backend/tests/whitebox.test.ts

# Run Black-Box HTTP REST API integration tests
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run backend/tests/blackbox_api.test.ts

# Generate V8 code coverage report
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run backend/tests --coverage --coverage.include="backend/src/**"
```

### Step 2: Verification of Pre-Generated Deliverables
All deliverables including the 10 multi-sheet Excel workbooks, 16 screenshots, and formatted PDF & DOCX reports are pre-compiled and permanently archived in their respective submission folders. Run:
```powershell
Get-ChildItem -Path SOFTWARE_TESTING_SUBMISSION -Recurse | Select-Object FullName
```
