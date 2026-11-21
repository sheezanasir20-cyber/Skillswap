# SkillSwap — Complete Web Application Documentation

This documentation pack describes the SkillSwap web platform: a reciprocal skill-exchange community where members list skills they can teach and want to learn, discover compatible partners, connect, message, schedule sessions, and build trust through reviews and moderation.

## Current visual direction
The visual source of truth is **`design/design.md` — Ember Noir**. It replaces all previous visual directions and palettes. The system uses the supplied Coolors palette (`#03071E`, `#370617`, `#6A040F`, `#9D0208`, `#D00000`, `#DC2F02`, `#E85D04`, `#F48C06`, `#FAA307`, `#FFBA08`) with warm porcelain utility surfaces, selective glassmorphism, and layered depth.

## Documentation map
| File | Purpose |
|---|---|
| `README.md` | Pack overview and setup guidance |
| `product/PRD.md` | Product definition, users, scope, success measures |
| `design/design.md` | Complete visual and interaction design system — authoritative |
| `design/ux-flows.md` | Screen inventory and core user journeys |
| `frontend/FRONTEND.md` | Frontend architecture, routes, components, and state |
| `backend/BACKEND.md` | Backend architecture and service boundaries |
| `backend/API.md` | REST and realtime API contracts |
| `backend/DATA-MODEL.md` | Relational entities, constraints, and indexes |
| `backend/MATCHING.md` | Matching eligibility and ranking proposal |
| `backend/SECURITY.md` | Authentication, authorization, privacy, and abuse controls |
| `operations/NOTIFICATIONS.md` | Notifications and reminders |
| `quality/TESTING.md` | Testing strategy and acceptance criteria |
| `quality/ACCESSIBILITY.md` | Accessibility requirements |
| `operations/DEPLOYMENT.md` | Environments, CI/CD, backup, and monitoring |
| `product/CONTENT-GUIDE.md` | Product voice and interface copy |
| `product/RELEASE-PLAN.md` | Suggested delivery phases |
| `DECISIONS.md` | Technical assumptions and decisions to confirm |

## Suggested implementation baseline
The original SRS does not mandate a technology stack. This pack proposes React + TypeScript + Vite for the frontend, Node.js + TypeScript + Express for the API, PostgreSQL for persistence, and WebSocket-based realtime messaging. Treat these as recommendations, not original SRS requirements.

## How to use
1. Read the full SRS and all Markdown documents before implementation.
2. Treat `design/design.md` as the sole visual source of truth. Do not reuse earlier palettes or themes.
3. Map each SRS functional requirement to a route, backend capability, and test.
4. Preserve the documented scope: no payments, built-in video calls, native mobile app, certificates, or social-learning integrations.
5. Record implementation decisions where the documents leave details open.
6. Verify the actual rendered UI at desktop, tablet, and mobile widths.

## Important
This is an implementation specification, not a claim that the application already exists. Review unresolved security, privacy, retention, hosting, and provider choices before production.
