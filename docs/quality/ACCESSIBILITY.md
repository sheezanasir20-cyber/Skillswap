# Accessibility Requirements

Target WCAG 2.2 AA.

## Keyboard
- All functions usable without a mouse.
- Logical tab order and no keyboard traps.
- Visible focus indicator on every interactive control.
- Escape closes dismissible menus/dialogs.
- Focus returns to the trigger after a dialog closes.

## Semantics
- One clear page-level H1.
- Headings are nested logically.
- Use buttons for actions and links for navigation.
- Tables have header cells.
- Form labels are programmatically associated.
- Live updates use appropriate status announcements.

## Visual
- Meet AA contrast for text and controls.
- Do not rely on color alone for status or errors.
- Support browser zoom to 200% without loss of content.
- Respect reduced-motion preferences.
- Do not use text embedded in images for essential information.

## Forms
- Explain required fields.
- Associate error messages with fields.
- Move focus to an error summary after failed submission when appropriate.
- Preserve entered data after validation failure.

## Dynamic content
- Announce new messages and notification counts without repeatedly interrupting users.
- Provide accessible names for icon buttons.
- Avoid auto-scrolling a conversation when the user is reading older messages.
