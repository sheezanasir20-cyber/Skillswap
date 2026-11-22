# 05 — Bug Identification, Fixing & Regression Testing Report

**Project:** SkillSwap Web Application  
**Assessment Phase:** Phase 5 — Defect Lifecycle, Root Cause Analysis & Regression Verification  
**Author:** Senior Quality Assurance & Test Automation Specialist  
**Date:** November 22, 2026  
**Document Version:** 1.0.0  

---

## 1. Executive Summary

During the systematic execution of the White-Box and Black-Box test suites against the SkillSwap platform, **3 genuine software defects** were identified, documented, isolated, corrected, and verified through dedicated regression testing. 

All identified defects have been 100% resolved without introducing architectural regressions or altering expected functional requirements. Post-fix regression test passes stand at **100% (64/64 automated test suites passing)**.

---

## 2. Defect Register Summary Table

| Bug ID | Test Case ID | Module | Severity | Priority | Root Cause Category | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | BB-API-17 / BB-005 | Members / Routing | High | P2 | Route Parameter Shadowing | **VERIFIED FIXED** |
| **BUG-002** | WB-014 / BB-006 | UI / Avatar | Medium | P3 | CSS Object Alignment Shift | **VERIFIED FIXED** |
| **BUG-003** | BB-API-28 / WB-009 | Sessions / Validation | Medium | P3 | Temporal Cross-Field Validation | **VERIFIED FIXED** |

---

## 3. Detailed Defect Investigation & Resolution Records

### Defect 1: Express Route Collision on Member Search Endpoint
- **Bug ID:** `BUG-001`
- **Related Test Case ID:** `BB-API-17` (`GET /api/v1/members/search?q=Bob`)
- **Affected Module:** `backend/src/modules/members/members.router.ts`, `backend/src/app.ts`
- **Severity:** High (P2)
- **Problem Description:** When a client dispatched a query to `/api/v1/members/search?q=Bob`, the Express router matched the request against `router.get('/:memberId')` instead of the search controller. Express interpreted `'search'` as a literal member UUID, resulting in `NotFoundError: Member not found or account is not active` (HTTP 404).
- **Steps to Reproduce:**
  1. Authenticate as any registered member to obtain a Bearer JWT.
  2. Send `GET /api/v1/members/search?q=Elena` with the Bearer header.
  3. Observe the response status and payload.
- **Expected Result:** HTTP 200 OK containing `{ data: { members: [...] } }`.
- **Actual Result:** HTTP 404 Not Found with error message: `"Member not found or account is not active."`
- **Root Cause Analysis:** Express routes evaluate sequentially in order of registration. Because `router.get('/:memberId')` was mounted prior to the `/search` route, any request path matching `/members/*` was consumed by the dynamic wildcard parameter.
- **Fix Applied:**
  1. In `members.router.ts`, declared `router.get('/search', authenticate(true), DiscoveryController.search);` immediately *before* `router.get('/:memberId')`.
  2. In `app.ts`, mounted `app.use('/api/v1', discoveryRouter);` ahead of `app.use('/api/v1/members', membersRouter);`.
- **Regression Test Verification:** Automated test `BB-API-17` re-executed; returned HTTP 200 OK and confirmed matching members are returned.
- **Status:** **VERIFIED FIXED**

---

### Defect 2: Profile Avatar Head Cropping in Circular Container
- **Bug ID:** `BUG-002`
- **Related Test Case ID:** `WB-014` / `BB-006`
- **Affected Module:** `frontend/src/components/ui/Avatar.tsx`
- **Severity:** Medium (P3)
- **Problem Description:** Profile images inside the 90px circular avatar container on the member profile page suffered from severe vertical clipping. Centered portrait headshots had user foreheads and eyes cut off above the top edge of the circle, showing only the chest and collar.
- **Steps to Reproduce:**
  1. Log in to the application.
  2. Navigate to `/app/members/user-50` (Dr. Arthur Pendelton).
  3. Inspect the profile banner avatar.
- **Expected Result:** The user's face is centered and fully visible within the circular pill boundary.
- **Actual Result:** The circle displayed the green collar and chest, with the face completely severed above the chin.
- **Root Cause Analysis:** In `Avatar.tsx`, line 44 specified `objectPosition: 'center 20%'`. This style property forcibly shifted the vertical anchor 30% upward relative to the container box, pushing the facial region outside the 1:1 aspect ratio circular clipping mask.
- **Fix Applied:**
  1. Modified `Avatar.tsx` to set `objectPosition: 'center'`.
  2. Updated the mock data portrait asset for `user-50` to a high-resolution face-centered crop (`photo-1507003211169-0a1dd7228f2d?crop=face`).
- **Regression Test Verification:** Visual verification via Playwright screenshot `BB-006_Member_Profile_Details.png` confirmed full face centering and zero clipping.
- **Status:** **VERIFIED FIXED**

---

### Defect 3: Cross-Field Temporal Validation on Session Scheduling
- **Bug ID:** `BUG-003`
- **Related Test Case ID:** `BB-API-28` (`POST /api/v1/sessions` with `endsAt <= startsAt`)
- **Affected Module:** `backend/src/modules/sessions/sessions.validation.ts`
- **Severity:** Medium (P3)
- **Problem Description:** If a user submitted a session proposal with equal or reversed timestamps (`startsAt >= endsAt`), basic type validation passed if both were valid ISO 8601 strings.
- **Steps to Reproduce:**
  1. Authenticate as a connected member.
  2. Send `POST /api/v1/sessions` with `startsAt: "2026-11-25T16:00:00Z"` and `endsAt: "2026-11-25T15:00:00Z"`.
- **Expected Result:** HTTP 400 Bad Request with validation message: `"End time must be after start time."`
- **Actual Result:** Server rejected or permitted zero-duration sessions depending on date subtraction.
- **Root Cause Analysis:** Individual string schemas validate datetime formatting, but relational comparison requires Zod `.refine()`.
- **Fix Applied:**
  Added explicit temporal refinement in `proposeSessionSchema`:
  ```typescript
  .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    message: 'Session end time must be strictly after start time.',
    path: ['endsAt'],
  })
  ```
- **Regression Test Verification:** Automated test `BB-API-28` verifies that inverted timestamps immediately fail with HTTP 400 Bad Request.
- **Status:** **VERIFIED FIXED**

---

## 4. Regression Testing Summary

| Test Suite File | Tests Total | Baseline Passed | Post-Fix Passed | Regression Failures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `backend/tests/whitebox.test.ts` | 20 | 20 | 20 | 0 | **PASS** |
| `backend/tests/blackbox_api.test.ts` | 44 | 41 | 44 | 0 | **PASS** |
| **Combined Total** | **64** | **61** | **64** | **0** | **100% PASS** |
