# Backend Architecture

## 1. Proposed stack
Node.js + TypeScript + Express, PostgreSQL, a background worker, and WebSocket messaging. The SRS defines capabilities, not the implementation stack.

## 2. Service boundaries
A modular monolith is recommended for the first release. Keep modules separated internally; avoid premature microservices.

- Auth: registration, login, password reset, session lifecycle.
- Members: profile and account state.
- Skills: skill catalogue and member skill associations.
- Discovery: search and match ranking.
- Connections: request lifecycle and blocks.
- Messaging: conversations and messages.
- Sessions: scheduling and state transitions.
- Reviews: ratings and review moderation.
- Reports: user-submitted reports and moderation workflow.
- Admin: account/role management and analytics.
- Audit: immutable staff-action records.
- Notifications: in-app and email delivery.

## 3. Request lifecycle
1. Validate request shape.
2. Authenticate caller.
3. Authorize action against role and resource ownership.
4. Execute business operation in a transaction when multiple records change.
5. Persist domain event/outbox entry.
6. Return a consistent response.
7. Worker processes asynchronous notifications and reminders.

## 4. API conventions
- Prefix: `/api/v1`.
- JSON request and response bodies.
- ISO 8601 timestamps in UTC; include timezone identifiers for user-facing scheduling.
- Cursor pagination for messages and activity logs; page pagination acceptable for small admin tables.
- Consistent error shape described in `API.md`.
- Never expose internal stack traces to clients.

## 5. Reliability
- Database transactions for connection/session/review state changes.
- Idempotency key for operations that may be retried, especially session proposals and notifications.
- Outbox pattern to avoid losing notifications after successful database commits.
- Retry transient email/provider failures with bounded exponential backoff.
- Dead-letter queue and staff-visible operational alert for repeatedly failing jobs.

## 6. Data handling
- Validate and normalize all user input.
- Store passwords using Argon2id or bcrypt with current secure parameters.
- Encrypt transport with TLS.
- Keep secrets in environment/secret manager, never source control.
- Apply retention rules to messages, reports, audit events, and backups after policy approval.
- Use least-privilege database credentials.

## 7. Observability
Structured logs with request ID, actor ID where appropriate, module, action, latency, and outcome. Exclude passwords, tokens, private message bodies, and unnecessary personal data.

Metrics:
- API request count, error rate, p50/p95 latency.
- DB connection saturation and slow queries.
- WebSocket connection count and delivery failures.
- Worker queue depth, retry count, and job age.
- Email delivery success/failure.
- Session reminder lag.

## 8. Scaling to SRS target
The SRS names 500 concurrent users. Validate this target with realistic load tests. Use indexed queries, pagination, connection pooling, and horizontal API/worker scaling only after measurement. Do not promise capacity without test evidence.
