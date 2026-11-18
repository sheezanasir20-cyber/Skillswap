# SkillSwap — Peer-to-Peer Reciprocal Skill Exchange Web Platform

> A production-grade, full-stack web application enabling people to exchange skills directly without money, tokens, or subscriptions. Learn what you want by teaching what you know.

[![Tests](https://img.shields.io/badge/tests-113%2F113%20passed-brightgreen.svg)]()
[![TypeCheck](https://img.shields.io/badge/typescript-zero%20errors-blue.svg)]()
[![Security](https://img.shields.io/badge/security-hardened-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)]()

---

## 1. Project Overview

**SkillSwap** connects individuals who want to learn a skill with individuals who can teach that skill in a direct, reciprocal exchange. If Alice wants to learn React and can teach Python, and Bob can teach React and wants to learn Python, SkillSwap identifies this reciprocal match, facilitates connection and real-time scheduling, sends automated reminders, and collects verified session reviews.

### Core Architectural Principles & Scope Boundaries
- **Zero Financial Transactions:** No payments, credits, virtual tokens, or subscriptions. Pure peer-to-peer mutual exchange.
- **External Video/Audio Calls:** No built-in video servers; sessions generate and link to external video rooms (e.g. Jitsi Meet, Google Meet, Zoom).
- **Web-First Application:** Designed as a responsive, modern web application optimized across mobile, tablet, and desktop viewports (320px–1440px).
- **Human & Editorial Aesthetic:** Adheres to a minimal, warm, editorial visual design specified in `docs/design/design.md`.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Routing:** React Router v6 (Data APIs with protected route guards)
- **State & Data Fetching:** TanStack Query (React Query v5)
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide Icons (consistent 20px / 16px geometric icons)
- **Styling:** Design token CSS variables (`tokens.css` + `global.css`) matching `docs/design/design.md`

### Backend
- **Runtime:** Node.js v22 (Native TypeScript support)
- **Framework:** Express.js REST API
- **Real-Time WebSockets:** Socket.IO with JWT authentication & room-level isolation
- **Database Layer:** PostgreSQL with Prisma ORM schema & typed relational in-memory database store
- **Authentication:** JWT with HttpOnly Secure cookies and Bearer tokens, salted password hashing
- **Security & Middleware:** Helmet, CORS, Rate Limiting, Centralized Error Handling

### Testing & Verification
- **Testing Runner:** Vitest v4
- **Test Strategy:** White-Box Testing (Statement, Branch, MC/DC Condition, Path, Loop Boundary) + Black-Box E2E Testing (25-step user journey)
- **Test Results:** 113 Tests across 10 test suites, **100% Pass Rate**

---

## 3. Repository Architecture

```
SkillSwap_WEB/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Full PostgreSQL schema with 13 entities & indexes
│   │   └── seed.ts                 # Seed data with development accounts & skills
│   ├── src/
│   │   ├── config/                 # Environment variables & runtime settings
│   │   ├── jobs/                   # Background workers (ReminderWorker: 24h & 1h)
│   │   ├── middleware/             # Authentication, RBAC, error handling, rate limiting
│   │   ├── modules/
│   │   │   ├── admin/              # Staff member management, role updates, audit trail
│   │   │   ├── analytics/          # Platform metrics aggregation engine
│   │   │   ├── auth/               # Register, login, logout, password reset, validation
│   │   │   ├── connections/        # Connection requests, state machine, mutual blocking
│   │   │   ├── discovery/          # Member directory search, filtering, pagination
│   │   │   ├── matching/           # 100-pt Reciprocal matching engine & explanations
│   │   │   ├── members/            # Profiles, skills, timezone-aware availability
│   │   │   ├── messaging/          # Direct conversations, messages, socket broadcast
│   │   │   ├── moderation/         # Reports queue, assignment, warnings, suspensions
│   │   │   ├── notifications/      # In-app notifications & real-time delivery
│   │   │   ├── reports/            # Polymorphic reporting (profile, message, review)
│   │   │   ├── reviews/            # Rating & reviews gated by completed sessions
│   │   │   └── sessions/           # Finite state machine (FSM), scheduling, reschedule
│   │   ├── realtime/               # Authenticated Socket.IO server & event handlers
│   │   ├── services/               # Typed DB store, Email outbox recorder, Audit service
│   │   ├── utils/                  # Structured responses, custom errors, logger
│   │   └── app.ts                  # Express application factory & server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                    # App entry, React Query client, RouterProvider
│   │   ├── components/             # UI primitives (Button, Input, Modal, Badge, etc.)
│   │   ├── features/               # Domain pages (auth, profile, discover, chat, staff)
│   │   ├── services/               # API client, Auth service, Socket client
│   │   ├── styles/                 # tokens.css (color tokens from design.md), global.css
│   │   └── types/                  # Shared frontend TypeScript interfaces
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── docs/                           # 17 comprehensive specification documents
├── tests/
│   ├── whitebox/                   # White-Box unit & module test suites (88 tests)
│   └── integration/                # Full 25-step End-to-End user journey (25 tests)
├── REQUIREMENTS-CHECKLIST.md       # Traceability matrix mapping all FRs to code & tests
├── IMPLEMENTATION-PLAN.md          # Architectural phases & execution plan
├── DOCUMENTATION-REVIEW.md         # Resolution of decisions & scope confirmation
├── TEST-REPORT.md                  # Complete testing report with coverage metrics
├── SECURITY-REVIEW.md              # Threat model & OWASP security review
├── docker-compose.yml              # Production Docker Compose for PostgreSQL & App
└── .env.example                    # Template environment variables
```

---

## 4. Quickstart & Installation

### Prerequisites
- Node.js ≥ 20.0.0
- npm ≥ 10.0.0 (or pnpm / yarn)
- PostgreSQL (or use the built-in typed database store for local testing)

### 1. Clone & Configure Environment
```bash
# Clone the repository
git clone https://github.com/your-username/SkillSwap_WEB.git
cd SkillSwap_WEB

# Copy environment template
cp .env.example .env
```

### 2. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
cd ..
```

### 3. Run Development Servers
```bash
# Terminal 1: Start Backend API & Realtime Socket Server (Port 4000)
cd backend
npm run dev

# Terminal 2: Start Frontend Vite Server (Port 5173)
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Running with Docker Compose
To launch PostgreSQL and the SkillSwap server via Docker:
```bash
docker-compose up -d
```

---

## 5. Automated Testing Suite

The application includes an exhaustive test suite covering white-box statement, branch, MC/DC condition, and path coverage, plus the complete 25-step end-to-end integration scenario.

### Run All Tests
```bash
# Run the entire test suite via Vitest
npm test

# Or run tests directly with the bundled runner
.\tools\node.cmd "C:\Users\Hp\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules\vitest\vitest.mjs" run
```

### Test Suite Execution Output
```
 RUN  v4.0.16 D:/SE 3-B/ISE/SkillSwap_WEB

 ✓ tests/whitebox/matching.whitebox.test.ts (12 tests)
 ✓ tests/whitebox/connections.whitebox.test.ts (16 tests)
 ✓ tests/whitebox/reviews.whitebox.test.ts (10 tests)
 ✓ tests/whitebox/reminder.worker.test.ts (3 tests)
 ✓ tests/whitebox/reports.whitebox.test.ts (11 tests)
 ✓ tests/whitebox/auth.whitebox.test.ts (13 tests)
 ✓ tests/integration/api.e2e.test.ts (25 tests)
 ✓ tests/whitebox/sessions.whitebox.test.ts (9 tests)
 ✓ tests/whitebox/rbac.whitebox.test.ts (11 tests)
 ✓ tests/whitebox/analytics.whitebox.test.ts (3 tests)

 Test Files  10 passed (10)
      Tests  113 passed (113)
   Duration  3.11s
```

### Run Typecheck (Zero Errors)
```bash
# Typecheck backend
.\tools\node.cmd "C:\Users\Hp\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules\typescript\lib\_tsc.js" --noEmit -p backend/tsconfig.json

# Typecheck frontend
.\tools\node.cmd "C:\Users\Hp\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules\typescript\lib\_tsc.js" --noEmit -p frontend/tsconfig.json
```

---

## 6. API Reference (Summary)

All endpoints adhere strictly to `docs/API.md` using standard envelope formats:
- **Success:** `{ "data": ... , "meta": ... }`
- **Error:** `{ "error": { "code": "...", "message": "...", "requestId": "..." } }`

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new member account | Public |
| `POST` | `/api/v1/auth/login` | Sign in & receive session cookie/token | Public |
| `POST` | `/api/v1/auth/logout` | Clear session cookie | Authenticated |
| `GET` | `/api/v1/auth/me` | Get current member profile | Authenticated |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/api/v1/auth/reset-password` | Set new password with token | Public |
| `GET` | `/api/v1/discovery` | Search & filter member directory | Member |
| `GET` | `/api/v1/matching` | Get 100-pt reciprocal match suggestions | Member |
| `GET` | `/api/v1/skills/catalogue` | Search canonical skill catalogue | Authenticated |
| `POST` | `/api/v1/skills` | Add skill to profile (teach/learn) | Member |
| `GET` | `/api/v1/connections` | List incoming, outgoing & accepted connections | Member |
| `POST` | `/api/v1/connections` | Send connection request | Member |
| `POST` | `/api/v1/connections/:id/accept` | Accept inbound connection | Recipient |
| `GET` | `/api/v1/conversations` | List active conversations | Connection Part. |
| `GET` | `/api/v1/conversations/:id/messages` | Get message history in thread | Connection Part. |
| `POST` | `/api/v1/conversations/:id/messages` | Send message in thread | Connection Part. |
| `POST` | `/api/v1/sessions` | Propose session with meeting URL | Connection Part. |
| `POST` | `/api/v1/sessions/:id/confirm` | Confirm session proposal | Partner |
| `POST` | `/api/v1/sessions/:id/reschedule`| Propose new time for session | Connection Part. |
| `POST` | `/api/v1/sessions/:id/complete` | Mark completed & unlock reviews | Connection Part. |
| `POST` | `/api/v1/reviews` | Submit rating & review for completed session | Session Part. |
| `POST` | `/api/v1/reports` | Report profile, message, or review | Member |
| `GET` | `/api/v1/staff/reports` | View moderation report queue | Staff |
| `POST` | `/api/v1/staff/reports/:id/resolve` | Resolve or dismiss report | Staff |
| `POST` | `/api/v1/staff/members/:id/suspend` | Suspend member account | Staff |
| `GET` | `/api/v1/staff/analytics` | View platform aggregate metrics | Admin |

---

## 7. Security Architecture

- **Password Storage:** Salted PBKDF2/bcrypt hashing with 10 salt rounds.
- **Account Enumeration Protection:** Constant-response password reset flows.
- **Role-Based Access Control:** Strict 4-tier role hierarchy (Guest, Member, Moderator, Administrator).
- **Protection Against CSRF/XSS:** `SameSite=Lax` HttpOnly session cookies, React output escaping, and Helmet headers.
- **Mutual Invisibility on Member Block:** Instant suppression in search, matching, and messaging.
- **Audit Logging:** Append-only, tamper-evident audit store for all moderation and administrative actions.

For complete architectural and threat model details, refer to `SECURITY-REVIEW.md`.

---

## 8. Verification & Project Artifacts

All master deliverables are documented and verified within the repository:
- **[REQUIREMENTS-CHECKLIST.md](REQUIREMENTS-CHECKLIST.md):** 100% trace of FR01–FR15 and NFRs to implementation paths and tests.
- **[IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md):** Phased architecture, database design, and component mapping.
- **[DOCUMENTATION-REVIEW.md](DOCUMENTATION-REVIEW.md):** Review of 17 specification documents and confirmation of DECISIONS.md defaults.
- **[TEST-REPORT.md](TEST-REPORT.md):** Full test execution metrics, coverage analysis, and 25-step E2E verification results.
- **[SECURITY-REVIEW.md](SECURITY-REVIEW.md):** OWASP Top 10 threat model and security control verification.

---

## 9. License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
