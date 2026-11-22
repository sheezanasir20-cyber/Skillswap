# IEEE 829 Software Test Plan (STP)
## SkillSwap Reciprocal Skill Exchange Platform

**Document Identifier:** STP-SKILLSWAP-2026-V1  
**Project:** SkillSwap Web Application  
**Standard Compliance:** IEEE Std 829-2008 Standard for Software and System Test Documentation  
**Date:** November 22, 2026  
**Status:** Approved for Execution  

---

## 1. Introduction & Purpose

The purpose of this Software Test Plan (STP) is to prescribe the scope, approach, resources, schedule, and evaluation criteria for the verification and validation of the SkillSwap web application. The platform provides peer-to-peer reciprocal skill matching, structured session management, direct messaging, reputation feedback, and staff moderation.

---

## 2. Test Items & Architectural Scope

The following software items are subject to formal verification:
1. **Core Domain Services:** `AuthService`, `MembersService`, `SkillsService`, `MatchingService`, `ConnectionsService`, `SessionsService`, `MessagingService`, `ReviewsService`, `ReportsService`, `ModerationService`, `AdminService`, `AuditService`.
2. **State Machines:**
   - Connection Request Lifecycle (`pending` → `accepted` / `rejected` / `cancelled` / `blocked`).
   - Session Scheduling Lifecycle (`proposed` → `confirmed` → `completed` / `declined` / `cancelled` / `rescheduled`).
3. **HTTP REST Endpoints:** Express routing layer (`/api/v1/*`) including Zod payload validation, authentication middleware, error handlers, and response transformers.
4. **Client-Side User Interface:** React 18 Single Page Application (`/app/*`, `/staff/*`, public landing pages).

### Out of Scope
- Third-party email SMTP delivery network latency (verified via mock transport log capture).
- Physical server hardware fault tolerance and multi-region database failover.

---

## 3. Features to be Tested (Functional Matrix)

| Test Item ID | Feature Description | Testing Technique | Primary Test Type |
| :--- | :--- | :--- | :--- |
| **F-01** | User Registration & Email Normalization | Equivalence Partitioning / Statement | Unit & API |
| **F-02** | Login & Suspended Account Enforcement | Boundary / Branch Coverage | Unit & API |
| **F-03** | Password Recovery & Reset Flow | Decision Matrix / Path Coverage | Unit & API |
| **F-04** | Member Profile & Bio Update | Boundary Value Analysis | Unit & UI |
| **F-05** | Availability Slot Interval Replacement | Branch & Exception Coverage | Unit & API |
| **F-06** | Skill Catalog & Duplicate Intent Guard | Equivalence Partitioning | Unit & API |
| **F-07** | Bipartite Reciprocal Matching Engine | Loop & Path Coverage | Unit |
| **F-08** | Bilateral Connection Handshake | State Machine & Branch Coverage | Unit & API |
| **F-09** | Rejection Reversal & Requester Swapping | Condition & Branch Coverage | Unit |
| **F-10** | Bilateral Messaging & Non-participant Guard| Fault Injection & Security | Unit & UI |
| **F-11** | Session Proposal & Conflict Detection | Boundary & Branch Coverage | Unit & API |
| **F-12** | Session Confirmation & Rescheduling Flow | State Machine & Path Coverage | Unit & API |
| **F-13** | Review Submission & Completed Guard | Boundary Value Analysis | Unit & API |
| **F-14** | Report Creation & Duplicate Guard | Exception Handling | Unit & API |
| **F-15** | Moderator Resolution & Account Warnings | RBAC & Branch Coverage | Unit & UI |
| **F-16** | Admin Role Demotion/Promotion with Audit | Condition & Statement Coverage | Unit & API |
| **F-17** | Background Reminder Worker Polling | Loop & Exception Coverage | Integration |

---

## 4. Approach & Methodology

Testing proceeds through four structured stages:
1. **Stage 1 — Unit & Service Level (White-Box):** Executed using Vitest against isolated domain services. Verifies logic branches, mathematical calculations, and boundary conditions.
2. **Stage 2 — API Integration Level (Black-Box):** Uses Supertest against active Express routes. Verifies HTTP status codes, Zod schema validation errors, and authentication barriers.
3. **Stage 3 — End-to-End System Level (Black-Box UI):** Uses Playwright headless Chromium. Drives real DOM interactions, verifies visual state, and captures high-resolution evidence screenshots.
4. **Stage 4 — Regression Verification:** Executed following code fixes to confirm that identified bugs are resolved without unintended side effects.

---

## 5. Item Pass / Fail Criteria

### 5.1 Unit & API Test Pass Criteria
- An individual test passes if and only if:
  1. The actual HTTP status code matches the expected code (e.g. 200, 201, 400, 401, 403, 404, 409).
  2. The response body matches expected JSON schemas without unexpected fields.
  3. No unhandled exceptions or memory leaks are emitted.

### 5.2 Overall Test Suite Exit Criteria
- **100% of planned tests executed.**
- **Pass rate of executed tests ≥ 98% (target 100% post-retest).**
- **Zero open Critical (P1) or High (P2) severity defects.**
- **Statement coverage on core domain services ≥ 75%.**
- **All defect fixes validated by dedicated regression test cases.**

---

## 6. Suspension and Resumption Criteria

- **Suspension:** Testing is suspended if the test database fails to initialize or the Node.js API server fails to bind to port 4000.
- **Resumption:** Testing resumes once the server environment is re-stabilized and verified via `GET /health`.

---

## 7. Test Deliverables

1. **IEEE 829 Software Test Plan** (`Software_Test_Plan.md`)
2. **Project Analysis and Feature Inventory** (`01_Project_Analysis.md`, `02_Feature_Inventory.xlsx`)
3. **White-Box Test Specification** (`05_White_Box_Test_Cases.xlsx`)
4. **Black-Box Test Specification** (`06_Black_Box_Test_Cases.xlsx`, `Detailed_Test_Cases.xlsx`)
5. **Master Testing Dashboard** (`Master_Testing_Dashboard.xlsx`)
6. **Execution Log and Test Evidence** (`07_Test_Execution_Log.xlsx`, screenshots, logs)
7. **Defect and Regression Reports** (`08_Bug_Report.xlsx`, `09_Regression_Test_Report.xlsx`, `Bug_Fix_Report.md`)
8. **Final Software Testing Report** (`Final_Software_Testing_Report.md`, `.pdf`, `.docx`)
