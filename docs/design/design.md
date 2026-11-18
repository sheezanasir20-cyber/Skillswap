# SkillSwap — Premium Visual & Interaction Design System

**Design direction:** Verdant Atelier — a warm, confident learning-exchange product with forest-green structure, soft parchment surfaces, jade accents, restrained terracotta warmth, and selective glassmorphism.

This document replaces the previous minimal monochrome visual direction. It is the visual source of truth for the complete SkillSwap application. Apply it consistently to public pages, member workspace, messaging, sessions, moderator tools, and administration.

---

## 1. Design intent

### 1.1 Product personality
SkillSwap should feel like a thoughtfully designed learning studio: welcoming, premium, calm, capable, and a little expressive. It should not look like a generic SaaS admin template or an automatically assembled AI dashboard.

The visual language combines:
- **Grounded structure:** deep evergreen navigation and clear page hierarchy.
- **Warm surfaces:** ivory, parchment, and soft neutral backgrounds instead of flat grey.
- **Fresh accents:** jade and sage for learning, progress, and selection.
- **Human warmth:** restrained clay/terracotta and muted amber for highlights.
- **Depth:** layered surfaces, subtle translucency, soft shadows, and selective glassmorphism.
- **Editorial restraint:** strong typography, carefully composed sections, and varied layouts rather than repeated grids of identical cards.

### 1.2 Intended visual impression
The interface should feel finished and designed, not merely minimal. Each screen needs a deliberate composition: a clear focal point, a secondary information layer, and a calm background. Use color and depth to establish hierarchy, not decoration for its own sake.

### 1.3 Design principles
1. **Warm, not sterile:** use parchment and cream neutrals instead of a white-on-grey-only palette.
2. **Distinctive, not loud:** use a strong evergreen foundation with a few warm accents.
3. **Layered, not cluttered:** add depth through a small number of translucent or elevated surfaces.
4. **Human, not synthetic:** avoid generic gradient blobs, random illustrations, stock-avatar walls, and AI-sounding copy.
5. **Informative, not ornamental:** every visual treatment must clarify status, hierarchy, or action.
6. **Consistent, not repetitive:** share a design system but vary page composition according to the task.

### 1.4 Do not reproduce the current screenshot literally
The current dashboard screenshot is useful as a structural reference, but its white sidebar, pale grey canvas, dark monochrome controls, thin plain cards, and blue browser-style focus outline make the interface feel unfinished and generic. The new design must visibly move beyond that appearance:
- Replace the white sidebar with a deep evergreen navigation rail.
- Replace the flat grey canvas with a warm parchment background and soft atmospheric color washes.
- Replace plain outlined panels with a mix of elevated paper surfaces and selective frosted-glass surfaces.
- Replace the default black CTA with a branded jade/evergreen treatment.
- Replace the harsh blue active outline with a designed active-navigation state while retaining a clear accessible keyboard focus ring.
- Give the dashboard more composition, warmth, and hierarchy without adding unnecessary content.

---

## 2. Brand and art direction

### 2.1 Brand concept
**SkillSwap — Share what you know. Discover what you don't.**

SkillSwap is a reciprocal learning community, not a paid tutoring marketplace. The visual identity should communicate exchange, trust, curiosity, and growth.

### 2.2 Signature motif
Use an understated **exchange-loop / interwoven path** motif. It can appear as:
- A small geometric mark beside the wordmark.
- A faint line motif in a hero background.
- A subtle accent on empty states or section dividers.

Keep the mark simple enough to work at 18–24 px. Do not use a robot, brain, graduation cap, generic lightbulb, or sparkle cluster as the logo.

### 2.3 Brand lockup
- Wordmark: `SkillSwap` in a semibold or bold weight.
- Mark: two interlocking curved strokes or two offset leaf-like paths suggesting a reciprocal exchange.
- Default lockup on the dark sidebar: warm white wordmark with a jade/amber mark.
- Public-page lockup: deep evergreen wordmark with jade mark.
- Do not stretch, rotate, outline, or apply glow to the wordmark.

### 2.4 Visual references in words
Think: a contemporary independent learning studio, a beautifully typeset editorial publication, and a calm boutique productivity product. Do not imitate any single commercial product or template.

---

## 3. Color system

The palette is intentionally richer than the previous grey-and-muted-green scheme. Evergreen anchors the product; parchment keeps it warm; jade provides freshness; terracotta and amber create human warmth. Use colors by role, not randomly.

### 3.1 Core palette

| Token | Hex | Role |
|---|---|---|
| `--color-forest-950` | `#142B28` | Deepest brand shade, sidebar and dark hero |
| `--color-forest-900` | `#1B3934` | Main dark surfaces and headings on dark backgrounds |
| `--color-forest-800` | `#245047` | Hover/active dark-surface states |
| `--color-jade-700` | `#287565` | Primary brand action and links |
| `--color-jade-600` | `#348777` | Main accent |
| `--color-jade-100` | `#DCEDE6` | Selected surface and soft accent |
| `--color-sage-100` | `#EAF0E8` | Soft supporting surface |
| `--color-parchment` | `#F5F1E8` | Main page canvas |
| `--color-paper` | `#FFFEFA` | Main card and form surface |
| `--color-white` | `#FFFFFF` | High-contrast surface and reversed text |
| `--color-ink` | `#1E2C29` | Main text |
| `--color-ink-soft` | `#465650` | Secondary text |
| `--color-muted` | `#75817A` | Metadata and helper text |
| `--color-line` | `#E4E4D9` | Borders and dividers |
| `--color-clay-600` | `#C96F55` | Warm highlight, badges, selected editorial accents |
| `--color-clay-100` | `#F6E5DE` | Soft warm accent surface |
| `--color-amber-600` | `#B9853F` | Important highlight and small decorative accents |
| `--color-amber-100` | `#F5EBD7` | Warm information surface |
| `--color-sky-700` | `#527C91` | Secondary data visualization accent |
| `--color-sky-100` | `#E2EEF2` | Secondary cool information surface |
| `--color-danger` | `#B34E4A` | Errors and destructive actions |
| `--color-danger-soft` | `#F8E7E4` | Error background |
| `--color-success` | `#32745A` | Success status |
| `--color-success-soft` | `#E2F0E7` | Success background |
| `--color-warning` | `#A8752D` | Warning status |
| `--color-warning-soft` | `#F7EEDB` | Warning background |
| `--color-focus` | `#76A9D5` | Visible keyboard focus on light and dark surfaces |

### 3.2 Signature gradients
Gradients are allowed and encouraged in a controlled way. Use them as a brand layer, not as a default background for every component.

| Token | CSS value | Use |
|---|---|---|
| `--gradient-brand` | `linear-gradient(120deg, #1B3934 0%, #287565 58%, #57917B 100%)` | Primary CTA, hero panel, selected feature areas |
| `--gradient-sidebar` | `linear-gradient(180deg, #142B28 0%, #1B3934 55%, #20473F 100%)` | Main app sidebar |
| `--gradient-warm` | `linear-gradient(120deg, #F5F1E8 0%, #F3E9DC 52%, #E8F0E8 100%)` | Marketing backgrounds and restrained content washes |
| `--gradient-clay` | `linear-gradient(120deg, #C96F55 0%, #D58B66 100%)` | Occasional highlight or small decorative detail |

Rules:
- Use no more than one prominent gradient area per viewport.
- Keep text contrast strong on gradient surfaces.
- Never use rainbow, neon, or purple-blue AI-style gradients.
- Do not put gradients inside every card, button, and badge.

### 3.3 Background atmosphere
The main app canvas may use a very subtle layered background, for example:

```css
.app-canvas {
  background:
    radial-gradient(ellipse at 88% 4%, rgba(52, 135, 119, 0.09), transparent 28rem),
    radial-gradient(ellipse at 18% 78%, rgba(201, 111, 85, 0.055), transparent 26rem),
    var(--color-parchment);
}
```

Keep the washes low-opacity and behind content. They must not reduce text contrast, compete with charts, or look like floating blobs.

### 3.4 Color balance guideline
For a typical authenticated desktop screen, target approximately:
- 55–65% parchment/cream/white surfaces.
- 20–25% evergreen/dark brand surfaces.
- 8–12% jade/sage accents.
- 3–6% warm clay/amber accents.

This is a visual guide, not a strict measurement. Do not let accent colors dominate the page.

### 3.5 Semantic color rules
- Jade: primary action, selected state, positive learning progress, links.
- Clay: attention, warm emphasis, selected editorial accents; not success or error.
- Amber: due soon, caution, important reminders.
- Sky: secondary information and chart series.
- Red: errors, destructive actions, suspended status.
- Green: success and completed states.

Every semantic status must include a readable label or icon. Never communicate meaning through color alone.

---

## 4. Typography

### 4.1 Font pairing
Use a restrained two-family system:
- **Headings and display:** `Manrope`, with `ui-sans-serif` fallback.
- **Body and interface:** `DM Sans`, with `ui-sans-serif` fallback.

Recommended CSS stack:

```css
--font-display: "Manrope", "Avenir Next", ui-sans-serif, system-ui, sans-serif;
--font-body: "DM Sans", Inter, ui-sans-serif, system-ui, sans-serif;
```

Load fonts locally or through an approved font provider. If fonts cannot load, the interface must remain visually stable with system fallbacks. Do not use more than two font families.

### 4.2 Type scale

| Style | Size | Weight | Line height | Usage |
|---|---:|---:|---:|---|
| Display | 48–56 px | 700 | 1.08 | Marketing hero only |
| H1 | 34–38 px | 700 | 1.15 | Main workspace page title |
| H2 | 25–28 px | 650 | 1.22 | Main section headings |
| H3 | 18–20 px | 650 | 1.3 | Panel and card headings |
| H4 | 15–16 px | 650 | 1.35 | Small subsection headings |
| Body large | 17 px | 400 | 1.55 | Hero supporting text |
| Body | 14–15 px | 400 | 1.55 | Default content |
| Body small | 12–13 px | 400 | 1.5 | Supporting metadata |
| Label | 11–12 px | 650 | 1.3 | Form labels and overlines |
| Button | 13–14 px | 650 | 1 | Buttons |

### 4.3 Typography rules
- Use sentence case for navigation and headings.
- Use tabular numerals for counts, ratings, dates, and analytics.
- Headlines should be confident but not oversized on operational screens.
- Use bold to establish hierarchy, not to emphasize every phrase.
- Keep paragraphs to a readable measure, ideally 55–80 characters per line.
- Avoid ultra-light weights, all-caps body copy, and condensed display fonts.
- Do not use letter spacing as a substitute for good hierarchy.

---

## 5. Layout system and app shell

### 5.1 Grid and content widths
- Maximum desktop workspace width: 1440 px.
- Standard reading width: 680–760 px.
- Wide dashboard content: 1180–1280 px where available.
- Desktop sidebar: 256 px expanded; 84 px compact only if compact mode is actually implemented.
- Topbar: 72 px high.
- Desktop content gutters: 36–44 px.
- Tablet gutters: 24 px.
- Mobile gutters: 16–20 px.

### 5.2 Main app shell
Use a composed two-region shell:
1. **Evergreen sidebar:** full-height, subtle gradient, wordmark at top, navigation grouped by purpose, profile area at bottom.
2. **Workspace:** warm atmospheric canvas, translucent topbar, page content aligned to a consistent content grid.

The sidebar should feel like an intentional brand anchor, not a generic white panel. It may use a slight inner highlight or a very subtle border on its right edge.

### 5.3 Sidebar specification
- Background: `--gradient-sidebar`.
- Wordmark: warm white; brand mark in jade or muted amber.
- Primary nav text: `rgba(255,255,255,.78)`.
- Inactive icon: `rgba(226,237,230,.72)`.
- Hover background: `rgba(255,255,255,.075)`.
- Active background: `rgba(220,237,230,.14)` with a slim jade/cream marker.
- Active label: white, semibold.
- Active icon: soft jade or pale mint.
- Divider: `rgba(255,255,255,.12)`.
- Profile footer: slightly lighter translucent dark surface with avatar, name, role, and sign-out control.
- Keep hit areas at least 44 px high.

Do not place a bright blue rectangle around the active item. Use a designed translucent highlight and a slim accent marker. Keyboard focus must remain distinct and visible (see Accessibility).

### 5.4 Topbar specification
- Sticky at the top of the workspace.
- Background: `rgba(255, 254, 250, 0.78)`.
- `backdrop-filter: blur(18px) saturate(145%)` with a solid fallback.
- Bottom border: `rgba(228,228,217,.75)`.
- Contains page context or breadcrumb on the left and notification/profile actions on the right.
- Avoid a second large logo in the workspace if the sidebar already holds the brand.

### 5.5 Spacing scale
Use a 4 px base unit.

| Token | Value |
|---|---:|
| `--space-1` | 4 px |
| `--space-2` | 8 px |
| `--space-3` | 12 px |
| `--space-4` | 16 px |
| `--space-5` | 20 px |
| `--space-6` | 24 px |
| `--space-8` | 32 px |
| `--space-10` | 40 px |
| `--space-12` | 48 px |
| `--space-16` | 64 px |
| `--space-20` | 80 px |

Spacing rules:
- Page title to supporting text: 8–12 px.
- Page header to first content area: 28–36 px.
- Section separation: 36–48 px.
- Form field separation: 16–20 px.
- Dense list row padding: 14–18 px.
- Card internal padding: 22–28 px desktop, 16–20 px mobile.
- Keep related controls close; use whitespace to separate unrelated groups.

---

## 6. Glassmorphism, surfaces, and depth

Glassmorphism is a signature part of this visual direction, but it must be selective. Too much blur makes the UI look like a template and reduces legibility.

### 6.1 Where glass is allowed
Use frosted glass for:
- Topbar.
- Notification popover.
- Dropdown menus.
- Filter popovers.
- Modal backplates and selected floating panels.
- A small number of dashboard summary surfaces.
- Floating contextual controls over a page background.

### 6.2 Where glass should not be used
Do not use glass for:
- Every content card.
- Long text and message bodies.
- Dense data tables.
- Form fields with long labels or validation text.
- High-density admin screens.
- Anything that must remain highly readable under all display conditions.

### 6.3 Glass tokens

```css
:root {
  --glass-bg: rgba(255, 254, 250, 0.68);
  --glass-bg-strong: rgba(255, 254, 250, 0.84);
  --glass-border: rgba(255, 255, 255, 0.74);
  --glass-shadow: 0 14px 40px rgba(23, 49, 43, 0.10);
  --glass-blur: 18px;
}

.glass-surface {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(var(--glass-blur)) saturate(145%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(145%);
}
```

Always include a readable opaque fallback when `backdrop-filter` is unsupported or disabled. Avoid placing text over complex moving content. Blur should be around 12–22 px, not extreme.

### 6.4 Standard surfaces
Use three clear surface levels:
1. **Canvas:** parchment with subtle color atmosphere.
2. **Paper surface:** warm white, a quiet border, and soft ambient shadow.
3. **Floating surface:** frosted glass, stronger elevation, and clear boundary.

Not every content group needs a card. Use open layouts, dividers, and typography where a card would add no value.

### 6.5 Shadows and borders

| Token | Value | Use |
|---|---|---|
| `--shadow-soft` | `0 4px 16px rgba(23,49,43,.055)` | Standard paper surface |
| `--shadow-card` | `0 10px 28px rgba(23,49,43,.075)` | Featured panel or member card |
| `--shadow-float` | `0 16px 44px rgba(23,49,43,.14)` | Popover and menu |
| `--shadow-modal` | `0 24px 72px rgba(13,31,27,.22)` | Dialog |

- Prefer delicate borders plus low-opacity shadows.
- Avoid heavy dark shadows and multiple nested shadow layers.
- Borders should usually be warm neutral, not pure grey.

### 6.6 Radius scale

| Token | Value | Usage |
|---|---:|---|
| `--radius-xs` | 6 px | Small tags and compact controls |
| `--radius-sm` | 9 px | Inputs and small buttons |
| `--radius-md` | 14 px | Standard buttons and small panels |
| `--radius-lg` | 18 px | Content panels and cards |
| `--radius-xl` | 24 px | Hero and featured surfaces |
| `--radius-pill` | 999 px | Avatar/status dot and deliberately pill-shaped chips |

Do not round every element into a pill. Reserve large radii for larger surfaces.

---

## 7. Buttons and interactive controls

### 7.1 Button variants

**Primary — Jade gradient**
- Background: `--gradient-brand`.
- Text: white.
- Soft shadow: subtle jade-tinted shadow.
- Hover: slightly brighter, lift by at most 1 px.
- Pressed: return to baseline and darken slightly.
- Use for the principal action on a page.

**Secondary — Paper outline**
- Background: warm white or translucent paper.
- Text: forest.
- Border: warm neutral.
- Hover: sage tint and jade border.

**Tertiary — Quiet text action**
- No filled background.
- Jade or forest text.
- Underline only where it clarifies link behavior.

**Warm accent — Clay**
- Use sparingly for one promotional or low-risk secondary action, never as the main destructive style.
- Ensure text contrast.

**Destructive**
- Danger text or danger-soft background for secondary destructive actions.
- Solid danger fill only for explicit final confirmation.

### 7.2 Button dimensions
- Compact: 32–34 px high.
- Standard: 40–44 px high.
- Prominent: 48 px high.
- Horizontal padding: 14–20 px.
- Minimum mobile touch target: 44 × 44 px.

### 7.3 Button behavior
- Use verb-first labels: “Send request”, “Save profile”, “Confirm session”.
- Include loading state and prevent double submission.
- Disabled controls must have a nearby explanation.
- Keep one clear primary action per section.
- Do not use icon-only buttons unless the icon is universally understood and an accessible name is supplied.

### 7.4 Inputs and forms
- Standard input height: 44 px.
- Textarea minimum height: 112 px.
- Background: white or translucent paper with adequate opacity.
- Border: `--color-line`.
- Focus: jade border with a soft ring, not an oversized browser-default blue box.
- Labels remain visible above the input; placeholders are examples only.
- Helper text uses muted ink and remains readable.
- Error text and field association must be accessible.
- On focus, avoid dramatic scale or glow effects.

### 7.5 Selects, search, and filters
- Search fields may include a leading search icon and a clear action.
- Use compact filter chips with soft jade/clay backgrounds and text labels.
- Active filters must be visible and removable.
- Provide “Clear filters” when more than one filter is active.
- Menus should use the frosted floating-surface style, but retain an opaque fallback.

### 7.6 Skill chips
- “Can teach” uses jade/sage treatment.
- “Wants to learn” uses clay/amber treatment.
- Level is a text label: Beginner, Intermediate, Advanced.
- Keep chips compact and rectangular with 7–10 px radius.
- Do not imply skill verification or proficiency scoring.

---

## 8. Navigation and information architecture

### 8.1 Member navigation
Recommended order:
- Overview
- Discover
- Connections
- Messages
- Sessions
- History
- Profile
- Settings

### 8.2 Staff navigation
- Overview
- Reports
- Members
- Analytics
- Activity log

### 8.3 Navigation styling
- Use a consistent line-icon family (Lucide is acceptable).
- Icon size: 18–20 px.
- Navigation item height: 44–48 px.
- Use clear text labels; do not use icon-only desktop navigation.
- Sidebar active state: translucent sage/white layer, slim jade indicator, white label.
- Use quiet group labels only where they improve scanning.

### 8.4 Mobile navigation
- Collapse the desktop sidebar below 900 px.
- Use a compact bottom navigation for the 4–5 most-used member destinations.
- Put remaining destinations in an accessible “More” panel.
- Ensure the bottom bar respects device safe areas.
- Do not hide essential actions on hover.

---

## 9. Dashboard composition — new visual target

The current dashboard must be redesigned with the following composition. Do not simply recolor the existing empty panels.

### 9.1 Page header
- Greeting and short contextual sentence on the left.
- Primary action “Discover partners” on the right.
- Page title in forest ink; supporting line in muted ink.
- Optional small eyebrow such as “YOUR LEARNING SPACE” in jade, with restrained letter spacing.
- Divider is subtle or omitted if spacing already separates the sections.

### 9.2 Welcome/hero panel
Use a wide, featured panel near the top of the page:
- Dark evergreen-to-jade gradient.
- 22–26 px radius.
- White title and supporting text.
- A small, understated exchange-loop motif on the far right.
- Optional small label such as “YOUR SKILLS, IN MOTION”.
- Do not use a giant decorative blob or stock illustration.
- Include one primary action and at most one secondary text link.

### 9.3 At-a-glance metrics
Use a compact row of 3–4 meaningful metrics when data exists:
- Skills listed.
- Active connections.
- Upcoming sessions.
- Sessions completed.

Each metric should have a clear label, value, and small context line. Use different subtle accent treatments, but no rainbow row of colored cards. If no data exists, show genuine zero states rather than invented values.

### 9.4 Skills overview
- Use a balanced two-column composition on desktop: “Skills I can teach” and “Skills I want to learn”.
- Give each side its own semantic chip color (jade vs clay/amber).
- Include counts and a direct “Manage skills” action.
- Empty states should guide the user to add the first skill.
- Avoid large blank card containers with only a single sentence in the middle.

### 9.5 Suggested partners
- Prefer a list or a varied 2-column set of member cards over identical full-width boxes.
- Show avatar/initials, name, short context, mutual skill exchange reason, level, and a clear action.
- Match explanation should be written in human language (“You can teach Figma; Noor wants to learn it. Noor can teach Excel, which is on your list.”).
- Do not display a compatibility percentage unless its scoring and interpretation are approved and clearly explained.

### 9.6 Upcoming sessions
- Use a compact timeline or agenda list.
- Show date block, topic, partner, local time, and status.
- Make the next upcoming session visually distinct with a soft jade surface.
- Include a useful empty state with a “Find a partner” route.

### 9.7 Visual rhythm
Use a mix of full-width hero, compact metrics, split skill areas, member rows/cards, and an agenda. Do not repeat the same card geometry for every section.

---

## 10. Screen-specific design rules

### 10.1 Public landing page
- Use a warm parchment background with a dark evergreen hero or a split hero composition.
- Headline: “Learn something new. Teach what you know.” or an equally clear alternative.
- Supporting copy explains reciprocal exchange in plain language.
- Main CTA: “Create your profile”. Secondary action: “See how it works”.
- Use a single contextual image or simple custom diagram only if it adds meaning.
- Use a 3-step process: list your skills, find a partner, arrange a session.
- Explain that SkillSwap does not process payments or host video calls.
- No fake testimonials, invented user counts, or fabricated outcomes.

### 10.2 Registration and login
- Use a focused split layout: form on warm paper, secondary brand panel in deep evergreen.
- Keep the form narrow and calm.
- Use clear field labels, password visibility control, and inline errors.
- Avoid a full-screen abstract gradient background.
- Staff sign-in may be a separate route or role-aware flow, but staff permissions must be enforced server-side.

### 10.3 Onboarding
- Use a stepper with simple step labels and a clear progress indicator.
- One key decision per step.
- Skills can be selected using searchable chips.
- Show “Can teach” and “Want to learn” as distinct sections.
- Allow the member to skip optional biography/avatar steps.
- Explain why availability improves matching.

### 10.4 Discover and match results
- Search and filters sit together in a calm floating filter surface.
- Results use a clean list or varied partner cards.
- Show mutual skill exchange context prominently.
- Make filter changes understandable and reversible.
- Empty state offers broader filters or adding skills.

### 10.5 Member profile
- Show identity and introductory text first.
- Separate teach and learn skills visually.
- Show skill level as user-provided information.
- Show general availability only where privacy settings permit.
- Display ratings/reviews with honest context; do not overstate credibility.
- Report action remains accessible but visually quiet.

### 10.6 Connections
- Split incoming, outgoing, and accepted connections using tabs or segmented navigation.
- Use compact member rows with status and one relevant action.
- Confirmation dialogs for reject/cancel where useful.
- Explain pending and expired states in plain language.

### 10.7 Messaging
- Use a two-panel desktop layout: conversation list and conversation thread.
- Conversation list may use a subtle glass surface; message history itself should remain readable on solid surfaces.
- Use distinct but restrained message bubbles: jade-tinted for the current member and warm white for the other person.
- Keep the text measure readable.
- Show send, pending, failed, and retry states.
- Do not expose online/read receipts unless explicitly part of approved scope.
- Keep report/block affordances in the conversation menu.

### 10.8 Sessions and calendar
- Default to agenda/list view; calendar view may be an additional option.
- Give session statuses consistent labels and semantic colors.
- Show the timezone explicitly when there could be ambiguity.
- Use a clear proposal/confirmation timeline.
- Reschedule and cancellation flows must explain who needs to confirm.
- External meeting links are user-provided; label them as external and validate them.

### 10.9 History and reviews
- Use a tidy chronological list with filters.
- Completed sessions may expose the “Rate and review” action.
- Review cards should be content-first, with rating and author/date metadata.
- Avoid star-rating displays that imply a verified quality guarantee.

### 10.10 Notifications
- Use a translucent popover with solid readable content.
- Group by recent/today/earlier only if helpful.
- Each notification has a type icon, short title, context, and timestamp.
- Do not include private message contents in notification previews.

### 10.11 Moderator workspace
- More operational and information-dense than member screens, but retain the same brand palette.
- Use paper surfaces and clear table/list hierarchy; do not overuse glass.
- Show report status, reason, target, date, and available action.
- Report details need enough context for fair review.
- Require a reason for consequential moderation actions.

### 10.12 Administrator workspace
- Use a calm analytical layout with a small number of well-defined metrics.
- Charts use a consistent palette and include date range, labels, and a textual summary.
- Tables prioritize scanability over decoration.
- Activity logs are read-only and visibly labelled as such.
- Export actions must be easy to locate but not visually dominant.

### 10.13 Settings
- Use a left-side settings index on desktop and a stacked section list on mobile.
- Group account, privacy, notification, and security settings.
- Provide clear save/cancel behavior and unsaved-change feedback.

---

## 11. Cards, lists, tables, and data visualization

### 11.1 Cards
Use cards only when content is a coherent unit. Vary composition:
- Featured hero surface.
- Standard paper card.
- Glass summary surface.
- Borderless content group.

Do not put every heading, row, and paragraph inside its own card.

### 11.2 Member cards
Order of information:
1. Avatar/initials and display name.
2. Short introduction or context.
3. Mutual teach/learn skill evidence.
4. General availability or level context when permitted.
5. One clear action.

### 11.3 Tables
- Warm paper background, thin warm border, clear header contrast.
- Compact but comfortable row padding.
- Highlight row hover with very subtle sage.
- Keep action placement consistent.
- On mobile, reflow into labelled stacked items or provide a controlled horizontal scroll region.
- Do not use colored row stripes as the only grouping method.

### 11.4 Charts
Use a consistent sequence:
1. Evergreen `#1B3934`
2. Jade `#348777`
3. Clay `#C96F55`
4. Amber `#B9853F`
5. Sky `#527C91`
6. Sage `#91A995`

Rules:
- Use no more than 4–5 series in one chart unless the chart type demands it.
- Label units and time ranges.
- Provide a textual summary and accessible data alternative.
- Do not use 3D charts, decorative gauges, or unexplained percentages.
- Color must not be the only differentiator between data series.

---

## 12. Iconography, avatars, and imagery

### 12.1 Icons
- Use one line-icon family consistently (Lucide is acceptable).
- Sizes: 16 px inline, 18 px form/control, 20 px navigation, 24 px empty-state illustration.
- Stroke weight: approximately 1.75–2 px.
- Icons support labels; they do not replace unfamiliar text labels.
- Use filled icons only for selected states or where the icon family provides a consistent variant.

### 12.2 Avatars
- Use actual member-uploaded images where provided.
- Otherwise use initials on a subtle jade, clay, or sky-tinted background.
- Never use fabricated people or random AI portraits to populate a real member list.
- Use consistent avatar sizes: 32 px compact, 40 px standard, 48 px profile/list feature, 80–96 px profile header.

### 12.3 Imagery
- Avoid generic stock photos as decoration.
- If marketing photography is used, choose natural, documentary-style images of people learning or collaborating; use consistent cropping and subtle color grading.
- Do not make the application dependent on images to communicate functionality.
- Prefer small custom diagrams or abstract line motifs when they explain the exchange process.

---

## 13. Motion and micro-interactions

Motion should make the product feel considered, not playful for its own sake.

### 13.1 Timing
- Hover/press: 120–160 ms.
- Menus/popovers: 160–200 ms.
- Modal: 180–220 ms.
- Page transitions: 180–240 ms, only if they improve continuity.

### 13.2 Allowed motion
- Subtle card lift (1–2 px) on hover.
- Slight background tint change on navigation hover.
- Gentle fade/slide for popovers and dialogs.
- Small icon state changes.
- Smooth progress/stepper updates.
- Button press feedback.

### 13.3 Avoid
- Parallax.
- Bouncing or spring-heavy UI.
- Constantly moving backgrounds.
- Animated gradient loops.
- Scroll-jacking.
- Loading animations that shift page layout.

Respect `prefers-reduced-motion: reduce` and remove nonessential transitions when requested.

---

## 14. Responsive behavior

### 14.1 Breakpoints

| Name | Range |
|---|---|
| Small mobile | 0–374 px |
| Mobile | 375–639 px |
| Tablet | 640–899 px |
| Desktop | 900–1279 px |
| Wide | 1280 px and above |

### 14.2 Responsive rules
- No horizontal page overflow at 320 px.
- Sidebar becomes a drawer or bottom navigation below 900 px.
- Dashboard hero stacks its content on mobile.
- Metrics use 2 columns on compact screens and 3–4 columns where space allows.
- Split skill sections stack on mobile.
- Forms become single-column on mobile.
- Tables reflow or scroll inside their own container.
- Dialogs become near-full-screen sheets on narrow phones when appropriate.
- Touch targets must be at least 44 × 44 px.
- Do not hide essential actions behind hover-only interactions.
- Preserve comfortable spacing; do not simply shrink desktop layouts.

### 14.3 Responsive test widths
Verify at 320, 375, 390, 640, 768, 900, 1024, 1280, and 1440 px.

---

## 15. Accessibility and focus treatment

Target WCAG 2.2 AA.

- Maintain contrast for text, controls, borders, and focus indicators.
- Use semantic landmarks and logical heading order.
- All controls must work by keyboard.
- Inputs must have persistent labels.
- Errors must be associated with relevant fields and announced.
- Dialogs must manage focus and return it to the trigger.
- Use status text/icons in addition to color.
- Glass surfaces must have sufficient opacity and contrast.
- Support browser zoom to 200% without loss of content.
- Respect reduced-motion settings.

### Focus styling
Do not remove focus outlines. Use a branded, high-contrast dual ring that works on light and dark surfaces:

```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.sidebar :focus-visible {
  outline-color: #F3D8A7;
}
```

The screenshot's harsh blue outline around the active Overview item should not be replicated as an active state. The active item gets the designed translucent highlight; keyboard focus gets the separate accessible ring only while focused.

---

## 16. Required interface states

Every data-driven screen must define:
- Initial/loading state.
- Loaded state.
- Empty state.
- Error state with retry when appropriate.
- Permission-denied state.
- Offline/reconnecting state for messaging.
- Mutation success feedback.
- Disabled state with explanation.
- Skeleton placeholders for loading where they improve perceived stability.

Empty states should feel intentional. Use a small line illustration or exchange motif only when it clarifies the action; otherwise use a concise message, one helpful explanation, and one clear CTA. Do not leave a large blank bordered box with a sentence floating in its center.

---

## 17. Writing and content style

- Use short, natural, specific language.
- Prefer “Find a learning partner” over “Unlock your potential”.
- Prefer “Skills you can teach” over “Your superpowers”.
- Prefer “Your next session” over “Your transformational journey”.
- Never claim SkillSwap verifies skills unless a verification feature is formally added.
- Avoid fake urgency, fake social proof, and generic AI-style marketing phrases.
- Use local date/time formatting and show timezone when ambiguous.
- Use member-friendly status names: Pending, Accepted, Confirmed, Completed, Cancelled, Declined.

---

## 18. CSS token starter

Use these tokens as the implementation baseline. Components may add component-level tokens, but do not hard-code unrelated colors throughout the codebase.

```css
:root {
  color-scheme: light;

  --color-forest-950: #142b28;
  --color-forest-900: #1b3934;
  --color-forest-800: #245047;
  --color-jade-700: #287565;
  --color-jade-600: #348777;
  --color-jade-100: #dcede6;
  --color-sage-100: #eaf0e8;
  --color-parchment: #f5f1e8;
  --color-paper: #fffefa;
  --color-white: #ffffff;
  --color-ink: #1e2c29;
  --color-ink-soft: #465650;
  --color-muted: #75817a;
  --color-line: #e4e4d9;
  --color-clay-600: #c96f55;
  --color-clay-100: #f6e5de;
  --color-amber-600: #b9853f;
  --color-amber-100: #f5ebd7;
  --color-sky-700: #527c91;
  --color-sky-100: #e2eef2;
  --color-danger: #b34e4a;
  --color-success: #32745a;
  --color-warning: #a8752d;
  --color-focus: #76a9d5;

  --gradient-brand: linear-gradient(120deg, #1b3934 0%, #287565 58%, #57917b 100%);
  --gradient-sidebar: linear-gradient(180deg, #142b28 0%, #1b3934 55%, #20473f 100%);

  --font-display: "Manrope", "Avenir Next", ui-sans-serif, system-ui, sans-serif;
  --font-body: "DM Sans", Inter, ui-sans-serif, system-ui, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-xs: 6px;
  --radius-sm: 9px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --shadow-soft: 0 4px 16px rgba(23, 49, 43, .055);
  --shadow-card: 0 10px 28px rgba(23, 49, 43, .075);
  --shadow-float: 0 16px 44px rgba(23, 49, 43, .14);

  --glass-bg: rgba(255, 254, 250, .68);
  --glass-border: rgba(255, 255, 255, .74);
  --glass-blur: 18px;
}

.app-canvas {
  min-height: 100vh;
  color: var(--color-ink);
  background:
    radial-gradient(ellipse at 88% 4%, rgba(52, 135, 119, .09), transparent 28rem),
    radial-gradient(ellipse at 18% 78%, rgba(201, 111, 85, .055), transparent 26rem),
    var(--color-parchment);
}

.app-sidebar {
  color: rgba(255, 255, 255, .88);
  background: var(--gradient-sidebar);
}

.app-topbar {
  background: rgba(255, 254, 250, .78);
  border-bottom: 1px solid rgba(228, 228, 217, .75);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
}

.paper-surface {
  background: var(--color-paper);
  border: 1px solid rgba(228, 228, 217, .9);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.glass-surface {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float);
  backdrop-filter: blur(var(--glass-blur)) saturate(145%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(145%);
}

.button-primary {
  color: var(--color-white);
  background: var(--gradient-brand);
  border: 0;
  border-radius: var(--radius-md);
  box-shadow: 0 5px 14px rgba(40, 117, 101, .20);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface,
  .app-topbar {
    background: #fffefa;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

**Implementation note:** the canonical `--color-jade-100` value is `#DCEDE6`. Use that exact six-character hex value in code.

---

## 19. Design quality checklist

### Brand and composition
- [ ] Evergreen navigation creates a strong brand anchor.
- [ ] Warm parchment replaces flat grey as the main workspace canvas.
- [ ] Jade, clay, amber, and sky accents are used semantically and sparingly.
- [ ] The dashboard has a clear hero, useful metrics, skills, matches, and session agenda.
- [ ] Page compositions vary according to user task; not every section is an identical card.

### Glass and depth
- [ ] Glassmorphism is selective and not applied to every surface.
- [ ] Glass text remains legible and has an opaque fallback.
- [ ] Paper surfaces, floating surfaces, and canvas are visually distinct.
- [ ] Shadows are soft and consistent.

### Components
- [ ] Buttons, fields, chips, tables, menus, dialogs, toasts, and status tags follow shared tokens.
- [ ] Active navigation and keyboard focus are visually distinct.
- [ ] Loading, empty, error, success, and permission states exist.
- [ ] No fake metrics, members, ratings, or testimonials are shown.

### Responsive and accessible
- [ ] Works at 320 px without page-level horizontal overflow.
- [ ] Sidebar changes to a mobile-friendly navigation pattern.
- [ ] Touch targets meet minimum size.
- [ ] Keyboard focus is visible on light and dark surfaces.
- [ ] Contrast meets WCAG 2.2 AA.
- [ ] Reduced-motion settings are respected.

### Craft
- [ ] No generic AI-style gradient blobs, neon glow, or overdecorated interface.
- [ ] No inconsistent radii, spacing, colors, or typography.
- [ ] No unnecessary animation or nested-card overload.
- [ ] The result feels warm, premium, distinctive, and trustworthy.

---

## 20. Final implementation instruction

Treat this file as mandatory visual acceptance criteria. Before considering frontend implementation complete, compare every major route against this system. The member dashboard shown in the supplied reference screenshot must be redesigned—not simply recolored—to use the evergreen shell, warm atmospheric canvas, selective frosted-glass elements, stronger typography, more purposeful dashboard composition, and the full Verdant Atelier palette.
