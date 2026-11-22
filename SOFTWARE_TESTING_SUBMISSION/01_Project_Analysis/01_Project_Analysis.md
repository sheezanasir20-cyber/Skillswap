# 01 — Project Analysis & Architectural Discovery

**Project Name:** SkillSwap — Reciprocal Skill Exchange Web Application  
**Assessment Phase:** Phase 1 — Project Discovery and Requirements Analysis  
**Author:** Senior Quality Assurance & Test Automation Specialist  
**Date:** November 22, 2026  
**Document Version:** 1.0.0  

---

## 1. System Overview & Purpose

**SkillSwap** is a peer-to-peer web platform designed to facilitate reciprocal skill exchanges between members without monetary transactions. The core philosophy of the application is **direct bilateral value exchange**: Member A teaches Skill X to Member B, and Member B in turn teaches Skill Y to Member A (or collaborates in reciprocal mentorship).

The platform addresses common failure modes in informal learning networks—unreliable scheduling, lack of accountability, asymmetric commitments, and safety concerns—by integrating:
1. A **reciprocal matching engine** calculating bipartite overlap across teaching capabilities and learning desires.
2. A **strict connection handshake state machine** governing bilateral interactions.
3. A **structured session scheduling engine** enforcing conflict detection and automated reminder delivery.
4. An **eligibility-gated review system** that restricts feedback strictly to completed sessions.
5. A **role-based moderation and administration portal** providing audit logging, member suspension, and report resolution.

---

## 2. Technology Stack & Architectural Decomposition

SkillSwap is structured as a modern modular TypeScript web application composed of three distinct layers:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 18 + Vite (SPA) · Tailwind CSS / Custom CSS Tokens   │
│  React Router v6 · React Hook Form + Zod · Socket.IO Client │
│  Ember Noir Design System (#03071E / #D00000 / #FFBA08)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / WSS
┌──────────────────────────────▼──────────────────────────────┐
│                    Application / API Layer                  │
│  Express 4 REST API (Node.js 22 Runtime)                    │
│  Modular Service-Oriented Architecture (12 Domain Modules)  │
│  Socket.IO Realtime Gateway · Rate Limiting · Helmet        │
│  JWT Authentication · Cookie Parser · Centralized Errors    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Data Persistence / Memory
┌──────────────────────────────▼──────────────────────────────┐
│                      Persistence Layer                      │
│  Prisma ORM Client / Dual-Mode In-Memory Repository         │
│  60 Standard Skills Catalog · 50 Pre-seeded Mock Profiles   │
│  Relational Integrity Checks · Audit Log Append-Only Store  │
└─────────────────────────────────────────────────────────────┘
```

### Technical Component Inventory
- **Runtime Environment:** Node.js v22.21.1 (ESM + CommonJS interoperability).
- **Backend Framework:** Express v4.21.0 with Helmet security headers, CORS protection, and cookie-parser.
- **Frontend Framework:** React v18.3.1 with Vite v7.3.0, TanStack Query, and Lucide React icons.
- **Data Validation:** Zod v3.23.8 enforcing input boundary schemas across both frontend and backend.
- **Authentication:** Stateless JSON Web Tokens (`jsonwebtoken` v9.0.2) signed with 256-bit entropy keys, accompanied by bcrypt password hashing (`bcryptjs` v2.4.3).
- **Real-time Engine:** Socket.IO v4.7.5 handling instant messaging and notification delivery.
- **Testing Frameworks:** Vitest v2.1.9, V8 Code Coverage Engine, Supertest v7.0.0, and Playwright v1.47.0.

---

## 3. Domain Modules & Functional Decomposition

The backend source code (`backend/src/modules/`) reveals 12 distinct functional modules:

### Module 1: Authentication & Identity (`modules/auth/`)
- **Key Files:** `auth.router.ts`, `auth.controller.ts`, `auth.service.ts`, `auth.validation.ts`
- **Capabilities:**
  - Member registration with email normalization, password complexity verification, and unique constraints.
  - Member login with password verification, account status checks (rejects `suspended` or `deleted` accounts), and `lastLoginAt` updates.
  - Profile retrieval (`/auth/me`).
  - Self-service password recovery flow generating expiring tokens.

### Module 2: Member Profiles & Availability (`modules/members/`)
- **Key Files:** `members.router.ts`, `members.controller.ts`, `members.service.ts`, `members.validation.ts`
- **Capabilities:**
  - Profile customization (display name, biography, timezone, avatar URL).
  - Weekly recurring availability slots management (weekday 0-6, startMinute, endMinute) with atomic replacement.
  - Member search directory with text query filtering and role badges.

### Module 3: Skill Catalog & User Inventories (`modules/skills/`)
- **Key Files:** `skills.router.ts`, `skills.controller.ts`, `skills.service.ts`, `skills.validation.ts`
- **Capabilities:**
  - Standard skill catalog lookup across categories (Programming, Design, Languages, Music, Business).
  - Dynamic user-skill bindings supporting two distinct intents: `teach` (skills offered) and `learn` (skills wanted).
  - Skill proficiency levels: `beginner`, `intermediate`, `advanced`.
  - Duplicate intent prevention (cannot add identical skill under the same intent twice).

### Module 4: Reciprocal Matching Engine (`modules/matching/`)
- **Key Files:** `matching.router.ts`, `matching.controller.ts`, `matching.service.ts`, `matching.engine.ts`
- **Capabilities:**
  - Mathematical bipartite matching: Identifies intersection where Member A teaches what Member B wants to learn, AND Member B teaches what Member A wants to learn.
  - Compatibility scoring: Normalizes overlap counts into a percentage match score (0-100%).
  - Exclusion filters: Automatically omits self, suspended users, and blocked connection partners.

### Module 5: Bilateral Connections State Machine (`modules/connections/`)
- **Key Files:** `connections.router.ts`, `connections.controller.ts`, `connections.service.ts`, `connections.validation.ts`
- **Capabilities:**
  - Formal 5-state lifecycle: `pending` → `accepted`, `rejected`, `cancelled`, or `blocked`.
  - Rejection reversal: If Member A rejects Member B, Member A may subsequently initiate a fresh request, swapping requester roles.
  - Strict mutual permission: Messaging and session scheduling are strictly gated on `status === 'accepted'`.

```
                    ┌──────────────┐
                    │   (Draft)    │
                    └──────┬───────┘
                           │ sendRequest()
                           ▼
                    ┌──────────────┐
           ┌────────┤   PENDING    ├────────┐
           │        └──────┬───────┘        │
cancel()   │               │                │ reject()
           ▼               │ accept()       ▼
    ┌──────────────┐       │         ┌──────────────┐
    │  CANCELLED   │       ▼         │   REJECTED   │
    └──────────────┘┌──────────────┐ └──────┬───────┘
                    │   ACCEPTED   │        │ re-request()
                    └──────┬───────┘        ▼
                           │ block() ┌──────────────┐
                           ▼         │   PENDING    │
                    ┌──────────────┐ └──────────────┘
                    │   BLOCKED    │
                    └──────────────┘
```

### Module 6: Real-time Messaging & Conversations (`modules/messaging/`)
- **Key Files:** `messaging.router.ts`, `messaging.controller.ts`, `messaging.service.ts`, `messaging.validation.ts`
- **Capabilities:**
  - Bilateral conversations automatically provisioned upon connection acceptance.
  - Whitespace-trimmed message body delivery with length boundary validation.
  - Realtime WebSocket broadcast through Socket.IO rooms.
  - Participant verification preventing external eavesdropping or unauthorized injection.

### Module 7: Sessions & Scheduling State Machine (`modules/sessions/`)
- **Key Files:** `sessions.router.ts`, `sessions.controller.ts`, `sessions.service.ts`, `sessions.state-machine.ts`, `sessions.validation.ts`
- **Capabilities:**
  - 6-state session lifecycle: `proposed` → `confirmed` → `completed`, `declined`, `cancelled`, or `rescheduled`.
  - Temporal validation: `startsAt` must precede `endsAt`, and scheduled time must reside in the future.
  - Clash detection: Prevents concurrent overlapping sessions between the same bilateral participants.
  - Rescheduling transition: Modifying time resets session state back to `proposed`, requiring partner re-confirmation.

```
                    ┌──────────────┐
                    │   PROPOSED   ├────────────────┐
                    └──────┬───────┘                │
                           │ confirm()              │ decline()
                           ▼                        ▼
                    ┌──────────────┐         ┌──────────────┐
         ┌──────────┤  CONFIRMED   │         │   DECLINED   │
cancel() │          └──────┬───────┘         └──────────────┘
         ▼                 │ complete()
  ┌──────────────┐         ▼
  │  CANCELLED   │  ┌──────────────┐
  └──────────────┘  │  COMPLETED   │
                    └──────────────┘
```

### Module 8: Reviews & Feedback Eligibility (`modules/reviews/`)
- **Key Files:** `reviews.router.ts`, `reviews.controller.ts`, `reviews.service.ts`, `reviews.validation.ts`
- **Capabilities:**
  - Strict eligibility guard: Reviews can only be submitted for sessions with `status === 'completed'`.
  - Uniqueness constraint: Exactly one review permitted per participant per completed session.
  - Numerical rating boundaries: Strictly bounded integers from 1 to 5.
  - Average rating recalculation on member profile cards.

### Module 9: Member Reports & Safety (`modules/reports/`)
- **Key Files:** `reports.router.ts`, `reports.controller.ts`, `reports.service.ts`, `reports.validation.ts`
- **Capabilities:**
  - Members can report profiles or conduct under structured reasons: `spam`, `harassment`, `inappropriate_content`, `no_show`, `other`.
  - Open duplicate report prevention against the same target.

### Module 10: Staff Moderation Portal (`modules/moderation/`)
- **Key Files:** `staff.router.ts`, `moderation.controller.ts`, `moderation.service.ts`
- **Capabilities:**
  - Role-gated access (`moderator`, `admin`).
  - Report queue inspection, assignment to specific moderators, and resolution (`resolved`, `dismissed`).
  - Punitive actions: Issuing formal warnings or executing account suspensions.

### Module 11: Admin Portal & System Analytics (`modules/admin/`, `modules/analytics/`)
- **Key Files:** `admin.service.ts`, `analytics.service.ts`, `audit.service.ts`
- **Capabilities:**
  - User role promotion/demotion (`member` ↔ `moderator` ↔ `admin`).
  - Immutable audit trail generation capturing actor ID, timestamp, target entity, and required reason string.
  - Platform-wide aggregate metrics (total members, session completion velocity, top skills).

### Module 12: Background Reminder Worker (`jobs/reminder.worker.ts`)
- **Key Files:** `reminder.worker.ts`
- **Capabilities:**
  - Polling interval (30,000ms) scanning pending `session_reminder` jobs.
  - Delivers notifications 24 hours and 1 hour prior to session start.
  - Cancels stale jobs if parent session is cancelled or declined.

---

## 4. Input Fields, Boundary Specifications & Validation Rules

| Entity / DTO | Field Name | Type | Constraints & Validation Rules | Inferred / Explicit |
| :--- | :--- | :--- | :--- | :--- |
| **User Register** | `email` | String | Valid RFC 5322 format, lowercase normalized, unique | Explicit (Zod schema) |
| **User Register** | `password` | String | Min 8 chars, max 100 chars, at least 1 number + 1 letter | Explicit (Zod schema) |
| **User Register** | `displayName` | String | Min 2 chars, max 60 chars, trimmed | Explicit (Zod schema) |
| **User Profile** | `bio` | String | Optional, max 500 chars | Explicit (Zod schema) |
| **User Profile** | `timezone` | String | Valid IANA timezone identifier string | Inferred from UI |
| **Availability** | `weekday` | Integer | Boundary: 0 (Sunday) to 6 (Saturday) | Explicit (Zod schema) |
| **Availability** | `startMinute` | Integer | Boundary: 0 to 1439, must be `< endMinute` | Explicit (Zod schema) |
| **Availability** | `endMinute` | Integer | Boundary: 1 to 1440, must be `> startMinute` | Explicit (Zod schema) |
| **Member Skill** | `name` | String | Min 2 chars, max 50 chars | Explicit (Zod schema) |
| **Member Skill** | `intent` | Enum | Exact values: `'teach'` or `'learn'` | Explicit (Zod enum) |
| **Member Skill** | `level` | Enum | Exact values: `'beginner'`, `'intermediate'`, `'advanced'` | Explicit (Zod enum) |
| **Connection** | `message` | String | Optional, max 300 chars | Explicit (Zod schema) |
| **Message** | `body` | String | Non-empty after trim, min 1 char, max 2000 chars | Explicit (Zod schema) |
| **Session** | `title` | String | Min 3 chars, max 100 chars | Explicit (Zod schema) |
| **Session** | `startsAt` | DateTime | ISO 8601 string, must be strictly in the future | Explicit (Zod schema) |
| **Session** | `endsAt` | DateTime | ISO 8601 string, must be `> startsAt` | Explicit (Zod schema) |
| **Review** | `rating` | Integer | Boundary: 1 to 5 inclusive | Explicit (Zod schema) |
| **Review** | `body` | String | Optional, max 1000 chars | Explicit (Zod schema) |
| **Report** | `reason` | Enum | `'spam' \| 'harassment' \| 'inappropriate_content' \| 'no_show' \| 'other'` | Explicit (Zod enum) |
| **Admin Action** | `reason` | String | Required non-empty string, min 3 chars | Explicit (Service check) |

---

## 5. Security Architecture & Threat Vectors

1. **Authentication Token Lifecycle:** JWT access tokens issued upon login or registration carry a 24-hour expiration (`expiresIn: '24h'`). Token verification rejects altered payloads, expired signatures, or tokens missing Bearer headers.
2. **Horizontal Privilege Escalation (BOLA):**
   - Members cannot access conversations where they are not designated participants (`participantIds.includes(userId)`).
   - Members cannot confirm or complete sessions where they are not participants.
   - Members cannot modify profiles or availability belonging to other accounts.
3. **Vertical Privilege Escalation:** Express middleware `requireRole('moderator', 'admin')` strictly checks `req.user.role`. Non-staff users attempting access to `/api/v1/staff/*` receive immediate `403 Forbidden` responses.
4. **Input Sanitization & Injection:**
   - Express body parsing is guarded by strict Zod schema validation; unexpected fields are stripped.
   - Rate limiting guards against brute-force login attempts (`express-rate-limit`).
   - CORS origin verification prevents cross-origin API abuse.

---

## 6. Comprehensive Risk Assessment Matrix

| Risk ID | Affected Feature / Module | Potential Failure Mode | Severity | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Sessions State Machine | Confirmed sessions completed by unauthorized third parties | Critical | Low | Severe data corruption | Enforce strict participant authorization tests |
| **RSK-02** | Sessions Clash Detection | Concurrent bookings permitted for identical timeslots | High | Medium | Double booking & scheduling failure | Boundary condition testing on overlapping timestamps |
| **RSK-03** | Review Eligibility | Users submit ratings without completing learning sessions | High | Low | Reputation gaming & fraudulent ratings | Verification of completed session precondition |
| **RSK-04** | Messaging Privacy | Unauthenticated users inject or read messages in active chats | Critical | Low | Severe privacy breach | White-box participant validation & negative auth tests |
| **RSK-05** | Reciprocal Matching | Disjoint or self-matched candidates returned as suggestions | Medium | Low | Degraded user experience | Mathematical set-intersection white-box coverage |
| **RSK-06** | Review Rating Boundaries | Ratings of 0 or >5 accepted due to integer overflow | Medium | Medium | Statistical score distortion | Boundary Value Analysis (BVA) test suite |
| **RSK-07** | Moderation Suspension | Suspended members retain active JWT sessions & can message | High | Medium | Continued harassment after ban | Realtime token & status verification in middleware |
| **RSK-08** | Availability Intervals | Slots where `startMinute >= endMinute` accepted by API | Medium | Low | Calendar rendering crashes | Zod schema refinement & validation tests |
| **RSK-09** | Connection State Reversal | Rejected requests remain locked forever, blocking future exchanges | Medium | Medium | User friction & lost connections | White-box verification of requester-swap branch |
| **RSK-10** | Staff Audit Trail | Admin role alterations occur without recorded justifications | High | Low | Unaccountable administrative actions | Enforce non-empty reason verification in AdminService |
