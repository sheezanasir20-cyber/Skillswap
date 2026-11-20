# SkillSwap UI/UX Redesign Implementation Plan (Verdant Atelier)

## 1. Objectives & Guidelines
Transform the SkillSwap web application from the previous monochrome design into the **Verdant Atelier** design system per `docs/design/design.md`.

## 2. Redesign Architecture Checklist

### Phase 1: Foundations & Design Tokens
- [x] Analyze `docs/design/design.md` and current frontend structure.
- [ ] Implement complete Verdant Atelier color tokens in `frontend/src/styles/tokens.css`:
  - Deep Forest (`#142B28`, `#1B3934`, `#245047`)
  - Primary Jade (`#348777`, `#287565`, `#DCEDE6`)
  - Sage (`#EAF0E8`, `#91A995`)
  - Warm Parchment (`#F5F1E8`) & Warm Paper (`#FFFEFA`)
  - Main Ink (`#1E2C29`, `#465650`, `#75817A`)
  - Warm Highlights: Clay (`#C96F55`, `#F6E5DE`), Amber (`#B9853F`, `#F5EBD7`), Sky (`#527C91`, `#E2EEF2`)
  - Status: Danger (`#B34E4A`, `#F8E7E4`), Success (`#32745A`, `#E2F0E7`), Warning (`#A8752D`, `#F7EEDB`)
- [ ] Implement typography scales: Manrope for display/headings, DM Sans for interface and body.
- [ ] Implement signature gradients: `--gradient-brand`, `--gradient-sidebar`, `--gradient-warm`, `--gradient-clay`.
- [ ] Implement glassmorphism tokens and atmospheric canvas wash (`.app-canvas`).
- [ ] Implement accessible focus styling with dual ring.

### Phase 2: Application Shell & Navigation
- [ ] `AppLayout.tsx`: Deep evergreen sidebar (`--gradient-sidebar`) with exchange-loop motif, white nav labels, jade indicator for active items, profile footer with role and sign out, responsive bottom navigation for mobile (< 900px).
- [ ] `AppTopbar`: Translucent glassmorphic topbar with `backdrop-filter: blur(18px)`, page breadcrumb context, notification bell with unread badge and dropdown popover.
- [ ] `PublicLayout.tsx`: Warm parchment canvas, translucent sticky header with evergreen brand lockup, responsive drawer, and editorial footer.
- [ ] `StaffLayout.tsx`: Professional operational workspace with evergreen sidebar, amber badges, and return-to-app action.

### Phase 3: Core Reusable UI System
- [ ] `Button.tsx`: Jade gradient primary, warm paper secondary, quiet tertiary, clay highlight, danger.
- [ ] `Input.tsx`, `Textarea.tsx`, `Select.tsx`: High-contrast warm paper surfaces, persistent labels, helper text, accessible error display.
- [ ] `SkillBadge.tsx`: Jade/sage chips for "can teach", clay/amber chips for "wants to learn", level indicator.
- [ ] `Avatar.tsx`: Initials with tinted pastel backgrounds (jade, clay, sky), standard sizes (32, 40, 48, 80px).
- [ ] `Modal.tsx`: Frosted glass backdrop (`backdrop-filter`), warm paper container, soft shadow (`--shadow-modal`).
- [ ] `NotificationBell.tsx`: Translucent glassmorphic popover, unread count badge, notification item list.
- [ ] `EmptyState.tsx`: Custom exchange-loop motif or icon, warm human copy, clear primary action.

### Phase 4: Page Redesigns
- [ ] **Public Pages**:
  - `LandingPage.tsx`: Hero with evergreen/split composition, 3-step reciprocal exchange process, discovery preview, legal disclaimer, final CTA.
  - `HowItWorksPage.tsx`: Illustrated editorial walkthrough.
  - `LegalPages.tsx`: Editorial typography for Terms & Privacy.
- [ ] **Authentication**:
  - `LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`: Split-screen layout (warm paper form + deep evergreen brand panel).
- [ ] **Member Experience**:
  - `OverviewDashboard.tsx`: Welcome header, evergreen-to-jade hero with exchange loop, metrics row, split teach/learn skills overview, suggested matches with plain-language explanations, upcoming sessions agenda.
  - `DiscoverPage.tsx`: Floating filter popover, search bar, active filter pills, partner cards with mutual match rationale.
  - `ConnectionsPage.tsx`: Segmented tabs (Incoming, Outgoing, Accepted), compact member rows, contextual actions.
  - `MessagesPage.tsx`: Two-panel UI: left conversation list with unread indicators, right message history (jade current user bubbles, warm paper partner bubbles, composer).
  - `SessionsPage.tsx`: Upcoming & pending timeline, propose session modal, cancel/confirm/reschedule actions with timezone awareness.
  - `SessionHistoryPage.tsx`: Chronological learning history, status labels, review eligibility, and review modal.
  - `MemberProfilePage.tsx`: Profile header, avatar, bio, teach vs learn skills, ratings, report affordance.
  - `ProfileSettingsPage.tsx` & `AccountSettingsPage.tsx`: Grouped settings with left-side index (Account, Profile, Privacy, Notifications, Security).
- [ ] **Staff & Moderation**:
  - `StaffOverviewPage.tsx`: Real moderation metrics and quick triage.
  - `StaffReportsPage.tsx`: Reports queue, filter by status, report details drawer, warn/suspend/dismiss actions.
  - `StaffMembersPage.tsx`: Member management table with role and status updates.
  - `StaffAnalyticsPage.tsx`: Analytical dashboard with charts in Verdant palette and textual summaries.
  - `StaffActivityPage.tsx`: Read-only audit log table.

### Phase 5: Verification & Delivery
- [ ] Run Vite production build (`vite build`) and verify 0 errors.
- [ ] Run TypeScript type check (`tsc --noEmit`) and verify 0 errors.
- [ ] Run test suite (`vitest run`) and verify 113/113 tests pass.
- [ ] Visual verification of all screens across responsive viewports.
- [ ] Produce `UI-REDESIGN-REPORT.md`.
