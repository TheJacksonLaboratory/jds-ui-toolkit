# Navbar end slot — design

**Size:** small change (toolkit side). The HPO "Copied Terms" clipboard is built in the HPO app, not here.

## Intent
HPO needs a "Copied Terms" clipboard button (badge, dropdown, export CSV) in the navbar, per the HPO
Term Browser prototype. The navbar's right-hand area is fixed (external link + auth) today, so apps
cannot put anything there. Other apps may want their own controls in the same spot.

## Goals
- Apps can project their own content into the navbar's right-hand area.
- No behavior change for apps that don't use it.

## Non-goals
- No clipboard, copy-tag, or list service in the toolkit (HPO-only; lives in the HPO app).
- No new inputs, styling, or colors (see echo-tokens note: defer color in component CSS).

## Anti-goals
- Breaking the mobile menu layout or the `mobileLogoPosition="center"` layout.

## Approaches
- **A. Projection slot in navbar + clipboard in HPO app** — chosen. One small, generic change.
- B. Clipboard built into the toolkit — rejected: HPO-specific concepts in a shared lib only HPO uses.
- C. Fork navbar into HPO — rejected: loses toolkit navbar fixes.

## Design
`navbar.component.html`, inside the `#end` template, first child of the flex wrapper:

```html
<div class="tw-flex tw-items-center">
  <ng-content select="[jdsNavbarEnd]" />
  @if (externalLink) { ... }
  @if (authentication) { ... }
</div>
```

Usage:

```html
<lib-jds-navbar [items]="items">
  <hpo-copied-terms jdsNavbarEnd />
</lib-jds-navbar>
```

- Projected content sits left of the external link / auth controls.
- `navbar.docs.ts`: document the slot (description, a "custom end content" variation, do/don't),
  and remove the "maintenance only / no new features" wording (description sentence and the
  "Do not extend Navbar" don't) for now — user decision.
- Demo: add the variation example; add a component test that projected `[jdsNavbarEnd]` content renders.

## Left to the builder
- Exact docs wording and demo example content.
- Verifying projection renders on mobile widths (PrimeNG keeps `#end` visible outside the collapsed menu).
