# SkillSwap — Ember Noir Premium Design System

**Design direction:** Ember Noir — a premium, expressive learning-community experience built around midnight ink, oxblood, deep crimson, vermilion, ember orange, and restrained golden highlights. Warm porcelain surfaces, editorial typography, deliberate composition, and selective glassmorphism keep the strong palette sophisticated and readable.

**Visual source of truth:** This document replaces all earlier palettes and design directions. Apply it consistently to the public website, authentication, onboarding, member workspace, discovery, profiles, connections, messaging, sessions, reviews, moderation, and administration.

---

## 1. Design intent and product character

### 1.1 Brand feeling

SkillSwap should feel like a confident, creative learning community: welcoming, ambitious, trustworthy, and carefully crafted. The visual language is warm and energetic without becoming loud, playful, or childish.

The design combines:

- **Midnight foundation:** deep navy-black establishes structure, focus, and contrast.
- **Oxblood depth:** wine and burgundy create an elevated, distinctive brand character.
- **Crimson confidence:** deep red anchors primary actions and selected states.
- **Ember energy:** vermilion and orange highlight discovery, momentum, and important moments.
- **Golden warmth:** amber and sunlight yellow are used as small highlights, not as large text surfaces.
- **Warm porcelain:** creamy neutral backgrounds make the saturated palette feel balanced and keep content readable.
- **Selective glass:** translucent layers add depth to navigation, popovers, and a few feature surfaces.
- **Editorial composition:** confident typography, asymmetrical layouts, intentional whitespace, and varied content structures replace generic dashboard grids.

### 1.2 Design goals

1. Make SkillSwap recognizable through the relationship between midnight, wine, crimson, ember, and gold.
2. Communicate a reciprocal learning community rather than a paid tutoring marketplace.
3. Make dashboards attractive while keeping actions, data, and status easy to scan.
4. Give every page a deliberate visual composition instead of repeating identical card grids.
5. Use glassmorphism only where layering improves hierarchy.
6. Preserve WCAG contrast, keyboard access, and mobile usability.
7. Use the supplied ten-color palette as the complete brand hue family; add only quiet neutral utility colors for legibility.

### 1.3 What this design is not

Avoid:

- Flat white sidebar, grey canvas, and generic black buttons.
- A page filled with identical white cards.
- Red/orange gradients on every panel.
- Neon outlines, glowing text, cyberpunk effects, or over-saturated backgrounds.
- Bright orange or yellow with white small text.
- Frosted glass behind dense tables, long paragraphs, or forms.
- Random blobs, sparkles, floating 3D objects, and decorative emoji.
- Excessive pills, huge rounded cards, or unnecessary animation.
- Fake testimonials, fake members, fabricated ratings, or invented analytics.
- Using red for every interaction, including destructive actions and ordinary navigation.

### 1.4 Redesign direction

Keep the existing product information architecture and useful navigation, but replace the entire old visual language:

- Use a deep midnight-to-oxblood sidebar as the visual anchor.
- Use warm porcelain or soft ivory for the main workspace.
- Use a burgundy/crimson feature treatment for the dashboard welcome area.
- Introduce ember and gold only as deliberate highlights.
- Use neutral paper panels for dense information.
- Use glass surfaces for floating layers and selected feature panels.
- Give teach skills, learning goals, sessions, discovery, and alerts distinct but related semantic treatments.
- Keep the interface confident and premium, not loud or cluttered.

---

## 2. Brand identity and art direction

### 2.1 Brand idea

**SkillSwap — Share what you know. Discover what’s next.**

SkillSwap is a reciprocal learning community. Every member can be both a teacher and a learner. The design should communicate that each person brings value.

### 2.2 Brand mark

Use a compact exchange symbol built from two interlocking paths, offset loops, or directional strokes. It should suggest sharing, learning, and mutual movement.

- Use the standalone mark only where space is limited.
- Pair the mark with the `SkillSwap` wordmark in the sidebar and public header.
- On dark surfaces, use a porcelain wordmark with a crimson-to-amber mark.
- On light surfaces, use midnight ink for the wordmark and deep crimson for the mark.
- Do not use a graduation cap, robot, brain, lightbulb, money symbol, or generic sparkle.

### 2.3 Photography and avatars

- Use member-uploaded avatars or neutral initials fallbacks.
- Never imply generated portraits are real members.
- Avoid random stock photography in dashboards.
- Marketing photography, if used, should show authentic learning or collaboration with natural light and restrained warm color grading.
- Do not apply heavy red/orange duotone filters to faces.
- Skill category photography is optional; clear text labels are usually better.

### 2.4 Iconography

Use one coherent line-icon family such as Lucide.

- Navigation: 20 px.
- Inline actions: 16 px.
- Form controls: 16–18 px.
- Empty-state spot illustration: up to 28 px.
- Default stroke: 1.8–2 px.
- Icons support labels; they do not replace unfamiliar actions.
- Avoid mixing filled, 3D, emoji, and outline icon styles.

---

## 3. Color system

The supplied Coolors palette is the exact brand hue source:

`#03071E · #370617 · #6A040F · #9D0208 · #D00000 · #DC2F02 · #E85D04 · #F48C06 · #FAA307 · #FFBA08`

The palette moves from midnight ink through wine, burgundy, crimson, vermilion, orange, and gold. It is intentionally bold. Use the darker values for structure and actions; reserve the brighter values for small, controlled highlights.

### 3.1 Exact brand palette

| Token | Hex | Role |
|---|---|---|
| `--color-ink-950` | `#03071E` | Deepest brand ink; sidebar base, dark hero text |
| `--color-wine-900` | `#370617` | Wine surface; sidebar depth and dark panels |
| `--color-burgundy-800` | `#6A040F` | Deep burgundy; strong hover and feature surface |
| `--color-crimson-700` | `#9D0208` | Primary brand action; active navigation marker |
| `--color-crimson-600` | `#D00000` | High-emphasis crimson; links and selected accents |
| `--color-vermilion-600` | `#DC2F02` | Warm action accent and prominent highlights |
| `--color-ember-600` | `#E85D04` | Discovery and editorial accent |
| `--color-orange-500` | `#F48C06` | Warm highlight and progress detail |
| `--color-amber-500` | `#FAA307` | Small accent, selected marker, chart series |
| `--color-gold-400` | `#FFBA08` | Tiny highlight and decorative emphasis |

### 3.2 Neutral utility palette

These are supporting neutrals, not additional brand hues. They exist to keep long-form content and app surfaces easy to read.

| Token | Hex | Role |
|---|---|---|
| `--color-paper` | `#FAF7F4` | Main authenticated canvas |
| `--color-paper-warm` | `#F3ECE7` | Alternate section background |
| `--color-surface` | `#FFFEFC` | Cards, form surfaces, menus |
| `--color-surface-raised` | `#FFFFFF` | Dialogs and elevated content |
| `--color-line` | `#E8DDD7` | Borders and separators |
| `--color-ink-soft` | `#282435` | Body text and headings on light surfaces |
| `--color-muted` | `#726A70` | Secondary metadata |
| `--color-muted-light` | `#91878A` | Nonessential metadata only |
| `--color-focus` | `#9D0208` | Keyboard focus on light surfaces |
| `--color-focus-dark` | `#FFBA08` | Keyboard focus on dark surfaces |

### 3.3 Semantic color roles

| UI purpose | Main treatment | Supporting treatment |
|---|---|---|
| Primary action | Crimson 700 `#9D0208` with white text | Burgundy hover |
| Brand / selected navigation | Crimson 700 | Pale warm red tint |
| Teach / contribution | Burgundy or crimson | Soft blush utility tint |
| Want to learn / discovery | Ember or vermilion | Pale apricot utility tint |
| Session due soon | Ember / orange | Pale amber utility tint |
| Completed session | Midnight ink text with gold marker | Pale warm neutral |
| Informational | Midnight ink | Warm porcelain |
| Warning | Ember `#E85D04` with dark ink | Pale amber utility tint |
| Destructive / error | Crimson `#D00000` or burgundy | Pale red utility tint |
| Selected highlight | Amber or gold marker | Pale warm neutral |

Rules:

- Use `#9D0208`, `#6A040F`, `#370617`, or `#03071E` for controls that need white text.
- Do not put small white text on `#DC2F02`, `#E85D04`, `#F48C06`, `#FAA307`, or `#FFBA08`; use dark ink text on bright surfaces.
- Do not use gold as a large paragraph or button-label color on white.
- Use muted text for secondary metadata only, never for essential instructions.
- Every status includes a readable text label; never rely on color alone.
- Reserve `#D00000` for important emphasis, not every link or icon.
- Red is a brand color in this system; destructive actions must still use a clear label, confirmation, and icon/context so users understand the consequence.
- Verify actual contrast pairs in the rendered application before release.

### 3.4 Color balance

For a typical authenticated desktop page, use this as a loose guide:

- 58–68% warm paper, porcelain, or white surfaces.
- 15–22% deep ink, wine, or burgundy framing.
- 5–9% crimson brand actions and selected details.
- 4–7% vermilion and ember highlights.
- 1–4% orange, amber, and gold details combined.

Do not count mechanically. The goal is an intentional warm-neutral canvas with rich dark structure and a few memorable warm accents.

### 3.5 Brand gradients

Use gradients on large intentional surfaces, not every card.

| Token | CSS value | Use |
|---|---|---|
| `--gradient-brand` | `linear-gradient(118deg, #03071E 0%, #370617 48%, #9D0208 100%)` | Dashboard welcome hero and major brand panel |
| `--gradient-sidebar` | `linear-gradient(180deg, #03071E 0%, #370617 62%, #6A040F 100%)` | Authenticated sidebar |
| `--gradient-crimson` | `linear-gradient(110deg, #6A040F 0%, #9D0208 100%)` | Primary feature action or small hero accent |
| `--gradient-ember` | `linear-gradient(110deg, #D00000 0%, #DC2F02 55%, #E85D04 100%)` | Narrow accent strip, progress or editorial highlight |
| `--gradient-gold` | `linear-gradient(110deg, #F48C06 0%, #FAA307 55%, #FFBA08 100%)` | Decorative micro-accent only; dark text if text is needed |
| `--gradient-soft` | `linear-gradient(135deg, #FAF7F4 0%, #F3ECE7 58%, #F8E7DF 100%)` | Low-contrast workspace wash |

Gradient rules:

- One major gradient area per viewport is usually enough.
- Use the brand gradient for the welcome hero or one large landing-page region.
- Use the ember gradient as a narrow highlight, not a full page background.
- Never use the gold gradient behind white text.
- Avoid rainbow effects, neon glow, and high-contrast gradients behind dense content.
- Important text on dark gradients must use a verified light color.

### 3.6 Workspace atmosphere

Keep the main workspace mostly solid. Add barely visible warm ambient light for depth.

```css
.app-canvas {
  background:
    radial-gradient(ellipse at 94% 0%, rgba(220, 47, 2, 0.045), transparent 30rem),
    radial-gradient(ellipse at 4% 82%, rgba(106, 4, 15, 0.035), transparent 26rem),
    var(--color-paper);
}
```

Do not create obvious background blobs, glowing spots, or patterns behind dense content.

---

## 4. Typography system

### 4.1 Font pairing

Use:

- **Headings:** `Manrope`, fallback to `ui-sans-serif, system-ui`.
- **Body and interface:** `Inter`, fallback to `ui-sans-serif, system-ui`.

```css
--font-heading: "Manrope", ui-sans-serif, system-ui, sans-serif;
--font-body: Inter, ui-sans-serif, system-ui, sans-serif;
```

Load fonts from an approved provider or package them locally where licensing permits. If a font fails to load, system fallbacks must remain visually sound. Do not use more than two font families.

### 4.2 Type scale

| Style | Size | Weight | Line height | Usage |
|---|---:|---:|---:|---|
| Display | 48–60 px | 700 | 1.05–1.12 | Public hero only |
| H1 | 32–38 px | 700 | 1.15 | Main page title |
| H2 | 24–28 px | 700 | 1.2 | Primary sections |
| H3 | 18–20 px | 650 | 1.3 | Panels and cards |
| H4 | 15–16 px | 650 | 1.35 | Subsections |
| Body large | 16–18 px | 400 | 1.55 | Hero and lead text |
| Body | 14–15 px | 400 | 1.55 | Standard content |
| Body small | 12–13 px | 400 | 1.45 | Metadata |
| Label | 11–12 px | 650 | 1.3 | Field labels and overlines |
| Button | 13–14 px | 650 | 1 | Buttons |

### 4.3 Typography rules

- Use sentence case for headings and navigation.
- Use tabular numerals for metrics, dates, timestamps, and ratings.
- Establish hierarchy through type size, weight, and spacing before adding color.
- Keep paragraphs around 55–80 characters per line where practical.
- Avoid all-caps paragraphs, ultra-light body text, and oversized headings on operational screens.
- Use bold sparingly; do not bold entire paragraphs.

---

## 5. Layout and application shell

### 5.1 Grid and dimensions

- Maximum wide workspace content: 1320 px.
- Typical dashboard content: 1120–1240 px.
- Reading width: 680–760 px.
- Desktop sidebar: 252–264 px expanded.
- Topbar: 72 px high.
- Desktop content gutters: 36–44 px.
- Tablet gutters: 24 px.
- Mobile gutters: 16–20 px.
- Use a 12-column grid for marketing and complex admin pages; use simpler two-column layouts for profiles and settings.

### 5.2 App shell

The authenticated shell has two primary regions:

1. Midnight/wine sidebar as the brand anchor.
2. Warm paper workspace with a translucent topbar and carefully aligned page content.

Each page should have a deliberate composition and one clear visual focal point. Do not force every page into the same layout.

### 5.3 Sidebar

- Background: `--gradient-sidebar`.
- Width: 252–264 px.
- Wordmark: warm white; exchange mark uses crimson and amber.
- Inactive label: `rgba(255, 250, 247, .76)`.
- Inactive icon: `rgba(255, 230, 220, .68)`.
- Hover background: `rgba(255, 255, 255, .07)`.
- Active background: `rgba(208, 0, 0, .18)`.
- Active marker: slim `#FFBA08` or `#F48C06` line.
- Active label: white, semibold.
- Active icon: white or pale warm neutral.
- Dividers: `rgba(255, 255, 255, .12)`.
- Profile footer: translucent wine panel with avatar, display name, role, and logout.
- Minimum navigation item height: 44 px.

Do not use a bright orange block behind every active item. Keep focus rings distinct from selected states.

### 5.4 Topbar

- Sticky to workspace top.
- Background: `rgba(255, 254, 252, .78)`.
- Backdrop blur: 14–20 px.
- Bottom border: `rgba(232, 221, 215, .82)`.
- Left side: page title, breadcrumb, or compact context.
- Right side: notification control and member menu.
- Keep height and alignment consistent across authenticated routes.
- Provide a solid warm-white fallback when backdrop filters are unsupported.

### 5.5 Spacing scale

Use a 4 px base unit and an 8 px rhythm for larger layout decisions.

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

Use 40–48 px between major dashboard sections, 16–24 px inside standard panels, and 16–20 px between form fields.

---

## 6. Surface, glassmorphism, borders, and elevation

### 6.1 Surface families

Use three surface families:

**Paper surface**
- White or warm porcelain background.
- Fine warm-neutral border.
- Minimal shadow.
- Used for forms, tables, message history, dense information, and standard panels.

**Tinted surface**
- Pale blush, pale apricot, or warm neutral background.
- Used to group skill types, highlight summaries, or distinguish secondary context.
- Use sparingly; do not tint every component.

**Glass surface**
- Translucent warm-white or midnight/wine layer.
- Backdrop blur and subtle border.
- Used for the topbar, popovers, notifications, floating controls, selected overview panels, and a few hero overlays.
- Never used for long-form text or dense tables.

### 6.2 Glassmorphism specification

Use glass as a layering technique, not as a theme applied everywhere.

Light glass:

```css
.glass-light {
  background: rgba(255, 254, 252, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 36px rgba(3, 7, 30, 0.08);
  backdrop-filter: blur(18px) saturate(135%);
  -webkit-backdrop-filter: blur(18px) saturate(135%);
}
```

Dark glass:

```css
.glass-dark {
  background: rgba(55, 6, 23, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 0 16px 44px rgba(3, 7, 30, 0.24);
  backdrop-filter: blur(18px) saturate(125%);
  -webkit-backdrop-filter: blur(18px) saturate(125%);
}
```

Glass rules:

- Use blur between 12 and 20 px in most cases.
- Keep opacity high enough for readable contrast.
- Use only one glass layer; do not stack several blurred surfaces.
- Menus and popovers need solid fallbacks.
- Test text against the actual rendered background.
- Do not apply backdrop-filter to every card, list row, or form.
- Keep dense content on solid paper surfaces.

### 6.3 Shape and radius

| Element | Radius |
|---|---:|
| Small control | 7 px |
| Input / button | 9 px |
| Standard card | 14 px |
| Feature panel | 18 px |
| Large hero panel | 22 px |
| Dialog | 18 px |
| Avatar | 50% |
| Small tag | 6 px |

Avoid making every control a full pill. Pills are reserved for compact filters, status chips, and selected tags where the shape improves recognition.

### 6.4 Elevation

Prefer borders and surface contrast. Use shadows only to separate layers.

```css
--shadow-xs: 0 1px 2px rgba(3, 7, 30, .04);
--shadow-sm: 0 4px 14px rgba(3, 7, 30, .06);
--shadow-md: 0 10px 28px rgba(3, 7, 30, .09);
--shadow-lg: 0 18px 48px rgba(3, 7, 30, .14);
--shadow-popover: 0 16px 42px rgba(3, 7, 30, .16);
```

---

## 7. Core component specifications

### 7.1 Buttons

**Primary:** crimson 700 `#9D0208` fill, white label, subtle shadow. Hover uses burgundy `#6A040F`. Use a gradient only for a large feature CTA when it materially improves the composition.

**Secondary:** white/porcelain fill, midnight text, warm border.

**Tertiary:** text action with burgundy or crimson label; no container.

**Dark:** midnight or wine fill with white label for prominent actions on light surfaces.

**Warm accent:** ember/orange background only for a special secondary action, with midnight text. Never use small white text on orange or gold.

**Destructive:** deep crimson fill or text, with confirmation for consequential actions.

Sizes:
- Small: 32–34 px high.
- Default: 40–44 px high.
- Large: 48 px high.

Rules:
- Button labels start with verbs: “Send request”, “Save changes”, “Confirm session”.
- One primary button per main section where possible.
- Include hover, active, focus, disabled, and loading states.
- Prevent duplicate submissions.

### 7.2 Inputs and forms

- Default height: 42–44 px.
- Textarea minimum height: 104 px.
- Background: white or warm porcelain.
- Border: `--color-line`.
- Focus: 2 px crimson ring with a subtle outer halo.
- Labels are always visible; placeholders are examples only.
- Helper text sits below the field.
- Errors appear beside the affected field and are programmatically associated.
- Preserve user-entered values when server validation fails.
- Use field groups and short section headings for long forms.

### 7.3 Cards and panels

- Use white surfaces for content needing maximum legibility.
- Use pale blush or apricot panels for skill types and selected summaries.
- Use dark gradient panels only for a small number of high-value areas, especially the dashboard hero.
- Avoid nested cards.
- Use lists and dividers when a card wrapper adds no information.

### 7.4 Skill tags

- “Can teach” uses deep burgundy/crimson text with a pale blush surface.
- “Wants to learn” uses deep wine text with a pale apricot surface.
- Skill level is a text label: Beginner, Intermediate, Advanced.
- Use compact tags with clear contrast.
- Never imply a self-selected skill level is independently verified.

### 7.5 Member cards and rows

Prioritize:

1. Avatar or initials.
2. Name and short introduction.
3. Relevant reciprocal skill information.
4. Availability summary when permitted.
5. One clear action.

Avoid showing exact weekly availability or private contact details to strangers unless the member explicitly chooses to share them.

### 7.6 Status badges

Use compact status chips with pale semantic backgrounds and dark readable labels. Include text for every state. Examples: Pending, Confirmed, Completed, Cancelled, Needs review, Suspended.

- Pending: pale amber with midnight text.
- Confirmed: pale warm neutral with burgundy marker.
- Completed: pale gold with midnight text.
- Cancelled: pale blush with burgundy text.
- Error/suspended: pale red with deep crimson text.

### 7.7 Tables

- White or porcelain surface.
- Quiet warm-neutral horizontal separators.
- Dark readable headings.
- Compact rows with consistent padding.
- Actions aligned in a predictable final column.
- Use sticky headers only when table height warrants it.
- On mobile, reflow into labelled stacked records or contain horizontal scroll inside the table region.

### 7.8 Dialogs and popovers

- Use glass treatment for floating menus when it improves layering.
- Use a solid or mostly solid dialog body for forms and important decisions.
- Include title, explanation, and clear action hierarchy.
- Escape closes non-destructive dialogs.
- Focus is managed and returned to the trigger after closing.
- Destructive dialog copy explains the exact consequence.

### 7.9 Notifications and toasts

- Notification popover may use light glass.
- Each item includes a clear title, short context, and timestamp.
- Unread state uses a small crimson or amber marker.
- Toasts are concise and specific: “Connection request sent.”
- Errors requiring action remain inline; do not rely only on a disappearing toast.

### 7.10 Charts

- Series order: midnight, burgundy, crimson, ember, gold.
- Use the minimum number of series necessary.
- Keep grid lines subtle.
- Use clear axis labels, legends, and date ranges.
- Avoid 3D charts and decorative charts with no useful meaning.
- Provide a textual summary or accessible data alternative.
- Use real values; never invent analytics.

---

## 8. Navigation and information architecture

### 8.1 Public navigation

- Wordmark on the left.
- Links: How it works, Explore skills (only if public browsing is supported), Sign in.
- Primary action: “Create your profile”.
- Use a transparent or warm-white nav over the landing hero; switch to solid when needed for readability.
- Mobile uses an accessible menu with expanded state announced to assistive technology.

### 8.2 Member navigation

Recommended order:

- Overview
- Discover
- Connections
- Messages
- Sessions
- History
- Profile
- Settings

Use icons from one icon family. Active item gets a translucent crimson background and a narrow gold or orange marker on the dark sidebar.

### 8.3 Staff navigation

- Overview
- Reports
- Members
- Analytics
- Activity log

Staff navigation remains visually related to the member shell but may use a small “Staff workspace” label. Do not create a completely unrelated theme.

---

## 9. Screen-by-screen design direction

### 9.1 Landing page

Create an editorial hero with a split composition rather than a generic centered heading above a grid of cards.

- Left: strong headline, concise explanation, primary and secondary CTAs.
- Right: a visual composition illustrating reciprocal skill exchange using real product UI fragments or a carefully designed abstract exchange motif.
- Hero backdrop: midnight-to-wine-to-crimson gradient.
- Add a small ember/gold detail as a finishing accent, not a large yellow block.
- Explain the three steps: list skills, find a partner, arrange a session.
- State clearly that SkillSwap does not process payments or host video calls.
- Do not invent testimonials, member counts, or success statistics.

### 9.2 Authentication

- Use a split layout on desktop: warm porcelain form area and midnight/wine brand panel.
- On mobile, place the brand mark and short message above the form.
- Form surfaces remain solid and highly readable.
- Use crimson for the primary submit action.
- Validation, password visibility, loading, and error states must work.

### 9.3 Member dashboard

The dashboard is a signature screen, but it must remain useful.

**Welcome hero**
- Wide midnight/wine/crimson gradient panel.
- Personalized greeting and short supporting sentence.
- Primary “Discover partners” action.
- Secondary link to manage skills.
- Use restrained amber/orange exchange motif or a small glow detail.
- Do not put every metric inside the hero.

**Metric summary**
- Show real values: skills listed, active connections, upcoming sessions, completed sessions.
- Use distinct but related metric treatments; avoid four identical oversized cards.
- Include labels and useful time context where relevant.

**Skills overview**
- Two-column desktop composition: Can teach and Wants to learn.
- Can teach: pale blush surface and burgundy/crimson accents.
- Wants to learn: pale apricot surface and ember accents.
- On mobile, stack sections.

**Suggested partners**
- Use elegant member rows or varied feature cards.
- Show avatar/initials, name, short bio, reciprocal skill match, level, and one clear action.
- Explain why the match is suggested.
- Use actual returned members only.

**Upcoming sessions**
- Use a compact agenda/timeline.
- Show date, time, timezone, partner, subject, and state.
- Make the next session easy to identify without relying on color alone.

### 9.4 Discover

- Search and filters sit at the top in a clear hierarchy.
- Show active filters as removable chips.
- Results should use a clean list with occasional feature emphasis, not a uniform wall of cards.
- Show a plain-language match reason.
- Use burgundy/crimson for strong reciprocal matches and ember for learning-interest highlights.
- Keep private availability details hidden from unconnected users.
- Empty state should offer a useful action such as broadening the search or adding a skill.

### 9.5 Member profile

- Identity header with avatar, name, and concise bio.
- Separate “Can teach” and “Wants to learn” sections.
- Show level as member-provided information.
- Display general availability only as permitted.
- Reviews use readable text and clear rating labels.
- Report action stays available but visually quiet.

### 9.6 Connections

- Separate incoming, outgoing, and accepted connections.
- Use consistent member rows and contextual actions.
- Pending states use amber markers; accepted states use a warm neutral surface with a dark status label.
- Prevent duplicate request actions and reflect server state.

### 9.7 Messages

- Two-panel desktop layout: conversation list and active conversation.
- Warm porcelain conversation list with clear active-row treatment.
- Current-user bubbles use deep burgundy/crimson with white text.
- Received bubbles use warm neutral surfaces with midnight text.
- Composer remains solid and readable; focus state uses crimson.
- Include connection context and session proposal entry point.
- Preserve reconnecting, failed-send, and empty states.
- Do not expose conversations to non-participants.

### 9.8 Sessions

- Use an agenda/list as the primary view; calendar can be secondary if implemented.
- Highlight the next session with a small crimson/ember accent.
- Display timezone explicitly where relevant.
- Status states: Proposed, Confirmed, Declined, Completed, Cancelled.
- Reschedule and cancel are contextual actions with clear confirmation.
- Keep meeting links optional and user-supplied; do not imply SkillSwap hosts calls.

### 9.9 History and reviews

- Chronological list of past sessions.
- Show partner, topic, date, status, and review eligibility.
- Completed sessions may show “Leave a review” when eligible.
- Use a gold rating marker sparingly and retain accessible text labels.
- Distinguish member-authored reviews from platform-verified information; do not claim skill verification.

### 9.10 Profile and settings

- Profile page uses a focused identity header and sections for introduction, teach skills, learn skills, level, and availability.
- Settings use grouped sections with concise descriptions.
- Place save actions consistently.
- Do not put every setting in a separate floating card.

### 9.11 Moderator workspace

- Prioritize report queue and resolution workflow.
- Use a dense but readable table/list with status, reason, report target, timestamp, and assigned moderator.
- Report detail uses a two-column layout on desktop: reported content/context and decision controls.
- Moderation actions require confirmation and a reason.
- Use deep crimson only for destructive or high-risk actions.

### 9.12 Admin workspace

- Overview metrics with definitions and date range.
- Popular skills and session completion trends use meaningful charts.
- Member management and activity logs use readable tables.
- Keep staff tools functional and information-dense without excessive glass or oversized hero panels.
- Clearly distinguish administrator-only actions.
- Use the palette consistently, with gold/orange only as chart accents.

---

## 10. Responsive behavior

Breakpoints:

- Small mobile: 0–479 px.
- Mobile: 480–639 px.
- Tablet: 640–899 px.
- Desktop: 900–1279 px.
- Wide: 1280 px and above.

Rules:

- No horizontal page overflow at 320 px.
- Sidebar becomes a drawer or compact bottom navigation on mobile.
- Mobile navigation exposes the 4–5 highest-use destinations; secondary items go in a labelled More menu.
- Dashboard metrics reflow into two columns or a compact list.
- Hero content stacks and reduces decorative layers.
- Member profiles become single-column.
- Tables reflow or scroll inside their own container.
- Messaging switches to a single-view navigation pattern.
- Dialogs may become full-height sheets on narrow screens.
- Touch targets should be at least 44 × 44 px.
- Do not hide essential actions only on hover.
- Bright orange and gold surfaces must not reduce text legibility on mobile.

---

## 11. Motion and interaction

Motion should make the interface feel responsive and polished, not animated for its own sake.

- Standard transitions: 140–200 ms.
- Use ease-out for entrances and ease-in for exits.
- Small hover lift: 1–2 px maximum.
- Popovers: subtle opacity and 4–6 px vertical movement.
- Buttons: subtle background and shadow transition.
- Avoid springy overshoot on operational screens.
- No autoplay backgrounds, parallax, or continuous motion.
- Respect `prefers-reduced-motion: reduce`.
- Avoid layout shifts when skeletons or images load.

---

## 12. States every screen must define

Every data-driven screen must include:

1. Initial/loading state.
2. Loaded state.
3. Empty state.
4. Error state with retry where appropriate.
5. Permission-denied state.
6. Offline/reconnecting state where relevant.
7. Success feedback after mutations.
8. Disabled state with an explanation.

Empty states should have a short heading, one useful sentence, and one relevant next action. Do not use generic “Nothing here!” copy.

---

## 13. Accessibility and contrast

Target WCAG 2.2 AA.

- Normal text contrast: at least 4.5:1.
- Large text contrast: at least 3:1.
- UI component boundaries and focus indicators must be discernible.
- Use white text on deep ink, wine, burgundy, and tested crimson backgrounds.
- Use midnight ink on orange, amber, and gold backgrounds.
- Never use small white text on `#DC2F02`, `#E85D04`, `#F48C06`, `#FAA307`, or `#FFBA08`.
- Provide a visible 2 px focus ring on every interactive element.
- On dark surfaces, use `#FFBA08` or another verified light focus token.
- Do not communicate status through color alone.
- Use semantic HTML and logical heading order.
- Provide accessible names for icon-only buttons.
- Announce asynchronous status changes to assistive technology.
- Manage dialog focus and Escape behavior.
- Support zoom to 200% without loss of content.
- Respect reduced motion.
- Verify each foreground/background pair in the rendered application; do not assume brand colors automatically pass contrast.

---

## 14. CSS token starter

Use this as the starting token layer. Components should consume these variables instead of hardcoding colors.

```css
:root {
  color-scheme: light;

  /* Supplied SkillSwap brand palette */
  --color-ink-950: #03071e;
  --color-wine-900: #370617;
  --color-burgundy-800: #6a040f;
  --color-crimson-700: #9d0208;
  --color-crimson-600: #d00000;
  --color-vermilion-600: #dc2f02;
  --color-ember-600: #e85d04;
  --color-orange-500: #f48c06;
  --color-amber-500: #faa307;
  --color-gold-400: #ffba08;

  /* Supporting neutrals */
  --color-paper: #faf7f4;
  --color-paper-warm: #f3ece7;
  --color-surface: #fffefc;
  --color-surface-raised: #ffffff;
  --color-line: #e8ddd7;
  --color-ink-soft: #282435;
  --color-muted: #726a70;
  --color-muted-light: #91878a;
  --color-focus: #9d0208;
  --color-focus-dark: #ffba08;

  --font-heading: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-body: Inter, ui-sans-serif, system-ui, sans-serif;

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
  --space-20: 80px;

  --radius-control: 9px;
  --radius-card: 14px;
  --radius-feature: 18px;
  --radius-hero: 22px;
  --radius-dialog: 18px;

  --gradient-brand: linear-gradient(118deg, #03071e 0%, #370617 48%, #9d0208 100%);
  --gradient-sidebar: linear-gradient(180deg, #03071e 0%, #370617 62%, #6a040f 100%);
  --gradient-crimson: linear-gradient(110deg, #6a040f 0%, #9d0208 100%);
  --gradient-ember: linear-gradient(110deg, #d00000 0%, #dc2f02 55%, #e85d04 100%);
  --gradient-gold: linear-gradient(110deg, #f48c06 0%, #faa307 55%, #ffba08 100%);
  --gradient-soft: linear-gradient(135deg, #faf7f4 0%, #f3ece7 58%, #f8e7df 100%);

  --shadow-xs: 0 1px 2px rgba(3, 7, 30, .04);
  --shadow-sm: 0 4px 14px rgba(3, 7, 30, .06);
  --shadow-md: 0 10px 28px rgba(3, 7, 30, .09);
  --shadow-lg: 0 18px 48px rgba(3, 7, 30, .14);
  --shadow-popover: 0 16px 42px rgba(3, 7, 30, .16);
}
```

---

## 15. Frontend implementation rules

1. Make this design system the only visual source of truth.
2. Centralize tokens in the global theme layer.
3. Use CSS variables or the project's approved styling system.
4. Avoid hardcoded one-off colors in page components.
5. Build reusable primitives for buttons, fields, cards, tags, badges, dialogs, and navigation.
6. Preserve all existing API calls, route paths, validation rules, and application behavior during visual refactoring.
7. Do not replace real data with static sample content.
8. Do not remove controls or actions simply to simplify the layout.
9. Remove old styles only after confirming they are no longer referenced.
10. Ensure every page has matching desktop, tablet, and mobile compositions.
11. Do not use orange or gold as default text colors on white surfaces.
12. Avoid using the warm palette as a full-screen saturated background.
13. Keep destructive actions semantically clear even though crimson is also a brand color.
14. Use the supplied ten HEX colors exactly; do not introduce a second competing brand palette.

Suggested shared components:

- `AppShell`
- `AppSidebar`
- `AppTopbar`
- `PageHeader`
- `WelcomeHero`
- `MetricTile`
- `PaperPanel`
- `GlassPanel`
- `SkillTag`
- `MemberRow`
- `MemberFeatureCard`
- `SessionAgendaItem`
- `MessageBubble`
- `StatusBadge`
- `NotificationPopover`
- `FilterPopover`
- `FormField`
- `Dialog`
- `Toast`
- `EmptyState`
- `LoadingSkeleton`
- `DataTable`

---

## 16. Visual QA checklist

Before accepting a redesigned route:

- [ ] Supplied ten-color palette is used exactly.
- [ ] Midnight/wine sidebar and branded active state are correct.
- [ ] Main workspace uses warm paper/porcelain surfaces.
- [ ] Primary actions use deep crimson with verified contrast.
- [ ] Bright orange and gold are used as accents, not body-text colors.
- [ ] Glassmorphism is selective and text remains readable.
- [ ] Layout has a clear visual focal point.
- [ ] Page is not just a set of repeated cards.
- [ ] Heading and body typography follow the scale.
- [ ] Buttons and fields have hover, focus, active, disabled, and loading states.
- [ ] Empty/loading/error/permission states exist.
- [ ] No fabricated users, reviews, or statistics.
- [ ] Works at 320 px without horizontal overflow.
- [ ] Keyboard focus is visible on light and dark surfaces.
- [ ] Contrast is verified for actual foreground/background pairs.
- [ ] Existing functionality and API integration remain intact.

---

## 17. Final design acceptance standard

The redesign is complete only when the whole application—not just the dashboard—uses this system consistently. Public pages, authentication, member workspace, discovery, profiles, connections, messaging, sessions, history, settings, moderator tools, and admin tools must all feel like parts of the same polished product.

The design should be visually rich but not noisy, warm but not childish, layered but not blurry, and premium without sacrificing clarity. The defining combination is midnight structure, oxblood depth, crimson confidence, ember energy, golden detail, and warm porcelain surfaces.
