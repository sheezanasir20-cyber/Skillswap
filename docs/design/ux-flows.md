# UX Flows and Screen Inventory

## Public
| Route | Screen | Main action |
|---|---|---|
| `/` | Landing | Create profile |
| `/how-it-works` | How it works | Register |
| `/login` | Sign in | Authenticate |
| `/register` | Create account | Create account |
| `/forgot-password` | Password reset request | Send reset email |
| `/reset-password` | Set new password | Save password |
| `/terms`, `/privacy` | Legal pages | Read |

## Member
| Route | Screen | Main action |
|---|---|---|
| `/app` | Overview | Continue to discover |
| `/app/onboarding` | Profile setup | Save profile |
| `/app/discover` | Search and matches | View profile / request |
| `/app/members/:id` | Member profile | Send connection request |
| `/app/connections` | Connection list/requests | Accept or reject |
| `/app/messages` | Conversation list | Open conversation |
| `/app/messages/:id` | Chat | Send message |
| `/app/sessions` | Session list | Propose session |
| `/app/sessions/:id` | Session detail | Confirm / reschedule / cancel |
| `/app/history` | Session history | View past session |
| `/app/profile` | Own profile | Edit profile |
| `/app/settings` | Account settings | Update preferences |

## Staff
| Route | Screen | Main action |
|---|---|---|
| `/staff` | Staff overview | Open queue |
| `/staff/reports` | Report queue | Review report |
| `/staff/reports/:id` | Report detail | Take action |
| `/staff/members` | Member management | Update account |
| `/staff/analytics` | Analytics | Change date range |
| `/staff/activity` | Activity log | Inspect event |

## Core state transitions
### Connection
`pending` → `accepted` or `rejected`; requester may `cancel` while pending. A blocked member cannot create a new request. Only participants can see connection details.

### Session
`proposed` → `confirmed` → `completed`
Alternative exits: `declined`, `cancelled`. Rescheduling creates a new proposal/version and requires the other participant's confirmation. Only participants can change their own session.

### Report
`submitted` → `under_review` → `resolved` or `dismissed`. A report can be escalated to an administrator. Every staff action creates an audit record.

## Interaction rules
- Confirm before irreversible or consequential actions.
- Preserve typed form values when validation fails.
- Explain why a user cannot proceed.
- Use optimistic UI only for low-risk message sending, with rollback on failure.
- Never show private profile or conversation data to unrelated members.
