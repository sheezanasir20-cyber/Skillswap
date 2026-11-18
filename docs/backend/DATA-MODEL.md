# Data Model

Relational model proposal for PostgreSQL. Names are illustrative; enforce constraints and indexes in migrations.

## Entities

### `users`
- `id` UUID primary key
- `email` unique, normalized
- `password_hash`
- `display_name`
- `bio` nullable
- `avatar_url` nullable
- `timezone` IANA timezone
- `role` enum: `member`, `moderator`, `admin`
- `status` enum: `active`, `suspended`, `deleted`, `pending_verification`
- `created_at`, `updated_at`, `last_login_at`

### `skills`
- `id` UUID
- `name` unique normalized
- `category` nullable
- `is_active`
- `created_at`

### `user_skills`
- `id` UUID
- `user_id` FK users
- `skill_id` FK skills
- `intent` enum: `teach`, `learn`
- `level` enum: `beginner`, `intermediate`, `advanced`
- `created_at`
- Unique constraint: `(user_id, skill_id, intent)`

### `availability`
- `id` UUID
- `user_id` FK users
- `weekday` integer 0–6
- `start_minute`, `end_minute`
- `timezone`
- `created_at`, `updated_at`

### `connections`
- `id` UUID
- `requester_id`, `recipient_id` FK users
- `status` enum: `pending`, `accepted`, `rejected`, `cancelled`, `blocked`
- `request_note` nullable
- `created_at`, `updated_at`
- Prevent self-connection and duplicate active pair.

### `conversations`
- `id` UUID
- `connection_id` unique FK connections
- `created_at`

### `messages`
- `id` UUID
- `conversation_id` FK conversations
- `sender_id` FK users
- `body`
- `created_at`, `edited_at` nullable
- Index `(conversation_id, created_at desc)`

### `sessions`
- `id` UUID
- `connection_id` FK connections
- `proposed_by` FK users
- `title`
- `description` nullable
- `starts_at`, `ends_at` UTC
- `timezone`
- `external_meeting_url` nullable
- `status` enum: `proposed`, `confirmed`, `declined`, `cancelled`, `completed`
- `version` integer
- `created_at`, `updated_at`

### `reviews`
- `id` UUID
- `session_id` FK sessions
- `reviewer_id`, `reviewee_id` FK users
- `rating` smallint 1–5
- `body` nullable
- `status` enum: `visible`, `hidden_pending_review`, `removed`
- `created_at`
- Unique `(session_id, reviewer_id)`

### `reports`
- `id` UUID
- `reporter_id` FK users
- `target_type` enum: `profile`, `message`, `review`
- `target_id` UUID
- `reason` enum or controlled text
- `description` nullable
- `status` enum: `submitted`, `under_review`, `resolved`, `dismissed`
- `assigned_to` nullable FK users
- `resolution_note` nullable
- `created_at`, `updated_at`, `resolved_at`

### `notifications`
- `id` UUID
- `user_id` FK users
- `type`
- `title`, `body`
- `resource_type`, `resource_id` nullable
- `read_at` nullable
- `created_at`

### `audit_logs`
- `id` UUID
- `actor_id` FK users
- `action`
- `target_type`, `target_id`
- `reason` nullable
- `metadata` JSONB with allowlisted non-sensitive fields
- `created_at`
- Append-only to application roles.

### `notification_jobs`
- `id` UUID
- `type`
- `resource_id`
- `run_at`
- `status`
- `attempts`
- `last_error` sanitized
- `created_at`, `updated_at`

## Relationship summary
- One user has many user skills and availability rows.
- Two users may have a connection; accepted connection has one conversation.
- A conversation has many messages.
- A connection can have many sessions.
- A completed session can have up to one review per participant.
- A report references a reported resource.
- Staff actions create audit log entries.

## Indexes and constraints
- Unique normalized email.
- `user_skills(skill_id, intent, level, user_id)`.
- `connections(requester_id, recipient_id, status)`.
- `messages(conversation_id, created_at desc)`.
- `sessions(connection_id, starts_at, status)`.
- `reports(status, created_at)`.
- `notifications(user_id, read_at, created_at desc)`.
- `audit_logs(actor_id, created_at desc)`.
- Check `ends_at > starts_at`, rating 1–5, valid weekday/minute ranges.
- Enforce all ownership and participant rules in service transactions, not only in the UI.

## Privacy note
Define deletion, anonymization, retention, and backup-expiry policy before launch. Avoid storing sensitive identity documents; the SRS does not require skill verification.
