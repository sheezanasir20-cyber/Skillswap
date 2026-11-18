# SkillSwap — Implementation Plan

This document establishes the architecture, phase-by-phase implementation sequence, technology decisions, testing strategy, and verification criteria for building the complete, production-grade SkillSwap web application.

---

## 1. Architectural Blueprint

SkillSwap is designed as a modular, production-ready system conforming to the contracts in `docss/`.

### 1.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 18 + TypeScript + Vite + React Router + TanStack Q   │
│  Editorial Design System (CSS Tokens + Lucide Icons)        │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTPS (REST)                 │ WSS (Realtime)
┌──────────────▼──────────────────────────────┴───────────────┐
│                   Backend API & Realtime                    │
│  Node.js + Express + TypeScript + Socket.IO                 │
│  Centralized Error Handler + Zod Validation + Helmet/CORS   │
│  RBAC Middleware (Guest, Member, Moderator, Administrator)   │
├─────────────────────────────────────────────────────────────┤
│  Modules:                                                   │
│  • Auth & Session Management (Argon2id/Bcrypt + Sessions)   │
│  • Members & Profiles (Skills, Bio, Availability, Timezone) │
│  • Matching Engine (Reciprocal Scoring + Explainability)    │
│  • Connections Service (Request lifecycle + Block guards)   │
│  • Messaging Service (Conversations, Messages, Typing)      │
│  • Session Coordinator (State Machine: Proposed→Completed)  │
│  • Reviews & Reputation (Post-session verification)         │
│  • Moderation & Reports (Queue, Actions, Sanctions)         │
│  • Admin & Analytics (Aggregated Metrics + Role elevation)  │
│  • Audit Logging (Immutable event trail)                    │
│  • Notification Dispatcher & Background Reminder Worker     │
└──────────────┬──────────────────────────────────────────────┘
               │ Prisma ORM / SQL Engine
┌──────────────▼──────────────────────────────────────────────┐
│                   Data Persistence Layer                    │
│  PostgreSQL Relational Schema with Foreign Keys, Indexes,   │
│  Check Constraints, Unique Indexes, and ACID Transactions   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Phased Implementation Roadmap

### Phase 1: Planning, Documentation Review & Requirements Traceability
- [x] Read all 17 specification documents in `docss/`.
- [x] Create `REQUIREMENTS-CHECKLIST.md`.
- [x] Create `IMPLEMENTATION-PLAN.md`.
- [x] Create `DOCUMENTATION-REVIEW.md`.

### Phase 2: Project Setup & Workspace Scaffolding
- Set up root repository layout:
  - `backend/` (Node.js, Express, TypeScript, Prisma, Socket.IO, Vitest/Supertest)
  - `frontend/` (React, TypeScript, Vite, CSS Modules, Lucide, React Router, TanStack Query)
  - `tests/` (Unit, Integration, White-Box, E2E)
- Configure strict TypeScript configs (`tsconfig.json`), ESLint, and Prettier.
- Configure environment definitions (`.env.example`).

### Phase 3: Database & Data Modeling
- Implement Prisma schema matching `DATA-MODEL.md`:
  - `users`, `skills`, `user_skills`, `availability`, `connections`, `conversations`, `messages`, `sessions`, `reviews`, `reports`, `notifications`, `audit_logs`, `notification_jobs`.
- Set up UUID generation, indexes (`messages(conversation_id, created_at desc)`, `sessions(connection_id, starts_at)`, etc.), unique constraints, foreign keys with referential actions.
- Implement comprehensive seed data script (`prisma/seed.ts`) populating standard skill catalogue, sample members, reciprocal skill pairings, mock sessions, reviews, and admin/moderator accounts.

### Phase 4: Backend Core Services & REST API (`/api/v1`)
- Standardized response formatting: `{ data, meta }` and error shape `{ error: { code, message, fields, requestId } }`.
- Authentication & Sessions:
  - Register, Login, Logout, Forgot/Reset Password, `/auth/me`.
  - Password hashing (Bcrypt/Argon2), secure session handling, CSRF & rate-limiting.
- Member & Skills Module:
  - `/members/me`, `/members/:id`, `/skills`, `/members/me/skills`.
- Matching Engine:
  - Algorithm implementation following `MATCHING.md`: 50pts reciprocal overlap, 20pts level compatibility, 20pts availability overlap, 5pts completeness, 5pts activity. Plain text explanation generation.
- Connections Module:
  - Request, accept, reject, cancel, list incoming/outgoing/accepted connections.
- Messaging & Realtime:
  - Conversation retrieval, message history pagination, WebSocket authentication and room dispatch.
- Sessions Module:
  - Propose, confirm, decline, reschedule, cancel, complete with strict state machine validation and participant ownership checks.
- Reviews Module:
  - Submission validation (completed session only, participant only, 1 review per user-session pair).
- Moderation & Reports:
  - Report creation, queue retrieval, assign, resolve, dismiss, member warning/suspension.
- Admin & Analytics:
  - Member management, role updating (admin-only), system analytics aggregation, immutable audit logs.
- Notification & Reminder Worker:
  - Outbox job creation for 24h and 1h reminders, status updates, cancellation cleanup.

### Phase 5: Frontend UI/UX Implementation (Per `design.md`)
- Design System & Tokens:
  - `tokens.css` with exact hex colors (`--color-ink: #202522`, `--color-accent: #52745F`, etc.), typography scale, spacing tokens, focus outline (`--color-focus: #315F9B`).
- Core UI Components:
  - Button (primary, secondary, tertiary, destructive with loading state), Input, Select, Textarea, Modal/Dialog, Toast, Badge, Tag, Table, Avatar with initials fallback, EmptyState, LoadingState, ErrorBanner.
- Public Routes:
  - `/` Landing page (editorial, honest copy, 3-step process), `/how-it-works`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/terms`, `/privacy`.
- Member Shell & Routes:
  - Sidebar navigation (collapsible under 900px), Mobile bottom nav.
  - `/app` Overview dashboard, `/app/onboarding` setup wizard.
  - `/app/discover` Search, filter, match cards with explanations.
  - `/app/members/:id` Public profile with teach/learn skills and reviews.
  - `/app/connections` Pending and active connections management.
  - `/app/messages` and `/app/messages/:id` Real-time chat with reconnect state.
  - `/app/sessions` and `/app/sessions/:id` Scheduling, confirmations, rescheduling, completion.
  - `/app/history` Past sessions and review prompts.
  - `/app/profile` Profile and skill catalogue editor.
  - `/app/settings` Timezone, availability, and account controls.
- Staff & Admin Routes:
  - `/staff` Staff dashboard overview.
  - `/staff/reports` and `/staff/reports/:id` Moderation queue and action drawer.
  - `/staff/members` Member management and status/role changes.
  - `/staff/analytics` Real analytics metrics and date range filtering.
  - `/staff/activity` Audit log viewer with filters.

### Phase 6: White-Box Testing & Coverage Verification
- Unit & White-Box test suites:
  - Statement, branch, condition (MC/DC), path, and loop testing.
  - Target: 100% critical backend business logic, 95% overall backend statement, 90% branch coverage.
- Test suites:
  - `auth.test.ts`, `matching.engine.test.ts`, `session.state-machine.test.ts`, `connections.test.ts`, `reviews.test.ts`, `reports.test.ts`, `rbac.test.ts`, `reminder.worker.test.ts`.

### Phase 7: Black-Box, Integration & End-to-End Testing
- Supertest integration tests covering all REST endpoints and error branches.
- WebSocket integration tests verifying room security and event delivery.
- Playwright End-to-End scenario executing the complete 25-step member journey:
  - Member A & B registration -> Profile completion -> Teach/Learn skills -> Reciprocal match search -> Connection request -> Acceptance -> Chat message exchange -> Session proposal -> Confirmation -> Reminders queued -> Completion -> Reviews submitted -> Reporting -> Moderation -> Admin analytics & audit inspection.

### Phase 8: Accessibility, Performance & Hardening
- WCAG 2.2 AA validation (keyboard navigation, focus visible, aria labels, color contrast).
- Responsive validation at 320px, 375px, 640px, 768px, 1024px, 1440px.
- Performance verification: concurrent load handling, indexed queries, sub-5s matching.
- Generate `TEST-REPORT.md` and `SECURITY-REVIEW.md`.
