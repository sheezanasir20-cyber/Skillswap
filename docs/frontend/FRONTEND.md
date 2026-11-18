# Frontend Architecture

## 1. Proposed stack
React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, and CSS Modules/design tokens. This is a proposal; the SRS does not prescribe a framework.

## 2. Architecture principles
- Feature-oriented folders; avoid one giant components directory.
- API access is centralized in typed service modules.
- Server state belongs in query/cache tooling; local UI state stays local.
- Authorization is enforced by the API. Frontend route guards improve UX but are not security boundaries.
- Components remain presentational where possible.
- No hard-coded user data or fake analytics in production.

## 3. Suggested structure
```text
src/
  app/
    App.tsx
    router.tsx
    providers/
  components/
    ui/
    layout/
    feedback/
  features/
    auth/
    onboarding/
    profile/
    skills/
    discover/
    connections/
    messages/
    sessions/
    reviews/
    reports/
    staff/
  lib/
    api/
    auth/
    validation/
    dates/
    errors/
  styles/
    tokens.css
    global.css
  types/
```

## 4. Route protection
- Public routes: landing, auth, legal.
- Member routes: require authenticated member session.
- Staff routes: require staff role and specific permission.
- If unauthorized, show a clear access-denied screen; do not merely hide the navigation link.
- Redirect expired sessions to sign-in while preserving a safe return path.

## 5. Feature requirements
### Authentication
Registration, login, logout, password reset, verification status, session-expired handling.

### Profile and skills
Editable display name, bio, timezone, avatar, teach skills, learn skills, skill level, availability. Validate lengths and supported values. Do not label user-entered skills as verified.

### Discover and matching
Search by skill and filters. Show match reason and only information the member is allowed to see. Debounce search input and cancel stale requests.

### Connections
Separate incoming, outgoing, and accepted connections. Disable duplicate request actions. Reflect server-side state after accept/reject.

### Messaging
Conversation list, message history pagination, send state, reconnect state, retry, report action. Escape rendered text and do not render user-supplied HTML.

### Sessions
Create, confirm, decline, reschedule, cancel, complete. Show timezone and state. A completed session unlocks review submission.

### Reviews
One review per eligible reviewer/session. Rating range and text limits are validated on both client and server.

### Staff
Role-aware navigation, report queue, decision confirmation, member actions, analytics date range, activity log filters.

## 6. API client
- Set a single API base URL from environment.
- Add request correlation ID where supported.
- Normalize API errors into a typed shape.
- Never log passwords, session cookies, message bodies, or private profile fields.
- Handle 401 by refreshing or redirecting according to the chosen auth model.
- Use pagination for lists.

## 7. State and cache policy
- Query/cache: profile, skills, matches, connections, sessions, reports, analytics.
- Local state: open menus, active tab, modal visibility, draft filter values.
- Invalidate relevant queries after mutations.
- Do not persist sensitive data in localStorage.
- Draft message persistence is optional and must be disclosed if implemented.

## 8. Forms
- Use schema-based validation shared where practical.
- Validate on blur and submit; avoid aggressive validation on every keystroke.
- Server errors should map to fields when possible.
- Use accessible labels, descriptions, and error associations.

## 9. Performance
- Lazy-load staff analytics and rarely used routes.
- Paginate messages and activity logs.
- Optimize avatar sizes and use modern image formats.
- Avoid loading the entire skill directory at once.
- Keep initial public page lightweight.
- Measure Core Web Vitals on representative devices.

## 10. Frontend acceptance checklist
- All routes have loading, empty, error, and unauthorized states.
- All interactive controls work with keyboard.
- Responsive at 320, 375, 768, 1024, and 1440 px.
- No private API data is exposed in client logs.
- No raw HTML injection from user content.
- Form submission prevents duplicate requests.
