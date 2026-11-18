# Quality Assurance and Test Plan

## Test layers
### Unit
- Skill matching score and eligibility.
- Session state transitions.
- Permission evaluation.
- Timezone and reminder calculations.
- Validation schemas.
- Notification idempotency.

### Integration
- Registration/login and password reset.
- Profile and skill CRUD.
- Connection request accept/reject/cancel.
- Conversation membership and message persistence.
- Session proposal/confirmation/reschedule/cancel/completion.
- Review eligibility and duplicate prevention.
- Report submission and moderator resolution.
- Admin role management and audit events.

### End-to-end
1. Register, complete profile, add teach/learn skills.
2. Discover a compatible member and send request.
3. Accept request from second account.
4. Exchange messages.
5. Propose and confirm a session.
6. Verify reminders are queued.
7. Complete session and submit reviews.
8. Report content and resolve as moderator.
9. Verify admin analytics and audit trail.

## Acceptance criteria
- A member cannot read another member's private profile fields.
- A non-participant cannot read a conversation or session.
- A member cannot review a session that is not completed.
- Duplicate reviews for the same reviewer/session are rejected.
- A moderator cannot assign admin privileges.
- Every staff moderation action creates an audit event.
- Cancelled/rescheduled sessions do not send stale reminders.
- Search and match results respect blocks and account status.
- API errors are understandable and do not leak implementation details.

## Performance
SRS target: 500 concurrent users. Test with realistic read/write ratios, chat connections, search, and session activity. Track p95 latency, error rate, DB load, and worker lag. Define concrete response-time thresholds before sign-off.

## Browser and device matrix
Test current stable Chrome, Firefox, Safari, and Edge where available. Test narrow mobile widths, tablet, laptop, and large desktop.

## Regression
Run unit and integration suites on each pull request. Run end-to-end smoke tests on staging before release. Include migration and backup-restore tests in release readiness.
