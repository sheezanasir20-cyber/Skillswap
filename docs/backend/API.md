# API Contract — `/api/v1`

All endpoints require HTTPS in deployed environments. Unless stated otherwise, JSON is used.

## Common response conventions
Success:
```json
{ "data": {}, "meta": {} }
```
Error:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the highlighted fields.",
    "fields": { "email": "Enter a valid email address." },
    "requestId": "..."
  }
}
```
Use appropriate HTTP status codes. Do not expose stack traces.

## Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create member account |
| POST | `/auth/login` | Start authenticated session |
| POST | `/auth/logout` | End session |
| POST | `/auth/forgot-password` | Request reset email |
| POST | `/auth/reset-password` | Set new password |
| GET | `/auth/me` | Current actor and permissions |

## Profile and skills
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/members/me` | Own profile |
| PATCH | `/members/me` | Update own profile |
| GET | `/members/:memberId` | View permitted public profile |
| GET | `/skills` | Search skill catalogue |
| POST | `/members/me/skills` | Add teach/learn skill |
| PATCH | `/members/me/skills/:id` | Update level/type |
| DELETE | `/members/me/skills/:id` | Remove skill |

## Discovery and connections
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/matches` | Ranked match suggestions |
| GET | `/members/search` | Search and filter members |
| GET | `/connections` | Own connection list |
| POST | `/connections` | Send request |
| POST | `/connections/:id/accept` | Accept request |
| POST | `/connections/:id/reject` | Reject request |
| POST | `/connections/:id/cancel` | Cancel own pending request |

## Messaging
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/conversations` | Conversation list |
| GET | `/conversations/:id/messages` | Paginated messages |
| POST | `/conversations/:id/messages` | Send message |

Realtime events (authenticated WebSocket):
- `message.created`
- `message.delivery_failed` (sender only)
- `notification.created`
- `connection.updated`
- `session.updated`

The server must verify conversation membership before joining a room or sending an event.

## Sessions
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/sessions` | Own sessions with filters |
| POST | `/sessions` | Propose a session |
| GET | `/sessions/:id` | Session details |
| POST | `/sessions/:id/confirm` | Confirm proposal |
| POST | `/sessions/:id/decline` | Decline proposal |
| PATCH | `/sessions/:id/reschedule` | Propose new time |
| POST | `/sessions/:id/cancel` | Cancel session |
| POST | `/sessions/:id/complete` | Mark completed |

## Reviews and reports
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/sessions/:id/reviews` | Submit eligible review |
| GET | `/members/:id/reviews` | Public permitted reviews |
| POST | `/reports` | Report profile/message/review |

## Staff
| Method | Endpoint | Permission |
|---|---|---|
| GET | `/staff/reports` | `reports.read` |
| GET | `/staff/reports/:id` | `reports.read` |
| POST | `/staff/reports/:id/assign` | `reports.assign` |
| POST | `/staff/reports/:id/resolve` | `reports.resolve` |
| POST | `/staff/members/:id/warn` | `members.moderate` |
| POST | `/staff/members/:id/suspend` | `members.suspend` |
| GET | `/staff/members` | `members.read` |
| PATCH | `/staff/members/:id` | `members.manage` |
| GET | `/staff/analytics` | `analytics.read` |
| GET | `/staff/activity` | `audit.read` |

## Validation rules (initial proposal)
- Email: normalized, valid format, unique.
- Display name: 2–60 characters.
- Bio: maximum 500 characters.
- Message: 1–4000 characters.
- Skill name: selected from catalogue or approved custom-skill flow.
- Review: integer rating 1–5; text maximum 1000 characters.
- Report reason: required enum; additional description maximum 1000 characters.
- Session title: 3–100 characters; optional note maximum 1000 characters.

## Authorization rules
- Members can access only their own private records and records shared with them.
- A conversation is accessible only to its participants.
- Session mutation is limited to its participants and valid state transitions.
- Reviews require a completed session and eligible participant.
- Staff endpoints require explicit permission checks on the server.
- Admin role assignment should require a higher-privilege permission and be audited.

## Notes
This contract is a proposed REST shape. Confirm exact payload schemas, pagination format, rate limits, and auth transport before implementation.
