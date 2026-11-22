# 03 — Software Testing Strategy

**Project Name:** SkillSwap Web Application  
**Assessment Phase:** Phase 2 — Testing Strategy and Methodological Framework  
**Author:** Lead Software Quality Assurance Engineer  
**Date:** November 22, 2026  
**Document Version:** 1.0.0  

---

## 1. Introduction & Objectives

The primary objective of this testing strategy is to define a rigorous, reproducible, and verifiable quality assurance framework for the SkillSwap web platform. The strategy guarantees full-spectrum verification by applying two complementary paradigms:

1. **White-Box Testing (Structural Verification):** Analyzing the internal implementation, execution paths, branch conditions, state transitions, exception handlers, and loops within all service classes, validation schemas, and middlewares.
2. **Black-Box Testing (Behavioral & Specification Verification):** Evaluating system functionality exclusively from the external user/API perspective against functional requirements, edge conditions, boundary values, equivalence partitions, and decision matrices.

---

## 2. Testing Levels & Pyramidal Distribution

The verification architecture is organized according to an industry-standard testing pyramid:

```
                    ┌────────────────────────┐
                    │      End-to-End UI     │  ~15% (Playwright Browser Tests)
                    │  (Visual & Workflows)  │
                    ├────────────────────────┤
                    │    Integration & API   │  ~35% (Supertest HTTP Scenarios)
                    │  (HTTP / Auth / Zod)   │
                    ├────────────────────────┤
                    │   White-Box / Services │  ~50% (Vitest Unit & Logic Tests)
                    │  (State Machines / DB) │
                    └────────────────────────┘
```

### Level 1: Unit & Service Layer (White-Box)
- **Scope:** Individual TypeScript domain services (`AuthService`, `MembersService`, `SkillsService`, `MatchingService`, `ConnectionsService`, `SessionsService`, `MessagingService`, `ReviewsService`, `ReportsService`, `ModerationService`, `AdminService`, `AuditService`).
- **Tools:** Vitest v2.1.9 with V8 native coverage engine.
- **Goal:** Achieve >80% statement coverage and >85% branch coverage across state machines and core business logic.

### Level 2: API & Integration Layer (Black-Box & Middleware)
- **Scope:** Express router endpoints, HTTP status codes, request validation, cookie management, JWT verification, rate limiting, and RBAC authorization barriers.
- **Tools:** Supertest v7.0.0 integrated into Vitest suites.
- **Goal:** Verify that all HTTP responses adhere to RFC specifications, return structured JSON bodies, and gracefully reject malformed inputs.

### Level 3: End-to-End System & UI Layer (Black-Box Workflows)
- **Scope:** Full user journeys executed in a real browser: User Registration → Discovery → Connection Request → Session Scheduling → Instant Messaging → Feedback Submission → Staff Moderation.
- **Tools:** Playwright v1.47 with headless Chromium.
- **Goal:** Capture high-resolution visual evidence, confirm DOM state updates, and ensure layout stability under genuine user interaction.

---

## 3. White-Box Testing Techniques & Coverage Criteria

The structural testing engine analyzes code execution paths using the following formal techniques:

### 3.1 Statement Coverage
Every executable statement in critical domain services must be triggered at least once during test execution. Statement coverage ensures no dead code exists within the primary execution corridors.

### 3.2 Branch & Decision Coverage
Every decision point (e.g. `if (existingUser)`, `if (session.status !== 'confirmed')`, `if (conn.status === 'blocked')`) must evaluate to both `true` and `false` across distinct test scenarios. This is especially vital for:
- State machine transition guards in `SessionStateMachine` and `ConnectionsService`.
- Account status verification in `AuthService` (`active` vs `suspended` vs `deleted`).
- Duplicate detection in `ReportsService` and `SkillsService`.

### 3.3 Condition & Multiple Condition Coverage
Where compound Boolean logic exists (e.g., `if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator'))`), test cases must independently verify each sub-condition to ensure short-circuit evaluation behaves as specified.

### 3.4 Exception & Error Path Coverage
Deliberate fault injection is applied to ensure that:
- Non-existent IDs trigger `NotFoundError` (HTTP 404).
- Identity collisions trigger `ConflictError` (HTTP 409).
- Unauthorized actions trigger `ForbiddenError` (HTTP 403) or `UnauthorizedError` (HTTP 401).
- Zod validation errors trigger `ValidationError` (HTTP 400).

### 3.5 Loop Testing
For iterative structures (e.g., calculating bipartite skill overlap in `MatchingEngine`, aggregating platform statistics over date buckets, and processing queued notifications in `ReminderWorker`):
- **Zero iterations:** Empty skill catalog or no queued notifications.
- **Single iteration:** Exactly one candidate or notification.
- **Multiple iterations:** 50 mock users across 60 skills.

---

## 4. Black-Box Testing Techniques & Specifications

### 4.1 Equivalence Partitioning (EP)
Input domains are partitioned into valid and invalid classes, selecting representative test vectors from each partition:
- **Email:** Valid (`user@example.com`), Missing domain (`user@`), Missing `@` (`userexample.com`), Empty (`""`), Whitespace-only (`"   "`).
- **Password:** Valid strong (`Password123!`), Below min length (`Pass1!`), Missing number (`Password!`), Missing letters (`12345678!`).
- **Rating:** Valid integer (`1, 2, 3, 4, 5`), Sub-boundary integer (`0`), Super-boundary integer (`6`), Floating point (`4.5`), Negative (`-1`).

### 4.2 Boundary Value Analysis (BVA)
Input values are tested exactly at boundaries, one below minimum, and one above maximum:
- **Display Name (2 to 60 characters):** 1 char (Invalid), 2 chars (Valid Min), 3 chars (Valid Min+1), 59 chars (Valid Max-1), 60 chars (Valid Max), 61 chars (Invalid).
- **Session Duration (15 to 480 minutes):** 14 mins (Invalid), 15 mins (Valid Min), 480 mins (Valid Max), 481 mins (Invalid).
- **Review Rating (1 to 5):** 0 (Invalid), 1 (Valid Min), 2 (Valid Min+1), 4 (Valid Max-1), 5 (Valid Max), 6 (Invalid).

### 4.3 Decision Table Testing
Complex multi-variable decision logic is formalized in truth tables:
- **Session Confirmation Decision:** (Is Participant? × Is Status Proposed? × Is Future Time? × Is Overlapping Free?) → Confirm / Reject.
- **Staff Access Decision:** (Is Authenticated? × Role == Admin? × Role == Moderator?) → Allow / 401 / 403.

### 4.4 Use Case-Based Scenario Testing
Tests mirror actual human usage workflows:
- **Workflow A (Full Exchange Lifecycle):** Member Registration → Search Directory → Connection Request → Partner Accepts → Chat Messages Exchanged → Session Proposed & Confirmed → Session Completed → Reciprocal Reviews Submitted.
- **Workflow B (Moderation & Safety Lifecycle):** Offending Profile Reported → Report Appears in Staff Queue → Moderator Reviews → Formal Warning Issued → Account Suspended → Suspended Member Attempting Login Rejected.

---

## 5. Test Environment & Configuration

| Parameter | Specification | Details |
| :--- | :--- | :--- |
| **Operating System** | Windows 11 Enterprise (x64) | Host execution platform |
| **Node.js Runtime** | Node.js v22.21.1 (Electron AS NODE) | High-performance V8 engine |
| **Test Database** | Dual-Engine: In-Memory DB & Prisma Client | Isolated in-memory repository for zero side effects |
| **API Host** | `http://localhost:4000` | Express REST server |
| **UI Host** | `http://localhost:3000` | Vite dev server |
| **Headless Browser** | Chromium v1255 | Playwright automated browser |
| **Seed State** | 50 Members, 60 Skills, 206 User-Skills | Deterministic mock data set |

---

## 6. Defect Management & Resolution Procedure

When an automated test or manual inspection reveals a defect:
1. **Defect Logging:** Record Bug ID, affected module, exact reproduction steps, expected behavior, and observed failure.
2. **Severity & Priority Classification:**
   - **Critical (P1):** System crash, security bypass, or data corruption.
   - **High (P2):** Core user flow blocked without available workaround.
   - **Medium (P3):** Edge-case validation failure or boundary error.
   - **Low (P4):** Cosmetic, typography, or alignment issue.
3. **Targeted Root Cause Analysis & Fix:** Apply the smallest viable code correction without architectural disruption.
4. **Regression Verification:** Implement an automated regression test exercising the formerly failing path.
5. **Retest Execution:** Re-run the full test suite to guarantee 100% pass rate.
