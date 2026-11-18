# Product Requirements — SkillSwap

## 1. Product summary
SkillSwap helps people teach what they know and learn what they need through reciprocal skill exchange. A member can be both a teacher and a learner. The platform helps members discover compatible partners, connect, communicate, schedule sessions, and establish trust through post-session feedback.

**Core promise:** exchange knowledge, not money.

## 2. Problem
Paid courses and private tutoring can be unaffordable. Free content often lacks personal feedback. Informal skill swaps are difficult to coordinate and provide limited trust or moderation. SkillSwap centralizes discovery, matching, communication, scheduling, reminders, and reputation.

## 3. Goals
- Let members describe skills they can teach and skills they want to learn.
- Suggest relevant partners based on skill fit, level, and availability.
- Support safe connection requests and private in-app messaging.
- Coordinate learning sessions and reminders.
- Collect reviews after completed sessions.
- Give moderators and administrators practical safety and management tools.
- Provide operational analytics and auditable staff actions.

## 4. Non-goals
- Payments, subscriptions, wallets, or money transfers.
- Built-in video/audio calling.
- Native iOS or Android apps.
- Skill certificates or official verification.
- Social login or integrations with external learning platforms.
- A public social feed.

## 5. Roles and permissions
### Guest
Can view public marketing pages and register/sign in. Cannot access member data.

### Registered member
Can manage their profile and skills, search and view eligible profiles, send/receive connection requests, chat with accepted connections, schedule sessions, manage their own sessions, view history, report content, and review a completed session.

### Moderator
Can access the moderation workspace, review assigned/all permitted reports, take moderation actions, and view relevant context. Cannot change system-wide roles unless explicitly granted.

### Administrator
Can manage accounts and roles, review analytics, access staff activity logs, and perform moderator functions when authorized.

## 6. Core capabilities
1. Account creation, login, logout, password reset.
2. Profile management.
3. Teach/learn skill management with level.
4. Match suggestions.
5. Search and filters.
6. Connection request lifecycle.
7. Connected-user messaging.
8. Session scheduling, rescheduling, cancellation.
9. Reminders and notifications.
10. Post-session ratings and written reviews.
11. Reporting profiles, messages, and reviews.
12. Moderation and account management.
13. Session history.
14. Admin analytics.
15. Staff activity logging.

## 7. Primary journeys
### New member
Landing page → registration → email verification (recommended) → profile basics → add teach skills → add learn skills → availability → match suggestions.

### Find a partner
Discover → filter by skill/level/availability → inspect profile → send request with optional note → wait for acceptance → open conversation.

### Learn together
Conversation → propose session → other member confirms → reminder → session takes place externally → mark complete → each member can leave a review.

### Report a concern
Profile/message/review menu → choose report reason → add optional context → submit → confirmation → moderation queue → moderator decision → audit event.

## 8. Functional requirements mapping
The supplied SRS identifiers are retained:
- FR01: registration, login, profile management
- FR02: teach/learn skill listing and level
- FR03: automatic matching
- FR04: search and filtering
- FR05: connection requests
- FR06: in-website chat
- FR07: schedule, reschedule, cancel sessions
- FR08: reminders and notifications
- FR09: ratings and reviews after completed sessions
- FR10: report profiles, messages, reviews
- FR11: moderation
- FR12: account and role management
- FR13: session history
- FR14: analytics
- FR15: staff activity logging

## 9. Non-functional requirements
- Browser-based, responsive experience.
- Secure authentication and role-based authorization.
- Personal information protected by default.
- Target capacity: 500 concurrent users as stated in the SRS; validate through load testing.
- Match suggestions and notifications target under 5 seconds, subject to load and provider latency.
- Daily backups.
- Keyboard-accessible, mobile-friendly UI.

## 10. Success measures
Track:
- Registration completion rate.
- Percentage of profiles with at least one teach and one learn skill.
- Match-to-connection acceptance rate.
- Time from registration to first accepted connection.
- Sessions proposed, confirmed, completed, cancelled, and missed.
- Review submission rate after completed sessions.
- Report resolution time and repeat-offender rate.
- API error rate, p95 response time, and background-job success rate.

Do not optimize for raw message volume. Prioritize successful, safe learning exchanges.

## 11. Product principles
- Useful before clever: make the next action obvious.
- Trust is a product feature: show context and safety controls.
- Mutuality: explain the exchange clearly; avoid a marketplace feel.
- Calm interface: prioritize content and whitespace over decoration.
- No false promises: do not imply skill verification or guaranteed match quality.
