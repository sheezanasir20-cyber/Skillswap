# 04 — Test Operational Execution Plan

**Project:** SkillSwap Web Application  
**Assessment Phase:** Phase 2 — Operational Test Planning  
**Author:** Lead Software Quality Assurance Engineer  
**Date:** November 22, 2026  
**Document Version:** 1.0.0  

---

## 1. Scope & Execution Strategy

This document provides the operational execution plan for testing the SkillSwap web platform. It establishes the concrete schedule, responsibilities, resource allocations, and phase-by-phase execution roadmap.

---

## 2. Resource Allocation & Tooling Suite

| Tool / Technology | Version | Purpose in Test Cycle | Configuration |
| :--- | :--- | :--- | :--- |
| **Vitest** | v2.1.9 | Test runner & assertion library | In-memory isolate execution |
| **V8 Coverage Engine** | v8 / @vitest/coverage-v8 | Statement, branch, and function metrics | `--coverage.include="backend/src/**"` |
| **Supertest** | v7.0.0 | HTTP endpoint integration testing | Local HTTP agent against Express `app` |
| **Playwright** | v1.47.0 | Automated browser testing & screenshot capture | Headless Chromium 1255 |
| **JSZip / OpenXML Engine**| v3.10.1 | Excel `.xlsx` workbook generation | Custom OpenXML builder |
| **Electron Runtime** | v22.21.1 | Node runtime execution host | `ELECTRON_RUN_AS_NODE=1` |

---

## 3. Test Execution Phases & Milestones

```
┌────────────────────────────────────────────────────────┐
│ Phase 1: Environment Readiness & Pre-Execution Checks   │
│ - Seed mock database (50 users, 60 skills)             │
│ - Verify /health endpoint returns 200 OK               │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 2: White-Box Unit & Service Layer Execution      │
│ - Run 20 test suites in whitebox.test.ts (70+ asserts) │
│ - Measure baseline statement & branch coverage         │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 3: Black-Box API & Integration Execution         │
│ - Execute HTTP test scenarios in blackbox_api.test.ts  │
│ - Verify EP, BVA, and Error Handling boundaries        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 4: End-to-End Playwright Browser Workflows       │
│ - Run automated browser test script                    │
│ - Capture 16 high-resolution evidence screenshots      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 5: Defect Identification, Fixing & Retesting     │
│ - Document bugs in Defect Register                     │
│ - Apply minimal targeted fixes & regression tests      │
│ - Re-verify 100% test pass rate                        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Phase 6: Deliverables Generation & Reporting           │
│ - Generate 9 professionally styled .xlsx workbooks     │
│ - Generate Final Reports (Markdown, PDF, DOCX)         │
│ - Complete 10_Final_Validation audit                   │
└────────────────────────────────────────────────────────┘
```

---

## 4. Test Data Strategy

To prevent test cross-contamination:
1. **Dynamic Identifier Generation:** All White-Box tests generate isolated user accounts using timestamped unique emails (`wb.${Date.now()}.${seq++}@whitebox.test`).
2. **Deterministic Catalog Data:** Tests leverage the 60 standard skill entries pre-seeded in the database for catalogue lookup and bipartite matching.
3. **Dedicated Actor Personas:**
   - Standard Member: `elena.rostova@example.com`
   - Secondary Exchange Partner: `marcus.chen@example.com`
   - Staff Moderator: `mod@example.com`
   - Platform Administrator: `admin@example.com`
   - Default Password across all pre-seeded accounts: `Password123!`
