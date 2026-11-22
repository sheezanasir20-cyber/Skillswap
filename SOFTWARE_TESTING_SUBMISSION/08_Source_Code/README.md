# Automated Test Suites & Runner Source Code

This directory documents the automated test suites and execution procedures implemented for the SkillSwap application.

---

## 1. Test Architecture & Source Code Locations

To prevent redundant file duplication across the repository, the canonical automated test suites are maintained within the core project test directory:

| Test Suite / Scope | File Location | Description |
|---|---|---|
| **White-Box Unit & Integration** | `backend/tests/whitebox.test.ts` | 20 test suites evaluating internal control flow, branches, state machines, loop boundaries, and exception paths using Vitest. |
| **Black-Box REST API Integration** | `backend/tests/blackbox_api.test.ts` | 44 test suites covering Equivalence Partitioning, Boundary Value Analysis, Decision Tables, Security, and Error Handling via Supertest. |

---

## 2. Test Execution Commands

### A. Run All 64 Automated Test Suites
```powershell
# From project root
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run
```

### B. Run Individual Test Suites
```powershell
# Execute White-Box test suite
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run backend/tests/whitebox.test.ts

# Execute Black-Box REST API test suite
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run backend/tests/blackbox_api.test.ts
```

### C. Run Code Coverage Analysis
```powershell
# Generate statement, branch, and line coverage metrics
.\tools\node.cmd .\node_modules\vitest\vitest.mjs run --coverage
```

---

## 3. Pre-Generated Deliverables Notice

All required testing artifacts, including:
- **10 Multi-Sheet OpenXML `.xlsx` Workbooks** (located in `01_Project_Analysis/`, `03_Test_Cases/`, `04_Test_Execution/`, `05_Bug_Tracking/`, `06_Coverage/`, `07_Evidence/`)
- **16 High-Resolution PNG Screenshots** (located in `07_Evidence/screenshots/`)
- **Executive PDF & DOCX Reports** (located in `09_Reports/`)

are pre-generated, validated, and permanently archived within their respective submission folders. Generation scripts have been retired post-build to prevent script duplication and runtime overhead.
