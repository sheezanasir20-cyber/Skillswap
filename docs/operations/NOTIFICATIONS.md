# Notifications and Reminders

## Notification types
- Connection request received.
- Connection request accepted or rejected.
- New message.
- Session proposed.
- Session confirmed, declined, rescheduled, or cancelled.
- Upcoming session reminder.
- Report status update where appropriate.

## Channels
- In-app notifications are the baseline.
- Email notifications are recommended for account verification, password reset, and important session reminders.
- Do not send marketing email by default.
- User notification preferences should be configurable after the first release if scope allows.

## Reminder policy
Proposed default: reminders 24 hours and 1 hour before a confirmed session. Confirm this timing with the product owner. Store scheduled jobs in UTC and format messages in the recipient's timezone.

## Delivery design
- Create notification/outbox row in the same transaction as the business event.
- Worker claims pending jobs safely.
- Retry transient failures with bounded exponential backoff.
- Make jobs idempotent.
- Mark permanent failures and alert operations.
- Avoid duplicate reminders after reschedule/cancel by invalidating prior job versions.

## Copy examples
- “You have a new connection request.”
- “Your session is confirmed for [date] at [time] ([timezone]).”
- “Your session starts in one hour.”
- “Your session time has changed. Review the updated details.”

## Privacy
Notification previews should not contain sensitive message text. Email must not reveal private profile information to unintended recipients.
