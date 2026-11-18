# SkillSwap — Web Application Documentation

This documentation pack describes a complete, implementation-ready web application for **SkillSwap**, a platform where people exchange skills without payments. The visual direction is now **Verdant Atelier**: warm parchment surfaces, deep evergreen navigation, jade accents, restrained clay/amber highlights, and selective glassmorphism.

## Product basis
The supplied SRS defines user profiles, teach/learn skills, matching by skill/level/availability, search, connection requests, in-app chat, session scheduling, reminders, reviews, reports, moderation, admin account/role management, session history, analytics, and staff activity logs. It excludes payments, built-in video calls, native mobile apps, certificates, and social/external learning-platform integrations.

## Suggested implementation baseline
The SRS does not mandate a technology stack. This pack uses the following practical baseline as an implementation proposal:
- Frontend: React + TypeScript + Vite
- Styling: CSS Modules or plain CSS with design tokens; no heavy component theme
- Backend: Node.js + TypeScript + Express
- Database: PostgreSQL
- Realtime messaging: WebSocket (Socket.IO or native ws)
- Background jobs: a queue/worker for reminders and scheduled tasks
- Authentication: secure, server-managed sessions or short-lived access tokens with refresh rotation
- Deployment: containerized frontend, API, worker, and PostgreSQL

These are recommendations, not requirements from the SRS. Teams may substitute equivalent technologies while preserving the contracts in this pack.

## Document index
| File | Purpose |
|---|---|
| `product/PRD.md` | Product definition, users, scope, success measures |
| `design/design.md` | Complete visual and interaction system |
| `design/ux-flows.md` | Screen inventory and core user journeys |
| `frontend/FRONTEND.md` | Frontend architecture, routes, components, state |
| `backend/BACKEND.md` | Backend architecture and service boundaries |
| `backend/API.md` | REST and realtime API contracts |
| `backend/DATA-MODEL.md` | Relational entities and constraints |
| `backend/MATCHING.md` | Matching rules and ranking approach |
| `backend/SECURITY.md` | Authentication, authorization, privacy, abuse controls |
| `operations/NOTIFICATIONS.md` | In-app/email notifications and reminders |
| `quality/TESTING.md` | Test strategy and acceptance criteria |
| `operations/DEPLOYMENT.md` | Environments, CI/CD, backup, monitoring |
| `quality/ACCESSIBILITY.md` | Accessibility requirements |
| `product/CONTENT-GUIDE.md` | Product voice and interface copy |
| `product/RELEASE-PLAN.md` | Phased delivery plan |
| `DECISIONS.md` | Assumptions and decisions to confirm |

## How to use
1. Read `product/PRD.md` and confirm scope with the supervisor.
2. Approve the assumptions in `DECISIONS.md`.
3. Treat `design/design.md` as the visual source of truth.
4. Implement backend contracts before wiring frontend data flows.
5. Convert each acceptance criterion into a tracked issue and automated test.

## Important
This is a build specification, not a claim that the application already exists. Security-sensitive flows, retention periods, email provider, hosting region, and exact stack must be reviewed before production.
