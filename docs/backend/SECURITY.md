# Security, Privacy, and Abuse Prevention

## Authentication
- Hash passwords with Argon2id or appropriately configured bcrypt.
- Use TLS for all production traffic.
- Prefer secure, HttpOnly, SameSite cookies for browser sessions.
- Apply CSRF protection when cookie-based authentication is used.
- Rate-limit login, registration, password reset, and verification endpoints.
- Use generic password-reset responses to prevent account enumeration.
- Rotate session identifiers after login and privilege changes.

## Authorization
- Enforce permissions on every API request.
- Check resource ownership and conversation/session membership server-side.
- Use deny-by-default role permissions.
- Admin role changes require elevated authorization and audit logging.
- Never trust role values supplied by the browser.

## Data protection
- Minimize collected personal information.
- Keep email and private profile fields out of public responses.
- Escape user-generated text at render time; reject unsafe rich HTML.
- Validate URLs and use safe external-link behavior.
- Store secrets outside source control.
- Encrypt backups and restrict access.

## Abuse controls
- Report profile, message, and review content.
- Provide block/mute controls as a recommended safety enhancement; confirm scope with product owner.
- Rate-limit repeated connection requests and messages.
- Detect spam patterns without exposing private content unnecessarily.
- Require reason text for staff moderation actions.
- Provide an appeal/contact path before permanent account deletion or suspension policy is finalized.

## Audit
Log staff actions: actor, action, target, timestamp, reason, and minimal metadata. Audit records should be append-only for application roles. Never log passwords, tokens, or message contents.

## Secure development checklist
- Dependency scanning and timely patching.
- Input validation and output encoding.
- SQL parameterization/ORM protections.
- CORS allowlist.
- Content Security Policy.
- Secure headers.
- File upload type/size checks if avatars are supported.
- Secrets scanning in CI.
- Backup restore tests.
- Authorization tests for every protected resource.
